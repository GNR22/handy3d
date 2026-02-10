<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Furniture;

class FurnitureController extends Controller
{
    public function index()
    {
        // This returns the furniture list from Neon as JSON
        return response()->json(Furniture::all());
    }
}
