import { motion } from "framer-motion";
import { Trophy, Award, Star, ChevronRight } from "lucide-react";
import { usePage } from "@inertiajs/react";

export default function Awards({ items }) {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;

    const tr = (key, fallback = "") => t[key] ?? fallback;

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-gray-50">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-primary-100/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute -right-40 top-40 w-80 h-80 bg-gradient-to-br from-primary-100/30 to-blue-100/30 rounded-full blur-2xl" />
                <div className="absolute -left-40 bottom-40 w-80 h-80 bg-gradient-to-tr from-blue-100/30 to-primary-100/30 rounded-full blur-2xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary-100/50 text-primary-800 mb-6">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">
              {tr("awards_badge", locale === "ar" ? "التميز والتكريم" : "Recognition & Excellence")}
            </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {tr("awards_title", locale === "ar" ? "إنجازاتنا" : "Our Achievements")}
                    </h2>

                    <p className="text-xl text-gray-600 leading-relaxed">
                        {tr(
                            "awards_subtitle",
                            locale === "ar"
                                ? "تقدير لالتزامنا بالتميز القانوني ورضا العملاء والنزاهة المهنية في المشهد القانوني بدولة الإمارات."
                                : "Recognition of our commitment to legal excellence, client satisfaction, and professional integrity in the UAE legal landscape."
                        )}
                    </p>
                </motion.div>

                {/* Awards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((award, index) => (
                        <motion.article
                            key={award.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-50 to-transparent rounded-bl-[100px]" />

                            <div className="relative">
                                {/* Icon & Badge */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                        <Award className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                    {award.badge}
                  </span>
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {award.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Star className="w-4 h-4 text-amber-400" />
                                            <span>{award.year}</span>
                                            <span>•</span>
                                            <span>{award.org}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 leading-relaxed">
                                        {award.desc}
                                    </p>

                                    {/* Hover Action */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <button className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors group/btn">
                      <span className="text-sm font-medium">
                        {tr("learn_more", locale === "ar" ? "اعرف المزيد" : "Learn More")}
                      </span>
                                            <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
