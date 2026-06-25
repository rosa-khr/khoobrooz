<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoreSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->upsert([
            ['name' => 'مدیر کل', 'key' => 'super_admin', 'description' => 'دسترسی کامل به پنل ادمین', 'accuracy' => 1],
            ['name' => 'مدیر محتوا', 'key' => 'content_manager', 'description' => 'مدیریت مقاله، خبر، دسته‌بندی و تگ', 'accuracy' => 1],
            ['name' => 'مدیر بازار', 'key' => 'market_manager', 'description' => 'مدیریت نرخ‌ها و ابزارهای بازار', 'accuracy' => 1],
        ], ['key'], ['name', 'description', 'accuracy']);

        DB::table('permissions')->upsert([
            ['name' => 'مشاهده منوها', 'key' => 'menus.view', 'group' => 'menus', 'description' => 'مشاهده لیست منوها', 'accuracy' => 1],
            ['name' => 'مدیریت منوها', 'key' => 'menus.manage', 'group' => 'menus', 'description' => 'ایجاد و ویرایش منوها', 'accuracy' => 1],
            ['name' => 'مشاهده مقالات', 'key' => 'articles.view', 'group' => 'articles', 'description' => 'مشاهده مقاله‌ها', 'accuracy' => 1],
            ['name' => 'مدیریت مقالات', 'key' => 'articles.manage', 'group' => 'articles', 'description' => 'ایجاد و ویرایش مقاله‌ها', 'accuracy' => 1],
            ['name' => 'تایید مقالات', 'key' => 'articles.approve', 'group' => 'articles', 'description' => 'تایید مقاله برای انتشار', 'accuracy' => 1],
            ['name' => 'مشاهده خبرها', 'key' => 'news.view', 'group' => 'news', 'description' => 'مشاهده خبرها', 'accuracy' => 1],
            ['name' => 'مدیریت خبرها', 'key' => 'news.manage', 'group' => 'news', 'description' => 'ایجاد و ویرایش خبرها', 'accuracy' => 1],
            ['name' => 'تایید خبرها', 'key' => 'news.approve', 'group' => 'news', 'description' => 'تایید خبر برای انتشار', 'accuracy' => 1],
            ['name' => 'مدیریت نرخ بازار', 'key' => 'market.manage', 'group' => 'market', 'description' => 'مدیریت ابزارهای نرخ بازار', 'accuracy' => 1],
            ['name' => 'مدیریت تنظیمات', 'key' => 'settings.manage', 'group' => 'settings', 'description' => 'مدیریت تنظیمات عمومی سایت', 'accuracy' => 1],
        ], ['key'], ['name', 'group', 'description', 'accuracy']);

        DB::table('countries')->upsert([
            ['name_fa' => 'ایران', 'name_en' => 'Iran', 'iso2' => 'IR', 'iso3' => 'IRN', 'phone_code' => '+98', 'capital' => 'تهران', 'currency_code' => 'IRR', 'timezone_default' => 'Asia/Tehran', 'flag' => 'IR', 'sort_order' => 10, 'accuracy' => 1],
            ['name_fa' => 'امارات متحده عربی', 'name_en' => 'United Arab Emirates', 'iso2' => 'AE', 'iso3' => 'ARE', 'phone_code' => '+971', 'capital' => 'ابوظبی', 'currency_code' => 'AED', 'timezone_default' => 'Asia/Dubai', 'flag' => 'AE', 'sort_order' => 20, 'accuracy' => 1],
            ['name_fa' => 'چین', 'name_en' => 'China', 'iso2' => 'CN', 'iso3' => 'CHN', 'phone_code' => '+86', 'capital' => 'پکن', 'currency_code' => 'CNY', 'timezone_default' => 'Asia/Shanghai', 'flag' => 'CN', 'sort_order' => 30, 'accuracy' => 1],
            ['name_fa' => 'ترکیه', 'name_en' => 'Turkey', 'iso2' => 'TR', 'iso3' => 'TUR', 'phone_code' => '+90', 'capital' => 'آنکارا', 'currency_code' => 'TRY', 'timezone_default' => 'Europe/Istanbul', 'flag' => 'TR', 'sort_order' => 40, 'accuracy' => 1],
            ['name_fa' => 'عراق', 'name_en' => 'Iraq', 'iso2' => 'IQ', 'iso3' => 'IRQ', 'phone_code' => '+964', 'capital' => 'بغداد', 'currency_code' => 'IQD', 'timezone_default' => 'Asia/Baghdad', 'flag' => 'IQ', 'sort_order' => 50, 'accuracy' => 1],
            ['name_fa' => 'روسیه', 'name_en' => 'Russia', 'iso2' => 'RU', 'iso3' => 'RUS', 'phone_code' => '+7', 'capital' => 'مسکو', 'currency_code' => 'RUB', 'timezone_default' => 'Europe/Moscow', 'flag' => 'RU', 'sort_order' => 60, 'accuracy' => 1],
            ['name_fa' => 'آلمان', 'name_en' => 'Germany', 'iso2' => 'DE', 'iso3' => 'DEU', 'phone_code' => '+49', 'capital' => 'برلین', 'currency_code' => 'EUR', 'timezone_default' => 'Europe/Berlin', 'flag' => 'DE', 'sort_order' => 70, 'accuracy' => 1],
            ['name_fa' => 'هند', 'name_en' => 'India', 'iso2' => 'IN', 'iso3' => 'IND', 'phone_code' => '+91', 'capital' => 'دهلی نو', 'currency_code' => 'INR', 'timezone_default' => 'Asia/Kolkata', 'flag' => 'IN', 'sort_order' => 80, 'accuracy' => 1],
            ['name_fa' => 'انگلستان', 'name_en' => 'United Kingdom', 'iso2' => 'GB', 'iso3' => 'GBR', 'phone_code' => '+44', 'capital' => 'لندن', 'currency_code' => 'GBP', 'timezone_default' => 'Europe/London', 'flag' => 'GB', 'sort_order' => 90, 'accuracy' => 1],
            ['name_fa' => 'ایالات متحده آمریکا', 'name_en' => 'United States', 'iso2' => 'US', 'iso3' => 'USA', 'phone_code' => '+1', 'capital' => 'واشنگتن', 'currency_code' => 'USD', 'timezone_default' => 'America/New_York', 'flag' => 'US', 'sort_order' => 100, 'accuracy' => 1],
        ], ['iso2'], ['name_fa', 'name_en', 'iso3', 'phone_code', 'capital', 'currency_code', 'timezone_default', 'flag', 'sort_order', 'accuracy']);

        DB::table('settings')->upsert([
            ['group' => 'contact', 'key' => 'clearance_phone', 'value' => '0912 470 1423', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
            ['group' => 'contact', 'key' => 'general_phone', 'value' => '0910 306 0396', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
            ['group' => 'contact', 'key' => 'email', 'value' => 'info@khoobrooz.com', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
            ['group' => 'seo', 'key' => 'default_title', 'value' => 'خوبروز', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
            ['group' => 'seo', 'key' => 'default_description', 'value' => 'خدمات بازرگانی، ترخیص، آموزش و محتوای تجاری', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
        ], ['group', 'key', 'locale'], ['value', 'type', 'accuracy']);

        DB::table('market_rate_sources')->upsert([
            ['key' => 'tgju', 'name' => 'internal_market_rate_source', 'base_url' => null, 'is_active' => true, 'accuracy' => 1],
            ['key' => 'cbi', 'name' => 'بانک مرکزی', 'base_url' => 'https://www.cbi.ir', 'is_active' => false, 'accuracy' => 1],
        ], ['key'], ['name', 'base_url', 'is_active', 'accuracy']);
    }
}
