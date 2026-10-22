<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            User::create(['username' => 'alice', 'password' => Hash::make('password123')]),
            User::create(['username' => 'bob', 'password' => Hash::make('password123')]),
            User::create(['username' => 'charlie', 'password' => Hash::make('password123')]),
        ];

        $notesSample = [
            ['title' => 'Tips Produktivitas Harian', 'content' => 'Fokus pada 3 tugas utama setiap pagi sebelum melihat surel.'],
            ['title' => 'Resep Kopi Sore', 'content' => 'Seduh dengan rasio 1:15 air suhu 92 C untuk hasil seimbang.'],
            ['title' => 'Daftar Bacaan Teknologi', 'content' => 'Arsitektur microservices, Clean Code, dan pola desain GoF.'],
            ['title' => 'Ide Proyek Aplikasi Catatan', 'content' => 'Membuat platform catatan sosial dengan antarmuka glassmorphism.'],
            ['title' => 'Rencana Liburan', 'content' => 'Menikmati akhir pekan di pantai bersama keluarga.'],
            ['title' => 'Catatan Belajar Laravel', 'content' => 'Gunakan Eloquent relationships untuk mempermudah relasi antar tabel.'],
            ['title' => 'Prinsip UI/UX', 'content' => 'Gunakan kontras yang cukup dan berikan umpan balik instan untuk interaksi.'],
        ];

        foreach ($users as $index => $user) {
            Note::create([
                'user_id' => $user->id,
                'title' => $notesSample[$index * 2]['title'],
                'content' => $notesSample[$index * 2]['content'],
            ]);

            Note::create([
                'user_id' => $user->id,
                'title' => $notesSample[$index * 2 + 1]['title'],
                'content' => $notesSample[$index * 2 + 1]['content'],
            ]);
        }
    }
}
