<?php

namespace App\Services;

use App\Models\WorldClockItem;

class WorldClockService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return WorldClockItem::query()->orderBy('sort_order');
    }
}
