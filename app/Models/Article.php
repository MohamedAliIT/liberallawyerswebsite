<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title_en', 'title_ar',
        'excerpt_en', 'excerpt_ar',
        'body_en', 'body_ar',
        'featured_image',
        'author_id',
        'published_at',
        'is_published'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    protected $casts = [
    'published_at' => 'datetime',
];

}
