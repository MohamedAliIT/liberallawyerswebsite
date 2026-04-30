<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    /**
     * Display a paginated list of published articles.
     */
public function index()
{
    $locale = app()->getLocale();

    $articles = Article::where('is_published', true)
        ->whereNotNull('published_at') // ممكن تبقيه أو تشيله
        ->orderBy('published_at', 'desc')
        ->paginate(10);

    return Inertia::render('Articles/Index', [
        'articles' => $articles,
        'locale'   => $locale,
    ]);
}


    /**
     * Display the specified article by slug.
     */
public function show(string $slug)
{
    $locale = app()->getLocale();

    $article = Article::where('slug', $slug)
        ->where('is_published', true)
        ->whereNotNull('published_at')
        ->firstOrFail();

    return Inertia::render('Articles/Show', [
        'article' => $article,
        'locale'  => $locale,
    ]);
}

}
