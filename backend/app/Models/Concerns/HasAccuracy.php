<?php

namespace App\Models\Concerns;

use App\Support\Accuracy;

trait HasAccuracy
{
    public function scopeAccepted($query)
    {
        return $query->where('accuracy', Accuracy::ACCEPTED);
    }

    public function scopeNotTrashed($query)
    {
        return $query->where('accuracy', '<>', Accuracy::TRASHED);
    }

    public function markAsTrashed(): bool
    {
        $this->accuracy = Accuracy::TRASHED;

        return $this->save();
    }
}
