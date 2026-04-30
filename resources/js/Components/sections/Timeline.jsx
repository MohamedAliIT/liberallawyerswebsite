// resources/js/Components/sections/Timeline.jsx
import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    ChevronRight,
    ArrowRight,
    ChevronLeft,
} from "lucide-react";

export default function Timeline({ items = [] }) {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;
    const tr = (k, f = "") => t[k] ?? f;

    // Resolve { en, ar } or string
    const tVal = (val) => {
        if (!val) return "";
        if (typeof val === "string") return val;
        if (typeof val === "object") {
            return val[locale] ?? val.en ?? "";
        }
        return "";
    };

    const [activeYear, setActiveYear] = useState(items[0]?.year);
    const [isMobile, setIsMobile] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const index = items.findIndex((item) => item.year === activeYear);
        setActiveIndex(index);
    }, [activeYear, items]);

    const nextItem = () => {
        const nextIndex = (activeIndex + 1) % items.length;
        setActiveYear(items[nextIndex].year);
    };

    const prevItem = () => {
        const prevIndex = (activeIndex - 1 + items.length) % items.length;
        setActiveYear(items[prevIndex].year);
    };

    const handleDragEnd = (event, info) => {
        const threshold = 50;
        if (info.offset.x > threshold) prevItem();
        else if (info.offset.x < -threshold) nextItem();
    };

    return (
        <section className="relative py-12 md:py-24 overflow-hidden bg-gradient-to-b from-gray-900 to-blue-900 text-white">
            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-12 md:mb-20"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {tr(
                                "timeline_badge",
                                locale === "ar" ? "رحلتنا" : "Our Journey"
                            )}
                        </span>
                    </span>

                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                        {tr(
                            "timeline_title",
                            locale === "ar"
                                ? "التاريخ بالكلمات"
                                : "History in Words"
                        )}
                    </h2>

                    <p className="text-lg md:text-xl text-blue-100/80">
                        {tr(
                            "timeline_desc",
                            locale === "ar"
                                ? "رحلتنا من عام 2007 حتى اليوم تعكس التزامنا بالتحكيم والوساطة والحلول القانونية الشاملة."
                                : "Our journey from 2007 to today reflects our commitment to arbitration, mediation, and comprehensive legal solutions."
                        )}
                    </p>
                </motion.div>

                {/* Year Navigation */}
                <div className="hidden md:flex justify-center gap-4 mb-16 overflow-x-auto pb-4">
                    {items.map((item) => (
                        <button
                            key={item.year}
                            onClick={() => setActiveYear(item.year)}
                            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                                activeYear === item.year
                                    ? "bg-white text-blue-900"
                                    : "bg-white/10 hover:bg-white/20"
                            }`}
                        >
                            <span className="font-semibold">{item.year}</span>
                        </button>
                    ))}
                </div>

                {/* Mobile indicators */}
                {isMobile && (
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <div className="flex gap-2">
                            {items.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${
                                        index === activeIndex
                                            ? "bg-white w-6"
                                            : "bg-white/30"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-blue-200 ml-2">
                            {activeIndex + 1}{" "}
                            {tr("timeline_of", locale === "ar" ? "من" : "of")}{" "}
                            {items.length}
                        </span>
                    </div>
                )}

                {/* Content */}
                <div className="relative max-w-6xl mx-auto">
                    {isMobile && (
                        <>
                            <button
                                onClick={prevItem}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextItem}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    <AnimatePresence mode="wait">
                        {items.map((item) => {
                            if (item.year !== activeYear) return null;

                            return (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    drag={isMobile ? "x" : false}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={isMobile ? handleDragEnd : undefined}
                                    className="grid md:grid-cols-2 gap-12 items-center px-4"
                                >
                                    {/* Text */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-blue-200">
                                                    {tr(
                                                        "timeline_milestone",
                                                        locale === "ar"
                                                            ? "محطة"
                                                            : "Milestone"
                                                    )}
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold">
                                                    {tVal(item.title)}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-blue-100/80 leading-relaxed">
                                            {tVal(item.desc)}
                                        </p>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                        >
                                            <span>
                                                {tr(
                                                    "timeline_read_more",
                                                    locale === "ar"
                                                        ? "اقرأ المزيد"
                                                        : "Read More"
                                                )}
                                            </span>
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    </div>

                                    {/* Visual */}
                                    <div className="relative aspect-square">
                                        <div className="relative h-full rounded-3xl bg-white/10 p-6 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-6xl md:text-8xl font-bold text-white mb-4">
                                                    {item.year}
                                                </div>
                                                <div className="flex items-center justify-center gap-2 text-blue-100">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        {tr(
                                                            "timeline_achieved",
                                                            locale === "ar"
                                                                ? "تم تحقيق المحطة"
                                                                : "Milestone achieved"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Mobile hint */}
                {isMobile && (
                    <div className="text-center mt-8 text-blue-200/60 text-sm">
                        {tr(
                            "timeline_swipe",
                            locale === "ar"
                                ? "اسحب يميناً أو يساراً للتنقل"
                                : "Swipe left or right to navigate"
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
