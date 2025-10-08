# Katkıda Bulunma Rehberi

Toolbox projesine katkıda bulunmak istediğiniz için teşekkürler! 🎉

## Başlamadan Önce

1. Projeyi fork edin
2. Local bilgisayarınıza clone edin:
   \`\`\`bash
   git clone https://github.com/your-username/developertools.git
   cd developertools
   \`\`\`

3. Bağımlılıkları yükleyin:
   \`\`\`bash
   npm install
   \`\`\`

4. Development server'ı başlatın:
   \`\`\`bash
   npm run dev
   \`\`\`

## Geliştirme Kuralları

### Kod Standartları

- TypeScript strict mode kullanın
- ESLint kurallarına uyun
- Tailwind CSS kullanın
- shadcn/ui componentlerini tercih edin
- Client components'i minimize edin

### Commit Mesajları

Conventional Commits formatını kullanın:

- \`feat(scope): description\` - Yeni özellik
- \`fix(scope): description\` - Bug fix
- \`docs(scope): description\` - Dokümantasyon
- \`style(scope): description\` - Kod formatı
- \`refactor(scope): description\` - Refactoring
- \`test(scope): description\` - Test
- \`chore(scope): description\` - Diğer

Örnek:
\`\`\`
feat(tools): add base64 encoder/decoder
fix(theme): resolve dark mode flash issue
docs(readme): update installation steps
\`\`\`

## Yeni Tool Ekleme

1. Tool için klasör oluşturun:
   \`\`\`bash
   mkdir -p app/[locale]/tools/your-tool-name
   \`\`\`

2. \`page.tsx\` dosyası oluşturun

3. Tüm dil dosyalarını güncelleyin:
   - \`i18n/locales/en.json\`
   - \`i18n/locales/de.json\`
   - \`i18n/locales/tr.json\`
   - \`i18n/locales/fr.json\`
   - \`i18n/locales/pt.json\`

4. Ana sayfadaki tools array'ine ekleyin

5. Commit ve push yapın

## Pull Request Süreci

1. Feature branch oluşturun:
   \`\`\`bash
   git checkout -b feat/your-feature-name
   \`\`\`

2. Değişikliklerinizi commit edin:
   \`\`\`bash
   git commit -m "feat(scope): description"
   \`\`\`

3. Branch'inizi push edin:
   \`\`\`bash
   git push origin feat/your-feature-name
   \`\`\`

4. Pull Request açın

## Çoklu Dil Desteği

Yeni string eklerken:

1. İngilizce versiyonu önce yazın
2. Diğer dillere çevirin veya çeviri isteyinde bulunun
3. Translation key'leri açıklayıcı olmalı
4. Namespace'leri doğru kullanın

## Kod İnceleme

Pull Request'iniz:

- [ ] Linter hatası içermemeli
- [ ] Tüm dillerde çalışmalı
- [ ] Responsive olmalı
- [ ] Dark mode'u desteklemeli
- [ ] Accessibility standartlarına uymalı
- [ ] Hiçbir kişisel veri toplamamalı

## Sorular

Sorularınız için:
- Issue açın
- Discussion başlatın

Katkılarınız için teşekkürler! ❤️

