<?php

namespace App\Models;

class ContentSource extends BaseModel
{
    protected $casts = [
        'request_headers' => 'array',
        'requires_review' => 'boolean',
        'allow_auto_publish' => 'boolean',
        'is_active' => 'boolean',
        'respect_robots' => 'boolean',
        'last_fetched_at' => 'datetime',
        'last_successful_fetch_at' => 'datetime',
        'last_error_at' => 'datetime',
    ];

    public function defaultCategory()
    {
        return $this->belongsTo(Category::class, 'default_category_id');
    }

    public function items()
    {
        return $this->hasMany(SourceItem::class, 'source_id');
    }
}
