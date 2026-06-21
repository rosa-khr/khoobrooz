<?php

namespace App\Console\Commands;

use App\Services\TgjuMarketRateService;
use Illuminate\Console\Command;

class SyncTgjuMarketRates extends Command
{
    protected $signature = 'market-rates:sync-tgju';

    protected $description = 'Fetch TGJU rates and store normalized market-rate snapshots.';

    public function handle(TgjuMarketRateService $marketRates): int
    {
        $payload = $marketRates->sync();
        $this->info(sprintf('TGJU sync completed. Rates: %d', count($payload['rates'] ?? [])));

        return self::SUCCESS;
    }
}
