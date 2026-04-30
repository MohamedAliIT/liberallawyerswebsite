// resources/js/Components/Footer.jsx
import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
// Official “X” (formerly Twitter) logo from Simple Icons
import { SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-t from-blue-900 to-blue-700 text-white pt-16 pb-8 overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C30,20 70,20 100,0 L100,100 L0,100 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {/* Brand & Contact */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Liberal Lawyers</h1>
          <p className="opacity-80 text-sm">
            Committed to exceptional legal representation across Dubai and
            Abu Dhabi with integrity and professionalism.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-300" />
              Business Bay, Dubai &amp; Corniche, Abu Dhabi
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-300" />
              +971 4 123 4567 | +971 2 123 4567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-300" />
              info@liberallawyers.com
            </li>
          </ul>
        </div>

        {/* Practice Areas */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Practice Areas</h4>
          <ul className="space-y-2 text-sm opacity-90">
            {[
              "Legal Advice",
              "Mediation Law",
              "Litigation",
              "Corporate Support Services",
            ].map((area) => (
              <li key={area}>
                <a href="#services" className="hover:underline">
                  {area}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm opacity-90">
            {[
              ["Privacy Policy", "/privacy-policy"],
              ["Terms of Service", "/terms"],
              ["Attorney Disclaimer", "/disclaimer"],
              ["Sitemap", "/sitemap.xml"],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/20 mt-12 pt-6 text-sm flex flex-col md:flex-row items-center justify-between container mx-auto px-6">
        <p>© {new Date().getFullYear()} Liberal Lawyers. All rights reserved.</p>
        <p className="opacity-70">
          Licensed to practice law in the United Arab Emirates.
        </p>
        <div className="flex gap-4 text-lg">
          <a href="#" className="hover:text-blue-300">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-blue-300">
            <SiX className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-blue-300">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-blue-300">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
