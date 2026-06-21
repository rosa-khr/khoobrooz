<?php

namespace App\Models;

use App\Models\Concerns\HasSeoFields;

class News extends BaseModel
{
    use HasSeoFields;

    protected $table = 'news';

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'news_tag');
    }
}
