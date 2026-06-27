<?php

namespace App\Services;

use App\Models\Article;

class ArticleService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        return Article::query()->latest('created_at');
    }

    public function approve(Article $article, int $userId): bool
    {
        $article->approve = true;
        $article->approved_by = $userId;
        $article->approved_at = now();

        return $article->save();
    }
}
