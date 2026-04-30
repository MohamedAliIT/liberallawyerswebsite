import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";

export default function ModIndex() {
  const { props } = usePage();
  const { mods, filters = {}, years = [], articles = [], endpoint = "/mods" } = props;

  const data  = mods?.data ?? [];
  const links = mods?.links ?? [];
  const total = mods?.total ?? 0;

  const [q, setQ] = useState(filters.q ?? "");
  const [year, setYear] = useState(filters.year ?? "");
  const [article, setArticle] = useState(filters.article ?? "");

  const submit = (e) => {
    e.preventDefault();
    const params = {};
    if (q.trim()) params.q = q.trim();
    if (year) params.year = year;
    if (article) params.article = article;
    router.get(endpoint, params, { preserveScroll: true, replace: true });
  };

  const reset = () => {
    setQ(""); setYear(""); setArticle("");
    router.get(endpoint, {}, { preserveScroll: true, replace: true });
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Head title="تعديلات الدستور" />

      <section className="rounded-2xl bg-gradient-to-l from-indigo-600 to-purple-500 text-white p-6">
        <h1 className="text-2xl font-extrabold">تعديلات الدستور</h1>
        <p className="mt-1 text-white/90">
          جميع التعديلات الدستورية المستخرجة من بوابة التشريعات الإماراتية.
        </p>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border p-4 bg-white shadow-sm">
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="block text-sm mb-1">بحث في النص</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border focus:ring-indigo-600"
              placeholder="نص المادة..."
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm mb-1">السنة</label>
            <select
              className="w-full rounded-xl border"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">الكل</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm mb-1">المادة</label>
            <select
              className="w-full rounded-xl border"
              value={article}
              onChange={(e) => setArticle(e.target.value)}
            >
              <option value="">الكل</option>
              {articles.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <button className="rounded-xl bg-indigo-600 text-white px-4 py-2" type="submit">
              تطبيق
            </button>
            {(q || year || article) && (
              <button type="button" onClick={reset} className="rounded-xl border px-4 py-2">
                إعادة الضبط
              </button>
            )}
          </div>
        </form>

        <div className="mt-3 text-sm">
          إجمالي النتائج: <b>{total}</b>
        </div>
      </section>

      {/* Items */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((m) => (
          <article key={m.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-lg">مادة {m.article_no ?? "—"}</h3>
            <div className="text-sm mt-1 text-slate-600">
              سنة: {m.year}
            </div>
            <p className="mt-2 text-slate-700 line-clamp-3">{m.content}</p>

            <div className="mt-3">
              <Link href={`/mods/${m.id}`} className="rounded-xl border px-3 py-2 text-sm">
                عرض التفاصيل
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {links?.length > 0 && (
        <nav className="mt-6 flex flex-wrap gap-2">
          {links.map((l, i) => (
            <Link
              key={i}
              href={l.url ?? "#"}
              dangerouslySetInnerHTML={{ __html: l.label }}
              className={`px-3 py-1 border rounded ${l.active ? "bg-gray-200 font-bold" : ""} ${!l.url ? "opacity-40 pointer-events-none" : ""}`}
            />
          ))}
        </nav>
      )}
    </div>
  );
}
