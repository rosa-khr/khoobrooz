<?php

namespace App\Services;

use App\Models\Permission;

class PermissionService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Permission::query()->orderBy('group')->orderBy('name');
    }
}
