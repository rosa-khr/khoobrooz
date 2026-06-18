<?php

namespace App\Models;

use App\Models\Concerns\HasSeoFields;

class Article extends BaseModel
{
    use HasSeoFields;

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'article_tag');
    }
}
