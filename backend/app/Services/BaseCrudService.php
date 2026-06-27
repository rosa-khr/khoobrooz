<?php

namespace App\Services;

abstract class BaseCrudService
{
    public function list(array $filters = [])
    {
        return $this->query($filters)->notTrashed();
    }

    public function trash($model): bool
    {
        return $model->markAsTrashed();
    }

    abstract protected function query(array $filters = []);
}
