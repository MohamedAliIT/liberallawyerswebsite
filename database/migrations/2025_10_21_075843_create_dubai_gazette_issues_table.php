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
        Schema::create('dubai_gazette_issues', function (Blueprint $table) {
        $table->id();
        $table->unsignedSmallInteger('year')->index();
        $table->unsignedSmallInteger('issue_no')->nullable()->index();
        $table->string('title')->nullable();
        $table->string('viewer_url');      // PDFViewer.aspx?file=...
        $table->string('pdf_url')->nullable();
        $table->date('published_at')->nullable();
        $table->json('meta')->nullable();
        $table->timestamps();

        $table->unique(['year', 'issue_no']); // اختياري، احذفه إن كان غير مضمون
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dubai_gazette_issues');
    }
};
