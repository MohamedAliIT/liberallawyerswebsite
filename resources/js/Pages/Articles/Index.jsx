import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

export default function ArticlesIndex({ articles, locale }) {
  const initialLang = locale === "ar" ? "ar" : "en";
  const [viewLang, setViewLang] = useState(initialLang);
  const isAr = viewLang === "ar";

  return (
    <MainLayout
      title={isAr ? "المقالات القانونية" : "Legal Articles"}
      locale={locale}
    >
      <Head title={isAr ? "المقالات القانونية" : "Legal Articles"} />

      {/* تغيير الإتجاه بالكامل حسب اللغة المختارة */}
      <div dir={isAr ? "rtl" : "ltr"} className={isAr ? "rtl" : "ltr"}>
        <div
          className={`container mx-auto py-8 px-4 max-w-6xl ${
            isAr ? "text-right" : "text-left"
          }`}
        >
          {/* العنوان + زر اللغة */}
          <div
            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ${
              isAr ? "md:flex-row-reverse" : ""
            }`}
          >
            <h1 className="text-3xl font-bold">
              {isAr ? "المقالات القانونية" : "Legal Articles"}
            </h1>

            {/* زر تبديل اللغة للمقالات فقط */}
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

          {/* قائمة المقالات */}
          {articles.data && articles.data.length > 0 ? (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
                isAr ? "md:text-right" : ""
              }`}
            >
              {articles.data.map((article) => {
                const title = isAr
                  ? article.title_ar || article.title_en
                  : article.title_en || article.title_ar;

                const excerpt = isAr
                  ? article.excerpt_ar || article.excerpt_en
                  : article.excerpt_en || article.excerpt_ar;

                const imageUrl = article.featured_image
                  ? article.featured_image.startsWith("http")
                    ? article.featured_image
                    : `/storage/${article.featured_image}`
                  : null;

                return (
                  <div
                    key={article.id}
                    className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="hover:text-blue-600"
                        >
                          {title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {excerpt}
                      </p>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {isAr ? "اقرأ المزيد »" : "Read more »"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">
              {isAr ? "لا توجد مقالات حالياً." : "No articles found."}
            </p>
          )}

          {/* Pagination */}
          <div
            className={`mt-8 flex justify-center ${
              isAr ? "flex-row-reverse" : ""
            }`}
          >
            {articles.links &&
              articles.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url || "#"}
                  className={`px-3 py-1 rounded-md mx-1 text-sm ${
                    link.active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
