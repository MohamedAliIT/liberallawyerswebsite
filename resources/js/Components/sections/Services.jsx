// resources/js/Components/sections/Services.jsx
import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import Button from "@/Components/ui/Button";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Gavel, Building, UserCheck, Home, Lightbulb,
    ArrowRightCircle, X, Clock, Users, Check, Phone
} from "lucide-react";

export default function Services() {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;
    const tr = (k, f = "") => t[k] ?? f;

    const services = [
        {
            slug: "legal-advice",
            Icon: BookOpen,
            title: tr("srv_legal_title", locale === "ar" ? "الاستشارات القانونية" : "Legal Advice"),
            desc: tr(
                "srv_legal_desc",
                locale === "ar"
                    ? "استشارات استراتيجية مصممة لأعمالك أو شؤونك الشخصية."
                    : "Strategic counsel tailored to your business or personal matters."
            ),
            bullets: [
                tr("srv_legal_b1", locale === "ar" ? "استشارات متخصصة" : "Specialized consultations"),
                tr("srv_legal_b2", locale === "ar" ? "تحليل المخاطر والامتثال" : "Risk & compliance analysis"),
                tr("srv_legal_b3", locale === "ar" ? "حلول قانونية وقائية" : "Preventive legal solutions"),
            ],
        },
        {
            slug: "litigation",
            Icon: Gavel,
            title: tr("srv_lit_title", locale === "ar" ? "التقاضي وحل النزاعات" : "Litigation & Dispute Resolution"),
            desc: tr(
                "srv_lit_desc",
                locale === "ar"
                    ? "تمثيل قوي أمام المحاكم ووسائل فض النزاعات البديلة."
                    : "Aggressive representation in courts and alternative dispute forums."
            ),
            bullets: [
                tr("srv_lit_b1", locale === "ar" ? "التقاضي المدني والتجاري" : "Civil & commercial litigation"),
                tr("srv_lit_b2", locale === "ar" ? "التحكيم والوساطة" : "Arbitration & mediation"),
                tr("srv_lit_b3", locale === "ar" ? "إجراءات التنفيذ" : "Enforcement proceedings"),
            ],
        },
        {
            slug: "corporate-law",
            Icon: Building,
            title: tr("srv_corp_title", locale === "ar" ? "الشركات والتجارة" : "Corporate & Commercial"),
            desc: tr(
                "srv_corp_desc",
                locale === "ar"
                    ? "دعم متكامل لتأسيس الشركات والحوكمة والمعاملات."
                    : "End-to-end support for company formation, governance, and transactions."
            ),
            bullets: [
                tr("srv_corp_b1", locale === "ar" ? "هيكلة الكيانات" : "Entity structuring"),
                tr("srv_corp_b2", locale === "ar" ? "الاندماج والاستحواذ" : "Mergers & acquisitions"),
                tr("srv_corp_b3", locale === "ar" ? "حوكمة الشركات" : "Corporate governance"),
            ],
        },
        {
            slug: "employment",
            Icon: UserCheck,
            title: tr("srv_emp_title", locale === "ar" ? "العمل والموارد البشرية" : "Employment & HR"),
            desc: tr(
                "srv_emp_desc",
                locale === "ar"
                    ? "استشارات في قانون العمل والعقود ونزاعات بيئة العمل."
                    : "Advising on labor law, contracts, and workplace disputes."
            ),
            bullets: [
                tr("srv_emp_b1", locale === "ar" ? "العقود والسياسات" : "Contracts & policies"),
                tr("srv_emp_b2", locale === "ar" ? "التحقيقات الوظيفية" : "Workplace investigations"),
                tr("srv_emp_b3", locale === "ar" ? "إنهاء الخدمة والنزاعات" : "Severance & disputes"),
            ],
        },
        {
            slug: "real-estate",
            Icon: Home,
            title: tr("srv_re_title", locale === "ar" ? "العقارات والممتلكات" : "Real Estate & Property"),
            desc: tr(
                "srv_re_desc",
                locale === "ar"
                    ? "خدمات شاملة لمعاملات البيع والإيجار."
                    : "Comprehensive services for property transactions and leasing."
            ),
            bullets: [
                tr("srv_re_b1", locale === "ar" ? "اتفاقيات البيع والشراء" : "Sale & purchase agreements"),
                tr("srv_re_b2", locale === "ar" ? "التفاوض على الإيجار" : "Lease negotiations"),
                tr("srv_re_b3", locale === "ar" ? "التسجيل والملكية" : "Title & registration"),
            ],
        },
        {
            slug: "intellectual-property",
            Icon: Lightbulb,
            title: tr("srv_ip_title", locale === "ar" ? "الملكية الفكرية" : "Intellectual Property"),
            desc: tr(
                "srv_ip_desc",
                locale === "ar"
                    ? "حماية وإنفاذ العلامات التجارية وبراءات الاختراع وحقوق التأليف."
                    : "Protection and enforcement of trademarks, patents, and copyrights."
            ),
            bullets: [
                tr("srv_ip_b1", locale === "ar" ? "التسجيل والمتابعة" : "Registration & prosecution"),
                tr("srv_ip_b2", locale === "ar" ? "إدارة محافظ الملكية الفكرية" : "IP portfolio management"),
                tr("srv_ip_b3", locale === "ar" ? "إجراءات الإنفاذ" : "Enforcement actions"),
            ],
        },
    ];

    const [selectedService, setSelectedService] = useState(null);

    return (
        <section id="services" className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
            {tr("srv_badge", locale === "ar" ? "خبراتنا" : "Our Expertise")}
          </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {tr("srv_title", locale === "ar" ? "الخدمات القانونية" : "Legal Services")}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        {tr(
                            "srv_sub",
                            locale === "ar"
                                ? "حلول قانونية شاملة مصممة لتلبية احتياجاتك"
                                : "Comprehensive legal solutions tailored to your needs"
                        )}
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((s, index) => (
                        <motion.article
                            key={s.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white rounded-3xl p-8 flex flex-col shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6">
                                <s.Icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{s.title}</h3>
                            <p className="text-gray-600 mb-6 flex-1">{s.desc}</p>

                            <ul className="space-y-3 mb-8">
                                {s.bullets.map((b) => (
                                    <li key={b} className="flex items-start gap-3">
                                        <ArrowRightCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                        <span className="text-gray-600 text-sm">{b}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedService(s);
                                }}
                                variant="solid"
                                className="mt-auto rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                            >
                                {tr("srv_learn_more", locale === "ar" ? "اعرف المزيد" : "Learn More")}
                            </Button>

                        </motion.article>
                    ))}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {selectedService && (
                        <Dialog
                            static
                            open={!!selectedService}
                            onClose={() => setSelectedService(null)}
                            className="relative z-50"
                        >
                            <div className="fixed inset-0 bg-black/30" />
                            <div className="fixed inset-0 flex items-center justify-center p-4">
                                <Dialog.Panel>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8"
                                    >
                                        <button
                                            onClick={() => setSelectedService(null)}
                                            className="absolute right-4 top-4"
                                        >
                                            <X className="w-6 h-6 text-gray-500" />
                                        </button>

                                        <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                                            {selectedService.title}
                                        </Dialog.Title>

                                        <p className="text-gray-600 mb-6">{selectedService.desc}</p>

                                        <h4 className="font-semibold mb-3">
                                            {tr("srv_key_features", locale === "ar" ? "الميزات الرئيسية" : "Key Features")}
                                        </h4>

                                        <ul className="grid grid-cols-2 gap-4 mb-6">
                                            {selectedService.bullets.map((b) => (
                                                <li key={b} className="flex items-center gap-2">
                                                    <Check className="w-5 h-5 text-blue-600" />
                                                    <span className="text-gray-600">{b}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-6 mb-6">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {tr("srv_resp_label", locale === "ar" ? "زمن الرد" : "Response Time")}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {tr("srv_resp_val", locale === "ar" ? "خلال 24 ساعة" : "Within 24 hours")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Users className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {tr("srv_team_label", locale === "ar" ? "حجم الفريق" : "Team Size")}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {tr("srv_team_val", locale === "ar" ? "خبراء متخصصون" : "Dedicated experts")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button
                                                href="#contact"
                                                variant="solid"
                                                className="flex-1"
                                                onClick={() => setSelectedService(null)}
                                            >
                                                {tr("srv_request", locale === "ar" ? "اطلب الخدمة" : "Request Service")}
                                            </Button>
                                            <Button
                                                href="tel:+97143283000"
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <Phone className="w-4 h-4" />
                                                {tr("srv_call", locale === "ar" ? "اتصل الآن" : "Call Now")}
                                            </Button>
                                        </div>
                                    </motion.div>
                                </Dialog.Panel>
                            </div>
                        </Dialog>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
