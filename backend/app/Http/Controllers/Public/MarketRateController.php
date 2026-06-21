<?php

namespace App\Http\Controllers\Public;

use App\Services\TgjuMarketRateService;
use Illuminate\Http\JsonResponse;

class MarketRateController
{
    public function __construct(private readonly TgjuMarketRateService $marketRates)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'ok' => true,
            ...$this->marketRates->board(),
        ]);
    }

    public function board(): JsonResponse
    {
        return $this->index();
    }
}
