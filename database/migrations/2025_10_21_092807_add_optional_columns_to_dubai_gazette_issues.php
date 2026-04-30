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
        Schema::table('dubai_gazette_issues', function (Blueprint $table) {
               if (!Schema::hasColumn('dubai_gazette_issues', 'pdf_local_path')) {
                $table->string('pdf_local_path')->nullable()->after('pdf_url');
            }
            if (!Schema::hasColumn('dubai_gazette_issues', 'thumb_url')) {
                $table->string('thumb_url')->nullable()->after('pdf_local_path');
            }
            if (!Schema::hasColumn('dubai_gazette_issues', 'cover_url')) {
                $table->string('cover_url')->nullable()->after('thumb_url');
            }
            if (!Schema::hasColumn('dubai_gazette_issues', 'pages')) {
                $table->unsignedInteger('pages')->nullable()->after('cover_url');
            }
            if (!Schema::hasColumn('dubai_gazette_issues', 'source_url')) {
                $table->string('source_url')->nullable()->after('viewer_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dubai_gazette_issues', function (Blueprint $table) {
                        foreach (['pdf_local_path','thumb_url','cover_url','pages','source_url'] as $col) {
                if (Schema::hasColumn('dubai_gazette_issues', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
