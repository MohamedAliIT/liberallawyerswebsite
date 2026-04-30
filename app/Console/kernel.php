<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
   // يجلب السنة الحالية + السابقة يوميًا 02:30 صباحًا
    $schedule->command('sync:dubai-gazette latest --download')
             ->dailyAt('02:30')
             ->onOneServer()
             ->withoutOverlapping();
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }

//     protected $commands = [
//     \App\Console\Commands\SyncDubaiGazette::class,
// ];

protected $commands = [
    // All default sectors (no args): run this in terminal >> php artisan download:all-sectors --pages=999 --lang=both
    // Specific list & ranges: run this on the terminal >> php artisan download:all-sectors 1-10 55,57,60 --pages=3 --lang=en
    \App\Console\Commands\DownloadSectorPdfs::class,
    \App\Console\Commands\DownloadAllSectors::class,
];
}
