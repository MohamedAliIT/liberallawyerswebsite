<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactInquiryReceived;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function store(Request $request)
    {
        // Debug log (check storage/logs/laravel.log after submitting)
        Log::info('✅ Contact form submitted', $request->all());

        // Validate input
        $data = $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email',
            'phone'   => 'nullable|string|max:30',
            'subject' => 'required|string|max:120',
            'message' => 'required|string|max:2000',
        ]);

        try {
            // Send email to your office inbox
            Mail::to('info@liberallawyers.com')
                ->send(new ContactInquiryReceived($data));

            Log::info('✅ Contact email sent successfully to info@liberallawyers.com');
        } catch (\Exception $e) {
            // Log failure for debugging
            Log::error('❌ Failed to send contact email: ' . $e->getMessage());
            return back()->with('error', 'Something went wrong, please try again later.');
        }

        // Flash success message back to SPA (Inertia)
        return back()->with('success', 'Thanks – we’ll get back to you within one business day.');
    }
}
