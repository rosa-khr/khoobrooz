<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name', 220);
            $table->string('slug', 180)->unique();
            $table->string('website_url', 600);
            $table->string('feed_url', 600)->nullable();
            $table->enum('source_type', ['rss', 'atom', 'api', 'scraper', 'manual'])->default('manual');
            $table->enum('source_category', ['official', 'news_agency', 'trade_media', 'international'])->default('official');
            $table->string('language', 10)->default('fa');
            $table->string('country', 80)->nullable();
            $table->enum('default_article_type', ['news', 'circular', 'regulation', 'official_notice'])->default('news');
            $table->foreignId('default_category_id')->nullable()->constrained('categories');
            $table->enum('trust_level', ['official', 'high', 'medium', 'low'])->default('medium');
            $table->unsignedInteger('fetch_interval_minutes')->default(60);
            $table->unsignedInteger('backfill_days')->default(7);
            $table->unsignedInteger('max_backfill_items')->default(20);
            $table->boolean('requires_review')->default(true);
            $table->boolean('allow_auto_publish')->default(false);
            $table->boolean('is_active')->default(false);
            $table->boolean('respect_robots')->default(true);
            $table->enum('connection_status', ['ready', 'needs_configuration', 'manual_required', 'disabled', 'error'])->default('needs_configuration');
            $table->text('terms_notes')->nullable();
            $table->string('parser_key', 120)->nullable();
            $table->json('request_headers')->nullable();
            $table->timestamp('last_fetched_at')->nullable();
            $table->timestamp('last_successful_fetch_at')->nullable();
            $table->timestamp('last_error_at')->nullable();
            $table->string('last_error_message', 900)->nullable();
            $table->string('etag', 255)->nullable();
            $table->string('last_modified', 255)->nullable();
            $this->auditColumns($table, 1);
            $table->index(['is_active', 'connection_status', 'last_fetched_at']);
        });

        Schema::create('source_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_id')->constrained('content_sources');
            $table->string('external_id', 255)->nullable();
            $table->string('guid', 600)->nullable();
            $table->string('source_url', 900);
            $table->string('original_title', 500);
            $table->longText('original_summary')->nullable();
            $table->longText('original_content')->nullable();
            $table->string('original_image_url', 900)->nullable();
            $table->string('original_author', 220)->nullable();
            $table->string('original_language', 10)->default('fa');
            $table->timestamp('source_published_at')->nullable();
            $table->timestamp('source_updated_at')->nullable();
            $table->timestamp('fetched_at')->useCurrent();
            $table->char('content_hash', 64);
            $table->char('normalized_title_hash', 64);
            $table->enum('detected_content_type', ['news', 'circular', 'regulation', 'official_notice'])->default('news');
            $table->foreignId('suggested_category_id')->nullable()->constrained('categories');
            $table->decimal('relevance_score', 5, 2)->default(0);
            $table->enum('processing_status', ['pending_review', 'approved', 'published', 'rejected', 'duplicate', 'archived', 'failed', 'filtered_out'])->default('pending_review');
            $table->foreignId('duplicate_of_id')->nullable()->constrained('source_items');
            $table->foreignId('article_id')->nullable()->constrained('articles');
            $table->foreignId('news_id')->nullable()->constrained('news');
            $table->string('circular_number', 180)->nullable();
            $table->string('issuer', 220)->nullable();
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('effective_at')->nullable();
            $table->string('subject', 500)->nullable();
            $table->longText('official_text')->nullable();
            $table->string('attachment_url', 900)->nullable();
            $table->string('official_page_url', 900)->nullable();
            $table->string('validity_status', 120)->nullable();
            $table->foreignId('supersedes_id')->nullable()->constrained('source_items');
            $table->foreignId('amends_id')->nullable()->constrained('source_items');
            $table->timestamp('last_verified_at')->nullable();
            $table->json('raw_payload')->nullable();
            $table->json('fetch_metadata')->nullable();
            $table->string('title', 500)->nullable();
            $table->string('slug', 240)->nullable();
            $table->longText('summary')->nullable();
            $table->longText('body')->nullable();
            $table->string('seo_title', 255)->nullable();
            $table->string('seo_description', 500)->nullable();
            $table->string('selected_image_url', 900)->nullable();
            $this->auditColumns($table, 1);
            $table->unique(['source_id', 'guid']);
            $table->unique(['source_id', 'source_url']);
            $table->index(['processing_status', 'detected_content_type', 'fetched_at']);
            $table->index(['content_hash', 'normalized_title_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('source_items');
        Schema::dropIfExists('content_sources');
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
