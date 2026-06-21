<?php

namespace App\Http\Controllers\Admin;

use App\Services\TgjuMarketRateService;
use Illuminate\Http\JsonResponse;

class MarketRateSyncController
{
    public function __construct(private readonly TgjuMarketRateService $marketRates)
    {
    }

    public function store(): JsonResponse
    {
        return response()->json([
            'ok' => true,
            ...$this->marketRates->sync(),
        ]);
    }
}
