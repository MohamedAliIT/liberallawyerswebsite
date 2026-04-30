<?php

namespace App\Console\Commands;

use App\Models\ConstitutionModification;
use Illuminate\Console\Command;

class DownloadConstitutionMods extends Command
{
    protected $signature = 'download:constitution-mods';
    protected $description = 'Download and save constitution modifications';

    public function handle()
    {
        $this->info("=== UAE Constitution Modifications Downloader ===");

        $years = [1971, 1972, 1976, 1981, 1986, 1991, 1996, 2004, 2009, 2023];

        foreach ($years as $year) {
            $this->line("\n>>> Fetching year $year");

            $script = base_path("scripts/fetch_constitution_mods_final.mjs");

            $cmd = "node \"$script\" $year";
            $output = shell_exec($cmd);

            if (!$output) {
                $this->error("Node returned no output.");
                continue;
            }

            $decoded = json_decode($output, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->error("INVALID JSON returned for $year");
                continue;
            }

            if (!isset($decoded["items"])) {
                $this->error("No items returned for year $year");
                continue;
            }

            foreach ($decoded["items"] as $item) {
                ConstitutionModification::updateOrCreate(
                    [
                        "year" => $year,
                        "title" => $item["title"]
                    ],
                    [
                        "date" => $item["date"],
                        "pdf_url" => $item["pdf"],
                        "body_html" => $item["body_html"]
                    ]
                );
            }

            $this->info("Saved {$decoded["count"]} items for $year");
        }

        $this->info("\n=== DONE ===");
        return 0;
    }
}
