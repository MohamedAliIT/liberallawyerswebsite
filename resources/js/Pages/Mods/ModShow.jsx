import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function ModShow() {
  const { props } = usePage();
  const { mod = {}, pdfUrl = "", back = "/mods" } = props;

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Head title={`تعديل دستوري – مادة ${mod.article_no}`} />

      <Link href={back} className="text-indigo-700">← رجوع</Link>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          تعديل دستوري – مادة {mod.article_no} لسنة {mod.year}
        </h1>

        <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
          {mod.content}
        </p>

        {pdfUrl && (
          <div className="mt-6 flex gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              className="rounded-xl bg-indigo-600 text-white px-4 py-2"
            >
              تنزيل PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
