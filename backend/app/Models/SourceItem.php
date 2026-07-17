<?php

namespace App\Models;

class SourceItem extends BaseModel
{
    protected $casts = [
        'source_published_at' => 'datetime',
        'source_updated_at' => 'datetime',
        'fetched_at' => 'datetime',
        'issued_at' => 'datetime',
        'effective_at' => 'datetime',
        'last_verified_at' => 'datetime',
        'raw_payload' => 'array',
        'fetch_metadata' => 'array',
    ];

    public function source()
    {
        return $this->belongsTo(ContentSource::class, 'source_id');
    }

    public function suggestedCategory()
    {
        return $this->belongsTo(Category::class, 'suggested_category_id');
    }

    public function duplicateOf()
    {
        return $this->belongsTo(SourceItem::class, 'duplicate_of_id');
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function news()
    {
        return $this->belongsTo(News::class);
    }
}
