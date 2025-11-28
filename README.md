# Audit Chain AI

Audit Chain AI adalah aplikasi web modern untuk manajemen audit organisasi yang terintegrasi dengan kecerdasan buatan dan teknologi blockchain. Aplikasi ini dirancang untuk membantu organisasi dalam mengelola transaksi, anggota, divisi, dan proyek dengan fitur pelaporan AI yang canggih.

## Fitur Utama

### Dashboard
- Ringkasan statistik organisasi
- Grafik dan visualisasi data real-time
- Monitoring performa audit

### Manajemen Anggota
- Tambah, edit, dan hapus anggota organisasi
- Sistem role-based (Admin, Treasurer, Auditor, Member)
- Manajemen izin akses

### Transaksi
- Pencatatan transaksi masuk dan keluar
- Riwayat transaksi lengkap
- Detail transaksi dengan informasi lengkap

### Laporan AI
- Generasi laporan otomatis menggunakan AI
- Analisis data transaksi
- Rekomendasi berdasarkan pola audit

### Blockchain Ledger
- Integrasi dengan teknologi blockchain
- Catatan transaksi yang tidak dapat diubah
- Verifikasi keamanan data

### Divisi & Proyek
- Pengelolaan divisi organisasi
- Manajemen proyek audit
- Tracking progress dan status

## Teknologi

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod

## Prasyarat

- Node.js (versi 18 atau lebih baru)
- npm atau bun package manager
- Backend API server (lihat dokumentasi backend)

## Instalasi & Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd audit-chain-ai-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   bun install
   ```

3. **Konfigurasi environment**
   - Salin file `.env.example` ke `.env`
   - Isi variabel environment yang diperlukan:
     ```
     VITE_API_BASE_URL=http://localhost:3001/api
     VITE_ORG_ID=your-org-id
     ```

4. **Jalankan development server**
   ```bash
   npm run dev
   # atau
   bun run dev
   ```

5. **Buka browser**
   - Aplikasi akan berjalan di `http://localhost:5173`

## Scripts Yang Tersedia

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run build:dev` - Build untuk development
- `npm run preview` - Preview production build
- `npm run lint` - Jalankan ESLint

## Struktur Proyek

```
src/
├── components/          # Komponen reusable
│   ├── ui/             # Komponen ShadCN UI
│   └── ...
├── pages/              # Halaman aplikasi
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── AddMember.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utilities dan helpers
└── assets/             # Gambar dan file statis
```

## Konfigurasi

### Environment Variables
- `VITE_API_BASE_URL`: URL base untuk API backend
- `VITE_ORG_ID`: ID organisasi default

### API Integration
Aplikasi ini terintegrasi dengan backend API. Pastikan backend server berjalan dan dapat diakses.

## Kontak

- Project Link: [GitHub Repository]
- Email: your-email@example.com

## Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
