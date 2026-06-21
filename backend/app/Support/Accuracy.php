<?php

namespace App\Support;

final class Accuracy
{
    public const PENDING = 0;
    public const ACCEPTED = 1;
    public const TRASHED = 2;

    public static function values(): array
    {
        return [
            self::PENDING,
            self::ACCEPTED,
            self::TRASHED,
        ];
    }
}
