<?php

namespace App\Services;

use App\Models\ContactRequest;

class ContactRequestService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return ContactRequest::query()->latest('created_at');
    }
}
