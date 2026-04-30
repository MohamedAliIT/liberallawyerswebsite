<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegislationFile extends Model
{
    protected $table = 'legislation_files';

    protected $fillable = [
        'legis_id',
        'lang',
        'year',
        'title',
        'number',
        'source_url',
        'local_path',   // always relative to storage/app, e.g. "uae_legislation/unknown/2118-ar.pdf"
        'size_bytes',
        'sha1',
        'downloaded_at',
    ];

    protected $casts = [
        'year'          => 'integer',
        'size_bytes'    => 'integer',
        'downloaded_at' => 'datetime',
    ];

    // مفيد للروت-model binding بـ {file}
    public function getRouteKeyName(): string
    {
        return 'id';
    }

    public function getStorageAbsolutePathAttribute(): ?string
    {
        if (!$this->local_path) return null;
        return storage_path('app/' . ltrim($this->local_path, '/'));
    }
}
