<?php

namespace App\Services;

use App\Models\User;

class UserService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return User::query()->latest('created_at');
    }
}
