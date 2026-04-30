// resources/js/Components/sections/Hero.jsx
import Button from "@/Components/ui/Button";
import { usePage } from "@inertiajs/react";
import { Scale, Shield, Users, Star, Calendar, ArrowRight, Briefcase, Award } from "lucide-react";

export default function Hero() {
    const { props } = usePage();
    const { t = {}, locale = "en" } = props;

    const tr = (key, fallback = "") => t[key] ?? fallback;

    const features = [
        [
            Scale,
            tr("hero_feat1_title", locale === "ar" ? "سجل حافل بالنجاح" : "Proven Track Record"),
            tr(
                "hero_feat1_desc",
                locale === "ar"
                    ? "تاريخ قوي في تحقيق نتائج ناجحة للأفراد والشركات."
                    : "Strong history of achieving successful outcomes for individuals and businesses."
            ),
        ],
        [
            Shield,
            tr("hero_feat2_title", locale === "ar" ? "النزاهة والشفافية" : "Integrity & Transparency"),
            tr(
                "hero_feat2_desc",
                locale === "ar"
                    ? "نعمل بأمانة وأخلاقيات وشفافية كاملة في الأتعاب والإجراءات لبناء علاقات طويلة الأمد."
                    : "We operate with honesty, ethics, and full transparency in fees and processes, building lasting client relationships."
            ),
        ],
        [
            Users,
            tr("hero_feat3_title", locale === "ar" ? "تأسست منذ 2007" : "Established Since 2007"),
            tr(
                "hero_feat3_desc",
                locale === "ar"
                    ? "أكثر من 17 عاماً من التميز"
                    : "17+ years of excellence"
            ),
        ],
    ];

    return (
        <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-32 relative overflow-hidden min-h-screen flex items-center">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3),transparent_60%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20">
                                <Star className="w-4 h-4 text-yellow-400 mr-2 fill-current" />
                                {tr("hero_badge", locale === "ar" ? "التميز القانوني الموثوق" : "Trusted Legal Excellence")}
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {tr("hero_title_1", locale === "ar" ? "شريكك" : "Your Leading")}
                </span>
                                <br />
                                <span className="text-white drop-shadow-lg">
                  {tr("hero_title_2", locale === "ar" ? "القانوني في الإمارات" : "Legal Partner in the UAE")}
                </span>
                            </h1>
                        </div>

                        <p className="text-xl leading-relaxed text-blue-100 max-w-2xl font-light">
                            {tr(
                                "hero_desc",
                                locale === "ar"
                                    ? "في ليبرال للمحاماة، نفخر بكوننا شريكك القانوني الرائد في دولة الإمارات. يجمع فريقنا بين الخبرة المحلية العميقة ونهج يضع العميل أولاً، لنقدم حلولاً قانونية شاملة مصممة خصيصاً لاحتياجاتك. سواء كنت فرداً أو شركة، نلتزم بمرافقتك في كل تحدٍ قانوني بوضوح واحترافية ونزاهة."
                                    : "At Liberal Lawyers, we take pride in being your leading legal partner in the UAE. Our team combines deep local expertise with a client-focused approach, offering comprehensive legal solutions tailored to your needs. Whether you are an individual or a business, we are committed to guiding you through every legal challenge with clarity, professionalism, and integrity."
                            )}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                href="#contact"
                                variant="light"
                                className="group transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                {tr("hero_btn_consult", locale === "ar" ? "احجز استشارة" : "Schedule Consultation")}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                href="#services"
                                variant="outline-light"
                                className="hover:bg-white/10 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
                            >
                                <Briefcase className="w-5 h-5 mr-2" />
                                {tr("hero_btn_services", locale === "ar" ? "خدماتنا" : "Our Services")}
                            </Button>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl transform rotate-3 scale-105 blur-sm" />

                        <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                            <div className="text-center mb-8 pb-6 border-b border-white/20">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {tr(
                                        "hero_card_title",
                                        locale === "ar" ? "3 أسباب رئيسية لاختيار ليبرال للمحاماة" : "3 Major Reasons to Choose Liberal Lawyers"
                                    )}
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    {tr("hero_card_sub", locale === "ar" ? "شريكك القانوني الموثوق" : "Your trusted legal partners")}
                                </p>
                            </div>

                            <ul className="space-y-8">
                                {features.map(([IconComponent, title, subtitle], index) => (
                                    <li
                                        key={title}
                                        className="group flex items-start gap-5 hover:scale-105 transition-all duration-300"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        <div className="relative">
                                            <div className="bg-gradient-to-br from-white/30 to-white/10 p-4 rounded-2xl border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300">
                                                <IconComponent className="w-6 h-6 text-white drop-shadow-sm" />
                                            </div>
                                            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        <div className="flex-1 pt-1">
                                            <h4 className="font-bold text-xl text-white mb-2 group-hover:text-blue-100 transition-colors">
                                                {title}
                                            </h4>
                                            <p className="text-blue-200 leading-relaxed font-medium">{subtitle}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-white/20 text-center">
                                <div className="inline-flex items-center text-sm text-blue-200">
                                    <Award className="w-4 h-4 mr-2 text-yellow-400" />
                                    {tr("hero_footer_badge", locale === "ar" ? "خبرة قانونية" : "Legal expertise")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/5 to-transparent" />
        </section>
    );
}
