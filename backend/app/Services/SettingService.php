<?php

namespace App\Services;

use App\Models\Setting;

class SettingService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Setting::query()->orderBy('group')->orderBy('key');
    }
}
