<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ConstitutionModificationArticle extends Model
{
    protected $fillable = [
        'modification_id',
        'article_title',
        'current_text',
        'previous_text'
    ];

    public function modification()
    {
        return $this->belongsTo(ConstitutionModification::class, 'modification_id');
    }
}
