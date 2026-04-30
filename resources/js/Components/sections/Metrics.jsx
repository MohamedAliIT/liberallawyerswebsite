// resources/js/Components/sections/Metrics.jsx
import { usePage } from "@inertiajs/react";

export default function Metrics({ items = [] }) {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;

    const tr = (key, fallback = "") => t[key] ?? fallback;

    // Handle { en, ar } objects safely
    const tVal = (obj) => {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        return obj[locale] ?? obj.en ?? "";
    };

    return (
        <section className="py-24">
            <div className="container mx-auto">
                <h2 className="section-title">
                    {tr(
                        "metrics_title",
                        locale === "ar" ? "مؤشرات الأداء" : "Performance Metrics"
                    )}
                </h2>

                <div className="grid md:grid-cols-4 gap-8 mt-12">
                    {items.map((m, i) => (
                        <div
                            key={i}
                            className="border rounded-2xl p-10 text-center space-y-4 shadow-sm bg-white"
                        >
                            <i
                                className={`bi ${m.icon} text-primary-900 text-3xl`}
                            />
                            <p className="text-3xl font-semibold">{m.value}</p>
                            <h4 className="font-medium">
                                {tVal(m.label)}
                            </h4>
                            <p className="text-sm opacity-70">
                                {tVal(m.desc)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
