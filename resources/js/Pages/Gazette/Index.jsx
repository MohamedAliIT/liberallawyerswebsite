// resources/js/Pages/Gazette/Index.jsx
import React, { useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";

export default function GazetteIndex() {
  const { props } = usePage();

  // نتوقع أن يرسل الكونترولر هذه القيم:
  // issues (Laravel LengthAwarePaginator)
  // years: [1960, 1961, ...]
  // year: السنة المختارة (اختياري)
  // q: عبارة البحث (اختياري)
  // minYear / maxYear: حدود الإدخال (اختياري)
  // endpoint: مسار نفس الصفحة للطلبات (مهم داخل XAMPP)
  const {
    issues,
    years = [],
    year: yearProp = "",
    q: qProp = "",
    minYear,
    maxYear,
    endpoint,
  } = props;

  const data = issues?.data ?? [];
  const links = issues?.links ?? [];
  const total = issues?.total ?? 0;

  const [year, setYear] = useState(yearProp || "");
  const [q, setQ] = useState(qProp || "");

  const decadeBuckets = useMemo(() => {
    // خرج مجموعات العشريات المتوفرة حسب years
    const buckets = {};
    (years || []).forEach((y) => {
      const base = Math.floor(Number(y) / 10) * 10; // 1960, 1980 ...
      if (!buckets[base]) buckets[base] = [];
      buckets[base].push(Number(y));
    });
    // رتب العشريات والأعوام داخلها
    return Object.keys(buckets)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
      .map((d) => ({ decade: d, years: buckets[d].sort((a, b) => a - b) }));
  }, [years]);

  const onSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (q.trim() !== "") params.q = q.trim();
    if (year !== "") params.year = Number(year);

    router.get(endpoint || window.location.pathname, params, {
      preserveScroll: true,
      replace: true,
      preserveState: false,
      only: ["issues", "q", "year"],
    });
  };

  const onReset = () => {
    setQ("");
    setYear("");
    router.get(endpoint || window.location.pathname, {}, { preserveScroll: true, replace: true });
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Head title="الجريدة الرسمية – دبي" />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-500 text-white p-6 sm:p-8">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            الجريدة الرسمية – دبي
          </h1>
          <p className="mt-2 text-white/90">
            تصفّح أعداد الجريدة الرسمية حسب السنة أو ابحث بعنوان العدد. عند فتح العدد يمكنك القراءة
            داخل النظام (PDF المباشر) أو الانتقال للعارض الرسمي للموقع.
          </p>
        </div>
        <div className="absolute -bottom-12 -left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end" noValidate>
          <div className="sm:col-span-3">
            <label htmlFor="q" className="block text-sm mb-1 text-slate-600">
              البحث بالعنوان (اختياري)
            </label>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border-slate-300 focus:border-emerald-600 focus:ring-emerald-600"
              placeholder="مثال: العدد،  ..."
              autoComplete="off"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="year" className="block text-sm mb-1 text-slate-600">
              السنة (اختياري)
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border-slate-300 focus:border-emerald-600 focus:ring-emerald-600"
            >
              <option value="">كل السنوات</option>
              {(years || []).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 sm:justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2 font-medium hover:bg-emerald-700 transition"
            >
              تطبيق
            </button>
            {(q || year !== "") && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-medium hover:bg-slate-50 transition"
              >
                إعادة الضبط
              </button>
            )}
          </div>
        </form>

        {/* Quick decade/year pills */}
        {decadeBuckets.length > 0 && (
          <div className="mt-1 space-y-2">
            {decadeBuckets.map(({ decade, years: ys }) => (
              <div key={decade} className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                  {decade}s
                </span>
                {ys.map((y) => {
                  const active = String(y) === String(year);
                  const hrefParams = new URLSearchParams();
                  if (q.trim() !== "") hrefParams.set("q", q.trim());
                  hrefParams.set("year", y);
                  return (
                    <Link
                      key={y}
                      href={(endpoint || window.location.pathname) + "?" + hrefParams.toString()}
                      className={`px-3 py-1 rounded-full border text-sm ${
                        active
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-white hover:bg-slate-50"
                      }`}
                      preserveScroll
                      replace
                    >
                      {y}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            إجمالي النتائج: <strong className="text-slate-900">{total}</strong>
          </span>
          {q && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              عبارة البحث: <strong className="text-slate-900">“{q}”</strong>
            </span>
          )}
          {year && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              السنة: <strong className="text-slate-900">{year}</strong>
            </span>
          )}
        </div>
      </section>

      {/* Results */}
      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 grid place-items-center">
            <span className="text-slate-400 text-xl">📄</span>
          </div>
          <h3 className="font-semibold text-slate-800">لا توجد نتائج</h3>
          <p className="text-slate-500 mt-1">جرّب اختيار سنة مختلفة أو إزالة عوامل التصفية.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((issue) => {
            const id = issue.id ?? issue.issue_id ?? issue.pk ?? undefined;
            const title = issue.title || `عدد ${issue.issue_no ?? ""} – ${issue.year ?? ""}`;
            const cover = issue.thumb_url || issue.cover_url || null;
           const insideUrl = id ? `/gazette/${id}/read` : null;
            const officialUrl = id ? `/gazette/${id}/open` : issue.viewer_url || issue.source_url || null;

            return (
              <article
                key={issue.source_url || id || title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="absolute -top-16 end-0 w-40 h-40 rounded-full bg-emerald-50 blur-2xl opacity-0 group-hover:opacity-100 transition" />
                <div className="flex gap-4">
                  <div className="w-24 shrink-0 rounded-lg overflow-hidden border">
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        className="w-24 h-32 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-24 h-32 grid place-items-center bg-slate-50 text-slate-400">
                        لا غلاف
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold leading-7 text-slate-900 line-clamp-2">{title}</h2>
                    <dl className="mt-1 text-sm text-slate-600 space-y-1">
                      <div className="flex gap-2">
                        <dt className="text-slate-500">السنة:</dt>
                        <dd><bdi>{issue.year ?? "—"}</bdi></dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-slate-500">رقم العدد:</dt>
                        <dd><bdi>{issue.issue_no ?? "—"}</bdi></dd>
                      </div>
                      {issue.pages && (
                        <div className="flex gap-2">
                          <dt className="text-slate-500">الصفحات:</dt>
                          <dd><bdi>{issue.pages}</bdi></dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {officialUrl && (
                        <a
                          href={officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 transition"
                        >
                          اقرأ على الموقع الرسمي
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 -rotate-45" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                          </svg>
                        </a>
                      )}

                      {insideUrl ? (
                        <a
                          href={insideUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50 transition"
                        >
                          اقرأ داخل النظام
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-slate-400">
                          PDF غير متاح
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {links?.length > 0 && (
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="pagination">
          {links.map((l, i) => (
            <Link
              key={i}
              href={l.url || "#"}
              dangerouslySetInnerHTML={{ __html: l.label }}
              className={`px-3 py-1 border rounded ${l.active ? "bg-gray-200" : ""} ${!l.url ? "opacity-50 pointer-events-none" : ""}`}
              preserveScroll
              replace
            />
          ))}
        </nav>
      )}

      {/* Footer note */}
      <p className="text-xs text-slate-500 text-center">
        المصدر: بوابة دبي القانونية (الجريدة الرسمية). العناوين والروابط يتم جلبها آليًا.
      </p>
    </div>
  );
}
