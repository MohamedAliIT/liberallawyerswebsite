import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, Clock } from "lucide-react";

export default function FloatingCard({
  year = "2018",
  title = "Specialised Practice Areas",
  desc = "Endowments, AML/CTF compliance, legal escrow",
  status = "Milestone achieved",
  corner = "right",          // "right" | "left"
  offset = 24,               // px from edges
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const posStyle =
    corner === "right"
      ? { right: offset, bottom: offset }
      : { left: offset, bottom: offset };

  return createPortal(
    <div className="fixed z-[2147483000] pointer-events-none" style={posStyle}>
      <div
        className="pointer-events-auto w-[min(90vw,560px)] rounded-3xl bg-white/95 backdrop-blur-md ring-1 ring-black/5 px-6 py-5 transition-all duration-300 hover:-translate-y-0.5"
        style={{
          boxShadow:
            "0 6px 12px rgba(2,8,23,.06), 0 18px 36px rgba(2,8,23,.08), 0 48px 96px rgba(2,8,23,.10)",
        }}
      >
        {/* Top row: year pill + calendar icon */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
            {year}
          </span>
          <Calendar size={16} className="text-indigo-600" />
        </div>

        {/* Title & description */}
        <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
        <p className="mt-1 text-slate-500">{desc}</p>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Clock size={16} />
          <span>{status}</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
