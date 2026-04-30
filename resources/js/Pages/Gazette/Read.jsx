// resources/js/Pages/Gazette/Read.jsx
import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function GazetteRead() {
  const { props } = usePage();
  const {
    issue = {},
    streamUrl,   // URL داخلي لعرض/بثّ الـ PDF (مثلاً route('gazette.pdf', id))
    officialUrl, // رابط العارض الرسمي (إن وُجد)
    title = "قراءة العدد",
  } = props;

  const id = issue.id ?? issue.issue_id ?? "";
  const niceTitle =
    issue.title ||
    (issue.issue_no && issue.year
      ? `العدد ${issue.issue_no} – ${issue.year}`
      : title);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <Head title={niceTitle} />

      {/* شريط علوي */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/gazette"
            className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            ← العودة للأرشيف
          </Link>

          <div className="ms-auto flex items-center gap-2">
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 transition"
              >
                افتح على الموقع الرسمي
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 -rotate-45" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </a>
            )}
            {streamUrl && (
              <a
                href={streamUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
              >
                تنزيل PDF
              </a>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-3">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-800">{niceTitle}</h1>
          <p className="text-slate-500 text-sm">
            رقم العدد: <bdi>{issue.issue_no ?? "—"}</bdi> • السنة: <bdi>{issue.year ?? "—"}</bdi>
          </p>
        </div>
      </header>

      {/* مساحة العارض */}
      <main className="max-w-7xl mx-auto p-4">
        {!streamUrl ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 grid place-items-center">
              <span className="text-slate-400 text-xl">📄</span>
            </div>
            <h3 className="font-semibold text-slate-800">ملف PDF غير متاح محليًا</h3>
            {officialUrl ? (
              <p className="text-slate-500 mt-1">
                يمكنك فتح العدد من خلال <a className="text-emerald-700 underline" href={officialUrl} target="_blank" rel="noreferrer">المنصة الرسمية</a>.
              </p>
            ) : (
              <p className="text-slate-500 mt-1">لا يتوفر رابط بديل لهذا العدد.</p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border bg-white">
            {/* نستخدم iframe حتى يبقى داخل النظام */}
<div className="rounded-2xl overflow-hidden border bg-white">
  <object
    data={streamUrl}
    type="application/pdf"
    className="w-full"
    style={{ height: "80vh" }}
  >
    <div className="p-6 text-center text-slate-600">
      لا يمكن عرض PDF داخل المتصفح.{" "}
      <a href={streamUrl} className="text-emerald-700 underline" target="_blank" rel="noreferrer">
        افتحه في علامة تبويب جديدة
      </a>
      {" "}أو{" "}
      <a href={`${streamUrl}?download=1`} className="text-emerald-700 underline">
        نزّله مباشرة
      </a>.
    </div>
  </object>
</div>

          </div>
        )}
      </main>
    </div>
  );
}
