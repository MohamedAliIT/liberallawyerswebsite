@component('mail::message')
# 📩 New Contact Inquiry

**Name:** {{ $data['name'] }}  
**Email:** {{ $data['email'] }}  
**Phone:** {{ $data['phone'] ?? 'N/A' }}  
**Subject:** {{ $data['subject'] }}

---

{{ $data['message'] }}

---

Thanks,  
**Liberal Lawyers Website**
@endcomponent
