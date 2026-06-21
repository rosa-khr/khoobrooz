<?php

namespace App\Models;

class HomeSection extends BaseModel
{
    public function items()
    {
        return $this->hasMany(HomeSectionItem::class, 'section_id')->orderBy('sort_order');
    }
}
