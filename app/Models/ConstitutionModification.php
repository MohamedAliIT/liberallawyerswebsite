<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstitutionModification extends Model
{
    protected $fillable = [
        'year',
        'mod_date',
        'title',
        'pdf_url'
    ];

    public function articles()
    {
        return $this->hasMany(ConstitutionModificationArticle::class, 'modification_id');
    }
}
