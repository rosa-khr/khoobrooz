<?php

namespace App\Services;

use App\Models\Page;

class PageService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Page::query()->latest('created_at');
    }
}
