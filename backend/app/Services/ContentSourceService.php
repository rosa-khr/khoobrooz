<?php

namespace App\Services;

use App\Models\ContentSource;

class ContentSourceService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        $query = ContentSource::query()->with('defaultCategory')->latest('created_at');

        if (isset($filters['source_type'])) {
            $query->where('source_type', $filters['source_type']);
        }

        if (isset($filters['connection_status'])) {
            $query->where('connection_status', $filters['connection_status']);
        }

        if (array_key_exists('is_active', $filters)) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        return $query;
    }
}
