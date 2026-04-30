import React, { useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";

export default function LegIndex() {
  const { props } = usePage();
  const {
    files,          // Laravel paginator
    filters = {},
    years = [],
    langs = [],
    endpoint = "/leg",
  } = props;

  const data  = files?.data ?? [];
  const links = files?.links ?? [];
  const total = files?.total ?? 0;

  const [q, setQ] = useState(filters.q ?? "");
  const [year, setYear] = useState(filters.year ?? "");
  const [lang, setLang] = useState(filters.lang ?? "");

  const submit = (e) => {
    e.preventDefault();
    const params = {};
    if (q.trim() !== "") params.q = q.trim();
    if (year) params.year = year;
    if (lang) params.lang = lang;
    router.get(endpoint, params, { preserveScroll: true, replace: true });
  };

  const reset = () => {
    setQ(""); setYear(""); setLang("");
    router.get(endpoint, {}, { preserveScroll: true, replace: true });
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Head title="ملفات التشريعات (تم تنزيلها)" />

      <section className="rounded-2xl bg-gradient-to-l from-teal-600 to-emerald-500 text-white p-6">
        <h1 className="text-2xl font-extrabold">ملفات التشريعات – (PDF)</h1>
        <p className="mt-1 text-white/90">
          هذه الصفحة تعرض ملفات PDF التي قام الأمر <code>download:sector-pdfs</code> بتنزيلها وحفظها في قاعدة البيانات.
        </p>
      </section>

      <section className="rounded-2xl border p-4 bg-white shadow-sm">
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end" noValidate>
          <div className="sm:col-span-3">
            <label className="block text-sm mb-1 text-slate-600">بحث</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="عنوان / رقم / legis_id"
              className="w-full rounded-xl border-slate-300 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1 text-slate-600">السنة</label>
            <select
              value={year ?? ""}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border-slate-300 focus:border-emerald-600 focus:ring-emerald-600"
            >
              <option value="">كل السنوات</option>
              {years.map((y) => (<option key={y} value={y}>{y}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-600">اللغة</label>
            <select
              value={lang ?? ""}
              onChange={(e) => setLang(e.target.value)}
              className="w-full rounded-xl border-slate-300 focus:border-emerald-600 focus:ring-emerald-600"
            >
              <option value="">الكل</option>
              {langs.map((l) => (<option key={l} value={l}>{l}</option>))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-emerald-600 text-white px-4 py-2">تطبيق</button>
            {(q || year || lang) && (
              <button type="button" onClick={reset} className="rounded-xl border px-4 py-2">إعادة الضبط</button>
            )}
          </div>
        </form>

        <div className="mt-3 text-sm text-slate-600">
          إجمالي النتائج: <b className="text-slate-900">{total}</b>
        </div>
      </section>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center bg-white">
          لا توجد ملفات.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((f) => {
            const id = f.id;
            const pdfUrl  = `/leg/${id}/pdf`;
            const showUrl = `/leg/${id}`;
            const niceSize = f.size_bytes ? new Intl.NumberFormat().format(f.size_bytes) + ' B' : '—';
            return (
              <article key={id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-900 line-clamp-2">
                  {f.title || `#${f.legis_id} (${f.lang || '—'})`}
                </h3>
                <dl className="mt-2 text-sm text-slate-600 space-y-1">
                  <div className="flex gap-2"><dt className="text-slate-500">legis_id:</dt><dd>{f.legis_id}</dd></div>
                  <div className="flex gap-2"><dt className="text-slate-500">اللغة:</dt><dd>{f.lang || '—'}</dd></div>
                  <div className="flex gap-2"><dt className="text-slate-500">السنة:</dt><dd>{f.year ?? '—'}</dd></div>
                  <div className="flex gap-2"><dt className="text-slate-500">الحجم:</dt><dd>{niceSize}</dd></div>
                </dl>
                <div className="mt-3 flex gap-2">
                  <a href={pdfUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm">فتح PDF</a>
                  <Link href={showUrl} className="rounded-xl border px-3 py-2 text-sm">تفاصيل</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

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
    </div>
  );
}
