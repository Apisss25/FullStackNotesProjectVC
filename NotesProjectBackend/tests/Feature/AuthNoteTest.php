<?php

namespace Tests\Feature;

use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthNoteTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
    }

    /** @test */
    public function guest_can_view_public_notes(): void
    {
        Note::factory()->count(3)->create();

        $response = $this->get('/api/notes');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data.data');
    }

    /** @test */
    public function authenticated_user_can_view_their_own_notes(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'password' => Hash::make('password123'),
        ]);
        Note::factory()->count(3)->create(['user_id' => $user->id]);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->get('/api/my-notes', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data.data');
    }

    /** @test */
    public function authenticated_user_can_view_saved_notes(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser2',
            'password' => Hash::make('password123'),
        ]);
        $otherNote = Note::factory()->create(['user_id' => User::factory()->create(['username' => 'other'])->id]);
        $user->savedNotes()->attach($otherNote->id);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->get('/api/saved-notes', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data');
    }

    /** @test */
    public function registered_user_can_login(): void
    {
        $user = User::factory()->create([
            'username' => 'loginuser',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->post('/api/login', [
            'username' => 'loginuser',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    /** @test */
    public function login_fails_with_invalid_credentials(): void
    {
        $response = $this->post('/api/login', [
            'username' => 'nonexistent',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Username atau password salah']);
    }

    /** @test */
    public function authenticated_user_cannot_save_own_note(): void
    {
        $user = User::factory()->create([
            'username' => 'savetest',
            'password' => Hash::make('password123'),
        ]);
        $ownNote = Note::factory()->create(['user_id' => $user->id]);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->post("/api/notes/{$ownNote->id}/save", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(422)
            ->assertJson(['message' => 'Tidak bisa menyimpan catatan sendiri']);
    }

    /** @test */
    public function authenticated_user_can_save_other_users_note(): void
    {
        $otherUser = User::factory()->create([
            'username' => 'saveuser',
            'password' => Hash::make('password123'),
        ]);
        $otherNote = Note::factory()->create(['user_id' => User::factory()->create(['username' => 'owner'])->id]);

        $token = $otherUser->createToken('nextjs')->plainTextToken;
        $response = $this->post("/api/notes/{$otherNote->id}/save", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['message' => 'Catatan berhasil disimpan']]);
    }

    /** @test */
    public function duplicate_save_idempotent(): void
    {
        $user = User::factory()->create([
            'username' => 'dupuser',
            'password' => Hash::make('password123'),
        ]);
        $note = Note::factory()->create(['user_id' => User::factory()->create(['username' => 'owner2'])->id]);
        $user->savedNotes()->attach($note->id);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->post("/api/notes/{$note->id}/save", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJson(['data' => ['message' => 'Catatan sudah tersimpan']]);
    }

    /** @test */
    public function authenticated_user_can_unsave_note(): void
    {
        $user = User::factory()->create([
            'username' => 'unsaveuser',
            'password' => Hash::make('password123'),
        ]);
        $note = Note::factory()->create(['user_id' => User::factory()->create(['username' => 'owner3'])->id]);
        $user->savedNotes()->attach($note->id);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->delete("/api/notes/{$note->id}/save", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJson(['data' => ['message' => 'Catatan batal disimpan']]);
    }

    /** @test */
    public function authenticated_user_cannot_update_others_note(): void
    {
        $user = User::factory()->create([
            'username' => 'cantupdate',
            'password' => Hash::make('password123'),
        ]);
        $otherNote = Note::factory()->create(['user_id' => User::factory()->create(['username' => 'ownernote'])->id]);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->put("/api/notes/{$otherNote->id}", [
            'title' => 'edited',
            'content' => 'content',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function authenticated_user_cannot_delete_others_note(): void
    {
        $user = User::factory()->create([
            'username' => 'cantdelete',
            'password' => Hash::make('password123'),
        ]);
        $otherNote = Note::factory()->create(['user_id' => User::factory()->create(['username' => 'ownernote2'])->id]);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->delete("/api/notes/{$otherNote->id}", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function authenticated_user_can_update_own_note(): void
    {
        $user = User::factory()->create([
            'username' => 'canupdate',
            'password' => Hash::make('password123'),
        ]);
        $note = Note::factory()->create(['user_id' => $user->id]);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->put("/api/notes/{$note->id}", [
            'title' => 'updated title',
            'content' => 'updated content',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJson(['data' => ['title' => 'updated title']]);
    }

    /** @test */
    public function authenticated_user_can_delete_own_note(): void
    {
        $user = User::factory()->create([
            'username' => 'candelete',
            'password' => Hash::make('password123'),
        ]);
        $note = Note::factory()->create(['user_id' => $user->id]);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->delete("/api/notes/{$note->id}", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJson(['data' => ['message' => 'Catatan berhasil dihapus']]);

        $this->assertDatabaseMissing('notes', ['id' => $note->id]);
    }

    /** @test */
    public function authenticated_user_can_view_profile(): void
    {
        $user = User::factory()->create([
            'username' => 'proftest',
            'password' => Hash::make('password123'),
        ]);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->get('/api/profile', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['username', 'joined_at', 'notes_count', 'saved_notes_count', 'recent_notes', 'recent_saved_notes']]);
    }

    /** @test */
    public function profile_excludes_password(): void
    {
        $user = User::factory()->create([
            'username' => 'proftest2',
            'password' => Hash::make('password123'),
        ]);

        $token = $user->createToken('nextjs')->plainTextToken;
        $response = $this->get('/api/profile', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertDontSee('password')
            ->assertDontSee('hash');
    }

    /** @test */
    public function logout_invalidates_token(): void
    {
        $user = User::factory()->create([
            'username' => 'logouttest',
            'password' => Hash::make('password123'),
        ]);

        $token = $user->createToken('nextjs')->plainTextToken;

        $response = $this->post('/api/logout', [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200);

        $tokensCount = $user->tokens()->count();
        $this->assertEquals(0, $tokensCount);
    }
}
