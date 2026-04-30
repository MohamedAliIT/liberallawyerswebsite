<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLegalPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    protected function prepareForValidation(): void
    {
        $tags = $this->input('tags', null);

        if (is_string($tags)) {
            $decoded = json_decode($tags, true);
            if (is_array($decoded)) {
                $tags = $decoded;
            } elseif (trim($tags) !== '') {
                $tags = array_values(array_filter(array_map('trim', explode(',', $tags))));
            } else {
                $tags = null;
            }
        }

        if ($tags === null && $this->filled('tags_csv')) {
            $tags = array_values(array_filter(array_map('trim', explode(',', (string) $this->input('tags_csv')))));
        }

        $this->merge([
            'tags' => $tags,
            'status' => $this->input('status', 'draft'),
        ]);
    }

    public function rules(): array
    {
        return [
            'title_ar'       => ['nullable','string','max:255'],
            'title_en'       => ['nullable','string','max:255'],
            'excerpt_ar'     => ['nullable','string','max:600'],
            'excerpt_en'     => ['nullable','string','max:600'],
            'body_html_ar'   => ['nullable','string'],
            'body_html_en'   => ['nullable','string'],

            'status'         => ['required','in:draft,published'],

            'tags'           => ['nullable','array'],
            'tags.*'         => ['string','max:40'],

            'cover'          => ['nullable','image','mimes:jpg,jpeg,png,webp','max:2048'],
        ];
    }
}
