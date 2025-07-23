<?php

use App\Http\Controllers\NetflowController;
use Illuminate\Support\Facades\Route;

Route::prefix('netflow')->group(function () {
    Route::get('/', [NetflowController::class, 'index']);
    Route::get('/stats', [NetflowController::class, 'stats']);
    Route::get('/top-talkers', [NetflowController::class, 'topTalkers']);
    Route::get('/protocols', [NetflowController::class, 'protocols']);
    Route::get('/search', [NetflowController::class, 'search']);
    Route::delete('/cleanup', [NetflowController::class, 'cleanup']);
});

Route::get('/health', [NetflowController::class, 'health']);