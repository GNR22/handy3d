<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Furniture;

class FurnitureSeeder extends Seeder
{
    public function run(): void
    {
       $items = [
            [
                'name' => 'King Size Bed',
                'category' => 'Bedroom',
                'model_url' => '/models/BedKing.glb', // <--- Must match filename EXACTLY
                'width' => 2.0, 'height' => 1.2, 'depth' => 2.1,
            ],
            [
                'name' => 'Luxury Bathtub',
                'category' => 'Bathroom',
                'model_url' => '/models/Bathtub.glb', // <--- Must match filename EXACTLY
                'width' => 1.7, 'height' => 0.6, 'depth' => 0.8,
            ],
            [
                'name' => 'Modern Sofa',
                'category' => 'Living Room',
                'model_url' => '/models/sofa.glb',    // <--- This one was already correct
                'width' => 2.0, 'height' => 0.9, 'depth' => 1.0,
            ],
        ];

        foreach ($items as $item) {
            Furniture::create($item);
        }
    }
}
