# Frontend - Website Catatan Sosial

Aplikasi frontend untuk website catatan sosial berbasis Next.js 15 dengan React 18, Tailwind CSS v4, dan glassmorphism design.

## Tech Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **React**: 18.3.1
- **Styling**: Tailwind CSS v4, CSS Variables
- **Icons**: Lucide React
- **Date**: date-fns
- **Fonts**: Bitter (heading), Poppins (body) via Google Fonts

## Persyaratan

- Node.js 18.x atau lebih baru
- npm 9.x atau lebih baru
- Backend API berjalan di `http://localhost:8000` (atau sesuai `NEXT_PUBLIC_API_BASE_URL`)

## Instalasi

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Konfigurasi environment (opsional):**

   Buat file `.env.local` di root folder jika backend berjalan di URL berbeda:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

3. **Jalankan development server:**

   ```bash
   npm run dev
   ```

   Aplikasi akan buka di [http://localhost:3000](http://localhost:3000).

## Scripts

| Script       | Deskripsi                                    |
|--------------|----------------------------------------------|
| `npm run dev`   | Jalankan server development                  |
| `npm run build` | Build aplikasi untuk production              |
| `npm start`     | Jalankan server production setelah build     |
| `npm run lint`  | Lint kode dengan ESLint                      |

## Struktur Folder

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── layout.jsx          # Root layout (fonts, metadata)
│   ├── page.jsx            # Beranda (/)
│   ├── login/              # Login page
│   ├── register/           # Register page
│   ├── my-notes/           # Catatan saya (protected)
│   ├── saved/              # Catatan tersimpan (protected)
│   ├── profile/            # Profil (protected)
│   ├── notes/[id]/         # Detail catatan (public + protected actions)
│   └── globals.css         # Global CSS (Tailwind, tokens, glassmorphism)
├── components/
│   ├── icons.jsx           # Icon wrappers (Lucide)
│   ├── layout/             # Sidebar, Topbar, AppShell
│   ├── notes/              # NoteForm
│   ├── ui/                 # Button, Input, Card, Dialog, Skeleton, Toast
│   ├── PlaceholderPage.jsx # Template untuk halaman placeholder
│   └── RequireAuth.jsx     # Protected route wrapper
├── context/
│   └── AuthContext.jsx     # Global auth state + session restore
└── lib/
    ├── api.js              # API client + token management + 401 handler
    └── validation.js       # Form validators
```

## Fitur Utama

### 1. **Autentikasi**
- Register (validasi username 3-20 karakter, password min 8)
- Login dengan pemulihan sesi otomatis (`GET /api/me`)
- Logout dengan penghapusan token
- Redirect ke login saat 401 (global handler)

### 2. **Mode Guest**
- Bisa lihat daftar catatan publik dan detail catatan
- Tombol simpan terkunci (klik → notifikasi + redirect ke login)
- Semua menu sidebar tampil tetapi terkunci dengan ikon gembok

### 3. **CRUD Catatan** (User Login)
- Buat catatan baru (form validasi title max 150, content wajib)
- Edit catatan sendiri (dari daftar atau detail)
- Hapus dengan dialog konfirmasi
- Daftar catatan milik sendiri dengan pagination

### 4. **Simpan Catatan Orang Lain**
- Simpan/batal simpan dari beranda atau detail
- Halaman catatan tersimpan dengan pagination
- Tombol disabled untuk guest

### 5. **Profil**
- Username, tanggal bergabung
- Statistik: jumlah catatan, jumlah tersimpan
- 5 catatan terbaru (catatan saya + tersimpan)
- Tombol segarkan data

### 6. **Responsive Design**
- Desktop (>=768px): sidebar tetap di samping
- Mobile (<768px): tombol ☰ membuka drawer dari kiri
- Drawer tertutup saat klik menu, area luar, atau Esc
- Glassmorphism dengan blur diturunkan ke 10px di mobile

### 7. **UX Polish**
- Loading skeleton untuk semua halaman
- Empty state dengan CTA
- Toast notification (success, error, info)
- Error handling 404, 422, 401
- Semua form input punya label, error, hint, dan accessible
- Focus visible dengan ring hijau
- `prefers-reduced-motion` support

## API Endpoints yang Dipakai

| Method | Endpoint                  | Keterangan                              |
|--------|---------------------------|-----------------------------------------|
| POST   | `/api/register`           | Daftar akun baru                        |
| POST   | `/api/login`              | Login, dapat token                      |
| POST   | `/api/logout`             | Logout, hapus token (auth)              |
| GET    | `/api/me`                 | Restore session (auth)                  |
| GET    | `/api/notes`              | Daftar catatan publik (pagination)      |
| GET    | `/api/notes/:id`          | Detail catatan (public + is_saved jika login) |
| POST   | `/api/notes`              | Buat catatan (auth)                     |
| PUT    | `/api/notes/:id`          | Edit catatan (auth, owner only)         |
| DELETE | `/api/notes/:id`          | Hapus catatan (auth, owner only)        |
| GET    | `/api/my-notes`           | Catatan milik user (auth, pagination)   |
| GET    | `/api/saved-notes`        | Catatan tersimpan (auth, pagination)    |
| POST   | `/api/notes/:id/save`     | Simpan catatan (auth)                   |
| DELETE | `/api/notes/:id/save`     | Batal simpan (auth)                     |
| GET    | `/api/profile`            | Profil + statistik + 5 terbaru (auth)   |

## Alur Testing Manual (F7)

1. **Guest melihat beranda:** Buka `/`, catatan publik tampil, tombol simpan terkunci.
2. **Register:** Buka `/register`, isi form, submit → redirect `/login`.
3. **Login:** Isi username + password → redirect `/` → sidebar menu aktif.
4. **Buat catatan:** Klik "Tulis catatan" → isi form → simpan → muncul di `/my-notes`.
5. **Edit catatan:** Dari `/my-notes` klik Edit atau dari `/notes/:id` klik "Edit catatan" → form terbuka → simpan.
6. **Hapus catatan:** Klik Hapus → dialog konfirmasi → hapus → catatan hilang.
7. **Buka catatan orang lain:** Dari `/` klik catatan → `/notes/:id` → klik Simpan → status berubah.
8. **Lihat catatan tersimpan:** Menu "Catatan Tersimpan" → `/saved` → daftar muncul → klik "Hapus dari tersimpan".
9. **Lihat profil:** Menu "Profil" → `/profile` → statistik, 5 terbaru tampil.
10. **Logout:** Klik Logout → toast "Kamu sudah keluar" → mode guest.
11. **Responsif:** Resize ke 360px, 768px, 1280px → sidebar jadi drawer di HP.
12. **401 handling:** Token kedaluwarsa → auto redirect ke login dengan `?redirect=...`.
13. **Console:** Buka DevTools → tidak ada error merah.
14. **XSS:** Isi catatan dengan `<script>alert('xss')</script>` → tampil sebagai teks, bukan dieksekusi.

## Catatan Development

- **XSS Protection:** Isi catatan ditampilkan dengan `whitespace-pre-wrap` di `<p>`, React escape otomatis.
- **Token Management:** Disimpan di `localStorage`, disisipkan otomatis lewat `apiClient`.
- **401 Global Handler:** Event listener di `AuthContext` untuk handle unauthorized dari mana saja.
- **Font Loading:** `display=swap` untuk mencegah FOUT.
- **Skeleton:** Ditampilkan saat `loading` atau `authLoading` untuk UX lebih halus.

## Build untuk Production

```bash
npm run build
npm start
```

Aplikasi siap di [http://localhost:3000](http://localhost:3000).

## Troubleshooting

**Token tidak tersimpan:**
- Pastikan `localStorage` tidak diblokir (incognito/private mode).

**401 terus-menerus:**
- Cek backend CORS (`FRONTEND_URL` di `.env` backend).
- Pastikan backend Sanctum sudah dikonfigurasi untuk stateless (token).

**Catatan tidak muncul:**
- Cek backend berjalan di `http://localhost:8000`.
- Lihat Network tab DevTools untuk response error.

**Drawer tidak muncul di mobile:**
- Pastikan lebar layar <768px (atau zoom in di DevTools).
- Cek console untuk error JavaScript.

---

Dokumentasi lengkap MVP: lihat `README.md` di root project.
