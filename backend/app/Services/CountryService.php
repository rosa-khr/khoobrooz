<?php

namespace App\Services;

use App\Models\Country;

class CountryService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Country::query()
            ->when($filters['search'] ?? null, function ($query, string $search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('name_fa', 'like', "%{$search}%")
                        ->orWhere('name_en', 'like', "%{$search}%")
                        ->orWhere('iso2', 'like', "%{$search}%")
                        ->orWhere('iso3', 'like', "%{$search}%");
                });
            })
            ->when($filters['iso2'] ?? null, fn ($query, string $iso2) => $query->where('iso2', strtoupper($iso2)))
            ->orderBy('sort_order')
            ->orderBy('name_fa');
    }
}
