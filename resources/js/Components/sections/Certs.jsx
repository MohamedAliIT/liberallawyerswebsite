// resources/js/Components/sections/Certs.jsx
import { usePage } from "@inertiajs/react";

export default function Certs({ items }) {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;

    const tr = (key, fallback = "") => t[key] ?? fallback;

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto">
                <h2 className="section-title">
                    {tr(
                        "certs_title",
                        locale === "ar" ? "الشهادات المهنية" : "Professional Certifications"
                    )}
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mt-12">
                    {items.map((c) => (
                        <div
                            key={c.title}
                            className="flex items-start gap-4 border rounded-2xl p-6 bg-white"
                        >
                            <i className={`bi ${c.icon} text-emerald-500 text-3xl`} />
                            <div>
                                <h4 className="font-semibold">{c.title}</h4>
                                <p className="text-sm opacity-70">{c.desc}</p>
                            </div>
                            <i className="bi bi-check-circle-fill text-emerald-500 ml-auto text-xl self-center" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
