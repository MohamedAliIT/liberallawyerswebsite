<?php

namespace App\Http\Controllers;

use App\Models\DubaiGazetteIssue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use GuzzleHttp\Client;


class DubaiGazetteController extends Controller
{
    /**
     * صفحة الفهرس + الفلاتر (Inertia)
     * props المتوقعة من الواجهة:
     * - issues (Paginator)
     * - years  : مصفوفة الأعوام المتوفرة
     * - year   : السنة المختارة (اختياري)
     * - q      : عبارة البحث (اختياري)
     * - endpoint: نفس المسار الحالي لتسهيل التصفية داخل XAMPP
     * - minYear / maxYear: حدود عامة (للاستخدام المستقبلي)
     */
    public function index(Request $request)
    {
        $q    = trim((string) $request->query('q', ''));
        $year = $request->integer('year') ?: null;

        $base = DubaiGazetteIssue::query();

        if ($year) {
            $base->where('year', $year);
        }

        if ($q !== '') {
            // بحث بسيط في العنوان
            $base->where(function ($qq) use ($q) {
                $qq->where('title', 'like', '%'.$q.'%');
            });
        }

        // ترتيب منطقي: الأحدث فالأقدم، ثم رقم العدد
        $base->orderByDesc('year')->orderByDesc('issue_no');

        // اختر الأعمدة المستخدمة في الواجهة لزيادة الأداء
        $base->select([
            'id', 'year', 'issue_no', 'title',
            'viewer_url', 'pdf_url', 'pdf_local_path',
            'thumb_url', 'cover_url', 'pages',
            'source_url',
        ]);

        $issues = $base->paginate(24)->appends($request->query());

        // قائمة السنوات المتوفرة (من 1960 فما فوق إذا كان لديك هذا الشرط)
        $years = DubaiGazetteIssue::query()
            ->whereNotNull('year')
            ->where('year', '>=', 1960)
            ->distinct()
            ->orderBy('year')
            ->pluck('year')
            ->values()
            ->toArray();

        // حدود عامة إن أحببت عرضها
        $minYear = DubaiGazetteIssue::min('year') ?? 1960;
        $maxYear = DubaiGazetteIssue::max('year') ?? now()->year;

        return Inertia::render('Gazette/Index', [
            'issues'   => $issues,
            'years'    => $years,
            'year'     => $year,
            'q'        => $q,
            'minYear'  => (int) $minYear,
            'maxYear'  => (int) $maxYear,
            'endpoint' => route('gazette.index'),
        ]);
    }

    /**
     * يفتح العدد على المنصة الرسمية (Redirect Away)
     */
    public function open(DubaiGazetteIssue $issue)
    {
        $url = $this->absoluteUrl($issue->viewer_url ?: $issue->source_url);
        abort_if(!$url, 404);

        return redirect()->away($url);
    }

    /**
     * صفحة "اقرأ داخل النظام" (Inertia) – تحاول البث الداخلي أولاً،
     * وإن تعذر تستخدم عارض داخلي مضمّن (iframe) دون إخراج المستخدم خارجيًا.
     */
    public function read(DubaiGazetteIssue $issue)
    {
        $canStream = $this->canStreamPdf($issue);
        $streamUrl = $canStream ? route('gazette.pdf', $issue) : null;

        // عارض داخلي بسيط يضمّن viewer الرسمي داخل iframe (مسار محلي)
        $viewerInner = route('gazette.viewer', $issue);

        // إن لم تكن لديك صفحة React مخصّصة للقراءة،
        // يمكنك إبقاء الربط كما في الـ Index.jsx نحو /pdf مباشرة،
        // لكن التجربة ستكون أرقى عبر صفحة Read.
    return Inertia::render('Gazette/Read', [
        'issue'       => $issue,
        'streamUrl'   => route('gazette.pdf', $issue->id),              // يبث/يعرض الـ PDF (محلي أو عبر proxy)
        'officialUrl' => $issue->viewer_url ?? $issue->source_url ?? null,
        'title'       => $issue->title ?? null,
    ]);
    }

    /**
     * بث الـ PDF داخليًا:
     * - إذا كان لدينا مسار محلي => response()->file
     * - إذا كان لدينا pdf_url => بروكسي ستريم (بدون إعادة توجيه خارجي)
     * - وإلا يعاد توجيه المستخدم لصفحة read (والتي تدرج العارض الرسمي داخليًا)
     */





public function pdf(DubaiGazetteIssue $issue)
{
    $forceDownload = request()->boolean('download');
    $filename = 'gazette-' . ($issue->year ?? 'unknown') . '-' . ($issue->issue_no ?? $issue->id) . '.pdf';

    // 1) إن وُجد مسار محلي
    if (!empty($issue->pdf_local_path) && is_file($issue->pdf_local_path)) {
        return Response::file($issue->pdf_local_path, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => ($forceDownload ? 'attachment' : 'inline').'; filename="'.$filename.'"',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control'       => 'public, max-age=604800',
        ]);
    }

    $client = new Client([
        'timeout' => 60,
        'verify'  => false,
        'headers' => [
            'User-Agent' => 'Mozilla/5.0',
            'Accept'     => 'text/html,application/pdf,*/*;q=0.8',
        ],
        'http_errors' => false,
    ]);

    // دالة مساعدة لبثّ أي استجابة PDF
    $streamPdf = function ($response) use ($forceDownload, $filename) {
        $ctype = $response->getHeaderLine('Content-Type');
        if (!$ctype || !Str::contains(Str::lower($ctype), 'application/pdf')) {
            return null;
        }
        $body = $response->getBody();
        return new StreamedResponse(function () use ($body) {
            while (!$body->eof()) {
                echo $body->read(8192);
                flush();
            }
        }, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => ($forceDownload ? 'attachment' : 'inline').'; filename="'.$filename.'"',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control'       => 'public, max-age=604800',
        ]);
    };

    // 2) إن وُجد pdf_url مباشر جرّبه أولاً
    if ($issue->pdf_url) {
        $res = $client->request('GET', $issue->pdf_url, ['stream' => true]);
        if ($res->getStatusCode() === 200) {
            if ($resp = $streamPdf($res)) return $resp;
        }
    }

    // 3) محاولة استخراج PDF من صفحة العارض
    if ($issue->viewer_url) {
        // (أ) جرّب download=1 مع الحفاظ على وسيطة file إن وجدت
        $tryUrls = [];
        $viewer = $issue->viewer_url;

        // أضف download=1 مهما كان شكل الاستعلام
        $tryUrls[] = Str::contains($viewer, '?') ? $viewer.'&download=1' : $viewer.'?download=1';

        // (ب) حمّل HTML وابحث عن روابط .pdf أو متغيرات JS تحمل مسار PDF
        $htmlRes = $client->request('GET', $viewer, ['stream' => false]);
        if ($htmlRes->getStatusCode() === 200) {
            $html = (string) $htmlRes->getBody();

            // أمثلة لأنماط شائعة داخل صفحات العارض:
            // href="/.../something.pdf"
            // src=".../something.pdf"
            // var fileUrl = '...pdf';
            if (preg_match_all('/(?:href|src)\s*=\s*["\']([^"\']+\.pdf[^"\']*)["\']/i', $html, $m)) {
                foreach ($m[1] as $url) $tryUrls[] = html_entity_decode($url, ENT_QUOTES);
            }
            if (preg_match_all('/fileUrl\s*[:=]\s*["\']([^"\']+\.pdf[^"\']*)["\']/i', $html, $m2)) {
                foreach ($m2[1] as $url) $tryUrls[] = html_entity_decode($url, ENT_QUOTES);
            }

            // حوّل أي روابط نسبية إلى مطلقة
            $base = parse_url($viewer);
            $origin = $base['scheme'].'://'.$base['host'].(isset($base['port']) ? ':'.$base['port'] : '');
            $toAbs = function ($u) use ($origin, $base) {
                if (Str::startsWith($u, ['http://','https://'])) return $u;
                if (Str::startsWith($u, '//')) return (parse_url($origin, PHP_URL_SCHEME) ?: 'https').':'.$u;
                if (Str::startsWith($u, '/')) return $origin.$u;
                // نسبي تمامًا
                $path = rtrim(dirname($base['path'] ?? '/'), '/');
                return $origin.$path.'/'.$u;
            };
            $tryUrls = array_values(array_unique(array_map($toAbs, $tryUrls)));
        }

        // (ج) جرّب كل الروابط المشتبه بها حتى نجد PDF حقيقي
        foreach ($tryUrls as $url) {
            $res = $client->request('GET', $url, ['stream' => true, 'allow_redirects' => true]);
            if ($res->getStatusCode() === 200) {
                if ($resp = $streamPdf($res)) return $resp;
            }
        }
    }

    // 4) فشلنا بالحصول على PDF inline → افتح العارض الرسمي في تبويب جديد
    // (ستظهر رسالة fallback في واجهة القراءة وهذا سلوك طبيعي عندما لا يتاح الـPDF للدمج)
    return redirect()->away($issue->viewer_url ?: ($issue->pdf_url ?: url('/')));
}



    /**
     * صفحة Blade بسيطة تدرج viewer الرسمي داخل iframe
     * (لا نُخرج المستخدم خارج نطاق النظام)
     */
    public function viewer(DubaiGazetteIssue $issue)
    {
        $url = $this->absoluteUrl($issue->viewer_url ?: $issue->source_url);
        abort_if(!$url, 404);

        return view('gazette.viewer', ['viewer_url' => $url]);
    }

    /* ----------------- Helpers ----------------- */

    protected function canStreamPdf(DubaiGazetteIssue $issue): bool
    {
        if ($issue->pdf_local_path && Storage::disk('local')->exists($issue->pdf_local_path)) {
            return true;
        }
        if ($issue->pdf_url) {
            // يمكننا المحاولة كبروكسي
            return true;
        }
        return false;
        // يمكنك هنا إضافة منطق إضافي لاختبار HEAD مثلاً
    }

    protected function absoluteUrl(?string $url): ?string
    {
        if (!$url) return null;

        // إن كانت نسبية مثل: /ar/Pages/PDFViewer.aspx?file=4
        if (str_starts_with($url, '/')) {
            return 'https://dlp.dubai.gov.ae'.$url;
        }

        // إن كانت بدون بروتوكول
        if (!preg_match('~^https?://~i', $url)) {
            return 'https://'.$url;
        }

        return $url;
    }
    
}
