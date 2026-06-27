<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('menus/{key}', 'Public\\MenuController@show');
    Route::get('settings/public', 'Public\\SettingController@index');
    Route::get('services', 'Public\\ServiceController@index');
    Route::get('services/{slug}', 'Public\\ServiceController@show');
    Route::get('articles', 'Public\\ArticleController@index');
    Route::get('articles/{slug}', 'Public\\ArticleController@show');
    Route::get('news', 'Public\\NewsController@index');
    Route::get('news/{slug}', 'Public\\NewsController@show');
    Route::get('market-rates', 'Public\\MarketRateController@index');
    Route::get('market-rates/board', 'Public\\MarketRateController@board');
    Route::get('countries', 'Public\\CountryController@index');
    Route::get('world-clock', 'Public\\WorldClockController@index');
    Route::get('social-links', 'Public\\SocialLinkController@index');
    Route::post('contact-requests', 'Public\\ContactRequestController@store');
});
