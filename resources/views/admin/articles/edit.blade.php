{{-- resources/views/admin/articles/edit.blade.php --}}
@extends('admin.layouts.app')

@section('title', __('Edit Article'))

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ __('Edit Article') }}</h1>
        <a href="{{ route('admin.articles.index') }}" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            {{ __('Back to Articles List') }}
        </a>
    </div>

    <form action="{{ route('admin.articles.update', $article) }}"
          method="POST"
          enctype="multipart/form-data"
          class="space-y-6 bg-white p-6 shadow rounded">
        @csrf
        @method('PUT')

        <div>
            <label class="block font-semibold mb-1">{{ __('Title (EN)') }}</label>
            <input type="text"
                   name="title_en"
                   value="{{ old('title_en', $article->title_en) }}"
                   class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                   required>
            @error('title_en')
                <p class="text-red-600 mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block font-semibold mb-1">{{ __('Title (AR)') }}</label>
            <input type="text"
                   name="title_ar"
                   value="{{ old('title_ar', $article->title_ar) }}"
                   class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                   required dir="rtl">
            @error('title_ar')
                <p class="text-red-600 mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block font-semibold mb-1">{{ __('Excerpt (EN)') }}</label>
            <textarea name="excerpt_en"
                      class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3">{{ old('excerpt_en', $article->excerpt_en) }}</textarea>
            @error('excerpt_en')
                <p class="text-red-600 mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block font-semibold mb-1">{{ __('Excerpt (AR)') }}</label>
            <textarea name="excerpt_ar"
                      class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3" dir="rtl">{{ old('excerpt_ar', $article->excerpt_ar) }}</textarea>
            @error('excerpt_ar')
                <p class="text-red-600 mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block font-semibold mb-1">{{ __('Body (EN)') }}</label>
            <textarea name="body_en"
                      class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="8"
                      required>{{ old('body_en', $article->body_en) }}</textarea>
            @error('body_en')
                <p class="text-red-600 mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block font-semibold mb-1">{{ __('Body (AR)') }}</label>
            <textarea name="body_ar"
                      class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="8"
                      dir="rtl"
                      required>{{ old('body_ar', $article->body_ar) }}</textarea>
            @error('body_ar')
                <p class="text-red-600 mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label class="block font-semibold mb-1">{{ __('Featured Image') }}</label>
            <input type="file" name="featured_image" class="w-full">
            @if($article->featured_image)
                <div class="mt-2">
                    <img src="{{ asset('storage/'.$article->featured_image) }}"
                         alt="Featured image"
                         class="max-w-xs border rounded">
                </div>
            @endif
            @error('featured_image')
                <p class="text-red-600 mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div class="flex flex-wrap items-center space-x-4 space-y-2">
            <label class="flex items-center">
                <input type="checkbox"
                       name="is_published"
                       value="1"
                       {{ old('is_published', $article->is_published) ? 'checked' : '' }}
                       class="h-4 w-4 text-blue-600 border-gray-300 rounded">
                <span class="ml-2">{{ __('Published') }}</span>
            </label>

            <div class="flex flex-col">
                <label class="block font-semibold mb-1">{{ __('Published At') }}</label>
                <input type="datetime-local"
                       name="published_at"
                       value="{{ old('published_at', optional($article->published_at)->format('Y-m-d\TH:i') ) }}"
                       class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                @error('published_at')
                    <p class="text-red-600 mt-1">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <div>
            <button type="submit"
                    class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                {{ __('Update Article') }}
            </button>
        </div>
    </form>
</div>
@endsection
