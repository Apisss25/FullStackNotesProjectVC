<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

Route::get('/notes', [NoteController::class, 'index']);
Route::get('/notes/{note}', [NoteController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/my-notes', [NoteController::class, 'myNotes']);
    Route::get('/saved-notes', [NoteController::class, 'savedNotes']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::post('/notes/{note}/save', [NoteController::class, 'save']);
    Route::delete('/notes/{note}/save', [NoteController::class, 'unsave']);
    Route::put('/notes/{note}', [NoteController::class, 'update']);
    Route::delete('/notes/{note}', [NoteController::class, 'destroy']);
});
