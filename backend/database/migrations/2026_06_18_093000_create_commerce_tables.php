<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('fa');
            $table->string('slug', 180);
            $table->string('title', 220);
            $table->longText('description')->nullable();
            $table->decimal('price', 18, 2)->default(0);
            $table->string('product_type', 60)->default('file');
            $this->publishColumns($table);
            $this->auditColumns($table);
            $table->unique(['locale', 'slug']);
        });

        Schema::create('product_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('file_id')->constrained('media_files');
            $this->auditColumns($table, 1);
        });

        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('session_id', 160)->nullable();
            $this->auditColumns($table, 1);
        });

        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 18, 2);
            $this->auditColumns($table, 1);
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('order_number', 80)->unique();
            $table->string('status', 60)->default('pending');
            $table->decimal('total_amount', 18, 2)->default(0);
            $this->auditColumns($table, 1);
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('product_id')->constrained('products');
            $table->string('title', 220);
            $table->integer('quantity');
            $table->decimal('unit_price', 18, 2);
            $table->decimal('total_price', 18, 2);
            $this->auditColumns($table, 1);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->string('provider', 80);
            $table->string('authority', 160)->nullable();
            $table->string('reference_id', 160)->nullable();
            $table->decimal('amount', 18, 2);
            $table->string('status', 60)->default('pending');
            $table->timestamp('paid_at')->nullable();
            $this->auditColumns($table, 1);
        });
    }

    public function down(): void
    {
        foreach ([
            'payments',
            'order_items',
            'orders',
            'cart_items',
            'carts',
            'product_files',
            'products',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }

    private function publishColumns(Blueprint $table): void
    {
        $table->boolean('is_published')->default(false);
        $table->timestamp('published_at')->nullable();
        $table->unsignedBigInteger('published_by')->nullable();
    }

    private function auditColumns(Blueprint $table, int $accuracyDefault = 0): void
    {
        $table->timestamp('created_at')->useCurrent();
        $table->unsignedBigInteger('created_by')->nullable();
        $table->timestamp('modified_at')->nullable();
        $table->unsignedBigInteger('modified_by')->nullable();
        $table->tinyInteger('accuracy')->default($accuracyDefault);
        $table->index('accuracy');
    }
};
