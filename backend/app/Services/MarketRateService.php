<?php

namespace App\Services;

use App\Models\MarketRateInstrument;

class MarketRateService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return MarketRateInstrument::query()->orderBy('sort_order');
    }
}
