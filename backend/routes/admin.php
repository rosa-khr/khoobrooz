<?php

use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('menus', 'Admin\\MenuController');
    Route::apiResource('pages', 'Admin\\PageController');
    Route::apiResource('services', 'Admin\\ServiceController');
    Route::apiResource('articles', 'Admin\\ArticleController');
    Route::post('articles/{article}/approve', 'Admin\\ArticleApprovalController@store');
    Route::post('articles/{article}/publish', 'Admin\\ArticlePublishController@store');
    Route::apiResource('news', 'Admin\\NewsController');
    Route::post('news/{news}/approve', 'Admin\\NewsApprovalController@store');
    Route::post('news/{news}/publish', 'Admin\\NewsPublishController@store');
    Route::apiResource('tags', 'Admin\\TagController');
    Route::apiResource('categories', 'Admin\\CategoryController');
    Route::apiResource('countries', 'Admin\\CountryController');
    Route::apiResource('social-links', 'Admin\\SocialLinkController');
    Route::apiResource('market-rate-instruments', 'Admin\\MarketRateInstrumentController');
    Route::post('market-rates/sync', 'Admin\\MarketRateSyncController@store');
    Route::apiResource('world-clock-items', 'Admin\\WorldClockItemController');
    Route::apiResource('important-links', 'Admin\\ImportantLinkController');
    Route::apiResource('home-sections', 'Admin\\HomeSectionController');
    Route::apiResource('home-section-items', 'Admin\\HomeSectionItemController');
    Route::apiResource('users', 'Admin\\UserController');
    Route::apiResource('roles', 'Admin\\RoleController');
    Route::apiResource('permissions', 'Admin\\PermissionController');
});
