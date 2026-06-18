<?php

namespace App\Models\Concerns;

trait HasSeoFields
{
    public function seoFields(): array
    {
        return [
            'slug',
            'seo_title',
            'seo_description',
            'canonical_url',
            'og_title',
            'og_description',
            'og_image_id',
            'robots',
            'structured_data',
        ];
    }
}
