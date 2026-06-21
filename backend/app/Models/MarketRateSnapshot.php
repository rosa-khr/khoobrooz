<?php

namespace App\Models;

class MarketRateSnapshot extends BaseModel
{
    protected $table = 'market_rate_snapshots';

    protected $casts = [
        'change_percent' => 'float',
        'source_updated_at' => 'datetime',
        'fetched_at' => 'datetime',
    ];
}
