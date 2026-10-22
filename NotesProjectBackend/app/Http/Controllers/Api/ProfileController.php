<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $recentNotes = $user->notes()
            ->with('user:id,username')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Note $note) => [
                'id' => $note->id,
                'title' => $note->title,
                'excerpt' => str($note->content)->limit(160)->toString(),
                'username' => $note->user->username,
                'created_at' => $note->created_at,
                'updated_at' => $note->updated_at,
            ]);

        $recentSavedNotes = $user->savedNotes()
            ->with('user:id,username')
            ->latest('saved_notes.created_at')
            ->limit(5)
            ->get()
            ->map(fn (Note $note) => [
                'id' => $note->id,
                'title' => $note->title,
                'excerpt' => str($note->content)->limit(160)->toString(),
                'username' => $note->user->username,
                'created_at' => $note->created_at,
                'updated_at' => $note->updated_at,
            ]);

        return response()->json([
            'data' => [
                'username' => $user->username,
                'joined_at' => $user->created_at,
                'notes_count' => $user->notes()->count(),
                'saved_notes_count' => $user->savedNotes()->count(),
                'recent_notes' => $recentNotes,
                'recent_saved_notes' => $recentSavedNotes,
            ],
        ]);
    }
}
