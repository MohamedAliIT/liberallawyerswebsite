<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale()=='ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - لوحة الإدارة</title>
    @vite(['resources/css/app.css','resources/js/app.js'])
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex">
        <aside class="w-64 bg-white shadow-md">
            <div class="p-4 font-semibold text-lg">لوحة الإدارة</div>
            <nav class="p-4">
                <ul>
                    <li><a href="{{ route('admin.articles.index') }}" class="block py-2">المقالات / Articles</a></li>
                    <!-- أضف عناصر القائمة الأخرى -->
                </ul>
            </nav>
        </aside>
        <div class="flex-1 p-6">
            @if(session('success'))
                <div class="mb-4 bg-green-100 text-green-800 p-4 rounded">
                    {{ session('success') }}
                </div>
            @endif
            
            @yield('content')
        </div>
    </div>
</body>
</html>
