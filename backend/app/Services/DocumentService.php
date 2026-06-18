<?php

namespace App\Services;

use App\Models\Document;

class DocumentService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Document::query()->latest('created_at');
    }
}
