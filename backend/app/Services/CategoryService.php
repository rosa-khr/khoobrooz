<?php

namespace App\Services;

use App\Models\Category;

class CategoryService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Category::query()->orderBy('sort_order')->orderBy('title');
    }
}
