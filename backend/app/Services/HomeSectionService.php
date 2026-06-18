<?php

namespace App\Services;

use App\Models\HomeSection;

class HomeSectionService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return HomeSection::query()->orderBy('sort_order');
    }
}
