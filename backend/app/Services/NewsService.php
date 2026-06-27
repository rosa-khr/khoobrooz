<?php

namespace App\Services;

use App\Models\News;

class NewsService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return News::query()->latest('created_at');
    }

    public function approve(News $news, int $userId): bool
    {
        $news->approve = true;
        $news->approved_by = $userId;
        $news->approved_at = now();

        return $news->save();
    }
}
