<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NetflowController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('anomaly-records', [NetflowController::class, 'index'] )->name('products.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
