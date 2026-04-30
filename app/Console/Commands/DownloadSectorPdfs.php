<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use App\Models\LegislationFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class DownloadSectorPdfs extends Command
{
    protected $signature = 'download:sector-pdfs
        {sectors* : IDs like 55 43 44, lists 55,57,60, or ranges 1-10}
        {--pages=1}
        {--from-page=1}
        {--lang=both : ar|en|both}
        {--dir=uae_legislation}
        {--node=}
        {--chrome=}
        {--timeout=180}
        {--no-save}';

    protected $description = 'جلب روابط التنزيل لقطاع/قطاعات، تنزيل PDF عبر Puppeteer، وحفظ النتائج في قاعدة البيانات.';

    protected bool $dbWarned = false;

    private function expandSectors(array $args): array
    {
        $out = [];
        foreach ($args as $tok) {
            foreach (explode(',', $tok) as $piece) {
                $piece = trim($piece);
                if ($piece === '') continue;

                if (preg_match('/^(\d+)\s*-\s*(\d+)$/', $piece, $m)) {
                    $a = (int) $m[1]; $b = (int) $m[2];
                    if ($a > $b) [$a, $b] = [$b, $a];
                    $out = array_merge($out, range($a, $b));
                } elseif (ctype_digit($piece)) {
                    $out[] = (int) $piece;
                }
            }
        }
        $out = array_values(array_unique(array_filter($out, fn($v) => $v > 0)));
        sort($out);
        return $out;
    }

    public function handle(): int
    {
        $sectors = $this->expandSectors((array) $this->argument('sectors'));
        if (empty($sectors)) {
            $this->error('Please provide at least one sector (e.g., 55 or 1-10).');
            return self::FAILURE;
        }

        $pages    = max(1, (int) $this->option('pages'));
        $fromPage = max(1, (int) $this->option('from-page'));
        $langOpt  = strtolower((string) ($this->option('lang') ?: 'both'));
        $saveDir  = trim((string) ($this->option('dir') ?: 'uae_legislation'), " \\/");
        $timeout  = max(30, (int) $this->option('timeout'));
        $doSave   = ! (bool) $this->option('no-save');

        $nodeBin  = (string) ($this->option('node') ?: $this->detectNode());
        $chrome   = (string) ($this->option('chrome') ?: env('PUPPETEER_EXECUTABLE_PATH'));

        $fetchScript    = base_path('scripts/fetch_uaelegis_downloads.cjs');
        $downloadScript = base_path('scripts/download_uaelegis_pdf.cjs');

        if (!is_file($fetchScript))  { $this->error("Missing script: {$fetchScript}");  return self::FAILURE; }
        if (!is_file($downloadScript)) { $this->error("Missing script: {$downloadScript}"); return self::FAILURE; }

        $wantAr = in_array($langOpt, ['ar', 'both'], true);
        $wantEn = in_array($langOpt, ['en', 'both'], true);

        $grandSaved = 0;

        foreach ($sectors as $sector) {
            $this->newLine();
            $this->info(str_repeat('=', 12) . " القطاع {$sector} " . str_repeat('=', 12));

            for ($page = $fromPage; $page < $fromPage + $pages; $page++) {
                $this->line("== القطاع {$sector} – صفحة {$page} ==");
                $indexUrl = "https://uaelegislation.gov.ae/ar/legislations?sector={$sector}&page={$page}";
                $this->line("  URL: {$indexUrl}");

                // 1) fetch
                [$ok, $json] = $this->runNodeFetch($nodeBin, $fetchScript, $sector, $page, $chrome);
                if (!$ok || !is_array($json) || !isset($json['items']) || !is_array($json['items'])) {
                    $this->warn('  ! لا توجد عناصر في هذه الصفحة.');
                    continue;
                }

                // filter lang
                $items = array_values(array_filter($json['items'], function (array $it) use ($wantAr, $wantEn): bool {
                    $lang = strtolower((string)($it['lang'] ?? ''));
                    return ($lang === 'ar' && $wantAr) || ($lang === 'en' && $wantEn);
                }));

                $count = count($items);
                $this->line("  ↳ روابط التحميل: {$count}");
                if ($count === 0) continue;

                // 2) download
                $savedThisPage = 0;
                foreach ($items as $it) {
                    $id   = (int) ($it['id'] ?? 0);
                    if ($id <= 0) continue;

                    $lang   = strtolower((string)($it['lang'] ?? 'ar'));
                    $number = trim((string)($it['number'] ?? '')); // may be null
                    $year   = $this->normalizeYearOrNull($it['year'] ?? null);

                    $yearFolder = $this->normalizeYearFolder($year);
                    $relative   = "{$saveDir}/{$yearFolder}/{$id}-{$lang}.pdf"; // relative to storage/app
                    $outPath    = storage_path('app/' . $relative);
                    @mkdir(dirname($outPath), 0775, true);

                    $okDl = $this->runNodeDownload($nodeBin, $downloadScript, $id, $lang, $outPath, $chrome, $timeout);
                    if ($okDl && is_file($outPath) && filesize($outPath) > 0) {
                        $savedThisPage++;
                        $grandSaved++;

                        if ($doSave) {
                            $this->persistLegFile($it, $id, $lang, $relative, $outPath);
                        }
                    } else {
                        $this->warn("    ! فشل Puppeteer: id={$id}");
                    }
                }

                $this->info("  ✓ تم حفظ {$savedThisPage} ملف/ملفات.");
            }
        }

        $this->newLine();
        $this->info("انتهى. تم حفظ {$grandSaved} ملف/ملفات.");
        return self::SUCCESS;
    }

    protected function persistLegFile(array $it, int $id, string $lang, string $relative, string $absPath): void
    {
        try {
            $title  = trim((string) Arr::get($it, 'title', '')) ?: "تشريع {$id}" . ($lang ? " ({$lang})" : '');
            $number = Arr::get($it, 'number');
            $year   = Arr::get($it, 'year');

            if (!$year && preg_match('/\b(20\d{2}|19\d{2})\b/u', $title, $mY)) {
                $year = (int) $mY[1];
            }
            $year = (is_numeric($year) && $year >= 1900 && $year <= 2100) ? (int) $year : null;

            $source = (string) Arr::get($it, 'href', '');

            $size = @filesize($absPath) ?: null;
            $sha1 = @sha1_file($absPath) ?: null;

            if (!class_exists(LegislationFile::class)) {
                if (!$this->dbWarned) {
                    $this->dbWarned = true;
                    $this->warn('  ! تخطّي الحفظ: App\\Models\\LegislationFile غير موجود.');
                }
                return;
            }

            LegislationFile::updateOrCreate(
                ['legis_id' => $id, 'lang' => $lang],
                [
                    'year'          => $year,
                    'title'         => $title,
                    'number'        => $number ? (string) $number : null,
                    'source_url'    => $source,
                    'local_path'    => ltrim($relative, '/'),
                    'size_bytes'    => $size,
                    'sha1'          => $sha1,
                    'downloaded_at' => now(),
                ]
            );
        } catch (\Throwable $e) {
            if (!$this->dbWarned) {
                $this->dbWarned = true;
                $this->warn('  ! DB save error: ' . $e->getMessage());
            }
        }
    }

    protected function runNodeFetch(string $nodeBin, string $script, int $sector, int $page, ?string $chromePath): array
    {
        $env = $_ENV;
        if ($chromePath) $env['PUPPETEER_EXECUTABLE_PATH'] = $chromePath;

        $proc = new Process([$nodeBin, $script, (string) $sector, (string) $page], base_path(), $env, null, 180);
        $bufferOut = '';
        $bufferErr = '';

        $proc->run(function ($type, $data) use (&$bufferOut, &$bufferErr) {
            if ($type === Process::ERR) $bufferErr .= $data; else $bufferOut .= $data;
        });

        if (!$proc->isSuccessful()) {
            $this->warn('  ! Puppeteer فشل (الفهرس).');
            $this->line(trim($bufferErr ?: $bufferOut));
            return [false, null];
        }

        $decoded = json_decode(trim($bufferOut), true);
        if (is_array($decoded) && isset($decoded['items'])) return [true, $decoded];

        $json = $this->extractInlineJsonWithItems($bufferOut);
        return $json ? [true, $json] : [false, null];
    }

    protected function runNodeDownload(
        string $nodeBin,
        string $script,
        int $id,
        string $lang,
        string $outPath,
        ?string $chromePath,
        int $timeout
    ): bool {
        $env = $_ENV;
        if ($chromePath) $env['PUPPETEER_EXECUTABLE_PATH'] = $chromePath;

        $proc = new Process([$nodeBin, $script, (string) $id, $lang, $outPath], base_path(), $env, null, $timeout);
        $out = ''; $err = '';

        $proc->run(function ($type, $data) use (&$out, &$err) {
            if ($type === Process::ERR) $err .= $data; else $out .= $data;
        });

        if ($proc->isSuccessful() && is_file($outPath) && filesize($outPath) > 0) return true;

        $msg = trim($err ?: $out);
        if ($msg !== '') $this->line("      → " . $msg);
        return false;
    }

    protected function normalizeYearOrNull($y): ?int
    {
        $yy = (int) $y;
        return ($yy >= 1900 && $yy <= 2100) ? $yy : null;
    }

    protected function normalizeYearFolder(?int $y): string
    {
        return $y ? (string) $y : 'unknown';
    }

    protected function detectNode(): string
    {
        if ($bin = env('NODE_BIN')) return $bin;
        $win = 'C:\\Program Files\\nodejs\\node.exe';
        if (DIRECTORY_SEPARATOR === '\\' && is_file($win)) return $win;
        return 'node';
    }

    protected function extractInlineJsonWithItems(string $text): ?array
    {
        $buf = str_replace(["\r\n", "\r"], "\n", $text);
        $buf = preg_replace('/^\xEF\xBB\xBF/', '', $buf);

        $depth = 0; $start = null; $objs = [];
        $inStr = false; $esc = false; $len = strlen($buf);

        for ($i = 0; $i < $len; $i++) {
            $ch = $buf[$i];

            if ($inStr) {
                if ($esc) { $esc = false; }
                else {
                    if ($ch === '\\') $esc = true;
                    elseif ($ch === '"') $inStr = false;
                }
                continue;
            }

            if ($ch === '"') { $inStr = true; continue; }
            if ($ch === '{') { if ($depth === 0) $start = $i; $depth++; continue; }
            if ($ch === '}') {
                if ($depth > 0) {
                    $depth--;
                    if ($depth === 0 && $start !== null) {
                        $objs[] = substr($buf, $start, $i - $start + 1);
                        $start = null;
                    }
                }
            }
        }

        for ($k = count($objs) - 1; $k >= 0; $k--) {
            $cand = $objs[$k];
            if (strpos($cand, '"items"') === false) continue;
            $dec = json_decode($cand, true);
            if (is_array($dec) && isset($dec['items']) && is_array($dec['items'])) return $dec;
        }
        return null;
    }
}
