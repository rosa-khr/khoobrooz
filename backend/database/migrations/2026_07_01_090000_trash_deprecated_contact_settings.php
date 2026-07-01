<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')
            ->where('group', 'contact')
            ->whereIn('key', ['office_phone', 'fax'])
            ->update([
                'accuracy' => 2,
                'modified_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('settings')
            ->where('group', 'contact')
            ->whereIn('key', ['office_phone', 'fax'])
            ->update([
                'accuracy' => 1,
                'modified_at' => now(),
            ]);
    }
};
