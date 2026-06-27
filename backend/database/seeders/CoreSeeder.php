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

        DB::table('countries')->upsert(
            require __DIR__ . '/data/countries.php',
            ['iso2'],
            ['name_fa', 'name_en', 'iso3', 'phone_code', 'capital', 'continent', 'currency_code', 'timezone_default', 'flag', 'sort_order', 'accuracy']
        );

        DB::table('settings')->upsert([
            ['group' => 'contact', 'key' => 'clearance_phone', 'value' => '0910 306 0306', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
            ['group' => 'contact', 'key' => 'general_phone', 'value' => '0910 306 0306', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
            ['group' => 'contact', 'key' => 'office_phone', 'value' => '021 2265 0282~3', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
            ['group' => 'contact', 'key' => 'fax', 'value' => '021 2620 4504', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
            ['group' => 'contact', 'key' => 'address', 'value' => 'تهران، منطقه 3، آفریقا (جردن)، بالاتر از خیابان اسفندیار، خیابان انصاری (صداقت)، پلاک 1، واحد 1 غربی', 'type' => 'string', 'locale' => 'fa', 'accuracy' => 1],
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
