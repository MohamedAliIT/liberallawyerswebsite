import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

export default function Show({ article, locale }) {
  const initialLang = locale === "ar" ? "ar" : "en";
  const [viewLang, setViewLang] = useState(initialLang);
  const isAr = viewLang === "ar";

  const title = isAr
    ? article.title_ar || article.title_en
    : article.title_en || article.title_ar;

  const bodyHtml = isAr
    ? article.body_ar || article.body_en
    : article.body_en || article.body_ar;

  let imageUrl = null;
  if (article.featured_image) {
    imageUrl = article.featured_image.startsWith("http")
      ? article.featured_image
      : `/storage/${article.featured_image}`;
  }

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(
        isAr ? "ar-AE" : "en-US",
        { year: "numeric", month: "2-digit", day: "2-digit" }
      )
    : null;

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <MainLayout title={title} locale={locale}>
      <Head title={title} />

      {/* اتجاه كامل حسب اللغة */}
      <div dir={isAr ? "rtl" : "ltr"} className={isAr ? "rtl" : "ltr"}>
        <div
          className={`container mx-auto py-10 px-4 max-w-4xl ${
            isAr ? "text-right" : "text-left"
          }`}
        >
          {/* الهيدر + زر اللغة */}
          <div
            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ${
              isAr ? "md:flex-row-reverse" : ""
            }`}
          >
            <div>
              <h1 className="text-3xl font-bold mb-1">{title}</h1>
              {publishedDate && (
                <p className="text-sm text-gray-500">
                  {isAr ? "تاريخ النشر: " : "Published on: "} {publishedDate}
                </p>
              )}
            </div>

            {/* زر تبديل اللغة للمقال فقط */}
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setViewLang("en")}
                className={
                  "px-4 py-1.5 text-sm font-medium transition " +
                  (viewLang === "en"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setViewLang("ar")}
                className={
                  "px-4 py-1.5 text-sm font-medium transition " +
                  (viewLang === "ar"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                العربية
              </button>
            </div>
          </div>

          {/* الصورة */}
          {imageUrl && (
            <div className="mb-8">
              <img
                src={imageUrl}
                alt={title}
                className="w-full max-h-[480px] object-cover rounded-lg shadow"
              />
            </div>
          )}

          {/* المحتوى */}
          <div
            className={`prose max-w-none mb-10 ${
              isAr ? "prose-rtl" : "prose-ltr"
            }`}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* المشاركة */}
          <div className="border-t pt-6 mt-8">
            <h2 className="font-semibold mb-3">
              {isAr ? "شارك هذا المقال" : "Share this article"}
            </h2>
            <div
              className={`flex gap-4 text-sm ${
                isAr ? "justify-end flex-row-reverse" : ""
              }`}
            >
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline"
              >
                Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* رجوع */}
          <div className={`mt-6 ${isAr ? "text-left" : "text-right"}`}>
            <Link href="/articles" className="text-blue-600 hover:underline">
              {isAr ? "← الرجوع إلى قائمة المقالات" : "← Back to articles"}
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
