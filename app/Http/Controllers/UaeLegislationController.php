<?php

namespace App\Http\Controllers;

use App\Models\LegislationFile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;

class UaeLegislationController extends Controller
{
    public function index(Request $request)
    {
        $q    = trim((string) $request->query('q', ''));
        $lang = $request->query('lang');
        $year = $request->integer('year');

        $base = LegislationFile::query()
            ->when($q !== '', function ($qq) use ($q) {
                $num = (int) preg_replace('/\D+/', '', $q);
                $qq->where(function ($w) use ($q, $num) {
                    $w->where('title', 'like', "%{$q}%")
                      ->orWhere('number', 'like', "%{$q}%");
                    if ($num > 0) {
                        $w->orWhere('legis_id', $num);
                    }
                });
            })
            ->when($lang, fn ($q2) => $q2->where('lang', $lang))
            ->when($year, fn ($q2) => $q2->where('year', $year))
            ->orderByDesc('downloaded_at')
            ->orderByDesc('id');

        $files = $base->paginate(24)->appends($request->query());

        // سنوات/لغات متوفرة للفلاتر السريعة
        $years = LegislationFile::query()
            ->whereNotNull('year')
            ->distinct()->orderBy('year')->pluck('year')->values();

        $langs = LegislationFile::query()
            ->distinct()->orderBy('lang')->pluck('lang')->values();

        return Inertia::render('Leg/Index', [
            'files'    => $files,
            'filters'  => [
                'q'    => $q,
                'lang' => $lang,
                'year' => $year,
            ],
            'years'    => $years,
            'langs'    => $langs,
            'endpoint' => route('leg.index'),
        ]);
    }

    public function show(LegislationFile $file)
    {
        // لا ترسل كل الحقول إن ما تحتاجها — نختار الأهم للواجهة
        $data = [
            'id'            => $file->id,
            'legis_id'      => $file->legis_id,
            'lang'          => $file->lang,
            'year'          => $file->year,
            'title'         => $file->title,
            'number'        => $file->number,
            'source_url'    => $file->source_url,
            'local_path'    => $file->local_path,
            'size_bytes'    => $file->size_bytes,
            'sha1'          => $file->sha1,
            'downloaded_at' => optional($file->downloaded_at)->toIso8601String(),
        ];

        $pdfUrl   = route('leg.pdf', ['file' => $file->id]);
        $backUrl  = route('leg.index');

        return Inertia::render('Leg/Show', [
            'file'   => $data,
            'pdfUrl' => $pdfUrl,
            'back'   => $backUrl,
        ]);
    }

    public function pdf(LegislationFile $file)
    {
        // local_path مخزّن نسبةً إلى storage/app
        $rel = ltrim((string) $file->local_path, '/');
        $abs = $rel !== '' ? storage_path('app/' . $rel) : null;

        if (!$abs || !is_file($abs)) {
            abort(404, 'PDF not found on disk.');
        }

        $name = $file->legis_id . '-' . $file->lang . '.pdf';

        return Response::file($abs, [
            'Content-Type'            => 'application/pdf',
            'Content-Disposition'     => 'inline; filename="' . $name . '"',
            'X-Content-Type-Options'  => 'nosniff',
            'Cache-Control'           => 'public, max-age=604800',
        ]);
    }
}
