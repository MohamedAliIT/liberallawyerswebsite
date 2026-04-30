import React, { useEffect, useState, useRef } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { Globe, ArrowUp, Clock, Menu, X } from 'lucide-react';

/* ─────────────── Enhanced Floating LOGO with animations ─────────────── */
function FloatingLogo({ anchorRef, src = '/images/logo-icon.png', imgHeight = 100, title = 'Liberal Lawyers' }) {
    const [pos, setPos] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const logoRef = useRef(null);

    useEffect(() => {
        const update = () => {
            const el = anchorRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            setPos({ top: r.top, left: r.left, width: r.width, height: r.height });
        };

        update();

        const ro = new ResizeObserver(update);
        if (anchorRef.current) ro.observe(anchorRef.current);

        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, { passive: true });

        return () => {
            ro.disconnect();
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update);
        };
    }, [anchorRef]);

    // Mouse tracking for magnetic effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!logoRef.current || !isHovered) return;

            const rect = logoRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.05; // subtle
            const deltaY = (e.clientY - centerY) * 0.05;

            setMousePos({ x: deltaX, y: deltaY });
        };

        if (isHovered) {
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
        } else {
            setMousePos({ x: 0, y: 0 });
        }

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isHovered]);

    // Scroll-based visibility
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsVisible(scrollY < 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!pos) return null;

    const top = pos.top + (pos.height - imgHeight) / 2;
    const left = pos.left;

    return createPortal(
        <div
            className={`fixed pointer-events-none transition-all duration-500 ease-out ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
            }`}
            style={{
                top,
                left,
                zIndex: 2147483000,
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            }}
        >
            {/* Background glow effect */}
            <div
                className="absolute inset-0 rounded-full animate-glow-pulse opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
                    filter: 'blur(10px)',
                    transform: 'scale(1.8)',
                    zIndex: -2,
                }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-float-particles"
                        style={{
                            top: `${15 + i * 20}%`,
                            left: `${25 + i * 25}%`,
                            animationDelay: `${i * 1.2}s`,
                            animationDuration: `${4 + i * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            <Link
                href="/"
                className="pointer-events-auto block group relative z-10"
                title={title}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    ref={logoRef}
                    src={src}
                    alt={title}
                    style={{ height: imgHeight, width: 'auto' }}
                    className="block transition-all duration-300 ease-out
                     group-hover:scale-110 group-hover:brightness-110
                     animate-float logo-shadow"
                />

                {/* Hover ripple effect */}
                <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                        isHovered ? 'scale-150 opacity-20' : 'scale-100 opacity-0'
                    }`}
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                        transform: `scale(${isHovered ? '1.5' : '1'})`,
                        zIndex: -1,
                    }}
                />
            </Link>
        </div>,
        document.body
    );
}

export default function MainLayout({ title = '', children }) {
    const { props, url } = usePage();
    const { flash = {}, locale = 'en', t = {} } = props;

    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [closeInfo, setCloseInfo] = useState({ label: '', isOpen: false });

    const dropdownRef = useRef(null);
    const logoAnchorRef = useRef(null);

    /* =========================================================
     * ✅ Language Switching (Fixed & Centralized)
     * ========================================================= */

    const LANGUAGES = [
        { code: 'en', native: 'English' },
        { code: 'ar', native: 'العربية' },
        { code: 'de', native: 'Deutsch' },
    ];

    const isValidLang = (code) => LANGUAGES.some((l) => l.code === code);

    // Normalize backend locale into safe app lang
    const currentLang = isValidLang(locale) ? locale : 'en';

    // Simple translation helper (fallback to provided fallback)
    const tr = (key, fallback) => (t && typeof t === 'object' && t[key] ? t[key] : fallback);

    // Ensure page direction is correct
    useEffect(() => {
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;
    }, [currentLang]);

    const changeLanguage = (code) => {
        const next = isValidLang(code) ? code : 'en';

        setLangDropdownOpen(false);
        setMobileNavOpen(false);

        // Visit backend route that sets session locale.
        // preserveScroll keeps user position; preserveState avoids reinitializing state unnecessarily.
        router.visit(`/lang/${next}`, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    /* =========================================================
     * Hash scrolling with sticky header offset
     * ========================================================= */
    useEffect(() => {
        const HEADER_OFFSET = 90;

        const scrollToHash = () => {
            const raw = window.location.hash;
            if (!raw) return;
            const id = raw.replace(/^#/, '');
            const el = document.getElementById(id);
            if (!el) return;

            const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
            window.scrollTo({ top: y, behavior: 'smooth' });
        };

        const onInertiaSuccess = () => setTimeout(scrollToHash, 0);

        scrollToHash();
        window.addEventListener('hashchange', scrollToHash, { passive: true });
        document.addEventListener('inertia:success', onInertiaSuccess);

        return () => {
            window.removeEventListener('hashchange', scrollToHash);
            document.removeEventListener('inertia:success', onInertiaSuccess);
        };
    }, []);

    // Outside click to close language dropdown
    useEffect(() => {
        const close = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLangDropdownOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    // Scroll-top button visibility
    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 350);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* =========================================================
     * "Closes in …" timer (Dubai workweek)
     * ========================================================= */
    const buildCloseInfo = () => {
        const now = new Date();
        const day = now.getDay(); // 0=Sun
        const h = now.getHours();
        const m = now.getMinutes();

        const schedule = {
            0: { open: 8, close: 18 }, // Sun
            1: { open: 8, close: 18 }, // Mon
            2: { open: 8, close: 18 }, // Tue
            3: { open: 8, close: 18 }, // Wed
            4: { open: 8, close: 18 }, // Thu
            5: { open: 8, close: 12 }, // Fri
            6: null, // Sat off
        };

        const today = schedule[day];
        const trLocal = (enStr, arStr) => (currentLang === 'ar' ? arStr : enStr);

        if (!today) return { label: trLocal('Closed today', 'مغلق اليوم'), isOpen: false };

        const nowMin = h * 60 + m;
        const openMin = today.open * 60;
        const closeMin = today.close * 60;

        if (nowMin < openMin) {
            const diff = openMin - nowMin;
            const hh = Math.floor(diff / 60);
            const mm = diff % 60;
            return {
                label: trLocal(
                    `Opens in ${hh ? `${hh}h ` : ''}${mm}m`,
                    `يفتح خلال ${hh ? `${hh}س ` : ''}${mm}د`
                ),
                isOpen: false,
            };
        }

        if (nowMin >= closeMin) return { label: trLocal('Closed now', 'مغلق الآن'), isOpen: false };

        const diff = closeMin - nowMin;
        const hh = Math.floor(diff / 60);
        const mm = diff % 60;

        return {
            label: trLocal(
                `Closes in ${hh ? `${hh}h ` : ''}${mm}m`,
                `يغلق خلال ${hh ? `${hh}س ` : ''}${mm}د`
            ),
            isOpen: true,
        };
    };

    useEffect(() => {
        setCloseInfo(buildCloseInfo());
        const tmr = setInterval(() => setCloseInfo(buildCloseInfo()), 60_000);
        return () => clearInterval(tmr);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLang]);

    const onHome = url === '/' || url.startsWith('/#');
    const makeHref = (hash) => (onHome ? `#${hash}` : `/#${hash}`);

    // Navbar items
    const navItems = [
        [tr('home', currentLang === 'ar' ? 'الرئيسية' : 'Home'), onHome ? '#' : '/'],
        [tr('about', currentLang === 'ar' ? 'من نحن' : 'About'), makeHref('about')],
        [tr('services', currentLang === 'ar' ? 'خدماتنا' : 'Services'), makeHref('services')],
        [tr('contact', currentLang === 'ar' ? 'اتصل بنا' : 'Contact'), makeHref('contact')],
        [
            <div
                key="file-case"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full border border-primary-200 hover:bg-primary-100 transition-colors"
            >
                <i className="bi bi-file-earmark-text"></i>
                <span>{tr('file_case', currentLang === 'ar' ? 'تقديم دعوى' : 'File a Case')}</span>
            </div>,
            makeHref('FileCase'),
        ],
        [tr('articles', currentLang === 'ar' ? 'المقالات' : 'Articles'), '/articles'],
    ];

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <>
            <Head title={title} />

            {/* Enhanced floating logo styles */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(0.5deg); }
          50% { transform: translateY(-8px) rotate(0deg); }
          75% { transform: translateY(-4px) rotate(-0.5deg); }
        }

        @media (max-width: 640px) {
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-2px) rotate(0.25deg); }
            50% { transform: translateY(-4px) rotate(0deg); }
            75% { transform: translateY(-2px) rotate(-0.25deg); }
          }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1.8); }
          50% { opacity: 0.6; transform: scale(2.2); }
        }

        @keyframes float-particles {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-6px) translateX(1px) rotate(90deg); opacity: 0.8; }
          50% { transform: translateY(-12px) translateX(0px) rotate(180deg); opacity: 0.6; }
          75% { transform: translateY(-6px) translateX(-1px) rotate(270deg); opacity: 0.8; }
        }

        @media (max-width: 640px) {
          @keyframes float-particles {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-6px) translateX(0px) rotate(180deg); opacity: 0.6; }
          }
        }

        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        .animate-float-particles { animation: float-particles 6s ease-in-out infinite; }

        .logo-shadow {
          filter: drop-shadow(0 6px 15px rgba(0, 0, 0, 0.1))
                  drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08));
        }

        .logo-shadow:hover {
          filter: drop-shadow(0 12px 25px rgba(0, 0, 0, 0.15))
                  drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))
                  drop-shadow(0 0 15px rgba(59, 130, 246, 0.2));
        }

        @media (max-width: 640px) {
          .logo-shadow {
            filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))
                    drop-shadow(0 1px 4px rgba(0, 0, 0, 0.06));
          }
          .logo-shadow:hover {
            filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12))
                    drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08))
                    drop-shadow(0 0 10px rgba(59, 130, 246, 0.15));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-glow-pulse, .animate-float-particles { animation: none; }
        }

        @media (max-width: 480px) {
          .xs\\:hidden { display: none !important; }
          .xs\\:inline { display: inline !important; }
        }
      `}</style>

            {/* ----------------------------- Top bar -------------------------- */}
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
                <div className="container mx-auto">
                    {/* Mobile View */}
                    <div className="block sm:hidden px-4 py-3">
                        <div className="flex justify-between items-center mb-2">
                            <a href="tel:+97143283000" className="flex items-center gap-2 text-white hover:text-blue-400">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <i className="bi bi-telephone-fill text-xs" />
                                </div>
                                <span className="text-sm">+971 4 328 3000</span>
                            </a>

                            <a href="mailto:info@liberallawyers.com" className="flex items-center gap-2 text-white hover:text-blue-400">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <i className="bi bi-envelope-fill text-xs" />
                                </div>
                                <span className="text-sm">info@liberallawyers.com</span>
                            </a>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-white">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <Clock size={14} className="text-blue-400" />
                                </div>
                                <span className="text-xs">{currentLang === 'ar' ? 'الأحد–الخميس 8 ص–6 م' : 'Sun–Thu 8 AM–6 PM'}</span>
                            </div>

                            <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                                    closeInfo.isOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                }`}
                            >
                                <Clock size={14} />
                                <span className="text-xs">{closeInfo.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden sm:grid sm:grid-cols-2 gap-2 py-3 px-4 text-white/90 text-sm">
                        <div className="flex items-center gap-6">
                            <a href="tel:+97143283000" className="flex items-center gap-2 hover:text-blue-400">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <i className="bi bi-telephone-fill text-xs" />
                                </div>
                                <span>+971 4 328 3000</span>
                            </a>
                            <a href="mailto:info@liberallawyers.com" className="flex items-center gap-2 hover:text-blue-400">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <i className="bi bi-envelope-fill text-xs" />
                                </div>
                                <span>info@liberallawyers.com</span>
                            </a>
                        </div>

                        <div className="flex items-center justify-end gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <Clock size={14} className="text-blue-400" />
                                </div>
                                <span>{currentLang === 'ar' ? 'الأحد–الخميس 8 ص–6 م' : 'Sun–Thu 8 AM–6 PM'}</span>
                            </div>
                            <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                                    closeInfo.isOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                }`}
                            >
                                <Clock size={14} />
                                <span>{closeInfo.label}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --------------------------- Navbar ----------------------------- */}
            <header className="sticky top-0 z-40 bg-white shadow-sm">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between py-4 px-4">
                        {/* Logo Placeholder (for floating overlay anchor) */}
                        <div ref={logoAnchorRef} className="w-[80px] h-14 shrink-0" aria-hidden />

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <nav className="flex items-center gap-8">
                                {navItems.map(([label, href]) => (
                                    <a key={typeof label === 'string' ? label : href} href={href} className="relative group">
                                        <span className="text-gray-700 font-medium hover:text-blue-600 transition-colors">{label}</span>
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                                    </a>
                                ))}
                            </nav>

                            {/* Language Switcher (EN/AR/DE) */}
                            <div ref={dropdownRef} className="relative">
                                <button
                                    onClick={() => setLangDropdownOpen((o) => !o)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                    type="button"
                                >
                                    <Globe size={18} className="text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">
                    {LANGUAGES.find((l) => l.code === currentLang)?.native ?? 'English'}
                  </span>
                                    <svg
                                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {langDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                                                    currentLang === lang.code ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                                }`}
                                            >
                                                <span className="flex-1">{lang.native}</span>
                                                {currentLang === lang.code && (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* CTA Button */}
                            <a
                                href={makeHref('contact')}
                                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-medium overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                            >
                <span className="relative z-10 flex items-center gap-2">
                  {tr('cta_free_consultation', currentLang === 'ar' ? 'احصل على استشارة مجانية' : 'Get Free Consultation')}
                    <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform" />
                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileNavOpen((o) => !o)}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                            type="button"
                        >
                            {mobileNavOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileNavOpen ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className="bg-gray-50 border-t border-gray-100 px-4 py-6 space-y-6">
                        <nav className="space-y-4">
                            {navItems.map(([label, href]) => (
                                <a
                                    key={typeof label === 'string' ? label : href}
                                    href={href}
                                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>

                        <div className="space-y-4">
                            <div className="px-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {tr('select_language', currentLang === 'ar' ? 'اختر اللغة' : 'Select Language')}
                                </label>
                                <select
                                    value={currentLang}
                                    onChange={(e) => changeLanguage(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.native}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <a
                                href={makeHref('contact')}
                                className="block bg-blue-600 text-white text-center px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                onClick={() => setMobileNavOpen(false)}
                            >
                                {tr('cta_free_consultation', currentLang === 'ar' ? 'احصل على استشارة مجانية' : 'Get Free Consultation')}
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* -------------------------- Flash messages ---------------------- */}
            {Object.keys(flash).length > 0 && (
                <div className="container mx-auto px-4 mt-6">
                    {Object.entries(flash).map(([type, msg]) => (
                        <div
                            key={type}
                            className={`p-4 rounded-lg mb-4 text-sm animate-in slide-in-from-top duration-300 ${
                                type === 'success'
                                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                                    : type === 'error'
                                        ? 'bg-red-50 border border-red-300 text-red-800'
                                        : 'bg-blue-50 border border-blue-300 text-blue-800'
                            }`}
                        >
                            {msg}
                        </div>
                    ))}
                </div>
            )}

            {/* ----------------------------- Content ------------------------- */}
            <main>{children}</main>

            {/* Floating logo overlay */}
            <FloatingLogo
                anchorRef={logoAnchorRef}
                imgHeight={100}
                title={tr('site_title', 'Liberal Lawyers')}
            />

            {/* ------------------------- Scroll to top ----------------------- */}
            {showScrollTop && (
                <button
                    onClick={scrollTop}
                    aria-label="Back to top"
                    className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary-700 text-white shadow-lg hover:bg-primary-800 transition-all duration-300 hover:scale-110 animate-bounce"
                    type="button"
                >
                    <ArrowUp size={20} />
                </button>
            )}
        </>
    );
}
