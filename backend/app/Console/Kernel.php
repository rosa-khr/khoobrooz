<?php

namespace App\Console;

use App\Console\Commands\SyncTgjuMarketRates;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        SyncTgjuMarketRates::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        $schedule
            ->command('market-rates:sync-tgju')
            ->everyTwoHours()
            ->withoutOverlapping()
            ->runInBackground();
    }
}
