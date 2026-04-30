import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Briefcase, Scale, Shield, Star, Calendar, Award, ArrowRight, ArrowLeft
} from "lucide-react";
import { usePage } from "@inertiajs/react";
import Button from "@/Components/ui/Button";

export default function FileCase() {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;

    const tr = (key, fallback = "") => t[key] ?? fallback;

    const steps = [
        {
            Icon: Users,
            title: tr("file_step1_title", locale === "ar" ? "الخطوة 1" : "Step 1"),
            subtitle: tr(
                "file_step1_sub",
                locale === "ar"
                    ? "تواصل معنا للحصول على استشارة مجانية لمناقشة قضيتك القانونية"
                    : "Contact us for a free consultation to discuss your legal matter"
            ),
            duration: tr("file_step1_duration", locale === "ar" ? "30 دقيقة" : "30 minutes"),
            cost: tr("file_free", locale === "ar" ? "مجانا" : "Free"),
            status: tr("file_completed", locale === "ar" ? "مكتملة" : "Completed"),
            tasks: [
                tr("file_step1_task1"),
                tr("file_step1_task2"),
                tr("file_step1_task3"),
                tr("file_step1_task4"),
            ],
        },
        {
            Icon: Briefcase,
            title: tr("file_step2_title", locale === "ar" ? "الخطوة 2" : "Step 2"),
            subtitle: tr(
                "file_step2_sub",
                locale === "ar"
                    ? "جمع جميع المستندات والأدلة المتعلقة بقضيتك"
                    : "Gather all relevant documents and evidence for your case"
            ),
            duration: tr("file_step2_duration", locale === "ar" ? "1-3 أيام" : "1-3 days"),
            cost: "—",
            status: tr("file_completed", locale === "ar" ? "مكتملة" : "Completed"),
            tasks: [
                tr("file_step2_task1"),
                tr("file_step2_task2"),
                tr("file_step2_task3"),
            ],
        },
        {
            Icon: Scale,
            title: tr("file_step3_title", locale === "ar" ? "الخطوة 3" : "Step 3"),
            subtitle: tr(
                "file_step3_sub",
                locale === "ar"
                    ? "يقوم محامونا بمراجعة قضيتك وتقديم التحليل القانوني"
                    : "Our attorneys review your case and provide legal analysis"
            ),
            duration: tr("file_step3_duration", locale === "ar" ? "2-5 أيام" : "2-5 days"),
            cost: tr("file_quote", locale === "ar" ? "تسعير" : "Quote"),
            status: tr("file_completed", locale === "ar" ? "مكتملة" : "Completed"),
            tasks: [
                tr("file_step3_task1"),
                tr("file_step3_task2"),
                tr("file_step3_task3"),
            ],
        },
        {
            Icon: Shield,
            title: tr("file_step4_title", locale === "ar" ? "الخطوة 4" : "Step 4"),
            subtitle: tr(
                "file_step4_sub",
                locale === "ar"
                    ? "توقيع اتفاقية التمثيل القانوني ومناقشة الأتعاب"
                    : "Sign the legal representation agreement and discuss fees"
            ),
            duration: tr("file_step4_duration", locale === "ar" ? "يوم واحد" : "1 day"),
            cost: "—",
            status: tr("file_completed", locale === "ar" ? "مكتملة" : "Completed"),
            tasks: [
                tr("file_step4_task1"),
                tr("file_step4_task2"),
                tr("file_step4_task3"),
            ],
        },
        {
            Icon: Star,
            title: tr("file_step5_title", locale === "ar" ? "الخطوة 5" : "Step 5"),
            subtitle: tr(
                "file_step5_sub",
                locale === "ar"
                    ? "إعداد المستندات القانونية وبناء استراتيجية القضية"
                    : "Prepare legal documents and build your case strategy"
            ),
            duration: tr("file_step5_duration", locale === "ar" ? "1-4 أسابيع" : "1-4 weeks"),
            cost: "—",
            status: tr("file_completed", locale === "ar" ? "مكتملة" : "Completed"),
            tasks: [
                tr("file_step5_task1"),
                tr("file_step5_task2"),
                tr("file_step5_task3"),
            ],
        },
        {
            Icon: Calendar,
            title: tr("file_step6_title", locale === "ar" ? "الخطوة 6" : "Step 6"),
            subtitle: tr(
                "file_step6_sub",
                locale === "ar"
                    ? "تقديم الدعوى لدى المحكمة أو الجهة المختصة في دولة الإمارات"
                    : "File your case with the appropriate UAE court or authority"
            ),
            duration: tr("file_step6_duration", locale === "ar" ? "1-2 أيام" : "1-2 days"),
            cost: tr("file_court_fees", locale === "ar" ? "رسوم المحكمة" : "Court fees"),
            status: tr("file_completed", locale === "ar" ? "مكتملة" : "Completed"),
            tasks: [
                tr("file_step6_task1"),
                tr("file_step6_task2"),
                tr("file_step6_task3"),
            ],
        },
        {
            Icon: Award,
            title: tr("file_step7_title", locale === "ar" ? "الخطوة 7" : "Step 7"),
            subtitle: tr(
                "file_step7_sub",
                locale === "ar"
                    ? "التمثيل أمام المحكمة حتى صدور الحكم النهائي"
                    : "Representation in court until final judgment"
            ),
            duration: tr("file_step7_duration", locale === "ar" ? "يختلف حسب القضية" : "Varies"),
            cost: "—",
            status: tr("file_completed", locale === "ar" ? "مكتملة" : "Completed"),
            tasks: [
                tr("file_step7_task1"),
                tr("file_step7_task2"),
                tr("file_step7_task3"),
            ],
        },
    ];

    const [index, setIndex] = useState(0);
    const active = steps[index];
    const progress = ((index + 1) / steps.length) * 100;

    return (
        <section id="FileCase" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
            <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_45%,#f0f7ff_45%_55%,transparent_55%)]" />

            <div className="container mx-auto max-w-4xl px-4 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
            {tr("file_badge", locale === "ar" ? "عملية مبسطة من 7 خطوات" : "Simple 7-Step Process")}
          </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {tr("file_title", locale === "ar" ? "كيفية تقديم قضيتك" : "How to File Your Case")}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {tr(
                            "file_subtitle",
                            locale === "ar"
                                ? "دليل تفاعلي واضح يوضح كل مرحلة من رحلتك القانونية مع ليبرال للمحاماة."
                                : "A clear, interactive guide through every stage of your case journey with Liberal Lawyers."
                        )}
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    className="w-full h-2 bg-gray-100 rounded-full mb-12 overflow-hidden"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </motion.div>

                {/* Step Icons */}
                <div className="flex justify-between items-center mb-12 relative">
                    <div className="absolute h-0.5 bg-gray-200 top-6 left-0 right-0 -z-10" />
                    {steps.map((step, i) => (
                        <motion.button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center focus:outline-none group"
                        >
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform ${
                                    i <= index
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-100"
                                        : "bg-white text-gray-400 hover:bg-gray-50"
                                }`}
                            >
                                <step.Icon className="w-6 h-6" />
                            </div>
                            <span
                                className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                                    i <= index ? "text-blue-600" : "text-gray-500"
                                }`}
                            >
                {step.title}
              </span>
                        </motion.button>
                    ))}
                </div>

                {/* Active Step */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100"
                    >
                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <active.Icon className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{active.title}</h3>
                                <p className="text-gray-600 text-lg">{active.subtitle}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-gray-50 rounded-2xl p-6">
                            <Detail
                                label={tr("file_duration", locale === "ar" ? "المدة" : "Duration")}
                                value={active.duration}
                                icon="clock"
                            />
                            <Detail
                                label={tr("file_cost", locale === "ar" ? "التكلفة" : "Cost")}
                                value={active.cost}
                                icon="credit-card"
                            />
                            <Detail
                                label={tr("file_status", locale === "ar" ? "الحالة" : "Status")}
                                value={active.status}
                                valueClass="text-emerald-600 font-semibold"
                                icon="check-circle"
                            />
                        </div>

                        <div className="mb-8">
                            <h4 className="font-semibold text-gray-900 mb-4">
                                {tr("file_includes", locale === "ar" ? "تشمل هذه الخطوة:" : "This step includes:")}
                            </h4>
                            <ul className="grid gap-3">
                                {active.tasks.map((task, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-3 text-gray-700"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                                            <i className="bi bi-check text-blue-600" />
                                        </div>
                                        {task}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                                disabled={index === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue-600
                  text-blue-600 disabled:opacity-50 hover:bg-blue-50 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {tr("prev", locale === "ar" ? "السابق" : "Previous")}
                            </motion.button>

                            {index < steps.length - 1 ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r
                    from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600
                    transition-colors shadow-lg hover:shadow-xl"
                                >
                                    {tr("next", locale === "ar" ? "التالي" : "Next")}
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            ) : (
                                <Button href="#contact" variant="solid" type="button" className="animate-pulse hover:animate-none">
                                    {tr("file_start", locale === "ar" ? "ابدأ قضيتك الآن" : "Start Your Case Now")}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}

function Detail({ label, value, valueClass = "text-gray-700", icon }) {
    return (
        <div className="flex items-start gap-3">
            <i className={`bi bi-${icon} text-blue-600`} />
            <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
                <dd className={`${valueClass} text-lg font-medium`}>{value}</dd>
            </div>
        </div>
    );
}
