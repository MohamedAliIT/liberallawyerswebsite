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
  Schema::create('legislation_files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('legis_id');             // رقم التشريع في الموقع
            $table->string('lang', 5)->default('ar');           // ar|en
            $table->unsignedSmallInteger('year')->nullable();   // 1960..2100 أو NULL
            $table->string('title', 600)->nullable();           // عنوان التشريع (إن توفر)
            $table->string('number', 50)->nullable();           // رقم (مثال 25/1)
            $table->string('source_url', 2048)->nullable();     // رابط التحميل أو التفاصيل
            // يُخزّن دومًا نسبةً إلى storage/app (بدون "app/")
            $table->string('local_path', 2048)->nullable();     // مثال: "uae_legislation/unknown/2118-ar.pdf"
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('sha1', 40)->nullable();
            $table->timestamp('downloaded_at')->nullable();
            $table->timestamps();

            $table->unique(['legis_id', 'lang']);
            $table->index('year');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legislation_files');
    }
};
