import React from "react";
import { motion } from "framer-motion";
import { usePage } from "@inertiajs/react";

export default function About({ stats }) {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    };

    const tr = (key, fallback = "") => t[key] ?? fallback;

    return (
        <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                    {/* Left column — About card */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        className="h-full"
                    >
                        <div className="bg-white h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl p-8 sm:p-10 space-y-6 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                                    <i className="bi bi-building text-2xl text-primary-600"></i>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {tr("about_title")}
                                </h2>
                            </div>

                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-800">
                                    <strong className="font-semibold">
                                        {tr("about_company")}
                                    </strong>{" "}
                                    {tr("about_paragraph_1")}
                                    <span className="relative inline-block mx-1">
                    <span className="absolute -inset-1.5 rounded-md bg-primary-50" />
                    <span className="relative z-10 font-semibold text-primary-700">
                      {tr("about_founder")}
                    </span>
                  </span>
                                    {tr("about_paragraph_1_cont")}
                                </p>

                                <p className="text-gray-700 mt-6">
                                    {tr("about_paragraph_2")}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Mission card */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        className="h-full"
                    >
                        <div className="bg-white h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl p-8 sm:p-10 space-y-6 border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                                    <i className="bi bi-trophy text-2xl text-primary-600"></i>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {tr("mission_title")}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {tr("mission_subtitle")}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl">
                                <p className="text-lg leading-relaxed text-gray-700">
                                    {tr("mission_text")}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h4 className="font-semibold text-primary-700 mb-4">
                                    {tr("services_title")}
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        tr("service_1"),
                                        tr("service_2"),
                                        tr("service_3"),
                                    ].map((txt) => (
                                        <li key={txt} className="flex items-center gap-3 group">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <i className="bi bi-check-lg text-emerald-600" />
                                            </div>
                                            <span className="text-gray-700">{txt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
