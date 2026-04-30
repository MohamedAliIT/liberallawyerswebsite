@extends('admin.layouts.app')

@section('title', isset($article) ? __('Edit Article') : __('Create Article'))

@section('content')
<form action="{{ isset($article) ? route('admin.articles.update', $article) : route('admin.articles.store') }}"
      method="POST" enctype="multipart/form-data" class="space-y-4">
    @csrf
    @if(isset($article))
        @method('PUT')
    @endif

    <div>
        <label class="block">{{ __('Title (EN)') }}</label>
        <input type="text" name="title_en" value="{{ old('title_en', $article->title_en ?? '') }}"
               class="w-full p-2 border rounded">
        @error('title_en') <p class="text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="block">{{ __('Title (AR)') }}</label>
        <input type="text" name="title_ar" value="{{ old('title_ar', $article->title_ar ?? '') }}"
               class="w-full p-2 border rounded">
        @error('title_ar') <p class="text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="block">{{ __('Excerpt (EN)') }}</label>
        <textarea name="excerpt_en" class="w-full p-2 border rounded">{{ old('excerpt_en', $article->excerpt_en ?? '') }}</textarea>
        @error('excerpt_en') <p class="text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="block">{{ __('Excerpt (AR)') }}</label>
        <textarea name="excerpt_ar" class="w-full p-2 border rounded">{{ old('excerpt_ar', $article->excerpt_ar ?? '') }}</textarea>
        @error('excerpt_ar') <p class="text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="block">{{ __('Body (EN)') }}</label>
        <textarea name="body_en" class="w-full p-2 border rounded h-40">{{ old('body_en', $article->body_en ?? '') }}</textarea>
        @error('body_en') <p class="text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="block">{{ __('Body (AR)') }}</label>
        <textarea name="body_ar" class="w-full p-2 border rounded h-40">{{ old('body_ar', $article->body_ar ?? '') }}</textarea>
        @error('body_ar') <p class="text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="block">{{ __('Featured Image') }}</label>
        <input type="file" name="featured_image" class="w-full">
        @if(isset($article) && $article->featured_image)
            <img src="{{ asset('storage/'.$article->featured_image) }}" alt="" class="mt-2 max-w-xs">
        @endif
        @error('featured_image') <p class="text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="flex items-center space-x-4">
        <label class="block">
            <input type="checkbox" name="is_published" value="1" {{ old('is_published', $article->is_published ?? false) ? 'checked' : '' }}>
            {{ __('Published') }}
        </label>
        <div>
            <label class="block">{{ __('Published At') }}</label>
            <input type="datetime-local" name="published_at"
                   value="{{ old('published_at', isset($article->published_at) ? $article->published_at->format('Y-m-d\TH:i') : '' ) }}"
                   class="p-2 border rounded">
            @error('published_at') <p class="text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div>
        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">
            {{ isset($article) ? __('Update Article') : __('Create Article') }}
        </button>
    </div>
</form>
@endsection
