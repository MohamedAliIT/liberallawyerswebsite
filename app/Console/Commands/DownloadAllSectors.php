<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class DownloadAllSectors extends Command
{
    protected $signature = 'download:all-sectors
        {sectors?* : اختياري — IDs مثل 55 43 44، أو قوائم 55,57,60، أو مدد 1-10}
        {--pages=1}
        {--from-page=1}
        {--lang=both}
        {--dir=uae_legislation}
        {--node=}
        {--chrome=}
        {--timeout=180}
        {--no-save}';

    protected $description = 'تشغيل تنزيل لكل القطاعات (أو مجموعة محددة) مع تمرير نفس خيارات download:sector-pdfs.';

    private function expandSectors(array $args): array
    {
        $out = [];
        foreach ($args as $tok) {
            foreach (explode(',', $tok) as $piece) {
                $piece = trim($piece);
                if ($piece === '') continue;
                if (preg_match('/^(\d+)\s*-\s*(\d+)$/', $piece, $m)) {
                    $a = (int)$m[1]; $b = (int)$m[2];
                    if ($a > $b) [$a, $b] = [$b, $a];
                    $out = array_merge($out, range($a, $b));
                } elseif (ctype_digit($piece)) {
                    $out[] = (int)$piece;
                }
            }
        }
        $out = array_values(array_unique(array_filter($out, fn ($v) => $v > 0)));
        sort($out);
        return $out;
    }

    private function defaultSectorIds(): array
    {
        return [55,43,44,45,56,46,57,47,58,49,50,51,52,53,61,59,60];
    }

    public function handle(): int
    {
        $args    = (array) $this->argument('sectors');
        $sectors = $this->expandSectors($args) ?: $this->defaultSectorIds();

        $opts = [
            '--pages'     => (string) max(1, (int)$this->option('pages')),
            '--from-page' => (string) max(1, (int)$this->option('from-page')),
            '--lang'      => (string) ($this->option('lang') ?: 'both'),
            '--dir'       => (string) ($this->option('dir') ?: 'uae_legislation'),
            '--timeout'   => (string) max(30, (int)$this->option('timeout')),
        ];
        if ($node = $this->option('node'))     $opts['--node'] = (string)$node;
        if ($chrome = $this->option('chrome')) $opts['--chrome'] = (string)$chrome;
        if ($this->option('no-save'))          $opts['--no-save'] = true;

        $params = array_merge(['sectors' => $sectors], $opts);

        $this->info('تشغيل download:sector-pdfs لجميع القطاعات المطلوبة…');
        $exit = Artisan::call('download:sector-pdfs', $params);
        $this->line(Artisan::output());

        return $exit === 0 ? self::SUCCESS : self::FAILURE;
    }
}
