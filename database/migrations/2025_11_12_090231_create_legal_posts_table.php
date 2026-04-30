<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('legal_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // الكاتب (محامٍ)
            $table->string('slug')->unique();
            $table->string('title_ar')->nullable();
            $table->string('title_en')->nullable();
            $table->string('excerpt_ar', 600)->nullable();
            $table->string('excerpt_en', 600)->nullable();
            $table->longText('body_html_ar')->nullable(); // احفظ HTML الناتج من المحرر
            $table->longText('body_html_en')->nullable();
            $table->string('cover_path')->nullable();
            $table->string('status', 20)->default('draft'); // draft|scheduled|published
            $table->unsignedSmallInteger('reading_time')->default(0);
            $table->json('tags')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legal_posts');
    }
};
