@extends('admin.layouts.app')

@section('title', __('Articles List'))

@section('content')
<div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">{{ __('Articles') }}</h1>
    <a href="{{ route('admin.articles.create') }}" class="px-4 py-2 bg-blue-600 text-white rounded">
        {{ __('Create New Article') }}
    </a>
</div>

<table class="w-full bg-white shadow overflow-hidden sm:rounded-lg">
    <thead>
        <tr class="bg-gray-50">
            <th class="px-4 py-2">{{ __('Title (EN)') }}</th>
            <th class="px-4 py-2">{{ __('Title (AR)') }}</th>
            <th class="px-4 py-2">{{ __('Published') }}</th>
            <th class="px-4 py-2">{{ __('Actions') }}</th>
        </tr>
    </thead>
    <tbody>
        @foreach($articles as $article)
        <tr class="border-t">
            <td class="px-4 py-2">{{ $article->title_en }}</td>
            <td class="px-4 py-2">{{ $article->title_ar }}</td>
            <td class="px-4 py-2">{{ $article->is_published ? __('Yes') : __('No') }}</td>
            <td class="px-4 py-2">
                <a href="{{ route('admin.articles.edit', $article) }}" class="text-blue-600">{{ __('Edit') }}</a>
                <form action="{{ route('admin.articles.destroy', $article) }}" method="POST" class="inline-block" onsubmit="return confirm('{{ __('Are you sure?') }}');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="text-red-600 ml-2">{{ __('Delete') }}</button>
                </form>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="mt-4">
    {{ $articles->links() }}
</div>
@endsection
