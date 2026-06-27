<?php

namespace App\Services;

use App\Models\Menu;

class MenuService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Menu::query()->orderBy('sort_order');
    }
}
