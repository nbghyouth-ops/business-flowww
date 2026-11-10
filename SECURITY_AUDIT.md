# SECURITY_AUDIT — source review, bukan pentest

## Patch yang dilakukan pada revisi ini

- Password minimum 15 dan maksimum 128 karakter, tanpa aturan komposisi paksa; beberapa password umum ditolak. Daftar belum setara breached-password corpus.
- Rate-limit identifiers yang mengandung email/IP disimpan sebagai SHA-256 digest.
- Kode OTP development tidak dikirim ke response ketika `NODE_ENV=production` atau `VERCEL=1`; provider email tetap belum tersedia.
- Body JSON dan multipart dibaca dengan batas byte saat streaming, bukan mengandalkan `Content-Length` saja.
- Session listing dan pencabutan sesi lain dibatasi ke akun yang sedang login; sesi sendiri harus dicabut melalui Logout.
- Global scheduler dikunci oleh `CRON_SECRET` dengan constant-time comparison dan rate limit; secret wajib ada dan tidak ada fail-open.
- Database bootstrap memakai transaction-scoped advisory lock di dalam satu transaksi sehingga lock tidak bergantung pada session affinity di PgBouncer transaction pooling.

## Temuan yang masih menghalangi production

- `DATABASE_URL` yang sama dipakai untuk bootstrap privileged dan operasi sistem. Bootstrap membuat role, policy, trigger, dan grants; runtime/migration identities belum dipisahkan. Ini bertentangan dengan least privilege dan harus ditangani sebelum menyimpan data client.
- `withSystem` adalah privilege boundary yang sangat luas; semua pemanggil perlu ditinjau dan akses admin dipisahkan dari tenant request.
- Auth masih app-managed, belum Neon Auth/email provider/Google OAuth/MFA; blocklist password masih terbatas.
- Tidak ada migration SQL berversi; DDL bootstrap dilakukan saat runtime.
- Upload tidak melakukan antivirus atau image re-encoding.
- Belum ada CI/SAST/DAST, pentest, accessibility/performance audit, maupun backup restore drill.

Tidak ada audit pihak ketiga. Tidak ada jaminan zero bug. Jangan gunakan untuk production sampai seluruh temuan berisiko tinggi ditutup dan diverifikasi.
