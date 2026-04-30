<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::latest()->paginate(15);
        return view('admin.articles.index', compact('articles'));
    }

    public function create()
    {
        return view('admin.articles.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'body_en' => 'required',
            'body_ar' => 'required',
            'excerpt_en' => 'nullable|string',
            'excerpt_ar' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title_en'].'-'.uniqid());
        $validated['author_id'] = auth()->id();

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('articles', 'public');
            $validated['featured_image'] = $path;
        }

        $article = Article::create($validated);

        return redirect()->route('admin.articles.index')
                         ->with('success', 'Article created successfully.');
    }

    public function edit(Article $article)
    {
        return view('admin.articles.edit', compact('article'));
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'body_en' => 'required',
            'body_ar' => 'required',
            'excerpt_en' => 'nullable|string',
            'excerpt_ar' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        // slug update optional
        // $validated['slug'] = Str::slug($validated['title_en'].'-'.uniqid());

        if ($request->hasFile('featured_image')) {
            if ($article->featured_image && Storage::disk('public')->exists($article->featured_image)) {
                Storage::disk('public')->delete($article->featured_image);
            }
            $path = $request->file('featured_image')->store('articles', 'public');
            $validated['featured_image'] = $path;
        }

        $article->update($validated);

        return redirect()->route('admin.articles.index')
                         ->with('success', 'Article updated successfully.');
    }

    public function destroy(Article $article)
    {
        if ($article->featured_image && Storage::disk('public')->exists($article->featured_image)) {
            Storage::disk('public')->delete($article->featured_image);
        }
        $article->delete();

        return redirect()->route('admin.articles.index')
                         ->with('success', 'Article deleted successfully.');
    }
}
