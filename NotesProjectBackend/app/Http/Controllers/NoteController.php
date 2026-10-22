<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Note::query()->latest('is_pinned')->latest();
        if ($request->filled('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', '%' . $request->search . '%')->orWhere('content', 'like', '%' . $request->search . '%'));
        }
        return view('notes.index', ['notes' => $query->get(), 'search' => $request->search]);
    }

    public function store(Request $request)
    {
        Note::create($request->validate(['title' => ['required', 'string', 'max:120'], 'content' => ['nullable', 'string'], 'color' => ['nullable', 'string', 'max:20']]));
        return redirect()->route('notes.index');
    }

    public function update(Request $request, Note $note)
    {
        $note->update($request->validate(['title' => ['required', 'string', 'max:120'], 'content' => ['nullable', 'string'], 'color' => ['nullable', 'string', 'max:20'], 'is_pinned' => ['sometimes', 'boolean']]));
        return redirect()->route('notes.index');
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return redirect()->route('notes.index');
    }
}
