# 🚀 Hızlı Başlangıç Rehberi

## Hoş Geldiniz! 👋

Toolbox projesine hoş geldiniz! Bu rehber, projeyi çalıştırmanız için gereken her şeyi içeriyor.

## 📋 Gereksinimler

- Node.js 18 veya üzeri
- npm (Node.js ile birlikte gelir)

## 🎯 Kurulum

### 1. Bağımlılıkları Yükleyin

Eğer henüz yüklemediyseniz:

\`\`\`bash
npm install
\`\`\`

### 2. Development Server'ı Başlatın

\`\`\`bash
npm run dev
\`\`\`

### 3. Tarayıcıda Açın

Tarayıcınızda şu adresi açın: [http://localhost:3000](http://localhost:3000)

🎉 **Tebrikler!** Artık projeniz çalışıyor!

## 🌍 Dil Değiştirme

Varsayılan olarak İngilizce açılacaktır. Farklı bir dil için:

- http://localhost:3000/en (English)
- http://localhost:3000/de (Deutsch)
- http://localhost:3000/tr (Türkçe)
- http://localhost:3000/fr (Français)
- http://localhost:3000/pt (Português)

Ya da header'daki dil seçiciyi kullanın!

## 🎨 Tema Değiştirme

Sağ üstteki ay/güneş ikonuna tıklayarak tema değiştirebilirsiniz:
- ☀️ Açık tema
- 🌙 Koyu tema
- 💻 Sistem otomatik

## 📁 Proje Yapısı

\`\`\`
developertools/
├── app/                   # Next.js sayfaları
│   └── [locale]/         # Çok dilli routing
│       ├── page.tsx      # Ana sayfa
│       └── tools/        # Araçlar
├── components/           # React componentleri
├── i18n/                 # Çeviriler
├── lib/                  # Yardımcı fonksiyonlar
├── hooks/                # Custom hooks
└── styles/               # CSS dosyaları
\`\`\`

## 🛠 Kullanılabilir Komutlar

| Komut | Açıklama |
|-------|----------|
| \`npm run dev\` | Development server başlatır |
| \`npm run build\` | Production build oluşturur |
| \`npm start\` | Production server başlatır |
| \`npm run lint\` | Kod kalitesini kontrol eder |
| \`npm run lint:fix\` | Linter hatalarını otomatik düzeltir |
| \`npm run type-check\` | TypeScript tiplerini kontrol eder |
| \`npm run format\` | Kod formatını düzenler |

## 🔧 İlk Aracınız: JSON Formatter

Projeyi başlattıktan sonra:

1. Ana sayfada "JSON Formatter" kartına tıklayın
2. Sol tarafa JSON kodunuzu yapıştırın
3. "Format" butonuna tıklayın
4. Sağ tarafta biçimlendirilmiş JSON'u göreceksiniz!

## 📚 Daha Fazla Bilgi

- 📖 [README.md](./README.md) - Proje hakkında detaylı bilgi
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Katkıda bulunma rehberi
- 📊 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Proje özeti

## ❓ Sorun mu Yaşıyorsunuz?

### Port 3000 zaten kullanımda

Farklı bir port kullanın:
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

### Bağımlılık hataları

node_modules'u temizleyin ve tekrar yükleyin:
\`\`\`bash
npm run clean
npm install
\`\`\`

### Build hataları

TypeScript kontrolü yapın:
\`\`\`bash
npm run type-check
\`\`\`

## 🎯 Sonraki Adımlar

1. ✅ Projeyi çalıştırdınız
2. 🌍 Farklı dilleri deneyin
3. 🎨 Tema değiştirin
4. 🛠 JSON Formatter'ı kullanın
5. 📖 Kodu inceleyin
6. 💡 Yeni tool fikirleri üretin!

## 💬 Yardım

Bir sorun yaşarsanız:
- Issue açın (GitHub)
- Dokümantasyonu okuyun
- Kod örneklerine bakın

---

**Mutlu Kodlamalar!** 🚀

Developer Tools Ekibi

