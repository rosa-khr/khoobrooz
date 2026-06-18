<?php

namespace App\Services;

use App\Models\Country;

class CountryService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Country::query()->orderBy('sort_order')->orderBy('name_fa');
    }
}
