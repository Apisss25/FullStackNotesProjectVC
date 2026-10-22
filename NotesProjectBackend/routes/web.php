<?php

use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/notes');
Route::resource('notes', NoteController::class)->only(['index', 'store', 'update', 'destroy']);
