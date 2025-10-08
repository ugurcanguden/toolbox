import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url
  const locales = ['en', 'de', 'tr', 'fr', 'pt']
  
  const tools = [
    'json-formatter',
    'xml-formatter',
    'base64',
    'url-encoder',
    'uuid-generator',
    'hash-generator',
    'password-generator',
    'qr-generator',
    'color-converter',
    'regex-tester',
    'string-tools',
    'text-compare',
    'markdown-preview',
    'jwt-decoder',
    'timestamp-converter',
    'lorem-generator',
    'case-converter',
    'html-formatter',
    'css-minifier',
    'sql-formatter',
    'image-to-base64',
    'number-base-converter',
    'word-counter',
    'line-sorter',
    'duplicate-remover',
    'html-entity-encoder',
    'json-to-csv',
    'csv-to-json',
    'yaml-formatter',
    'credit-card-validator',
  ]

  const routes: MetadataRoute.Sitemap = []

  // Add home page for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}`])
        ),
      },
    })
  })

  // Add all tools for each locale
  tools.forEach((tool) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/tools/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [loc, `${baseUrl}/${loc}/tools/${tool}`])
          ),
        },
      })
    })
  })

  return routes
}
