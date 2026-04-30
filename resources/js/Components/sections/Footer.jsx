import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { MapPin, Phone, Mail, Facebook, Linkedin, Instagram } from "lucide-react";
import { SiX } from "react-icons/si";

export default function Footer() {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;
    const tr = (k, f = "") => t[k] ?? f;

    return (
        <footer className="relative bg-gradient-to-t from-blue-900 to-blue-700 text-white pt-16 pb-8 overflow-hidden">
            {/* Decorative top wave */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
                <svg
                    className="relative block w-full h-12"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <path d="M0,0 C30,20 70,20 100,0 L100,100 L0,100 Z" fill="currentColor" />
                </svg>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                {/* Brand & About */}
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold">
                        {tr("footer_brand", "Liberal Lawyers")}
                    </h1>
                    <p className="opacity-80 text-sm leading-relaxed">
                        {tr("footer_about_text")}
                    </p>

                    <div className="flex gap-4 text-lg pt-2">
                        <a href="#" className="hover:text-blue-300"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-blue-300"><SiX className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-blue-300"><Linkedin className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-blue-300"><Instagram className="w-5 h-5" /></a>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                    <h4 className="text-lg font-semibold">
                        {tr("footer_contact_info", locale === "ar" ? "معلومات التواصل" : "Contact Information")}
                    </h4>
                    <ul className="space-y-3 text-sm opacity-90">
                        <li className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-300" />
                            {tr("footer_location")}
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-blue-300" />
                            <span dir="ltr" className="unicode-bidi: plaintext">
                            {tr("footer_phone")}
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-300" />
                            {tr("footer_email")}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-5 h-5" />
                            {tr("footer_hours")}
                        </li>
                    </ul>
                </div>

                {/* Practice Areas */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">
                        {tr("footer_practice", locale === "ar" ? "مجالات الممارسة" : "Practice Areas")}
                    </h4>
                    <ul className="space-y-2 text-sm opacity-90">
                        {[
                            tr("footer_corporate"),
                            tr("footer_realestate"),
                            tr("footer_family"),
                            tr("footer_criminal"),
                            tr("footer_civil"),
                        ].map((area) => (
                            <li key={area}>
                                <a href="#services" className="hover:underline">
                                    {area}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">
                        {tr("footer_quick", locale === "ar" ? "روابط سريعة" : "Quick Links")}
                    </h4>
                    <ul className="space-y-2 text-sm opacity-90">
                        {[
                            [tr("footer_about"), "#about"],
                            [tr("footer_team"), "#team"],
                            [tr("footer_contact"), "#contact"],
                            [tr("footer_privacy"), "/privacy"],
                            [tr("footer_terms"), "/terms"],
                        ].map(([label, href]) => (
                            <li key={label}>
                                <Link href={href} className="hover:underline">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom strip */}
            <div className="border-t border-white/20 mt-12 pt-6 text-sm flex flex-col md:flex-row items-center justify-between container mx-auto px-6 gap-4">
                <p>
                    © {new Date().getFullYear()} {tr("footer_rights")}
                </p>
                <p className="opacity-70 text-center">
                    {tr("footer_license")}
                </p>
            </div>
        </footer>
    );
}
