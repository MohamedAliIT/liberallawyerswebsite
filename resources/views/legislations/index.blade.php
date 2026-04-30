@extends('layouts.app')

@section('title', 'التشريعات (قطاع ' . $sector . ')')

@section('content')
<div class="mx-auto max-w-6xl px-4 py-8 space-y-8" dir="rtl">
    {{-- Hero / Header --}}
    <section class="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-600 to-cyan-500 text-white p-6 sm:p-8">
        <div class="relative z-10">
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
                التشريعات الإماراتية — قطاع <span class="underline decoration-white/60 decoration-2">{{ $sector }}</span>
            </h1>
            <p class="mt-2 text-white/90">
                استعرض قائمة التشريعات وروابطها الرسمية على منصة التشريعات الإماراتية.
            </p>
        </div>
        <div class="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        <div class="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl"></div>
    </section>

    {{-- Filters --}}
    <section class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <form method="GET" class="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div class="sm:col-span-3">
                <label class="block text-sm mb-1 text-slate-600">بحث بالعنوان</label>
                <div class="relative">
                    <input type="text" name="q" value="{{ $q }}"
                           class="w-full rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 pe-10"
                           placeholder="ابحث عن تشريع…">
                    <svg xmlns="http://www.w3.org/2000/svg" class="absolute top-2.5 end-3 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>

            <div>
                <label class="block text-sm mb-1 text-slate-600">القطاع</label>
                <input type="number" name="sector" min="1" value="{{ $sector }}"
                       class="w-full rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div class="flex gap-2 sm:justify-end">
                <button class="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition">
                    تطبيق
                </button>
                @if($q || $sector)
                    <a href="{{ route('legislations.index') }}"
                       class="inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-medium hover:bg-slate-50 transition">
                       إعادة الضبط
                    </a>
                @endif
            </div>
        </form>

        {{-- Small stats --}}
        <div class="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                إجمالي النتائج: <strong class="text-slate-900">{{ $items->total() }}</strong>
            </span>
            @if($q)
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                عبارة البحث: <strong class="text-slate-900">“{{ $q }}”</strong>
            </span>
            @endif
        </div>
    </section>

    {{-- Results --}}
    @if($items->count() === 0)
        <div class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 grid place-items-center">
                <span class="text-slate-400 text-xl">🔎</span>
            </div>
            <h3 class="font-semibold text-slate-800">لا توجد نتائج</h3>
            <p class="text-slate-500 mt-1">جرّب كلمات مفتاحية مختلفة أو أزل بعض عوامل التصفية.</p>
        </div>
    @else
        <div class="grid sm:grid-cols-2 gap-4">
            @foreach($items as $law)
                <article class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                    <div class="absolute -top-16 end-0 w-40 h-40 rounded-full bg-blue-50 blur-2xl opacity-0 group-hover:opacity-100 transition"></div>

                    <h2 class="font-semibold leading-7 text-slate-900 mb-2">
                        {{ $law->title }}
                    </h2>

                    <dl class="text-sm text-slate-600 space-y-1 mb-4">
                        <div class="flex gap-2">
                            <dt class="text-slate-500">القطاع:</dt>
                            <dd>{{ $law->sector ?? '—' }}</dd>
                        </div>
                        <div class="flex gap-2">
                            <dt class="text-slate-500">السنة:</dt>
                            <dd>{{ $law->year ?? '—' }}</dd>
                        </div>
                        <div class="flex gap-2">
                            <dt class="text-slate-500">الرقم:</dt>
                            <dd>{{ $law->number ?? '—' }}</dd>
                        </div>
                    </dl>

                    <div class="flex items-center gap-2">
                        <a href="{{ $law->source_url }}" target="_blank"
                           class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-3 py-2 font-medium hover:bg-emerald-700 transition">
                            اقرأ على المنصة الرسمية
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 -rotate-45" viewBox="0 0 24 24" fill="none">
                                <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                            </svg>
                        </a>

                        <button type="button"
                                data-copy="{{ $law->source_url }}"
                                class="copy-btn inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-medium hover:bg-slate-50 transition">
                            نسخ الرابط
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <path d="M9 9h7a2 2 0 0 1 2 2v7M5 15V8a2 2 0 0 1 2-2h7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </article>
            @endforeach
        </div>

        {{-- Pagination --}}
        <nav class="mt-6 flex flex-wrap gap-2">
            @foreach ($items->onEachSide(1)->links()->elements[0] ?? [] as $link)
                {{-- سنستخدم الروابط الجاهزة من Laravel بشكل مبسّط --}}
            @endforeach

            {{-- استخدام روابط Laravel الافتراضية --}}
            <div class="w-full">
                {{ $items->onEachSide(1)->links('vendor.pagination.tailwind') }}
            </div>
        </nav>
    @endif
</div>

{{-- Copy-to-clipboard --}}
<script>
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const url = btn.getAttribute('data-copy');
    if (!url) return;

    navigator.clipboard.writeText(url).then(() => {
        const old = btn.innerHTML;
        btn.innerHTML = '✓ تم النسخ';
        btn.classList.add('bg-emerald-50','border-emerald-200');
        setTimeout(() => {
            btn.innerHTML = old;
            btn.classList.remove('bg-emerald-50','border-emerald-200');
        }, 1400);
    });
});
</script>
@endsection
