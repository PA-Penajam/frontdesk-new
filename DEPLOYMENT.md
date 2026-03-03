# Panduan Deployment Produksi: frontdesk-next

Dokumen ini berisi langkah-langkah teknis untuk melakukan deployment aplikasi `frontdesk-next` (Sistem Buku Tamu) pada server VPS atau bare-metal berbasis Linux.

## 1. Pendahuluan

`frontdesk-next` adalah aplikasi buku tamu digital yang dirancang untuk Pengadilan Agama. Aplikasi ini dibangun menggunakan Next.js 16 dan menggunakan SQLite sebagai basis data utama. Arsitektur ini dipilih karena kemudahan pemeliharaan dan performa yang cepat untuk skala penggunaan kantor pemerintah.

## 2. Persyaratan Sistem

Pastikan server Anda memenuhi spesifikasi minimum berikut:

| Komponen | Spesifikasi Minimum |
| :--- | :--- |
| Sistem Operasi | Ubuntu 22.04 LTS atau lebih baru |
| Node.js | v24.0.0 atau lebih tinggi |
| Package Manager | pnpm v9.0.0 atau lebih tinggi |
| RAM | 1 GB (2 GB direkomendasikan untuk proses build) |
| Disk Space | 500 MB (di luar data cadangan) |

## 3. Persiapan Server

### Update Sistem
Lakukan pembaruan paket sistem terlebih dahulu:
```bash
sudo apt update && sudo apt upgrade -y
```

### Instalasi Node.js v24
Gunakan NodeSource untuk mendapatkan versi terbaru:
```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

### Instalasi pnpm
Instal pnpm secara global:
```bash
sudo npm install -g pnpm
```

### Membuat User Aplikasi
Demi keamanan, jangan jalankan aplikasi sebagai root:
```bash
sudo adduser frontdesk
sudo usermod -aG sudo frontdesk
su - frontdesk
```

## 4. Instalasi Aplikasi

Klon repositori ke direktori tujuan:
```bash
git clone https://github.com/username/buku-tamu.git ~/frontdesk
cd ~/frontdesk/frontdesk-next
```

Instal dependensi menggunakan pnpm:
```bash
pnpm install
```

## 5. Konfigurasi Environment

Salin file contoh environment:
```bash
cp .env.example .env
```

Buka file `.env` dan atur variabel `ADMIN_PASSWORD_HASH`. Anda harus memasukkan hash bcrypt dari password admin. Gunakan perintah berikut untuk menghasilkan hash:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('PASSWORD_ANDA_DI_SINI', 10).then(h => console.log(h))"
```

Salin output hash tersebut ke dalam file `.env`:
```text
ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 6. Migrasi Data (Opsional)

Jika Anda memiliki data lama dari sistem berbasis JSON, jalankan perintah migrasi untuk memindahkan data ke SQLite:
```bash
pnpm migrate
```
Perintah ini akan membaca data lama dan memasukkannya ke dalam tabel `tamu` di `data/frontdesk.db`.

## 7. Build & Jalankan

Lakukan proses build aplikasi untuk produksi:
```bash
pnpm build
```

Setelah build selesai, Anda bisa mencoba menjalankan aplikasi secara manual:
```bash
pnpm start
```
Aplikasi akan berjalan di port 3000 secara default. Tekan `Ctrl+C` untuk menghentikan.

## 8. Process Manager (PM2)

Gunakan PM2 agar aplikasi tetap berjalan di latar belakang dan otomatis restart jika terjadi crash.

### Instalasi PM2
```bash
sudo npm install -g pm2
```

### Konfigurasi Ecosystem
Buat file `ecosystem.config.cjs` di direktori root proyek:

```javascript
module.exports = {
  apps: [
    {
      name: "frontdesk-next",
      script: "pnpm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
```

### Menjalankan Aplikasi dengan PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
```

### Setup Startup Script
Agar PM2 otomatis berjalan saat server reboot:
```bash
pm2 startup
```
Ikuti instruksi perintah yang muncul di layar untuk menyelesaikan konfigurasi startup.

## 9. Reverse Proxy (Nginx)

Nginx digunakan untuk meneruskan trafik dari port 80/443 ke port 3000.

### Instalasi Nginx
```bash
sudo apt install -y nginx
```

### Konfigurasi Site
Buat file konfigurasi baru `/etc/nginx/sites-available/frontdesk`:

```nginx
server {
    listen 80;
    server_name domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
    }

    # Akses ke direktori data harus dilarang
    location /data {
        deny all;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/frontdesk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 10. SSL/HTTPS

Gunakan Certbot untuk mendapatkan sertifikat SSL gratis dari Let's Encrypt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d domain-anda.com
```

Ikuti petunjuk di layar untuk menyelesaikan proses instalasi SSL.

## 11. Backup & Restore

Basis data aplikasi disimpan dalam satu file SQLite di `data/frontdesk.db`.

### Backup Manual
Cukup salin file database ke lokasi aman:
```bash
cp data/frontdesk.db data/frontdesk.db.bak
```

### Otomatisasi Backup (Cron Job)
Buat script backup sederhana:
```bash
mkdir -p ~/backups
crontab -e
```
Tambahkan baris berikut untuk backup setiap jam 2 pagi:
```text
0 2 * * * cp /home/frontdesk/frontdesk-next/data/frontdesk.db /home/frontdesk/backups/db_$(date +\%F).db
```

### Restore
Untuk mengembalikan data, hentikan aplikasi terlebih dahulu, lalu timpa file database:
```bash
pm2 stop frontdesk-next
cp ~/backups/db_file_tujuan.db data/frontdesk.db
pm2 start frontdesk-next
```

## 12. Monitoring & Logs

### Melihat Log Aplikasi
```bash
pm2 logs frontdesk-next
```

### Log Rotation
Gunakan modul `pm2-logrotate` agar file log tidak memenuhi disk:
```bash
pm2 install pm2-logrotate
```

## 13. Update & Deployment Ulang

Jika ada pembaruan kode dari repositori, ikuti langkah ini:

```bash
cd ~/frontdesk/frontdesk-next
git pull origin main
pnpm install
pnpm build
pm2 restart frontdesk-next
```

## 14. Troubleshooting

| Masalah | Solusi |
| :--- | :--- |
| Port 3000 sudah digunakan | Cek proses dengan `lsof -i :3000` atau ubah port di `ecosystem.config.cjs`. |
| Permission denied pada `data/` | Pastikan user `frontdesk` memiliki hak akses tulis: `chmod -R 755 data`. |
| Database is locked | SQLite sedang sibuk. Pastikan tidak ada proses lain yang mengakses file secara eksklusif. |
| Build gagal | Biasanya karena RAM kurang. Tambahkan swap space pada VPS Anda. |
| Env tidak terbaca | Pastikan file `.env` berada di root folder aplikasi dan PM2 sudah di-restart. |

## 15. Keamanan

1. **Firewall**: Aktifkan UFW dan hanya buka port yang diperlukan.
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```
2. **Akses Root**: Nonaktifkan login root via SSH di `/etc/ssh/sshd_config`.
3. **Proteksi File**: Pastikan file `.env` tidak bisa dibaca oleh user lain (`chmod 600 .env`).
4. **Fail2Ban**: Instal fail2ban untuk mencegah serangan brute force pada SSH.
   ```bash
   sudo apt install fail2ban
   ```
