<?php

namespace App\Services;

use App\Models\Tag;

class TagService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Tag::query()->orderBy('title');
    }
}
