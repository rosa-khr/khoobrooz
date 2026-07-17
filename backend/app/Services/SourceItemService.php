<?php

namespace App\Services;

use App\Models\SourceItem;

class SourceItemService extends BaseCrudService
{
    protected function query(array $filters = [])
    {
        $query = SourceItem::query()
            ->with(['source', 'suggestedCategory'])
            ->latest('fetched_at');

        if (isset($filters['processing_status'])) {
            $query->where('processing_status', $filters['processing_status']);
        }

        if (isset($filters['detected_content_type'])) {
            $query->where('detected_content_type', $filters['detected_content_type']);
        }

        if (isset($filters['source_id'])) {
            $query->where('source_id', $filters['source_id']);
        }

        return $query;
    }

    public function approve(SourceItem $item): bool
    {
        $item->processing_status = 'approved';
        return $item->save();
    }

    public function reject(SourceItem $item): bool
    {
        $item->processing_status = 'rejected';
        return $item->save();
    }

    public function archive(SourceItem $item): bool
    {
        $item->processing_status = 'archived';
        return $item->save();
    }
}
