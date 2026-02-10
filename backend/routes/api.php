<?php

use Illuminate\Support\Facades\Route; // <--- VITAL: Add this import
use App\Http\Controllers\API\FurnitureController;


Route::get('/furniture', [FurnitureController::class, 'index']);
