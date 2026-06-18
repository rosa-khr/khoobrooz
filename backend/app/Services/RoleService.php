<?php

namespace App\Services;

use App\Models\Role;

class RoleService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Role::query()->orderBy('name');
    }
}
