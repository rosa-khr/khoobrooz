<?php

namespace App\Services;

use App\Models\ImportantLink;

class ImportantLinkService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return ImportantLink::query()->orderBy('sort_order');
    }
}
