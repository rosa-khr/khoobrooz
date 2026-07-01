<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const NEW_NUMBER = '0910 306 0396';

    public function up(): void
    {
        $this->updateNumbers(self::NEW_NUMBER);
    }

    public function down(): void
    {
        // The invalid contact number must not be restored.
    }

    private function updateNumbers(string $number): void
    {
        DB::table('settings')
            ->where('group', 'contact')
            ->whereIn('key', ['general_phone', 'clearance_phone'])
            ->update([
                'value' => $number,
                'accuracy' => 1,
                'modified_at' => now(),
            ]);
    }
};
