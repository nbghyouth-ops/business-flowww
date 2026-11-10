# MANUAL TESTING GUIDE — Business Flow

Dokumen ini disusun dari halaman, route, modul, dan workflow yang ada pada source ZIP yang diserahkan. Jalankan pada deployment Preview menggunakan data uji, bukan data pelanggan. Kolom **Hasil aktual**, **Status**, dan **Catatan** sengaja dibiarkan untuk diisi saat manual testing.

## Status implementasi yang perlu diketahui sebelum mulai

- E2E report yang disertakan di arsip mencatat **107/107 pemeriksaan lulus pada 9 November 2026**. Itu adalah bukti historis dari arsip, bukan pengujian ulang pada paket hasil perbaikan saat ini.
- Email OTP/reset belum memiliki provider email. Kode OTP hanya boleh terlihat pada local development; production/Vercel tidak boleh mengembalikan kode ke browser. Uji alur autentikasi produksi berstatus **BLOCKED** sampai email sender/Neon Auth resmi diintegrasikan.
- Google OAuth belum aktif. Neon Auth/Object Storage/Functions, Android, XLSX, PDF server-side, backup restore drill, CI/SAST/DAST, retur pemasok/kredit pemasok, dan platform admin/break-glass juga belum lengkap.
- `DATABASE_URL` harus mengarah ke PostgreSQL yang dapat dijangkau oleh runtime Vercel. Koneksi PostgreSQL lokal di laptop/sandbox tidak dapat dipakai dari Vercel.
- Jangan memasukkan data pribadi pelanggan/karyawan atau transaksi produksi saat pengujian. Gunakan akun, email, produk, dan nominal fiktif.

## Cara menjalankan

1. Gunakan deployment Preview yang terhubung ke database uji yang terpisah dari produksi.
2. Simpan URL Preview, waktu, browser, OS, ukuran layar dan build/commit yang diuji.
3. Buat minimal dua akun dengan email berbeda dan dua workspace terpisah. Gunakan akun owner, admin, cashier dan role lain yang diperlukan.
4. Jalankan bagian A–H. Untuk fitur eksternal yang belum diintegrasikan, catat `BLOCKED`, jangan mengubahnya menjadi `PASS`.
5. Setelah selesai, isi actual/status/catatan dan lampirkan bug report dari template di bawah.

## Format status

- **PASS**: hasil aktual sama dengan hasil yang diharapkan.
- **FAIL**: hasil aktual berbeda, error, crash, data salah, atau akses yang seharusnya ditolak justru berhasil.
- **BLOCKED**: butuh integrasi, credential, akun layanan atau infrastruktur yang belum tersedia.

## A. Akses awal & autentikasi

| ID Test | Modul | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status | Catatan |
|---|---|---|---|---|---|---|---|
| A-01 | Akses | Buka landing page | Buka URL Preview/Production melalui browser. | Halaman awal tampil, asset tidak 404, tidak ada error fatal di Console. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-02 | Akses | Health endpoint | Buka /api/health. | HTTP 200 dan JSON ok=true hanya jika database/bootstrap benar-benar sehat. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-03 | Registrasi | Validasi email | Daftar memakai email tidak valid. | Server menolak dengan pesan validasi; akun tidak dibuat. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-04 | Registrasi | Password terlalu pendek | Daftar dengan password kurang dari 15 karakter. | Server menolak dengan 422; tidak membuat akun. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-05 | Registrasi | Password umum | Daftar memakai password yang ada di daftar password umum aplikasi. | Server menolak password umum. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-06 | Registrasi | Registrasi valid | Daftar dengan nama, email unik dan password minimal 15 karakter. | Di mode pengembangan lokal, akun dibuat dan kode OTP diberi label mode pengembangan. Di deployment tanpa email sender, tidak ada OTP yang dibocorkan ke browser. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-07 | Registrasi | Email duplikat | Ulangi pendaftaran dengan email yang sama. | Respons generik tidak membocorkan keberadaan akun; tidak membuat akun duplikat. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-08 | Verifikasi email | OTP salah | Masukkan kode yang salah. | Verifikasi ditolak; percobaan tercatat dan dibatasi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-09 | Verifikasi email | OTP benar | Gunakan OTP mode pengembangan lokal. | Email menjadi verified dan akun dapat login. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-10 | Verifikasi email | OTP kedaluwarsa/satu kali | Gunakan kode sesudah 15 menit atau gunakan ulang kode. | Kode ditolak; tidak bisa digunakan kedua kalinya. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-11 | Verifikasi email | Kirim ulang OTP | Tekan Kirim ulang kode beberapa kali. | Kode lama dinonaktifkan; rate limit berlaku; pada produksi kode tidak ditampilkan ke client. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-12 | Verifikasi email | Email OTP produksi | Coba daftar di Vercel tanpa email provider/Neon Auth yang sudah diintegrasikan. | Status BLOCKED: email nyata belum dikirim pada versi arsip; jangan menandai registrasi produksi lulus. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-13 | Login | Login benar | Masuk dengan akun terverifikasi. | Cookie sesi HttpOnly dibuat dan pengguna diarahkan ke aplikasi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-14 | Login | Password salah | Masuk dengan password salah. | Pesan generik; tidak mengungkap apakah email terdaftar. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-15 | Login | Akun belum verifikasi | Login sebelum OTP diverifikasi. | Login ditolak dan diarahkan ke langkah verifikasi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-16 | Login | Akun nonaktif | Uji akun dengan status suspended/deleted melalui fixture admin. | Login ditolak; sesi tidak diterbitkan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-17 | Logout | Logout | Klik Keluar. | Sesi dicabut di database dan cookie dihapus; kembali ke login. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-18 | Login kembali | Persistensi akun | Login ulang menggunakan akun yang sama. | Workspace dan data bisnis yang sebelumnya tersimpan tetap tersedia. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-19 | Lupa password | Permintaan reset lokal | Buka Lupa kata sandi, masukkan email, gunakan OTP mode development lokal. | Kode reset hanya tersedia di lokal development; pada produksi perlu provider email. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-20 | Reset password | Password baru | Gunakan OTP reset valid dan password baru minimal 15 karakter. | Password diganti, semua sesi lama dicabut, login baru menggunakan password baru. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-21 | Google OAuth | Google login | Cari tombol Google login di halaman login. | Status BLOCKED: Google OAuth belum aktif dan tidak boleh diasumsikan berhasil. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-22 | Sesi akun | Daftar perangkat | Login dari dua browser/perangkat lalu buka Pengaturan Bisnis → Sesi akun. | Kedua sesi aktif tampil; sesi saat ini ditandai. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-23 | Sesi akun | Cabut sesi perangkat lain | Dari sesi pertama, cabut sesi kedua. | Sesi kedua ditolak pada permintaan berikutnya; sesi pertama tetap aktif. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| A-24 | Sesi akun | Tidak bisa mencabut sesi sendiri dari daftar | Coba cabut current session melalui endpoint/API. | Ditolak; gunakan tombol Logout untuk mencabut sesi berjalan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |

## B. Workspace, tenant, undangan & peran

| ID Test | Modul | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status | Catatan |
|---|---|---|---|---|---|---|---|
| B-01 | Onboarding | Buat workspace | Login akun baru dan buat workspace dengan nama dan template. | Workspace dibuat; pembuat menjadi owner; data default bisnis/cabang/gudang terbentuk. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-02 | Workspace | Pilih workspace | Buat dua workspace dan ganti dari selector header. | Data dan konteks berpindah sesuai workspace aktif. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-03 | Workspace | Refresh halaman | Ubah workspace aktif lalu refresh. | Workspace aktif dipulihkan dari cookie dan membership server. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-04 | Workspace | Workspace tidak dimiliki | Kirim ID workspace akun lain melalui header x-workspace-id. | Permintaan ditolak 403; data tenant lain tidak muncul. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-05 | Undangan | Buat undangan | Owner/Admin membuka Admin & Keamanan dan undang email anggota dengan role. | Token undangan dibuat dan hanya ditampilkan saat pembuatan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-06 | Undangan | Terima undangan | Login memakai email undangan dan buka tautan/token undangan. | Membership dibuat pada workspace yang sesuai dan role sesuai undangan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-07 | Undangan | Token sekali pakai | Gunakan ulang token undangan yang sudah diterima. | Permintaan kedua ditolak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-08 | Undangan | Cabut undangan | Cabut undangan yang masih pending. | Token tidak lagi dapat dipakai. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-09 | RBAC | Kasir membuka admin | Login sebagai cashier lalu akses API/halaman admin. | Akses ditolak; menu/aksi yang tidak berizin tidak ditawarkan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-10 | RBAC | Kasir membuat jurnal | Login sebagai cashier dan coba POST jurnal. | API menolak 403. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-11 | RBAC | Owner terakhir | Coba menurunkan role atau menghapus satu-satunya owner. | Operasi ditolak untuk mencegah workspace kehilangan owner. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-12 | Modul | Nonaktifkan modul | Matikan satu modul di Pengaturan → Modul, lalu coba akses halaman/API modul tersebut. | Menu tersembunyi/disabled dan API menolak; data tidak dihapus. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| B-13 | Tenant | Isolasi data | Buat produk pada workspace A, lalu coba baca dari workspace B. | Workspace B tidak dapat melihat atau mengubah data A. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |

## C. Dashboard, profil bisnis & konfigurasi

| ID Test | Modul | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status | Catatan |
|---|---|---|---|---|---|---|---|
| C-01 | Dashboard | Ringkasan data | Buka Dashboard setelah ada transaksi dan setelah workspace masih kosong. | Angka bersumber dari database; kondisi kosong menggunakan empty state, bukan data contoh. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-02 | Dashboard | Aksi cepat | Klik setiap aksi cepat yang tampil. | Berpindah ke modul tujuan yang sesuai dengan izin pengguna. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-03 | Dashboard | Notifikasi | Buka ikon notifikasi, tandai dibaca, refresh. | Status baca tersimpan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-04 | Kesiapan | Checklist onboarding | Buka Kesiapan Bisnis dan selesaikan langkah yang relevan. | Progress berubah berdasarkan data nyata yang tersimpan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-05 | Pengaturan bisnis | Profil bisnis | Ubah nama legal, alamat, telepon, email, NPWP lalu simpan. | Data muncul kembali setelah refresh. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-06 | Pengaturan bisnis | Cabang | Tambah cabang dengan kode unik dan data wajib. | Cabang tersimpan dan tampil di daftar. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-07 | Pengaturan bisnis | Gudang | Tambah gudang, hubungkan ke cabang. | Gudang tersimpan; gudang dengan stok tidak boleh dinonaktifkan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-08 | Pengaturan bisnis | Zona waktu | Ubah zona waktu ke zona yang valid dan coba nilai tidak valid melalui API. | Nilai valid tersimpan; nilai tidak valid ditolak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-09 | Pengaturan bisnis | Mode sederhana/lanjutan | Ganti mode dari header, refresh. | Mode tersimpan per workspace dan UI menyesuaikan tanpa mengubah izin/data. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-10 | Pengaturan bisnis | Pajak efektif tanggal | Buat tarif pajak baru dengan tanggal efektif. | Tarif historis tidak ditimpa; transaksi mengikuti tarif yang berlaku. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-11 | Pengaturan bisnis | Aturan diskon | Buat draft, aktifkan dengan role approver, lalu jalankan simulasi. | Aturan draft tidak berlaku sebelum disetujui; dry-run tidak membuat transaksi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| C-12 | Pengaturan bisnis | Template workflow | Buka tab Template. | Workflow/checklist yang ditampilkan cocok dengan template workspace. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |

## D. Data master, produk, persediaan & produksi

| ID Test | Modul | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status | Catatan |
|---|---|---|---|---|---|---|---|
| D-01 | Produk | Buat produk | Tambah produk dengan SKU, nama, harga, metode HPP dan stok minimum. | Produk tersimpan dengan SKU unik dan tampil pada daftar. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-02 | Produk | Validasi SKU duplikat | Buat produk dengan SKU yang sudah dipakai pada workspace yang sama. | Ditolak 409; data lama tidak berubah. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-03 | Produk | Ubah/hapus produk | Edit data produk dan uji penghapusan/nonaktif sesuai UI. | Update tampil setelah refresh; produk yang sudah direferensikan tidak boleh merusak transaksi historis. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-04 | Produk | Unggah gambar valid | Unggah gambar tipe yang didukung dan pasangkan ke produk. | File tersimpan dan dapat diunduh pada workspace pemilik. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-05 | Produk | Unggah file palsu/aktif | Ubah ekstensi file atau coba SVG/konten aktif. | File ditolak oleh allowlist/signature validation. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-06 | Persediaan | Saldo awal/penyesuaian | Tambahkan saldo awal/penyesuaian dengan alasan dan biaya. | Stok dan nilai persediaan berubah serta tercatat di ledger. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-07 | Persediaan | FIFO | Buat dua penerimaan dengan biaya berbeda, lalu lakukan penjualan. | HPP mengikuti lot FIFO dan nilai persediaan direkonsiliasi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-08 | Persediaan | Rata-rata bergerak | Pilih metode rata-rata, terima pembelian dengan biaya berbeda lalu jual. | Biaya rata-rata bergerak dihitung dari transaksi aktual. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-09 | Persediaan | Transfer stok | Transfer antar gudang dan periksa kedua saldo. | Pengurangan dan penambahan konsisten; tidak ada stok negatif. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-10 | Persediaan | Opname | Buat hitung fisik, input selisih, konfirmasi. | Penyesuaian tercatat dan laporan rekonsiliasi stok berubah. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-11 | Produksi | BOM/resep | Buat BOM, mulai produksi dengan bahan cukup. | Bahan dikonsumsi dan output produk jadi terbentuk secara atomik. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-12 | Produksi | Bahan tidak cukup | Mulai produksi melebihi bahan tersedia. | Operasi ditolak tanpa mutasi parsial/stock negatif. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-13 | Produksi | Waste/produk rusak | Catat waste sesuai alur modul. | Pengurangan stok/waste tercatat dan nilai inventory tetap dapat direkonsiliasi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| D-14 | Data master | UOM dan kurs | Tambah satuan dan catatan kurs dari modul Data Master. | Record tersimpan; tidak menganggap fitur multi-currency penuh bila transaksi belum mendukungnya. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |

## E. Pembelian, penjualan, POS, kas & keuangan

| ID Test | Modul | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status | Catatan |
|---|---|---|---|---|---|---|---|
| E-01 | Pemasok | Buat pemasok | Tambah dan edit data pemasok. | Data tersimpan pada workspace. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-02 | Pembelian | Purchase Order | Buat PO dengan beberapa item, ajukan dan minta approval. | Status mengikuti transisi; penerimaan sebelum approval ditolak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-03 | Pembelian | Penerimaan parsial | Terima sebagian kuantitas lalu terima sisanya. | Penerimaan parsial/idempoten; stok, HPP, dan utang terbentuk konsisten. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-04 | Pembelian | Penerimaan duplikat | Kirim ulang request penerimaan dengan Idempotency-Key yang sama. | Tidak menambah stok atau tagihan ganda. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-05 | Pembelian | Pembayaran tagihan pemasok | Catat pembayaran tagihan dengan metode manual. | Pembayaran dan saldo utang tercermin sesuai catatan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-06 | Pembelian | Retur pemasok/kredit pemasok | Cari fungsi retur dan credit note pemasok. | Status BLOCKED: fitur ini tercantum belum diimplementasikan pada BLOCKERS.md. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-07 | Pelanggan | Data pelanggan | Buat, baca, ubah, dan hapus/nonaktif pelanggan sesuai izin. | Data dan riwayat terkait konsisten. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-08 | CRM | Lead dan peluang | Buat lead, pindahkan status new → contacted → qualified → won/lost. | Perubahan status dan nilai peluang tersimpan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-09 | CRM | Riwayat interaksi | Catat interaksi pelanggan dengan kanal dan tindak lanjut. | Interaksi muncul pada daftar pelanggan/CRM. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-10 | Penjualan | Dokumen penjualan kredit | Buat penjualan/faktur kredit dengan pelanggan. | Piutang dan dokumen penjualan tersimpan tanpa memaksa pembayaran tunai. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-11 | POS | Sesi kas wajib | Coba transaksi tunai tanpa membuka sesi kas. | Ditolak dengan no_cash_session. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-12 | POS | Buka sesi kas | Buka sesi kas dengan modal awal. | Sesi aktif tercatat dan kasir yang sama tidak dapat membuka sesi ganda. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-13 | POS | Penjualan tunai | Jual dua item dengan pembayaran melebihi total. | Transaksi atomik, kembalian benar, stok berkurang, jurnal tercatat. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-14 | POS | Idempotensi POS | Kirim transaksi yang sama dengan kunci yang sama. | Hanya satu penjualan dibuat; respons duplikat mengacu transaksi yang sama. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-15 | POS | Persaingan stok terakhir | Dari beberapa sesi, jual unit terakhir secara bersamaan. | Hanya satu transaksi berhasil; stok tidak pernah negatif. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-16 | Penjualan | Retur dan refund | Retur sebagian transaksi lalu uji retur melebihi jumlah terjual. | Retur valid mengembalikan stok dan mencatat refund/jurnal; over-return ditolak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-17 | Kas | Kas masuk/keluar | Catat cash in/out, setoran brankas atau transfer. | Saldo ekspektasi dihitung dan transaksi masuk ke laporan kas. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-18 | Kas | Tutup sesi kas | Hitung fisik dengan denominasi, tutup sesi, refresh. | Variance tersimpan, sesi terkunci, dan jurnal selisih kas benar. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-19 | Keuangan | Chart of Accounts | Tambah/ubah akun sesuai izin. | Kode akun unik dan akun yang direferensikan dijaga dari penghapusan merusak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-20 | Keuangan | Jurnal seimbang | Buat jurnal debit kredit seimbang. | Jurnal diposting dan saldo akun berubah. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-21 | Keuangan | Jurnal tidak seimbang | Buat jurnal dengan debit tidak sama dengan kredit. | Ditolak oleh validasi/database constraint. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-22 | Keuangan | Reversal jurnal | Balik jurnal posted, lalu coba balik lagi. | Counter-entry dibuat; jurnal asli immutable dan reversal ganda ditolak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-23 | Keuangan | Periode terkunci | Tutup periode dan coba posting transaksi pada periode tersebut. | Posting ditolak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-24 | Keuangan | Saldo awal | Catat opening balances. | Jurnal pembuka seimbang otomatis dan rekonsiliasi valid. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-25 | Laporan | Neraca saldo | Buka laporan neraca saldo setelah transaksi. | Total debit sama dengan kredit. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-26 | Laporan | Laba rugi | Buka laporan laba rugi dan cocokkan angka dengan transaksi test. | Pendapatan, HPP, laba kotor dan laba bersih konsisten dengan ledger. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-27 | Laporan | Neraca | Buka neraca. | Aset sama dengan liabilitas + ekuitas. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-28 | Laporan | Arus kas | Buka laporan arus kas setelah kas masuk/keluar. | Pergerakan kas dapat ditelusuri ke transaksi sumber. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-29 | Laporan | AR/AP aging | Buka umur piutang dan utang. | Saldo dan umur sesuai dokumen tagihan/pembayaran. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| E-30 | Laporan | Rekonsiliasi | Buka rekonsiliasi stok dan penjualan ke GL. | Status match/selisih sesuai data ledger; tidak mengarang data. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |

## F. Booking, tugas, HR, operasional, marketing, proyek, aset & legal

| ID Test | Modul | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status | Catatan |
|---|---|---|---|---|---|---|---|
| F-01 | Booking | Sumber daya & kapasitas | Buat sumber daya dengan kapasitas; buat booking. | Booking tersimpan dan kapasitas dihormati. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-02 | Booking | Double booking | Buat dua booking bentrok untuk resource yang sama. | Permintaan yang melampaui kapasitas ditolak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-03 | Tugas | Tugas & subtugas | Buat task, subtugas, assignee, priority, due date. | Task tersimpan; subtugas terhubung ke parent. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-04 | Tugas | Optimistic concurrency | Ambil versi record, ubah dari sesi A, lalu simpan versi lama dari sesi B. | Sesi B menerima konflik (409), perubahan A tidak tertimpa. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-05 | Tugas | Agenda/pengingat | Buat agenda dengan tanggal, jam, tipe dan catatan. | Agenda muncul di dashboard dan modul tugas. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-06 | HR | Karyawan/departemen | Buat departemen dan data karyawan dengan role yang berizin. | Record tersimpan; payroll/HR sensitif tidak dapat dibaca role tidak berhak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-07 | HR | Absensi self-service | Buat absensi untuk tanggal dan jam tertentu. | Karyawan yang diberi hak self-service hanya mengelola ruang lingkup yang diizinkan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-08 | HR | Timesheet dan approval | Ajukan timesheet/lembur lalu approve/reject sebagai approver. | Status transisi memerlukan permission approve. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-09 | HR | Cuti | Ajukan cuti dengan tanggal mulai dan akhir lalu approve/reject. | Status dan rentang tanggal tersimpan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-10 | HR | Catatan payroll | Buat draft dan uji akses role lain ke data payroll. | Akses sensitif harus dibatasi; payroll di sini adalah catatan, bukan proses penggajian/bank. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-11 | Operasional | SOP | Buat SOP draft, aktifkan, lalu pensiunkan. | Status workflow tersimpan dan dapat dibaca tim berizin. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-12 | Operasional | Checklist buka/tutup | Buat checklist dengan item, isi item selesai, tutup checklist. | Status completed dan catatan item tersimpan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-13 | Operasional | Serah terima shift | Kirim handover lalu akui sebagai shift penerima. | Status submitted → acknowledged. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-14 | Operasional | QC dan insiden | Catat hasil QC pass/fail/rework serta laporan insiden. | Status dan catatan tersimpan; penutupan insiden memerlukan approval sesuai izin. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-15 | Marketing | Kampanye | Buat kampanye, status, channel, biaya, revenue. | Data kampanye tersimpan; tidak mengklaim pesan iklan terkirim. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-16 | Marketing | Promosi | Buat promo dan aktifkan pada rentang tanggal. | Aturan promo tersimpan; cek dry-run diskon sebelum dipakai di penjualan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-17 | Marketing | Template pesan | Buat template WhatsApp/SMS/email lalu salin manual. | Template dapat disalin; pengiriman otomatis bukan bagian dari fitur. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-18 | Proyek | Proyek dan milestone | Buat proyek, milestone, fase dan update progres. | Struktur parent-child dan status tersimpan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-19 | Proyek | Biaya proyek | Catat biaya dan minta approval. | Biaya terkait proyek tersimpan dan status approval ditegakkan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-20 | Proyek | BOQ/RAB | Pada template Kontraktor buat item BOQ volume × harga. | Jumlah sesuai hasil perkalian deterministic dan tidak hanya dihitung di UI. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-21 | Aset | Aset dan perawatan | Buat aset dengan masa manfaat, kondisi, lokasi; buat jadwal maintenance. | Record dan hubungan perawatan tersimpan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-22 | Aset | Dokumen/berkas | Unggah file, buat record dokumen, lalu download. | File dapat diakses oleh workspace pemilik; akses tenant lain 404. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-23 | Legal | S&K dan privasi | Buat draft dokumen legal dan versi, uji publish/arsip jika tersedia. | Versi published immutable; jangan menganggap teks bawaan sebagai nasihat hukum. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| F-24 | Privasi | Register dan DSR | Buat inventaris data pribadi, retensi, legal hold atau insiden privasi. | Record tercatat dan dapat ditinjau role yang sesuai; tenggat kepatuhan harus diverifikasi legal. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |

## G. Impor/ekspor, admin, API, keamanan & persistensi

| ID Test | Modul | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status | Catatan |
|---|---|---|---|---|---|---|---|
| G-01 | Impor | Template CSV | Buka menu impor dan unduh template untuk products/customers/suppliers/opening_stock. | Header sesuai field yang didukung. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-02 | Impor | Pratinjau CSV valid | Unggah CSV berisi beberapa baris valid. | Batch staged dan hasil validasi tampil sebelum commit. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-03 | Impor | Baris CSV tidak valid | Unggah file dengan baris yang salah dan duplikat. | Error ditandai per baris; hanya baris valid dapat diproses sesuai status batch. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-04 | Impor | Commit impor | Setujui commit batch valid. | Job diproses bertahap dengan checkpoint; cek status hingga selesai. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-05 | Ekspor | Ekspor CSV | Ekspor products/customers/suppliers/sales/journals. | File dapat dibuka; formula injection dinetralkan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-06 | Admin | Anggota dan role | Buat undangan, ubah role/member, uji akses. | Perubahan role berlaku pada request selanjutnya dan tunduk ke proteksi owner terakhir. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-07 | Admin | Audit log | Lakukan beberapa mutasi lalu buka audit. | Aksi tercatat tanpa password, OTP, session token, atau secret. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-08 | Admin | Kesehatan database | Buka health admin. | Latency/queue/import/backup status mencerminkan keadaan nyata. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-09 | Admin | Job queue | Lihat job, jalankan worker, replay dead-letter jika tersedia. | Status dan error job dapat ditinjau; pekerjaan tidak diproses dua kali secara salah. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-10 | Admin | Ekspor workspace | Unduh ekspor JSON. | Hanya data workspace pemohon dan tidak memasukkan rahasia/session. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-11 | API | OpenAPI | Buka /api/v1/openapi.json. | Dokumen API terbit dan route/perizinan sesuai implementasi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-12 | API | Problem details | Kirim payload invalid. | Respons memakai application/problem+json dan requestId. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-13 | API | CSRF Origin | Kirim POST dengan Origin domain asing. | Permintaan ditolak 403. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-14 | API | Body limit | Kirim JSON melebihi 1 MB dan upload melebihi batas. | Permintaan ditolak 413; server tidak memproses seluruh payload tak terbatas. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-15 | API | Rate limit | Ulangi login gagal sampai batas. | Respons 429 dan tidak mengunci akun permanen. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-16 | Keamanan | IDOR lintas tenant | Gunakan ID produk/file/booking tenant lain dalam endpoint. | Tidak ada data bocor; respons 403/404 sesuai endpoint. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-17 | Keamanan | XSS/input aktif | Masukkan string HTML/script ke nama, catatan, atau file. | Konten tampil sebagai teks aman; file aktif ditolak. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-18 | Keamanan | Cookie sesi | Periksa cookie pada HTTPS. | HttpOnly, SameSite=Lax, Secure; tidak ada token auth di localStorage. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-19 | Keamanan | Secret exposure | Cari bundle browser, response, source map, console dan Git history. | Tidak ada DATABASE_URL, key, token, password, atau reset code produksi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-20 | Persistensi | Refresh | Buat produk/transaksi lalu refresh halaman. | Data tersimpan di database dan tampil lagi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-21 | Persistensi | Logout/login | Buat data bisnis, logout, login ulang akun yang sama. | Workspace, produk, transaksi, dokumen, konfigurasi dan pengaturan tetap ada. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-22 | Persistensi | Multi-workspace | Buat data berbeda di dua workspace dan berganti beberapa kali. | Tidak ada data yang tercampur. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-23 | Scheduler | Tolak cron tanpa secret | Buka `/api/cron` tanpa header Authorization. | Request ditolak 401/503; job global tidak dijalankan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| G-24 | Scheduler | Tolak worker endpoint tanpa secret | Kirim POST `/api/v1/worker/tick` tanpa Bearer CRON_SECRET. | Request ditolak; job global tidak dijalankan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |

## H. Browser, responsivitas, aksesibilitas & state UI

| ID Test | Modul | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status | Catatan |
|---|---|---|---|---|---|---|---|
| H-01 | Desktop | Lebar 1440 px | Uji halaman penting: dashboard, POS, produk, finance, reports, settings, admin. | Tidak ada overflow horizontal yang tidak disengaja; layout dan tabel dapat dipakai. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-02 | Tablet | Lebar 768 px | Uji nav, form, modal, tabel dan grafik pada orientasi portrait/landscape. | Konten tetap terbaca dan kontrol bisa disentuh. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-03 | Mobile | Lebar 360–390 px | Uji dashboard, POS, product, cash, auth dan menu navigasi. | Tidak ada tombol tertutup, form terpotong, atau scroll horizontal tidak perlu. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-04 | Keyboard | Navigasi keyboard | Gunakan Tab, Shift+Tab, Enter, Space, Escape tanpa mouse. | Fokus terlihat, semua tindakan utama dapat dijangkau, dialog dapat ditutup. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-05 | Screen reader | Label dan status | Periksa input label, aria status, heading dan tabel. | Input memiliki label; loading/error/status diumumkan dengan semantik yang sesuai. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-06 | Reduced motion | Preferensi reduce motion | Aktifkan prefers-reduced-motion pada OS/browser. | Transisi non-esensial dikurangi atau dimatikan. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-07 | Loading state | Koneksi lambat | Gunakan throttling jaringan dan buka halaman data. | Loading/skeleton muncul tanpa interaksi ganda atau status sukses palsu. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-08 | Error state | API/database gagal | Matikan koneksi database pada environment pengujian dan akses halaman. | Error jelas, tidak membocorkan detail secret, retry tersedia bila sesuai. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-09 | Empty state | Workspace kosong | Masuk workspace baru tanpa data transaksi. | Empty state informatif; tidak ada data transaksi contoh. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-10 | Success state | Operasi berhasil | Buat atau ubah record. | Feedback sukses hanya muncul setelah server mengonfirmasi. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |
| H-11 | Cross-browser | Chrome/Edge/Firefox/Safari | Uji auth, form, tabel, upload, modal dan sesi. | Perilaku konsisten; perbedaan browser dicatat. | ________________ | [ ] PASS [ ] FAIL [ ] BLOCKED | ________________ |


## Template laporan bug

Salin blok ini untuk setiap temuan. Jangan menyertakan password, OTP, token sesi, API key, atau data pelanggan nyata.

```text
BUG ID: BF-BUG-____
Tanggal & waktu kejadian (sertakan zona waktu):
Deployment URL / Preview ID / commit:
Browser + versi:
OS + perangkat + ukuran layar:
Nama halaman / URL:
Modul:
Akun uji & role (tanpa password):
Workspace uji:
Tingkat keparahan: Critical / High / Medium / Low

Langkah untuk mereproduksi:
1.
2.
3.

Kondisi yang terjadi:
Kondisi yang diharapkan:
Apakah terjadi setiap kali? Ya / Tidak / Kadang-kadang
Request ID (bila ada):
HTTP status / API endpoint (bila ada):
Screenshot / video / console log yang sudah disensor:
Catatan tambahan:
```

## Catatan akhir pengujian

| Informasi | Isi |
|---|---|
| Deployment URL |  |
| Preview/commit |  |
| Tanggal pengujian |  |
| Penguji |  |
| Browser/perangkat |  |
| Jumlah PASS |  |
| Jumlah FAIL |  |
| Jumlah BLOCKED |  |
| Bug ID yang dilaporkan |  |

Jangan menyatakan seluruh aplikasi bebas bug hanya karena halaman berhasil merespons HTTP 200. Verifikasi juga penyimpanan, kalkulasi, izin, transaksi, konsistensi database, dan pengalaman pengguna.
