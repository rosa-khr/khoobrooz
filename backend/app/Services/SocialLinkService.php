<?php

namespace App\Services;

use App\Models\SocialLink;

class SocialLinkService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return SocialLink::query()->orderBy('sort_order');
    }
}
