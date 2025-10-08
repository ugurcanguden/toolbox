# 🐳 Docker Quick Start Guide

En hızlı şekilde Toolbox'ı Docker ile çalıştırmak için bu kılavuzu takip et!

## ⚡ Hızlı Başlangıç (3 Adım)

### 1️⃣ Otomatik Build Script (En Kolay!)

```bash
chmod +x docker-build.sh
./docker-build.sh
```

Script sana rehberlik edecek ve uygulamayı otomatik olarak başlatacak! 🎉

### 2️⃣ Docker Compose (Önerilen)

```bash
# .env değişkenlerini düzenle (opsiyonel)
nano docker-compose.yml

# Başlat
docker-compose up -d

# Logları izle
docker-compose logs -f toolbox
```

### 3️⃣ Manuel Docker Run

```bash
# Build
docker build -t toolbox:latest .

# Run
docker run -d \
  --name toolbox \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  --restart unless-stopped \
  toolbox:latest
```

## 🌐 Test Et

```bash
# Browser'da aç
open http://localhost:3000

# veya curl ile test et
curl http://localhost:3000
```

## 🔧 Yaygın Komutlar

```bash
# Container'ı durdur
docker stop toolbox

# Container'ı başlat
docker start toolbox

# Logları gör
docker logs -f toolbox

# Container'ı sil
docker stop toolbox && docker rm toolbox

# Image'ı yeniden build et
docker build --no-cache -t toolbox:latest .
```

## 🚨 Sorun Giderme

### Problem: Port 3000 kullanımda

```bash
# Farklı port kullan
docker run -d --name toolbox -p 3001:3000 toolbox:latest
# Artık http://localhost:3001'de çalışacak
```

### Problem: Container başlamıyor

```bash
# Logları kontrol et
docker logs toolbox

# Container'ı yeniden oluştur
docker rm toolbox
docker run -d --name toolbox -p 3000:3000 toolbox:latest
```

### Problem: Build çok uzun sürüyor

```bash
# Build cache kullan
docker build -t toolbox:latest .

# İlk build yavaş olabilir, sonraki buildler daha hızlı olacak
```

## 📊 Production İçin

Detaylı production deployment rehberi için:
👉 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Başarılar!** 🎉 Herhangi bir sorun yaşarsan DEPLOYMENT.md dosyasına göz at.
