<?php

namespace App\Services;

use App\Models\Service;

class ServiceService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Service::query()->orderBy('sort_order');
    }
}
