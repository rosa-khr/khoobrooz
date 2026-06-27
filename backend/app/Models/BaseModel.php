<?php

namespace App\Models;

use App\Models\Concerns\HasAccuracy;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    use HasAccuracy;

    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = 'modified_at';

    protected $guarded = ['id'];
}
