# Blockers — Business Flow

**Status keseluruhan: BELUM SIAP PRODUKSI / BELUM CLIENT-READY.** Tabel ini membedakan source implementation dari integrasi yang benar-benar dapat dipakai.

| Item | Status saat ini | Syarat penutupan |
|---|---|---|
| Neon database/provisioning | Belum dihubungkan; source hanya menerima `DATABASE_URL` untuk PostgreSQL | Pemilik mengotorisasi akun Neon, membuat database/branch, memilih region/plan, memverifikasi connection string dan biaya |
| Neon Auth / app-managed auth | Source menggunakan scrypt + session sendiri; bukan Neon Auth | Putuskan provider resmi; integrasikan migrasi akun, linking, verification/reset, session, dan QA |
| Email verifikasi/reset | **Kode selesai & teruji:** nodemailer via `SMTP_*`; OTP tidak pernah ada di body JSON; mode dev hanya via header `X-Dev-OTP` (NODE_ENV != production); produksi tanpa SMTP menolak registrasi/reset (503). Diverifikasi E2E dan uji produksi dengan SMTP sink lokal. **Sisa:** SMTP provider nyata belum dikonfigurasi | Isi `SMTP_*` dengan provider nyata; domain/sender terautentikasi (SPF/DKIM/DMARC); bounce/retry/monitoring; uji kirim ke inbox sungguhan |
| Google login | Belum aktif | Google Identity Services, OAuth client, callback/origin, server-side ID token validation, secure linking, QA cancellation/failure |
| MFA/passkey untuk privileged | Belum diimplementasikan | TOTP/passkey/step-up policy untuk owner/superadmin/high-risk operation |
| Password blocklist | Policy min 15/max 128 sudah diterapkan; daftar kata sandi umum masih kecil dan statis | Integrasikan blocklist kompromi cukup luas dan audit KDF cost/rehash |
| DB role separation | **Blocker keamanan tinggi:** bootstrap DDL/CREATE ROLE dan query `withSystem` memakai pool yang sama dari `DATABASE_URL`; runtime credential terpisah belum ada | Jalankan schema provisioning via migrator/operator; pisahkan URL/role migrasi (DDL) dan runtime (least privilege); audit setiap `withSystem` privileged path |
| Versioned SQL migrations | **Selesai:** `drizzle/0000..0003` + `npm run db:migrate` (`scripts/migrate.mjs`), teruji pada DB kosong. `drizzle-kit push` tidak lagi dipakai (gagal idempoten karena bug diff constraint). Belum: uji upgrade dari DB lama berisi data & rollback | Uji upgrade pada salinan DB produksi; untuk DB lama hasil `push`, tandai baseline sudah diterapkan sebelum migrasi berikutnya; rencana rollback/restore |
| Worker scheduler | Endpoint publik lama sudah diamankan; `/api/cron` sekarang menuntut Bearer `CRON_SECRET`, secret dapat dibuat via Vercel CLI script | Link project, jalankan `npm run vercel:cron-secret`, redeploy, konfirmasi cron berjalan dan observability tersedia |
| Neon Object Storage | Fallback file ada di PostgreSQL (batas ukuran/kuota sesuai kode); belum memakai object storage privat | Provisioning bucket private, signed URL, lifecycle/retention, isolation, malware scan |
| Upload security | Allowlist MIME/ekstensi, signature (magic bytes), nama kunci acak (UUID), tolak konten aktif & makro: **diaudit, sudah ada**. Belum: re-encode gambar & antivirus | Re-encode raster, malware scanning, uji polyglot, retensi |
| XLSX / PDF server-side | **Selesai:** impor XLSX (`POST /import/batches/xlsx`, sheet pertama, batas 2 MB/5.000 baris, anti zip-bomb, tolak makro) dan PDF server-side (`GET /reports/:type/pdf` via pdfkit, tanpa browser headless). Belum: PDF untuk laporan non-keuangan; ekspor XLSX | Uji formula-injection pada ekspor jika ditambahkan; uji beban file besar |
| Pembelian — retur/kredit pemasok | **Selesai & teruji:** `POST /purchase-orders/:id/return` (alias `/purchases/:id/return`), stok keluar FIFO/rata-rata, jurnal Dr 2100 / Cr 1300, kredit ke tagihan, idempoten, wajib `purchasing:approve`, UI. Belum: dokumen kredit dari pemasok yang berbeda harga dari biaya stok (selisih harga/PPN) | Review akuntan atas perlakuan selisih harga & pajak masukan pada retur |
| Platform admin / break-glass | **Selesai (tanpa MFA):** `/api/admin/*` dengan `ADMIN_TOKEN` (>=32 karakter) + baris `platform_admins` (SUPER_ADMIN), tanpa akses dari browser, semua aksi (termasuk penolakan) di `admin_audit_log` append-only. Fitur: daftar workspace, tampilan dukungan baca-saja (wajib alasan), disable/enable workspace, reset darurat (cabut sesi + kode ke email pengguna), kelola admin. **Tidak ada impersonasi pengguna (disengaja)** | MFA/passkey untuk admin, persetujuan dua orang, rotasi token, rate-limit terdistribusi |
| Multi-currency | **Dasar selesai & teruji:** tabel `exchange_rates`, CRUD, `GET /currency/convert`, laporan laba rugi/neraca `?currency=XXX`, kolom `currency_code` otomatis (trigger) pada jurnal/penjualan/PO/tagihan/retur. Buku besar tetap satu mata uang dasar; baris lama berisi `currency_code` kosong = mata uang workspace | Transaksi dalam mata uang asing (input nominal USD, selisih kurs terealisasi/belum terealisasi, revaluasi) belum ada |
| Backup & restore | Belum ada backup terjadwal atau restore drill yang terbukti | Backup terenkripsi, off-site, retention, monitoring, restore drill, bukti RPO/RTO |
| CI / SAST / DAST | Belum ada pipeline eksternal; repo belum ditautkan ke GitHub di sesi ini | Connect repo, protected branch, dependency/security scanning, static checks, automated tests |
| Android / Capacitor | Belum dibuat | Android build/signing, SDK/Studio, privacy permission review, Play Console account owner |
| Legal/privacy | Dokumentasi dasar ada; bukan legal opinion atau compliance attestation | Review UU PDP/PSE, terms, privacy notice, retention, processor agreements, data residency/transfer |
| Commercial hosting | Belum dipilih/diotorisasi | Pilih Vercel Pro/Enterprise atau host komersial yang sesuai. Vercel Hobby ditujukan untuk personal/non-commercial use |
| Production QA | Typecheck, lint (0 error), build, dan 185 cek E2E hijau di lingkungan sandbox (PostgreSQL 16 lokal). **Belum:** uji browser manual, responsif 375px, aksesibilitas/kontras terukur, performa beban, DAST | Uji manual semua halaman di perangkat nyata; audit aksesibilitas; uji beban; pen-test |

## Dikerjakan di sesi ini (lihat BUILD_STATE.json)
Fase 1, 2, 3 (rate limit, CORS, logging, audit RLS), 4A–4E, 7A–7C, konfirmasi hapus (8F), 10. **Tidak dikerjakan karena butuh akun eksternal:** Fase 5 (Neon Auth) dan Fase 6 (object storage S3/Neon). Caching daftar produk 1 menit **sengaja tidak dibuat** (stok berubah pada tiap penjualan; data basi di POS berbahaya).

## Catatan penting

- `DATABASE_URL` adalah satu-satunya env wajib yang digunakan aplikasi saat ini untuk koneksi database. `CRON_SECRET` diperlukan untuk cron production dan dihasilkan otomatis oleh `scripts/configure-vercel-cron-secret.mjs`, bukan diketik ke `.env`. Integrasi email/Google akan memerlukan konfigurasi resmi bila dipilih.
- File `.env.example` tidak memiliki secret asli. Jangan commit `.env`, token, database dump, atau data pengguna.
- Jangan deploy ke production sampai blocker keamanan tinggi, email verification, migrations, backup, dan QA ditutup.
