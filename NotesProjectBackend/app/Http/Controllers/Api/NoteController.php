<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    public function index(): JsonResponse
    {
        $notes = Note::with('user:id,username')
            ->latest()
            ->paginate(10);

        $notes->through(fn (Note $note) => $this->listItem($note));

        return response()->json(['data' => $notes]);
    }

    public function show(Request $request, Note $note): JsonResponse
    {
        $note->load('user:id,username');

        $data = [
            'id' => $note->id,
            'title' => $note->title,
            'content' => $note->content,
            'username' => $note->user->username,
            'created_at' => $note->created_at,
            'updated_at' => $note->updated_at,
        ];

        $user = Auth::guard('sanctum')->user();

        if ($user) {
            $data['is_mine'] = $user->id === $note->user_id;
            $data['is_saved'] = $user->savedNotes()->where('note_id', $note->id)->exists();
        }

        return response()->json(['data' => $data]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'content' => ['required', 'string'],
        ]);

        $note = $request->user()->notes()->create($validated);
        $note->load('user:id,username');

        return response()->json(['data' => $this->listItem($note)], 201);
    }

    public function myNotes(Request $request): JsonResponse
    {
        $notes = $request->user()->notes()
            ->with('user:id,username')
            ->latest()
            ->paginate(10);

        $notes->through(fn (Note $note) => $this->listItem($note));

        return response()->json(['data' => $notes]);
    }

    public function save(Request $request, Note $note): JsonResponse
    {
        if ($request->user()->id === $note->user_id) {
            return response()->json(['message' => 'Tidak bisa menyimpan catatan sendiri'], 422);
        }

        $alreadySaved = $request->user()->savedNotes()->where('note_id', $note->id)->exists();

        if ($alreadySaved) {
            return response()->json(['data' => ['message' => 'Catatan sudah tersimpan']]);
        }

        $request->user()->savedNotes()->attach($note->id);

        return response()->json(['data' => ['message' => 'Catatan berhasil disimpan']], 201);
    }

    public function unsave(Request $request, Note $note): JsonResponse
    {
        $request->user()->savedNotes()->detach($note->id);

        return response()->json(['data' => ['message' => 'Catatan batal disimpan']]);
    }

    public function savedNotes(Request $request): JsonResponse
    {
        $notes = $request->user()->savedNotes()
            ->with('user:id,username')
            ->latest('saved_notes.created_at')
            ->paginate(10);

        $notes->through(fn (Note $savedNote) => $this->listItem($savedNote));

        return response()->json(['data' => $notes]);
    }

    public function update(Request $request, Note $note)
    {
        $this->ensureOwner($request, $note);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'content' => ['required', 'string'],
        ]);

        $note->update($validated);
        $note->load('user:id,username');

        return response()->json(['data' => $this->listItem($note)]);
    }

    public function destroy(Request $request, Note $note): JsonResponse
    {
        $this->ensureOwner($request, $note);
        $note->delete();

        return response()->json(['data' => ['message' => 'Catatan berhasil dihapus']]);
    }

    private function ensureOwner(Request $request, Note $note): void
    {
        abort_unless($request->user()->id === $note->user_id, 403, 'Anda tidak memiliki akses ke catatan ini');
    }

    private function listItem(Note $note): array
    {
        return [
            'id' => $note->id,
            'title' => $note->title,
            'excerpt' => str($note->content)->limit(160)->toString(),
            'username' => $note->user->username,
            'created_at' => $note->created_at,
            'updated_at' => $note->updated_at,
        ];
    }
}
