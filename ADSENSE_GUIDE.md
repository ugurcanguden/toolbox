# 💰 Google AdSense Integration Guide

Toolbox uygulamasına Google AdSense başarıyla entegre edildi!

## 🎯 Mevcut Durum

### ✅ Eklenenler:

1. **AdSense Meta Tag** (`app/layout.tsx`)
   ```html
   <meta name="google-adsense-account" content="ca-pub-9339461513261360" />
   ```

2. **AdSense Script** (`app/layout.tsx`)
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9339461513261360" crossorigin="anonymous"></script>
   ```

3. **Reklam Component'leri:**
   - `AdBanner` - Banner reklamlar için
   - `InArticleAd` - İçerik arası reklamlar için

---

## 📦 Component Kullanımı

### 1. **AdBanner Component**

Responsive banner reklamlar için:

```typescript
import { AdBanner } from '@/components';

// Ana sayfada
<AdBanner 
  dataAdSlot="YOUR_AD_SLOT_ID"
  className="my-8"
/>

// Özelleştirilmiş
<AdBanner 
  dataAdSlot="YOUR_AD_SLOT_ID"
  dataAdFormat="horizontal"
  dataFullWidthResponsive={true}
  className="max-w-7xl mx-auto my-8"
/>
```

### 2. **InArticleAd Component**

Tool sayfalarında içerik arası reklamlar için:

```typescript
import { InArticleAd } from '@/components';

// Tool sayfasında
<InArticleAd 
  dataAdSlot="YOUR_AD_SLOT_ID"
  className="my-8"
/>
```

---

## 🎨 Önerilen Reklam Yerleşimi

### **Ana Sayfa (`app/[locale]/page.tsx`)**

#### 1. Hero Section Altı (Üst Banner):
```typescript
{/* Hero Section */}
<div className="mb-12 text-center">
  <h1>...</h1>
  <p>...</p>
</div>

{/* Reklam - Üst Banner */}
<AdBanner 
  dataAdSlot="SLOT_ID_1" 
  className="max-w-7xl mx-auto mb-12"
/>

{/* Search & Filter */}
<div className="mb-12">...</div>
```

#### 2. Favorites ve All Tools Arası:
```typescript
{/* Favorites Section */}
{favoriteTools.length > 0 && (
  <div className="mb-12">...</div>
)}

{/* Reklam - Orta */}
<AdBanner 
  dataAdSlot="SLOT_ID_2" 
  className="max-w-7xl mx-auto mb-12"
/>

{/* All Tools Grid */}
<div className="mb-12">...</div>
```

#### 3. Footer Üstü (Alt Banner):
```typescript
{/* All Tools Grid */}
<div className="mb-12">...</div>

{/* Reklam - Alt Banner */}
<AdBanner 
  dataAdSlot="SLOT_ID_3" 
  className="max-w-7xl mx-auto mb-12"
/>
```

---

### **Tool Sayfaları (`app/[locale]/tools/*/page.tsx`)**

#### Örnek: JSON Formatter

```typescript
<div className="container mx-auto py-8 px-4">
  <div className="max-w-7xl mx-auto space-y-6">
    {/* Header */}
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>

    {/* Reklam - Tool Üstü */}
    <InArticleAd dataAdSlot="SLOT_ID_4" />

    {/* Tool UI */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input/Output */}
    </div>

    {/* Reklam - Tool Altı */}
    <InArticleAd dataAdSlot="SLOT_ID_5" />

    {/* Info Section */}
    <Card>...</Card>
  </div>
</div>
```

---

## 🎯 AdSense Strateji

### **Önerilen Reklam Sayısı:**

**Ana Sayfa:**
- 🎯 2-3 banner (üst, orta, alt)
- 📊 Test et ve performansa göre ayarla

**Tool Sayfaları:**
- 🎯 1-2 reklam (tool üstü veya altı)
- 📊 Kullanıcı deneyimini bozmamaya dikkat et

---

## 📊 AdSense Best Practices

### ✅ **Yapılması Gerekenler:**

1. **Ad Placement:**
   - Above the fold (1 reklam)
   - Below content (1-2 reklam)
   - Sidebar (opsiyonel)

2. **Responsive Design:**
   - `dataAdFormat="auto"` kullan
   - `dataFullWidthResponsive={true}` aktif et

3. **User Experience:**
   - Reklam yüklenene kadar boşluk bırak
   - Loading skeleton ekle (opsiyonel)
   - Sayfada max 3-4 reklam

4. **Performance:**
   - Async loading ✅ (zaten var)
   - Lazy load (scroll ile yükle)

### ❌ **Yapılmaması Gerekenler:**

- Çok fazla reklam (max 3-4 per page)
- Click fraud (tıklama teşviki)
- Reklam üstüne "Click here" yazmak
- Content cover etmek
- Pop-up reklamlar

---

## 🔧 AdSense Setup Checklist

### **1. Google AdSense Console'da:**

1. Site ekle: `free-dev-tools.net.tr`
2. Site doğrulaması yap (meta tag zaten eklendi ✅)
3. Reklam ünitesi oluştur:
   - **Display Ads** → Responsive
   - Ad Slot ID'leri al (örn: `1234567890`)

### **2. Reklam Yerleştir:**

Component'leri import et ve ad slot ID'leri ile kullan:

```typescript
import { AdBanner, InArticleAd } from '@/components';

<AdBanner dataAdSlot="1234567890" />
<InArticleAd dataAdSlot="9876543210" />
```

### **3. Test Et:**

- Local'de test et: `http://localhost:3000`
- AdSense test reklamları görünmeli
- Console'da hata olmamalı

### **4. Production'a Deploy Et:**

- Pipeline'ı çalıştır
- Site live olduktan sonra AdSense onay sürecini bekle (1-7 gün)

---

## 📈 Monitoring

### **AdSense Console:**
- Daily earnings
- Page RPM (Revenue Per Mille)
- CTR (Click-Through Rate)
- Top performing pages

### **Optimize Et:**
- Hangi tool'lar daha çok ziyaret ediliyor?
- Hangi sayfalarda CTR yüksek?
- Reklam yerleşimini A/B test et

---

## 🎨 Örnek Kullanım

### Ana Sayfaya Reklam Ekle:

```typescript
// app/[locale]/page.tsx
import { AdBanner } from '@/components';

export default function HomePage() {
  // ... existing code

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">...</div>

      {/* 🎯 ÜST BANNER REKLAM */}
      <AdBanner dataAdSlot="YOUR_SLOT_ID" className="mb-12" />

      {/* Search & Filter */}
      <div className="mb-12">...</div>

      {/* Favorites */}
      {favoriteTools.length > 0 && <div className="mb-12">...</div>}

      {/* 🎯 ORTA BANNER REKLAM */}
      <AdBanner dataAdSlot="YOUR_SLOT_ID" className="mb-12" />

      {/* All Tools */}
      <div className="mb-12">...</div>
    </div>
  );
}
```

---

## 🚨 AdSense Policy Compliance

### ✅ **Toolbox Uyumlu:**
- ✅ Original content
- ✅ User-generated content yok
- ✅ Copyright ihlali yok
- ✅ No adult content
- ✅ Privacy policy var (ekle)
- ✅ Cookie consent (ekle)

### 📝 **Eksik Olanlar:**

1. **Privacy Policy Page:**
   - AdSense kullanımını belirt
   - Cookie kullanımını açıkla
   - Üçüncü parti script'leri belirt

2. **Cookie Consent:**
   - GDPR uyumluluğu için gerekli
   - Cookie banner ekle

---

## 💡 Gelir Optimizasyonu

### **1. Traffic Artışı:**
- SEO iyileştirmeleri ✅ (zaten var)
- Social media paylaşımları
- Blog yazıları (tool kullanım rehberleri)

### **2. Ad Placement:**
- A/B testing yap
- Heat map kullan
- Click-through rate'i takip et

### **3. Content:**
- Tool'lara açıklama ekle
- Tutorial'lar ekle
- "How to use" rehberleri

---

**AdSense Account ID:** `ca-pub-9339461513261360`  
**Status:** ✅ Entegre Edildi  
**Next Step:** Reklam ünitesi oluştur ve ad slot ID'leri ekle

**Son Güncelleme:** 2025-10-08
