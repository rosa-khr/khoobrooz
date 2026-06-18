<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_key', 120);
            $table->string('title', 220)->nullable();
            $table->string('subtitle', 220)->nullable();
            $table->string('description', 900)->nullable();
            $table->string('layout_type', 80)->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('locale', 10)->default('fa');
            $this->publishColumns($table);
            $this->auditColumns($table);
            $table->unique(['locale', 'section_key']);
        });

        Schema::create('home_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('home_sections');
            $table->string('title', 220)->nullable();
            $table->string('subtitle', 220)->nullable();
            $table->string('description', 900)->nullable();
            $table->string('url', 600)->nullable();
            $table->foreignId('image_id')->nullable()->constrained('media_files');
            $table->string('icon', 150)->nullable();
            $table->longText('metadata')->nullable();
            $table->integer('sort_order')->default(0);
            $this->publishColumns($table);
            $this->auditColumns($table);
        });

        Schema::create('world_clock_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->nullable()->constrained('countries');
            $table->string('city', 160);
            $table->string('country', 160);
            $table->char('country_code', 2)->nullable();
            $table->string('timezone', 120);
            $table->string('market_label', 180)->nullable();
            $table->string('flag', 20)->nullable();
            $table->integer('sort_order')->default(0);
            $this->publishColumns($table);
            $this->auditColumns($table);
        });

        Schema::create('important_links', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->string('url', 600);
            $table->string('description', 800)->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories');
            $table->string('icon', 150)->nullable();
            $table->string('target', 30)->nullable();
            $table->string('rel', 120)->nullable();
            $table->integer('sort_order')->default(0);
            $this->publishColumns($table);
            $this->auditColumns($table);
        });

        Schema::create('market_rate_sources', function (Blueprint $table) {
            $table->id();
            $table->string('key', 120)->unique();
            $table->string('name', 180);
            $table->string('base_url', 800)->nullable();
            $table->boolean('is_active')->default(true);
            $this->auditColumns($table, 1);
        });

        Schema::create('market_rate_instruments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_id')->constrained('market_rate_sources');
            $table->string('key', 160);
            $table->string('group', 80);
            $table->string('title', 180);
            $table->string('symbol', 40)->nullable();
            $table->string('unit', 40)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $this->auditColumns($table, 1);
            $table->unique(['source_id', 'key']);
        });

        Schema::create('market_rate_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instrument_id')->constrained('market_rate_instruments');
            $table->string('price', 80)->nullable();
            $table->string('high', 80)->nullable();
            $table->string('low', 80)->nullable();
            $table->string('change_value', 80)->nullable();
            $table->decimal('change_percent', 10, 4)->nullable();
            $table->string('direction', 20)->nullable();
            $table->timestamp('source_updated_at')->nullable();
            $table->timestamp('fetched_at')->useCurrent();
            $this->auditColumns($table, 1);
            $table->index(['instrument_id', 'fetched_at']);
        });

        Schema::create('market_rate_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_id')->constrained('market_rate_sources');
            $table->string('status', 40);
            $table->longText('message')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('finished_at')->nullable();
            $this->auditColumns($table, 1);
        });

        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->string('type', 80);
            $table->string('name', 160)->nullable();
            $table->string('phone', 40)->nullable();
            $table->string('email', 190)->nullable();
            $table->string('company', 180)->nullable();
            $table->longText('message')->nullable();
            $table->longText('metadata')->nullable();
            $table->string('status', 60)->default('new');
            $this->auditColumns($table);
        });
    }

    public function down(): void
    {
        foreach ([
            'contact_requests',
            'market_rate_sync_logs',
            'market_rate_snapshots',
            'market_rate_instruments',
            'market_rate_sources',
            'important_links',
            'world_clock_items',
            'home_section_items',
            'home_sections',
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
