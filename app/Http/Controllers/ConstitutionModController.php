<?php

namespace App\Http\Controllers;

use App\Models\ConstitutionModification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PDF;

class ConstitutionModController extends Controller
{
    public function index(Request $request)
    {
        $q    = $request->q;
        $year = $request->year;

        $mods = ConstitutionModification::query()
            ->when($q, function ($query) use ($q) {
                $query->where(function ($q2) use ($q) {
                    $q2->where('title', 'like', "%$q%")
                        ->orWhere('article_title', 'like', "%$q%")
                        ->orWhere('article_text_old', 'like', "%$q%")
                        ->orWhere('article_text_new', 'like', "%$q%");
                });
            })
            ->when($year, fn($q1) => $q1->where('year', $year))
            ->orderBy('year')
            ->orderBy('order_in_year')
            ->paginate(18)
            ->withQueryString();

        // Distinct years for filter
        $years = ConstitutionModification::select('year')
                    ->distinct()
                    ->orderBy('year')
                    ->pluck('year');

        return Inertia::render('Mods/ModIndex', [
            'mods'     => $mods,
            'filters'  => $request->only('q', 'year'),
            'years'    => $years,
            'endpoint' => '/mods',
        ]);
    }

    public function show($id)
    {
        $mod = ConstitutionModification::findOrFail($id);

        return Inertia::render('Mods/ModShow', [
            'mod'    => $mod,
            'pdfUrl' => route('mods.pdf', $mod->id),
            'back'   => '/mods',
        ]);
    }

    public function pdf($id)
    {
        $mod = ConstitutionModification::findOrFail($id);

        $pdf = PDF::loadView('pdf.constitution-mod', ['mod' => $mod]);

        return $pdf->download("mod-{$mod->year}-{$mod->order_in_year}.pdf");
    }
}
