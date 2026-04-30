<?php

namespace App\Console\Commands;

use App\Models\DubaiGazetteIssue;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

class SyncDubaiGazette extends Command
{
    protected $signature = 'sync:dubai-gazette 
                            {year : Four-digit year to sync (e.g. 1961)} 
                            {--deep : Use deep scraping mode in Puppeteer} 
                            {--download : Also download the PDF to local storage} 
                            {--node= : Full path to node.exe (optional; auto-detected)} 
                            {--script= : Full path to scripts/scrape_dubai_gazette.cjs (optional)}';

    protected $description = 'Scrape Dubai Official Gazette issues for a given year (and optionally download PDFs).';

    public function handle(): int
    {
        $year = (int) $this->argument('year');
        if ($year < 1900 || $year > (int) date('Y') + 1) {
            $this->error("Invalid year: {$year}");
            return self::FAILURE;
        }

        $deep            = (bool) $this->option('deep');
        $shouldDownload  = (bool) $this->option('download');
        $nodePath        = $this->option('node') ?: $this->guessNodePath();
        $scriptPath      = $this->option('script') ?: base_path('scripts/scrape_dubai_gazette.cjs');

        if (!is_file($scriptPath)) {
            $this->error("Script not found: {$scriptPath}");
            return self::FAILURE;
        }

        $this->line('Running Dubai Gazette scraper:');
        $this->line("  Node: {$nodePath}");
        $this->line('  Args: ' . json_encode([$nodePath, $scriptPath, (string) $year, $deep ? '1' : '0']));

        [$buffer, $ok] = $this->runNodeScraper($nodePath, $scriptPath, $year, $deep);
        $this->storeDebugLog($buffer);

        if (!$ok) {
            $this->error('Scraper failed. See storage/logs/dubai_gazette_last.log');
            return self::FAILURE;
        }

        $json = $this->extractItemsJson($buffer);
        if (!is_array($json) || !isset($json['items']) || !is_array($json['items'])) {
            $this->warn('No valid items JSON produced by scraper.');
            return self::SUCCESS;
        }

        $items = $json['items'];
        if (count($items) === 0) {
            $this->warn("No items for year {$year}.");
            return self::SUCCESS;
        }

        // === Lookup للأعداد الموجودة مسبقًا في هذه السنة (لتخطيها بسرعة) ===
        $existing = DubaiGazetteIssue::where('year', $year)->pluck('issue_no')->all();
        $existing = array_flip($existing); // issue_no => true

        $this->info('Saving to database ...');

        $saved = 0;
        foreach ($items as $raw) {
            $issueNo = isset($raw['issue_no']) ? (int) $raw['issue_no'] : null;
            if (!$issueNo) {
                $issueNo = $this->tryParseIssueNo(Arr::get($raw, 'title', ''));
            }
            if (!$issueNo) {
                $this->warn('  ! skipped item (missing issue_no)');
                continue;
            }

            // تخطّي العدد إن كان موجودًا مسبقًا في قاعدة البيانات لنفس السنة
            if (isset($existing[$issueNo])) {
                $this->line("  • skip existing: year={$year} issue_no={$issueNo}");
                continue;
            }

            $viewer = Arr::get($raw, 'viewer_url');
            $pdf    = Arr::get($raw, 'pdf_url');
            $title  = trim(preg_replace('/\s+/', ' ', (string) Arr::get($raw, 'title', ''))) ?: "عدد {$issueNo} – {$year}";

            /** @var \App\Models\DubaiGazetteIssue $issue */
            $issue = DubaiGazetteIssue::query()->updateOrCreate(
                ['year' => $year, 'issue_no' => $issueNo],
                [
                    'title'      => $title,
                    'viewer_url' => $viewer,
                    'pdf_url'    => $pdf,
                    'source_url' => $viewer ?: $pdf,
                    'thumb_url'  => Arr::get($raw, 'thumb_url'),
                    'cover_url'  => Arr::get($raw, 'cover_url'),
                    'pages'      => Arr::get($raw, 'pages'),
                ]
            );

            $this->info("  ✓ upsert: year={$year} issue_no={$issueNo}");

            // أضِف العدد الجديد إلى الـ lookup لتجنّب تكراره داخل نفس التشغيل إذا ظهرت عناصر مكررة لاحقًا
            $existing[$issueNo] = true;

            if ($shouldDownload) {
                $resolved = $this->resolvePdfUrl($issue->viewer_url, $issue->pdf_url);
                if ($resolved) {
                    if (!$issue->pdf_url) {
                        $issue->pdf_url = $resolved;
                    }
                    if ($local = $this->downloadPdfToLocal($resolved, $year, $issueNo)) {
                        $issue->pdf_local_path = $local;
                        $issue->save();
                        $this->info("    ✓ downloaded -> {$local}");
                    } else {
                        $this->warn("    ! download failed");
                    }
                } else {
                    $this->warn("    ! could not resolve pdf url");
                }
            }

            $saved++;
        }

        $this->info("Synced: {$saved} item(s).");
        return self::SUCCESS;
    }

    /* ========================== SCRAPER ========================== */

    protected function runNodeScraper(string $node, string $script, int $year, bool $deep): array
    {
        $env = $_ENV;
        if (!empty(config('services.puppeteer.chrome_path'))) {
            $env['PUPPETEER_EXECUTABLE_PATH'] = config('services.puppeteer.chrome_path');
        } elseif (!empty(env('PUPPETEER_EXECUTABLE_PATH'))) {
            $env['PUPPETEER_EXECUTABLE_PATH'] = env('PUPPETEER_EXECUTABLE_PATH');
        }

        $args    = [$node, $script, (string) $year, $deep ? '1' : '0'];
        $process = new Process($args, base_path(), $env);
        $process->setTimeout(300);

        $buffer = '';
        $this->line('Opening index …');

        $process->run(function ($type, $data) use (&$buffer) {
            $buffer .= $data;
        });

        return [$buffer, $process->isSuccessful()];
    }

    /* ======================= JSON EXTRACTION ===================== */

    protected function extractItemsJson(string $buffer): ?array
    {
        $buf = str_replace(["\r\n", "\r"], "\n", $buffer);
        $buf = preg_replace('/^\xEF\xBB\xBF/', '', $buf);
        $buf = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $buf);

        $len      = strlen($buf);
        $objects  = [];
        $inString = false;
        $escaped  = false;
        $depth    = 0;
        $start    = null;

        for ($i = 0; $i < $len; $i++) {
            $ch = $buf[$i];

            if ($inString) {
                if ($escaped) {
                    $escaped = false;
                } else {
                    if ($ch === '\\') $escaped = true;
                    elseif ($ch === '"') $inString = false;
                }
                continue;
            }

            if ($ch === '"') { $inString = true; continue; }

            if ($ch === '{') {
                if ($depth === 0) $start = $i;
                $depth++;
            } elseif ($ch === '}') {
                if ($depth > 0) {
                    $depth--;
                    if ($depth === 0 && $start !== null) {
                        $objects[] = substr($buf, $start, $i - $start + 1);
                        $start = null;
                    }
                }
            }
        }

        for ($k = count($objects) - 1; $k >= 0; $k--) {
            $candidate = $objects[$k];
            if (strpos($candidate, '"items"') === false) continue;

            try {
                $data = json_decode($candidate, true, 512, JSON_THROW_ON_ERROR);
            } catch (\Throwable $e) {
                $candidate = preg_replace('#//.*$#m', '', $candidate);
                $candidate = preg_replace('#/\*.*?\*/#s', '', $candidate);
                try {
                    $data = json_decode($candidate, true, 512, JSON_THROW_ON_ERROR);
                } catch (\Throwable $e2) {
                    $data = null;
                }
            }

            if (is_array($data) && isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as &$it) {
                    if (isset($it['title'])) $it['title'] = trim(preg_replace('/\s+/', ' ', (string) $it['title']));
                    if (isset($it['issue_no'])) $it['issue_no'] = (int) $it['issue_no'];
                }
                return $data;
            }
        }

        return null;
    }

    /* =========================== HELPERS ========================= */

    protected function tryParseIssueNo(string $title): ?int
    {
        $western = $this->arabicDigitsToWestern($title);
        if (preg_match('/\b(\d{1,4})\b/u', $western, $m)) return (int) $m[1];
        return null;
    }

    protected function arabicDigitsToWestern(string $s): string
    {
        $eastern = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        $western = ['0','1','2','3','4','5','6','7','8','9'];
        return str_replace($eastern, $western, $s);
    }

    protected function resolvePdfUrl(?string $viewerUrl, ?string $pdfUrl): ?string
    {
        if ($pdfUrl && Str::contains($pdfUrl, '.pdf')) return $pdfUrl;
        if (!$viewerUrl) return null;

        $html = $this->fetchHtml($viewerUrl);
        if (!$html) return null;

        if (preg_match('/https?:\/\/[^\s\'"]+\.pdf/i', $html, $m)) return $m[0];

        if (preg_match('/["\']([^"\']+\.pdf)["\']/', $html, $m2)) {
            $abs = $this->absolutizeUrl($viewerUrl, html_entity_decode($m2[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            if ($abs) return $abs;
        }

        if (preg_match('/"pdfUrl"\s*:\s*"([^"]+\.pdf)"/i', $html, $m3)) {
            $abs = $this->absolutizeUrl($viewerUrl, html_entity_decode($m3[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            if ($abs) return $abs;
        }

        return null;
    }

    protected function fetchHtml(string $url): ?string
    {
        try {
            $resp = Http::timeout(60)->withHeaders([
                'User-Agent' => 'Mozilla/5.0',
                'Accept'     => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            ])->get($url);

            if ($resp->ok()) return $resp->body();
        } catch (\Throwable $e) {
            $this->warn("    ! fetchHtml error: " . $e->getMessage());
        }
        return null;
    }

    protected function absolutizeUrl(string $baseUrl, string $maybeRelative): ?string
    {
        if (preg_match('#^https?://#i', $maybeRelative)) return $maybeRelative;

        $b = parse_url($baseUrl);
        if (!$b || empty($b['scheme']) || empty($b['host'])) return null;

        $scheme   = $b['scheme'];
        $host     = $b['host'];
        $port     = isset($b['port']) ? ':' . $b['port'] : '';
        $basePath = isset($b['path']) ? $b['path'] : '/';

        if (strpos($maybeRelative, '/') === 0) {
            return "{$scheme}://{$host}{$port}{$maybeRelative}";
        }

        $dir = rtrim(substr($basePath, 0, strrpos($basePath, '/') ?: 0), '/');
        return "{$scheme}://{$host}{$port}{$dir}/{$maybeRelative}";
    }

    protected function downloadPdfToLocal(string $url, int $year, int $issueNo): ?string
    {
        try {
            $dir = storage_path("app/dubai_gazette/{$year}");
            if (!is_dir($dir)) @mkdir($dir, 0775, true);

            $target = "{$dir}/{$issueNo}.pdf";
            $tmp    = "{$target}.part";

            $resp = Http::timeout(180)->withHeaders([
                'Accept'     => 'application/pdf,*/*',
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            ])->get($url);

            if (!$resp->ok() || !Str::contains(Str::lower($resp->header('Content-Type', '')), 'pdf')) {
                return null;
            }

            file_put_contents($tmp, $resp->body());
            @rename($tmp, $target);

            // relative path from storage/ (كما نحفظه في عمود pdf_local_path)
            return "app/dubai_gazette/{$year}/{$issueNo}.pdf";
        } catch (\Throwable $e) {
            $this->warn("    ! HTTP error: " . $e->getMessage());
            return null;
        }
    }

    protected function storeDebugLog(string $buffer): void
    {
        $logFile = storage_path('logs/dubai_gazette_last.log');
        @file_put_contents($logFile, $buffer);
        $this->line("Debug saved: {$logFile}");
    }

    protected function guessNodePath(): string
    {
        $win = 'C:\Program Files\nodejs\node.exe';
        if (DIRECTORY_SEPARATOR === '\\' && is_file($win)) return $win;
        return 'node';
    }
}
