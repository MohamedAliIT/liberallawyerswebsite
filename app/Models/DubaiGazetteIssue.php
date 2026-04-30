<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DubaiGazetteIssue extends Model
{
     protected $table = 'dubai_gazette_issues';

    protected $fillable = [
        'year','issue_no','title','viewer_url','pdf_url','published_at','meta',
    ];

    protected $casts = [
        'published_at' => 'date',
        'meta' => 'array',
    ];
}
