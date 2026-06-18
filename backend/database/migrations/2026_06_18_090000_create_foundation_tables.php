<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('email', 190)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $this->auditColumns($table);
            $table->unique('email', 'ux_users_email');
            $table->unique('phone', 'ux_users_phone');
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('key', 120)->unique();
            $table->string('description', 500)->nullable();
            $this->auditColumns($table);
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('key', 150)->unique();
            $table->string('group', 100);
            $table->string('description', 500)->nullable();
            $this->auditColumns($table);
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles');
            $table->foreignId('user_id')->constrained('users');
            $this->auditColumns($table, 1);
            $table->unique(['role_id', 'user_id']);
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_id')->constrained('permissions');
            $table->foreignId('role_id')->constrained('roles');
            $this->auditColumns($table, 1);
            $table->unique(['permission_id', 'role_id']);
        });

        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->string('disk', 80);
            $table->string('path', 600);
            $table->string('mime_type', 150)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('alt', 255)->nullable();
            $table->string('caption', 500)->nullable();
            $this->auditColumns($table);
        });

        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name_fa', 160);
            $table->string('name_en', 160);
            $table->char('iso2', 2)->unique();
            $table->char('iso3', 3)->unique();
            $table->string('phone_code', 12)->nullable();
            $table->string('capital', 160)->nullable();
            $table->char('currency_code', 3)->nullable();
            $table->string('timezone_default', 120)->nullable();
            $table->string('flag', 20)->nullable();
            $table->integer('sort_order')->default(0);
            $this->auditColumns($table, 1);
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group', 100);
            $table->string('key', 150);
            $table->text('value')->nullable();
            $table->string('type', 50)->default('string');
            $table->string('locale', 10)->nullable();
            $this->auditColumns($table, 1);
            $table->unique(['group', 'key', 'locale']);
        });

        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120);
            $table->string('platform', 80);
            $table->string('url', 600);
            $table->string('icon', 150)->nullable();
            $table->string('username', 150)->nullable();
            $table->integer('sort_order')->default(0);
            $this->publishColumns($table);
            $this->auditColumns($table);
        });
    }

    public function down(): void
    {
        foreach ([
            'social_links',
            'settings',
            'countries',
            'media_files',
            'permission_role',
            'role_user',
            'permissions',
            'roles',
            'users',
        ] as $table) {
            Schema::dropIfExists($table);
        }
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

    private function publishColumns(Blueprint $table): void
    {
        $table->boolean('is_published')->default(false);
        $table->timestamp('published_at')->nullable();
        $table->unsignedBigInteger('published_by')->nullable();
    }
};
