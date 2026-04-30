<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConstitutionModification;
use Illuminate\Http\Request;

class ConstitutionModApiController extends Controller
{
    public function index(Request $request)
    {
        return ConstitutionModification::query()
            ->when($request->year, fn($q) => $q->where('year', $request->year))
            ->when($request->article, fn($q) => $q->where('article_no', $request->article))
            ->when($request->q, fn($q) => $q->where('content', 'like', "%{$request->q}%"))
            ->orderBy('year')
            ->orderBy('order_in_year')
            ->paginate(50);
    }

    public function show($id)
    {
        return ConstitutionModification::findOrFail($id);
    }


    public function import(Request $request)
{
    foreach ($request->items as $item) {
        \App\Models\ConstitutionModification::updateOrCreate(
            [
                'year' => $item['year'],
                'article_no' => $item['article_no'],
                'order_in_year' => $item['order_in_year'],
            ],
            [
                'title' => $item['title'],
                'content' => $item['content'],
            ]
        );
    }

    return response()->json(['status' => 'ok']);
}

}
