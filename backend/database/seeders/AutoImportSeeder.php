<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AutoImportSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Point to the Frontend folder where files live
        // We go up (..) from backend to reach frontend
        $path = base_path('../frontend/public/models');

        // Check if folder exists
        if (!File::exists($path)) {
            $this->command->error("Could not find folder: $path");
            return;
        }

        // 2. Get all .glb files
        $files = File::files($path);

        $count = 0;
        foreach ($files as $file) {
            $filename = $file->getFilename();

            // Skip non-glb files
            if ($file->getExtension() !== 'glb') continue;

            // 3. Smart Naming
            // "Modern_Sofa.glb" becomes "Modern Sofa"
            $cleanName = str_replace(['_', '-'], ' ', $file->getFilenameWithoutExtension());
            $cleanName = ucwords($cleanName); // Capitalize First Letters

            // 4. Guess Category (Optional Logic)
            $category = 'General';
            if (stripos($cleanName, 'Chair') !== false) $category = 'Chairs';
            if (stripos($cleanName, 'Bed') !== false) $category = 'Bedroom';
            if (stripos($cleanName, 'Table') !== false) $category = 'Tables';
            if (stripos($cleanName, 'Sofa') !== false) $category = 'Living Room';
            if (stripos($cleanName, 'Lamp') !== false) $category = 'Lighting';

            // 5. Insert into Database (Avoid duplicates)
            DB::table('furniture')->updateOrInsert(
                ['model_url' => '/models/' . $filename], // Check if this file exists
                [
                    'name' => $cleanName,
                    'category' => $category,
                    'width' => 1.0, // Default placeholders
                    'height' => 1.0,
                    'depth' => 1.0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            $count++;
        }

        $this->command->info("Successfully imported $count furniture items!");
    }
}
