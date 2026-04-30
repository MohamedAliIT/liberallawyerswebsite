<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>ملفات التشريعات</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:24px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #eee}a{color:#0a7}</style>
</head>
<body>
  <h1>ملفات التشريعات (تم تنزيلها)</h1>

  <form method="get" style="margin:16px 0; display:flex; gap:8px; flex-wrap:wrap">
    <input type="text" name="q" placeholder="بحث بالعنوان/الرقم/ID" value="{{ $filters['q'] ?? '' }}">
    <select name="lang">
      <option value="">كل اللغات</option>
      <option value="ar" @selected(($filters['lang'] ?? '')==='ar')>ar</option>
      <option value="en" @selected(($filters['lang'] ?? '')==='en')>en</option>
    </select>
    <input type="number" name="year" placeholder="السنة" value="{{ $filters['year'] ?? '' }}">
    <button type="submit">تطبيق</button>
    <a href="{{ route('leg.index') }}">إعادة الضبط</a>
  </form>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>legis_id</th>
        <th>اللغة</th>
        <th>السنة</th>
        <th>العنوان</th>
        <th>الرقم</th>
        <th>الحجم</th>
        <th>عرض</th>
      </tr>
    </thead>
    <tbody>
      @forelse($files as $f)
        <tr>
          <td>{{ $f->id }}</td>
          <td>{{ $f->legis_id }}</td>
          <td>{{ $f->lang }}</td>
          <td>{{ $f->year ?? '—' }}</td>
          <td style="max-width:420px">{{ $f->title }}</td>
          <td>{{ $f->number }}</td>
          <td>{{ $f->size_bytes ? number_format($f->size_bytes) . ' B' : '—' }}</td>
          <td>
            <a href="{{ route('leg.show', $f) }}">تفاصيل</a> •
            <a href="{{ route('leg.pdf', $f) }}" target="_blank">فتح PDF</a>
          </td>
        </tr>
      @empty
        <tr><td colspan="8">لا توجد ملفات.</td></tr>
      @endforelse
    </tbody>
  </table>

  <div style="margin-top:16px">
    {{ $files->links() }}
  </div>
</body>
</html>
