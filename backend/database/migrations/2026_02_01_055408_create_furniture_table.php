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
    Schema::create('furniture', function (Blueprint $table) {
        $table->id();
        $table->string('name');          // e.g., "Modern Sofa"
        $table->string('category');      // e.g., "Seating", "Tables"
        $table->string('model_url');     // Link to the .glb file
        $table->string('thumbnail_url')->nullable(); // Preview image

        // Dimensions for the "fit-check" feature in your thesis
        $table->float('width')->default(1.0);
        $table->float('height')->default(1.0);
        $table->float('depth')->default(1.0);

        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('furniture');
    }
};
