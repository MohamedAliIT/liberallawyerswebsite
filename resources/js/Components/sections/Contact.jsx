import React, { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/ui/Button";
import {
    MapPin, Phone, Clock, Mail, Users, Scale, Send,
    AlarmClock, CheckCircle, XCircle
} from "lucide-react";

/* ─── office data (update mapSrc) ─────────────────────────────── */
const defaultOffices = [
    {
        city: "Dubai",
        title: "Liberal Lawyers – Dubai",
        mapSrc: "https://maps.google.com/maps?hl=en&q=Liberal%20Lawyers%20&t=&z=12&ie=UTF8&iwloc=B&output=embed",
        address: "Al Wasl, Dubai, UAE",
        phone: "97143283000+",
        hours: "Sun–Thu 08:00–18:00 · Fri 08:00–12:00 · Sat OFF",
    },
    {
        city: "Abu Dhabi",
        title: "Liberal Lawyers – Abu Dhabi",
        mapSrc:
            "https://maps.google.com/maps?hl=en&q=Liberal%20Lawyers%20Abu%20Dhabi&t=&z=12&ie=UTF8&iwloc=B&output=embed",
        address: "Muroor Road, Abu Dhabi, UAE",
        phone: "97143283000+",
        hours: "Sun–Thu 08:00–18:00 · Fri 08:00–12:00 · Sat OFF",
    },
];

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt12 = (d, locale) => {
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();
    const hh = ((h + 11) % 12) + 1;
    const mm = String(m).padStart(2, "0");
    const am = locale === "ar" ? "ص" : "AM";
    const pm = locale === "ar" ? "م" : "PM";
    return `${hh}:${mm} ${h < 12 ? am : pm}`;
};

function Field({ label, type, name, value, onChange, error, required, Icon }) {
    return (
        <div>
            <label className="relative block">
                {Icon && <Icon className="absolute left-3 top-3 h-5 w-5 text-blue-600" />}
                <input
                    type={type}
                    name={name}
                    value={value}
                    required={required}
                    onChange={onChange}
                    placeholder={`${label}${required ? " *" : ""}`}
                    className="w-full rounded-lg border-gray-300 px-10 py-3 focus:border-blue-600 focus:ring focus:ring-blue-200"
                />
            </label>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

/* ─── page component ─────────────────────────────────────────── */
export default function Contact({ offices = defaultOffices }) {
    const { props } = usePage();
    const { flash = {}, t = {}, locale = "en" } = props;
    const success = flash?.success;

    const tr = (key, fallback = "") => t[key] ?? fallback;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    /* live UAE time + status */
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(id);
    }, []);

    const uae = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const day = uae.getUTCDay();
    const mins = uae.getUTCHours() * 60 + uae.getUTCMinutes();

    const SCHED = {
        default: { start: 8 * 60, end: 18 * 60 },
        fri: { start: 8 * 60, end: 12 * 60 },
    };

    let slot;
    if (day === 5) slot = SCHED.fri;
    else if (day === 6) slot = null;
    else slot = SCHED.default;

    const open = slot && mins >= slot.start && mins < slot.end;
    const minsToChange = open
        ? slot.end - mins
        : slot
            ? (slot.start - mins + 24 * 60) % (24 * 60)
            : (SCHED.default.start + 24 * 60 - mins) % (24 * 60);

    const hLeft = Math.floor(minsToChange / 60);
    const mLeft = minsToChange % 60;

    /* submit */
    const submit = (e) => {
        e.preventDefault();
        post(route("contact.store"), { onSuccess: () => reset() });
    };

    return (
        <section id="contact" className="relative py-24 bg-gray-50 overflow-hidden">
            {/* gradient blobs */}
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 opacity-20" />

            <div className="container relative z-10 mx-auto px-6">
                <header className="mb-12 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        {tr("contact_title", locale === "ar" ? "تواصل معنا اليوم" : "Contact Us Today")}
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 opacity-90">
                        {tr(
                            "contact_subtitle",
                            locale === "ar"
                                ? "هل أنت مستعد لمناقشة احتياجاتك القانونية؟ أرسل لنا رسالة أو قم بزيارة أحد مكاتبنا."
                                : "Ready to discuss your legal needs? Send us a message or visit one of our offices."
                        )}
                    </p>
                </header>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* office cards */}
                    <div className="space-y-8">
                        {offices.map((o) => (
                            <article key={o.city} className="overflow-hidden rounded-2xl bg-white shadow-lg">
                                <iframe src={o.mapSrc} title={o.title} className="h-48 w-full" loading="lazy" />
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-900">{o.title}</h3>
                                    <ul className="mt-4 space-y-3 text-gray-700">
                                        <li className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-blue-600" /> {o.address}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Phone className="h-5 w-5 text-blue-600" /> {o.phone}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-blue-600" /> {o.hours}
                                        </li>
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* form */}
                    <form onSubmit={submit} className="flex flex-col space-y-5 rounded-2xl bg-white p-8 shadow-lg">
                        {success && (
                            <div className="rounded border border-emerald-300 bg-emerald-50 p-3 text-emerald-800">
                                {success}
                            </div>
                        )}

                        <Field
                            label={tr("form_name", locale === "ar" ? "الاسم الكامل" : "Full Name")}
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
                            required
                            Icon={Users}
                        />

                        <Field
                            label={tr("form_email", locale === "ar" ? "البريد الإلكتروني" : "Email")}
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            error={errors.email}
                            required
                            Icon={Mail}
                        />

                        <Field
                            label={tr("form_phone", locale === "ar" ? "رقم الهاتف" : "Phone")}
                            type="tel"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            error={errors.phone}
                            Icon={Phone}
                        />

                        <Field
                            label={tr("form_subject", locale === "ar" ? "الموضوع" : "Subject")}
                            type="text"
                            name="subject"
                            value={data.subject}
                            onChange={(e) => setData("subject", e.target.value)}
                            error={errors.subject}
                            required
                            Icon={Scale}
                        />

                        <div>
              <textarea
                  rows={4}
                  name="message"
                  required
                  value={data.message}
                  onChange={(e) => setData("message", e.target.value)}
                  placeholder={`${tr("form_message", locale === "ar" ? "الرسالة" : "Message")} *`}
                  className="w-full rounded-lg border-gray-300 px-4 py-3 pt-6 focus:border-blue-600 focus:ring focus:ring-blue-200"
              />
                            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                        </div>

                        <div>
                            <Button type="submit" disabled={processing} className="relative w-full font-semibold text-white">
                                {processing ? (
                                    <>
                                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        {tr("sending", locale === "ar" ? "جارٍ الإرسال…" : "Sending…")}
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        {tr("send_message", locale === "ar" ? "إرسال الرسالة" : "Send Message")}
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* time/status */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-700">
                  <AlarmClock className="h-5 w-5 text-blue-600" />
                    {fmt12(uae, locale)} {tr("uae_time", "UAE")}
                </span>
                                {open ? (
                                    <span className="flex items-center gap-1 font-medium text-emerald-600">
                    <CheckCircle className="h-5 w-5" /> {tr("open", locale === "ar" ? "مفتوح" : "OPEN")}
                  </span>
                                ) : (
                                    <span className="flex items-center gap-1 font-medium text-red-600">
                    <XCircle className="h-5 w-5" /> {tr("closed", locale === "ar" ? "مغلق" : "CLOSED")}
                  </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                                {open
                                    ? tr("closes_in", locale === "ar" ? "يغلق خلال" : "Closes in")
                                    : tr("opens_in", locale === "ar" ? "يفتح خلال" : "Opens in")}{" "}
                                {hLeft}h {mLeft}m
                            </p>
                        </div>

                        {/* SLA banner */}
                        <div className="relative mt-6 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white via-blue-50 to-white shadow-sm">
                            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
                            <div className="flex items-start gap-4 p-6 text-blue-900">
                                <div className="relative">
                                    <CheckCircle className="h-7 w-7 text-blue-600 drop-shadow" />
                                    <span className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold sm:text-lg">
                                        {tr(
                                            "sla_title",
                                            locale === "ar" ? "طلبك في مقدمة الأولوية" : "Your request. Front of the line."
                                        )}
                                    </h4>
                                    <p className="mt-1 text-sm leading-relaxed sm:text-base">
                                        {tr(
                                            "sla_text",
                                            locale === "ar"
                                                ? "نرد خلال 30 دقيقة خلال ساعات العمل. الرسائل المرسلة بعد الدوام يتم الرد عليها أولاً في أول يوم عمل تالٍ."
                                                : "We reply within 30 minutes during office hours. Messages sent after hours jump to the top of our list and get answered first thing the next working day."
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
