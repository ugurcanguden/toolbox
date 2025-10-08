# 🧰 Toolbox - World's Best Developer Tools Collection

**Version 2.0.0** | **30 Production-Ready Tools** | **5 Languages** | **PWA Ready**

A modern, multilingual collection of 30+ useful tools for everyone, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌟 Features

- **🌍 Multilingual Support**: English, German, Turkish, French, and Portuguese (100% coverage)
- **🎨 Theme Support**: Light, Dark, and System preference with smooth transitions
- **🔒 Privacy First**: No personal data collection, all processing happens client-side
- **⚡ Fast & Modern**: Built with Next.js 14 App Router, PWA ready, SEO optimized
- **📱 PWA Ready**: Install as an app, works offline
- **🔍 Search & Filter**: Find tools quickly with smart search and category filters
- **♿ Accessible**: WCAG compliant with proper ARIA labels

## 🛠 30 Production-Ready Tools

### 📝 Formatters (6)
1. **JSON Formatter** - Format, minify, validate with tree view
2. **XML Formatter** - Format XML with collapsible tree view
3. **Markdown Preview** - Real-time GFM preview
4. **HTML Formatter** - Format and minify HTML
5. **SQL Formatter** - Format SQL with syntax highlighting
6. **YAML Formatter** - Format, validate, convert to JSON

### 🔐 Encoders/Decoders (5)
7. **Base64 Encoder/Decoder** - Encode/decode strings and files
8. **URL Encoder/Decoder** - Encode URLs with query parser
9. **JWT Decoder** - Decode JSON Web Tokens
10. **HTML Entity Encoder** - Convert special characters
11. **CSV ↔ JSON** - Bidirectional CSV/JSON conversion

### 🎲 Generators (4)
12. **UUID Generator** - Generate UUIDs in bulk
13. **Hash Generator** - MD5, SHA-1/256/512, HMAC
14. **Password Generator** - Strong passwords with strength meter
15. **Lorem Ipsum Generator** - Placeholder text generator

### 🔄 Converters (7)
16. **Color Converter** - HEX, RGB, HSL, HSV, CMYK + 40-color palette
17. **Timestamp Converter** - Unix timestamp ↔ Date
18. **Case Converter** - 7 different case styles
19. **Image to Base64** - Convert images to Base64
20. **Number Base Converter** - Binary, Octal, Decimal, Hex
21. **JSON to CSV** - Export JSON as CSV
22. **CSV to JSON** - Import CSV as JSON

### 📄 Text Tools (7)
23. **String Tools** - 31+ text operations (Unicode, API, JSON escape)
24. **Text Compare** - Side-by-side & unified diff viewer
25. **Regex Tester** - Real-time regex testing
26. **Word Counter** - Count words, characters, reading time
27. **Line Sorter** - Sort, shuffle, reverse lines
28. **Duplicate Remover** - Remove duplicate lines
29. **Case Converter** - Multiple case transformations

### 🛠️ Utilities (3)
30. **QR Code Generator** - Generate QR codes (PNG/SVG)
31. **CSS Minifier** - Minify and beautify CSS
32. **Credit Card Validator** - Validate cards with Luhn algorithm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd developertools
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Internationalization**: next-intl (5 languages)
- **Theme**: next-themes (Light/Dark)
- **Icons**: lucide-react
- **PWA**: manifest.json, service worker ready
- **SEO**: Dynamic sitemap, robots.txt, Open Graph
- **Security**: Security headers, XSS protection
- **Libraries**: marked, js-yaml, qrcode, diff

## 🎯 Highlights

✅ **30 Tools** - Production ready  
✅ **5 Languages** - EN, DE, TR, FR, PT  
✅ **Search & Filter** - Find tools quickly  
✅ **Syntax Highlighting** - SQL formatter  
✅ **File Support** - Upload/download capabilities  
✅ **Real-time Processing** - Instant results  
✅ **Copy to Clipboard** - One-click copy  
✅ **Dark Mode** - Beautiful themes  
✅ **Mobile Responsive** - Works everywhere  
✅ **0 Data Collection** - Complete privacy

## 📁 Project Structure

\`\`\`
/app                    # Next.js App Router
  /[locale]            # Locale-based routing
/components            # Reusable components
  /ui                  # shadcn/ui components
  /layout              # Layout components
  /tools               # Tool-specific components
/lib                   # Utilities and helpers
/hooks                 # Custom React hooks
/types                 # TypeScript type definitions
/i18n                  # Internationalization
  /locales             # Translation files
/public                # Static assets
/styles                # Global styles
\`\`\`

## 🌐 Supported Languages

- English (en)
- Deutsch (de)
- Türkçe (tr)
- Français (fr)
- Português (pt)

## 🎨 Theme System

The application supports three theme modes:
- Light mode
- Dark mode
- System preference (automatic)

Theme preference is stored in localStorage.

## 📝 Adding New Tools

1. Create a new directory in \`app/[locale]/tools/[tool-name]\`
2. Add the tool page component
3. Update translation files in \`i18n/locales/\`
4. Add the tool to the home page tools array

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

