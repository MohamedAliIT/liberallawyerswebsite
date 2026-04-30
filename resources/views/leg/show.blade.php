<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>تفاصيل الملف #{{ $file->id }}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:24px}a{color:#0a7}</style>
</head>
<body>
  <p><a href="{{ route('leg.index') }}">← رجوع</a></p>
  <h1>تفاصيل الملف #{{ $file->id }}</h1>

  <ul>
    <li><b>legis_id:</b> {{ $file->legis_id }}</li>
    <li><b>اللغة:</b> {{ $file->lang }}</li>
    <li><b>السنة:</b> {{ $file->year ?? '—' }}</li>
    <li><b>العنوان:</b> {{ $file->title ?? '—' }}</li>
    <li><b>الرقم:</b> {{ $file->number ?? '—' }}</li>
    <li><b>المصدر:</b> @if($file->source_url)<a href="{{ $file->source_url }}" target="_blank">فتح المصدر</a>@else — @endif</li>
    <li><b>المسار المحلي:</b> {{ $file->local_path }}</li>
    <li><b>الحجم:</b> {{ $file->size_bytes ? number_format($file->size_bytes) . ' B' : '—' }}</li>
    <li><b>SHA1:</b> {{ $file->sha1 ?? '—' }}</li>
    <li><b>تاريخ التنزيل:</b> {{ $file->downloaded_at ?? '—' }}</li>
  </ul>

  <p><a href="{{ route('leg.pdf', $file) }}" target="_blank">فتح PDF داخل النظام</a></p>
</body>
</html>
