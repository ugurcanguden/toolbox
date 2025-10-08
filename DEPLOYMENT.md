# Toolbox - Deployment Guide 🚀

Bu dosya, Toolbox uygulamasını Docker ile deploy etmek için gerekli tüm bilgileri içerir.

## 📋 Gereksinimler

- Docker 20.10+
- Docker Compose 2.0+ (opsiyonel)
- 2GB+ RAM
- 1GB+ Disk alanı

---

## 🐳 Docker ile Deployment

### 1. Environment Variables Ayarla

`.env.production` dosyasını düzenle:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Docker Image Build Et

```bash
# Image build
docker build -t toolbox:latest .

# Build progress detaylı görmek için
docker build -t toolbox:latest . --progress=plain
```

### 3. Container Başlat

#### Seçenek A: Docker Run
```bash
docker run -d \
  --name toolbox \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  --restart unless-stopped \
  toolbox:latest
```

#### Seçenek B: Docker Compose (ÖNERİLEN)
```bash
# docker-compose.yml dosyasını düzenle (NEXT_PUBLIC_SITE_URL)
docker-compose up -d

# Logları izle
docker-compose logs -f

# Durdur
docker-compose down
```

### 4. Test Et

```bash
# Container'ın çalıştığını kontrol et
docker ps

# Health check
curl http://localhost:3000

# Logları kontrol et
docker logs toolbox
```

---

## 🔧 Yaygın Docker Komutları

```bash
# Image listele
docker images

# Container'ları listele
docker ps -a

# Container'ı durdur
docker stop toolbox

# Container'ı başlat
docker start toolbox

# Container'ı yeniden başlat
docker restart toolbox

# Container'ı sil
docker rm toolbox

# Image'ı sil
docker rmi toolbox:latest

# Logları izle
docker logs -f toolbox

# Container içine gir (debug için)
docker exec -it toolbox sh

# Container kaynak kullanımını gör
docker stats toolbox
```

---

## 🚀 Production Server'da Deployment

### 1. Projeyi Server'a Gönder

```bash
# Git ile
git clone <your-repo-url>
cd toolbox

# veya rsync ile
rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./ user@server:/path/to/toolbox/
```

### 2. Server'da Build Et

```bash
ssh user@server
cd /path/to/toolbox

# .env.production'ı düzenle
nano .env.production

# Docker build
docker build -t toolbox:latest .

# Başlat
docker-compose up -d
```

### 3. Nginx Reverse Proxy (Opsiyonel)

`/etc/nginx/sites-available/toolbox`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx'i test et
sudo nginx -t

# Nginx'i reload et
sudo systemctl reload nginx
```

### 4. SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kur
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Otomatik yenileme test et
sudo certbot renew --dry-run
```

---

## 📊 Monitoring & Logs

### Docker Logs

```bash
# Son 100 satır
docker logs --tail 100 toolbox

# Real-time logs
docker logs -f toolbox

# Timestamp ile
docker logs -t toolbox

# Son 1 saatlik loglar
docker logs --since 1h toolbox
```

### Health Check

```bash
# Manuel health check
curl http://localhost:3000

# Otomatik health check (Docker)
docker inspect --format='{{json .State.Health}}' toolbox | jq
```

---

## 🔄 Update & Rollback

### Update

```bash
# Yeni kodu çek
git pull origin main

# Yeni image build et
docker build -t toolbox:latest .

# Container'ı yeniden başlat
docker-compose down
docker-compose up -d

# Veya tek komutla
docker-compose up -d --build
```

### Rollback

```bash
# Önceki image'a geri dön
docker tag toolbox:latest toolbox:backup
docker build -t toolbox:latest .

# Eğer sorun olursa
docker tag toolbox:backup toolbox:latest
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Problem: Container başlamıyor

```bash
# Logları kontrol et
docker logs toolbox

# Port çakışması kontrolü
sudo lsof -i :3000

# Container'ı yeniden oluştur
docker-compose down
docker-compose up -d --force-recreate
```

### Problem: Image çok büyük

```bash
# Image boyutunu gör
docker images toolbox

# Unused image'ları temizle
docker image prune -a

# Build cache'i temizle
docker builder prune
```

### Problem: Memory yetersiz

```bash
# Container'a memory limiti ekle
docker run -d \
  --name toolbox \
  -p 3000:3000 \
  --memory="1g" \
  --memory-swap="1g" \
  toolbox:latest
```

---

## 📈 Performance Tips

### 1. Multi-stage Build Kullan ✅
Dockerfile zaten multi-stage build kullanıyor.

### 2. Layer Caching
```bash
# Build cache kullan
docker build -t toolbox:latest .

# Cache'siz build (sorun varsa)
docker build --no-cache -t toolbox:latest .
```

### 3. Image Optimization
```bash
# Image boyutunu küçült
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd):/data" \
  -e DOCKER_HOST=unix:///var/run/docker.sock \
  wagoodman/dive toolbox:latest
```

---

## 🔒 Security Best Practices

1. ✅ Non-root user kullanımı (nextjs:nodejs)
2. ✅ Security headers yapılandırıldı
3. ✅ Secrets .gitignore'da
4. ⚠️ SSL sertifikası ekle (production için)
5. ⚠️ Firewall kuralları ayarla

---

## 📞 Destek

Sorun yaşıyorsan:
1. Logları kontrol et: `docker logs toolbox`
2. GitHub Issues'a bak
3. ROADMAP.md'ye göz at

---

**Son Güncelleme:** 2025-10-08  
**Versiyon:** 2.1.0
