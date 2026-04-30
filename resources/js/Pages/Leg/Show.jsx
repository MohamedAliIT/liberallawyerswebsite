import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function LegShow() {
  const { props } = usePage();
  const { file = {}, pdfUrl = "", back = "/" } = props || {};

  const niceBytes = (n) => {
    if (!n || isNaN(n)) return "—";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(n) / Math.log(1024));
    return `${(n / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
  };

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text || ""); } catch {}
  };

  const title = file?.title || `تشريع رقم ${file?.number || "—"} لسنة ${file?.year || "—"}`;

  const MetaItem = ({ label, value }) => (
    <div className="flex items-start gap-3 rounded-2xl border bg-white/60 p-3">
      <div className="min-w-0">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="truncate font-medium text-slate-800" title={String(value ?? "—")}>
          {value ?? "—"}
        </div>
      </div>
      {value && (
        <button
          onClick={() => copy(String(value))}
          className="ms-auto inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          title="نسخ"
        >
          <span>نسخ</span>
        </button>
      )}
    </div>
  );

  return (
    <div dir="rtl" className="mx-auto max-w-6xl px-4 py-8">
      <Head title={`تفاصيل التشريع #${file?.legis_id ?? "—"}`} />

      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={back} className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800">
          <span className="hidden rtl:inline">↩︎</span>
          <span className="inline rtl:hidden">←</span>
          <span>رجوع</span>
        </Link>
        <div className="flex items-center gap-2">
          {file?.year && (
            <span className="rounded-full border bg-white px-3 py-1 text-sm text-slate-700">{file.year}</span>
          )}
          {file?.lang && (
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white">
              {(file.lang || "").toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Title & actions */}
      <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold leading-snug text-slate-900">{title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            المصدر:
            {file?.source_url ? (
              <a
                href={file.source_url}
                target="_blank"
                rel="noreferrer"
                className="ms-2 inline-flex items-center gap-1 text-emerald-700 underline"
              >
                فتح الصفحة ↗
              </a>
            ) : (
              <span className="ms-2">—</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
                فتح PDF ↗
              </a>
            )}
            {pdfUrl && (
              <a href={pdfUrl} download className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-slate-700 hover:bg-slate-50">
                تنزيل PDF ↓
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Meta grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetaItem label="معرّف المنصة" value={file.id} />
        <MetaItem label="رقم التشريع" value={file.number} />
        <MetaItem label="سنة الإصدار" value={file.year} />
        <MetaItem label="اللغة" value={file.lang} />
        <MetaItem label="الحجم" value={niceBytes(file.size_bytes)} />
        <MetaItem label="SHA1" value={file.sha1} />
        <MetaItem label="تاريخ التنزيل" value={file.downloaded_at} />
      </div>

      {/* PDF Preview */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="overflow-hidden rounded-2xl border">
          {pdfUrl ? (
            <iframe src={pdfUrl} title="PDF Preview" className="h-[78vh] w-full" />
          ) : (
            <div className="flex h-64 items-center justify-center bg-slate-50 text-slate-500">
              لا يوجد رابط PDF متاح.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
