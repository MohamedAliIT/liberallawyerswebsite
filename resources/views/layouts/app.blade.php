<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'موقعي')</title>

    {{-- اختياري: ستايل خفيف للتجربة فقط --}}
    <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Noto Sans",Tahoma,Arial,sans-serif;background:#f6f7fb;color:#111;margin:0}
        .container{max-width:1100px;margin:0 auto;padding:24px}
        a{color:#2563eb;text-decoration:none}
        a:hover{text-decoration:underline}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px}
        .grid{display:grid;gap:16px}
        @media (min-width:640px){.grid-2{grid-template-columns:repeat(2,minmax(0,1fr));}}
        .btn{display:inline-block;background:#059669;color:#fff;padding:8px 12px;border-radius:8px}
        .btn:hover{opacity:.9}
        input,select,button{border:1px solid #d1d5db;border-radius:8px;padding:8px 10px}
        label{color:#6b7280;font-size:.9rem}
    </style>
</head>
<body>
    <div class="container">
        @yield('content')
    </div>
</body>
</html>
