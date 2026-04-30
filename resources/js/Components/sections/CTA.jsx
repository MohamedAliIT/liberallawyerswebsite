import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Calendar, Award, Users } from "lucide-react";
import { usePage } from "@inertiajs/react";
import Button from "@/Components/ui/Button";

export default function CTA() {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;

    const tr = (key, fallback = "") => t[key] ?? fallback;

    const stats = [
        { icon: Users, label: tr("cta_stat_clients", locale === "ar" ? "عملاء راضون" : "Satisfied Clients"), value: "1,000+" },
        { icon: Award, label: tr("cta_stat_awards", locale === "ar" ? "جوائز" : "Awards Won"), value: "25+" },
        { icon: Calendar, label: tr("cta_stat_years", locale === "ar" ? "سنوات خبرة" : "Years Experience"), value: "17+" },
        { icon: Phone, label: tr("cta_stat_support", locale === "ar" ? "دعم 24/7" : "24/7 Support"), value: tr("cta_stat_support_val", locale === "ar" ? "متاح" : "Available") },
    ];

    const badges = [
        tr("cta_badge_iso", locale === "ar" ? "معتمد ISO" : "ISO Certified"),
        tr("cta_badge_uae_bar", locale === "ar" ? "جمعية المحامين الإماراتية" : "UAE Bar Association"),
        tr("cta_badge_difc", locale === "ar" ? "محاكم مركز دبي المالي" : "DIFC Courts"),
        tr("cta_badge_excellence", locale === "ar" ? "جائزة التميز القانوني" : "Legal Excellence Award"),
    ];

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-blue-50">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-600/20 to-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 to-blue-600/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Main CTA Card */}
                    <div className="bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white rounded-[2.5rem] p-12 md:p-16 shadow-2xl">
                        <div className="absolute inset-0.5 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-[2.5rem] opacity-50" />
                        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-10 mix-blend-overlay rounded-[2.5rem]" />

                        <div className="relative max-w-4xl mx-auto text-center">
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                                {stats.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="text-center">
                                        <Icon className="w-8 h-8 mx-auto mb-3 text-blue-300" />
                                        <div className="text-2xl font-bold mb-1">{value}</div>
                                        <div className="text-sm text-blue-200/80">{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                    {tr("cta_title_1", locale === "ar" ? "اختبر" : "Experience")}{" "}
                                    <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                    {tr("cta_title_2", locale === "ar" ? "خدمة قانونية حائزة على جوائز" : "Award-Winning Legal Service")}
                  </span>
                                </h2>

                                <p className="text-xl text-blue-100/90 mb-12 max-w-2xl mx-auto">
                                    {tr(
                                        "cta_subtitle",
                                        locale === "ar"
                                            ? "انضم إلى مجتمع عملائنا الراضين الذين يثقون بخبرتنا والتزامنا لتقديم حلول قانونية استثنائية."
                                            : "Join our community of satisfied clients who trust our expertise and dedication to deliver exceptional legal solutions."
                                    )}
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row justify-center gap-6">
                                    <Button
                                        href="#contact"
                                        className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 border border-transparent"
                                    >
                    <span className="flex items-center gap-3">
                      {tr("cta_btn_consult", locale === "ar" ? "احجز استشارة" : "Schedule Consultation")}
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                                    </Button>

                                    <Button
                                        href="#services"
                                        className="group bg-blue-700/20 hover:bg-blue-700/30 text-white px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm transition-all duration-300 border border-white/10 hover:border-white/20"
                                    >
                    <span className="flex items-center gap-3">
                      {tr("cta_btn_services", locale === "ar" ? "عرض خدماتنا" : "View Our Services")}
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 flex flex-wrap justify-center gap-8 items-center"
                    >
                        {badges.map((badge) => (
                            <div
                                key={badge}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 text-sm font-medium shadow-sm"
                            >
                                <Award className="w-4 h-4 text-blue-600" />
                                {badge}
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
