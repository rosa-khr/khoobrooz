<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('menus');
            $table->string('title', 160);
            $table->string('url', 600)->nullable();
            $table->string('slug', 180)->nullable();
            $this->seoColumns($table);
            $table->string('icon', 150)->nullable();
            $table->string('target', 30)->nullable();
            $table->integer('sort_order')->default(0);
            $table->tinyInteger('level')->default(1);
            $table->string('locale', 10)->default('fa');
            $this->publishColumns($table);
            $this->auditColumns($table);
            $table->index(['parent_id', 'sort_order']);
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories');
            $table->string('type', 60);
            $table->string('locale', 10)->default('fa');
            $table->string('title', 160);
            $table->string('slug', 180);
            $this->seoColumns($table);
            $table->integer('sort_order')->default(0);
            $this->auditColumns($table);
            $table->unique(['locale', 'slug']);
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('title', 160);
            $table->string('slug', 180);
            $this->seoColumns($table);
            $table->string('locale', 10)->default('fa');
            $this->auditColumns($table);
            $table->unique(['locale', 'slug']);
        });

        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('fa');
            $table->string('slug', 180);
            $table->string('title', 220);
            $table->string('summary', 800)->nullable();
            $table->longText('body')->nullable();
            $this->seoColumns($table);
            $this->publishColumns($table);
            $this->auditColumns($table);
            $table->unique(['locale', 'slug']);
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('fa');
            $table->string('slug', 180);
            $table->string('title', 220);
            $table->string('short_title', 120)->nullable();
            $table->string('summary', 800)->nullable();
            $table->longText('body')->nullable();
            $table->string('icon', 150)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $this->seoColumns($table);
            $this->publishColumns($table);
            $this->auditColumns($table);
            $table->unique(['locale', 'slug']);
        });

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories');
            $table->string('locale', 10)->default('fa');
            $table->string('title', 240);
            $table->string('slug', 200);
            $table->string('excerpt', 900)->nullable();
            $table->longText('body')->nullable();
            $table->foreignId('cover_image_id')->nullable()->constrained('media_files');
            $this->seoColumns($table);
            $this->approvalColumns($table);
            $this->publishColumns($table);
            $table->timestamp('scheduled_at')->nullable();
            $this->auditColumns($table);
            $table->unique(['locale', 'slug']);
            $table->index(['locale', 'is_published', 'approve', 'published_at']);
        });

        Schema::create('article_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles');
            $table->foreignId('tag_id')->constrained('tags');
            $this->auditColumns($table, 1);
            $table->unique(['article_id', 'tag_id']);
        });

        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories');
            $table->string('locale', 10)->default('fa');
            $table->string('title', 240);
            $table->string('slug', 200);
            $table->string('summary', 900)->nullable();
            $table->longText('body')->nullable();
            $table->string('source_name', 180)->nullable();
            $table->string('source_url', 600)->nullable();
            $table->timestamp('news_date')->nullable();
            $table->foreignId('cover_image_id')->nullable()->constrained('media_files');
            $this->seoColumns($table);
            $this->approvalColumns($table);
            $this->publishColumns($table);
            $table->timestamp('scheduled_at')->nullable();
            $this->auditColumns($table);
            $table->unique(['locale', 'slug']);
            $table->index(['locale', 'is_published', 'approve', 'published_at']);
        });

        Schema::create('news_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_id')->constrained('news');
            $table->foreignId('tag_id')->constrained('tags');
            $this->auditColumns($table, 1);
            $table->unique(['news_id', 'tag_id']);
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10)->default('fa');
            $table->string('slug', 180);
            $table->string('title', 220);
            $table->string('description', 900)->nullable();
            $table->foreignId('file_id')->nullable()->constrained('media_files');
            $table->decimal('price', 18, 2)->default(0);
            $table->boolean('is_free')->default(true);
            $this->seoColumns($table);
            $this->publishColumns($table);
            $this->auditColumns($table);
            $table->unique(['locale', 'slug']);
        });
    }

    public function down(): void
    {
        foreach ([
            'documents',
            'news_tag',
            'news',
            'article_tag',
            'articles',
            'services',
            'pages',
            'tags',
            'categories',
            'menus',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }

    private function seoColumns(Blueprint $table): void
    {
        $table->string('seo_title', 255)->nullable();
        $table->string('seo_description', 500)->nullable();
        $table->string('canonical_url', 600)->nullable();
        $table->string('og_title', 255)->nullable();
        $table->string('og_description', 500)->nullable();
        $table->foreignId('og_image_id')->nullable()->constrained('media_files');
        $table->string('robots', 80)->nullable();
        $table->longText('structured_data')->nullable();
    }

    private function approvalColumns(Blueprint $table): void
    {
        $table->boolean('approve')->default(false);
        $table->timestamp('approved_at')->nullable();
        $table->unsignedBigInteger('approved_by')->nullable();
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
