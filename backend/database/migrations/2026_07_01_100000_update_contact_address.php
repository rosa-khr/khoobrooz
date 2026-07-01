<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const NEW_ADDRESS = 'تهران، بلوار آفریقا (جردن)، بالاتر از خیابان اسفندیار، خیابان انصاری (صداقت)، پلاک 1';

    private const OLD_ADDRESS = 'تهران، منطقه 3، آفریقا (جردن)، بالاتر از خیابان اسفندیار، خیابان انصاری (صداقت)، پلاک 1، واحد 1 غربی';

    public function up(): void
    {
        $this->updateAddress(self::NEW_ADDRESS);
    }

    public function down(): void
    {
        $this->updateAddress(self::OLD_ADDRESS);
    }

    private function updateAddress(string $address): void
    {
        DB::table('settings')->updateOrInsert(
            [
                'group' => 'contact',
                'key' => 'address',
                'locale' => 'fa',
            ],
            [
                'value' => $address,
                'type' => 'string',
                'accuracy' => 1,
                'modified_at' => now(),
            ],
        );
    }
};
