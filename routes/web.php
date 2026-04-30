<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\LandingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DubaiGazetteController;
use App\Http\Controllers\UaeLegislationController;
use App\Models\DubaiGazetteIssue;

use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\ArticleController;

// Breeze auth routes
 require __DIR__ . '/auth.php';

// ===== Public routes =====
Route::get('/', LandingController::class)->name('home');

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// ===== Authenticated area =====
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    Route::get('/profile',   [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile',[ProfileController::class, 'destroy'])->name('profile.destroy');
});

// // ===== Dubai Gazette =====
// Route::model('issue', DubaiGazetteIssue::class);

// Route::get('/gazette',                [DubaiGazetteController::class, 'index'])->name('gazette.index');
// Route::get('/gazette/{issue}/open',   [DubaiGazetteController::class, 'open'])->name('gazette.open');
// Route::get('/gazette/{issue}/read',   [DubaiGazetteController::class, 'read'])->name('gazette.read');
// Route::get('/gazette/{issue}/pdf',    [DubaiGazetteController::class, 'pdf'])->name('gazette.pdf');
// Route::get('/gazette/{issue}/viewer', [DubaiGazetteController::class, 'viewer'])->name('gazette.viewer');
// Route::get('/gazette/{issue}/thumb',  [DubaiGazetteController::class, 'thumb'])->name('gazette.thumb');

// // ===== UAE Legislation =====
// Route::get('/leg',               [UaeLegislationController::class, 'index'])->name('leg.index');
// Route::get('/leg/{file}',        [UaeLegislationController::class, 'show'])->name('leg.show');
// Route::get('/leg/{file}/pdf',    [UaeLegislationController::class, 'pdf'])->name('leg.pdf');

// ===== Articles =====
// Admin – لإدارة المقالات
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function(){
    Route::resource('articles', AdminArticleController::class);
});

// Front – قائمة المقالات للجميع
Route::get('/articles',           [ArticleController::class, 'index'])->name('articles.index');

// Front – عرض مقالة مفردة حسب slug
Route::get('/articles/{slug}',    [ArticleController::class, 'show'])->name('articles.show');

Route::get('/lang/{locale}', function ($locale) {
    if (! in_array($locale, ['en', 'ar','de'])) {
        abort(400);
    }

    session(['locale' => $locale]);

    return redirect()->back();
})->name('lang.switch');

