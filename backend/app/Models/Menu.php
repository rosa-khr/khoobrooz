<?php

namespace App\Models;

use App\Models\Concerns\HasSeoFields;

class Menu extends BaseModel
{
    use HasSeoFields;

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }
}
