<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class LegalPost extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id','slug',
        'title_ar','title_en',
        'excerpt_ar','excerpt_en',
        'body_html_ar','body_html_en',
        'cover_path','status','published_at',
        'reading_time','tags',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'tags'         => 'array',
    ];

    // علاقات
    public function author() {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Scopes
    public function scopePublished($q) {
        return $q->where('status', 'published');
    }

    // Helpers
    public static function makeSlug(string $title): string {
        $base = Str::slug(mb_substr($title, 0, 140));
        $slug = $base;
        $i = 1;
        while (self::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }
        return $slug ?: Str::random(8);
    }

    public static function estimateReadingTime(?string $html): int {
        $text = trim(strip_tags((string)$html));
        $words = str_word_count($text);
        return max(1, (int) ceil($words / 200)); // 200 كلمة/دقيقة
    }
}
