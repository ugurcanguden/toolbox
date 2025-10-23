#!/usr/bin/env tsx

/**
 * SEO Diagnosis Script
 * Analyzes crawl data and generates diagnostic reports
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

interface CrawlData {
  url: string;
  finalUrl: string;
  status: number;
  title: string;
  h1Count: number;
  canonical: string;
  robots: string;
  contentLength: number;
  internalLinks: number;
  externalLinks: number;
  hasMetaDescription: boolean;
  metaDescription: string;
  lastModified: string;
}

interface DiagnosticResult {
  altWithCanonical: CrawlData[];
  notFound404: CrawlData[];
  redirects: CrawlData[];
  discoveredNotIndexed: CrawlData[];
  crawledNotIndexed: CrawlData[];
  duplicateCanonical: { canonical: string; urls: string[] }[];
}

class SEODiagnoser {
  private outputDir: string;
  private crawlData: CrawlData[] = [];

  constructor() {
    this.outputDir = path.join(process.cwd(), 'seo-output');
  }

  async diagnose() {
    console.log('🔍 Starting SEO diagnosis...');
    
    try {
      // Load crawl data
      await this.loadCrawlData();
      console.log(`📊 Loaded ${this.crawlData.length} crawl records`);
      
      // Perform diagnosis
      const results = this.performDiagnosis();
      
      // Generate CSV reports
      await this.generateReports(results);
      
      console.log('✅ Diagnosis complete!');
      
    } catch (error) {
      console.error('❌ Error during diagnosis:', error);
      process.exit(1);
    }
  }

  private async loadCrawlData(): Promise<void> {
    const csvPath = path.join(this.outputDir, 'crawl.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`Crawl data not found at: ${csvPath}`);
    }
    
    return new Promise((resolve, reject) => {
      const records: CrawlData[] = [];
      
      fs.createReadStream(csvPath)
        .pipe(parse({ 
          columns: true,
          skip_empty_lines: true 
        }))
        .on('data', (record) => {
          records.push({
            ...record,
            status: parseInt(record.status) || 0,
            h1Count: parseInt(record.h1Count) || 0,
            contentLength: parseInt(record.contentLength) || 0,
            internalLinks: parseInt(record.internalLinks) || 0,
            externalLinks: parseInt(record.externalLinks) || 0,
            hasMetaDescription: record.hasMetaDescription === 'true',
          });
        })
        .on('end', () => {
          this.crawlData = records;
          resolve();
        })
        .on('error', reject);
    });
  }

  private performDiagnosis(): DiagnosticResult {
    const results: DiagnosticResult = {
      altWithCanonical: [],
      notFound404: [],
      redirects: [],
      discoveredNotIndexed: [],
      crawledNotIndexed: [],
      duplicateCanonical: []
    };

    // 1. Alt with canonical (pages with canonical pointing to different URL)
    results.altWithCanonical = this.crawlData.filter(data => {
      return data.status === 200 && 
             data.canonical && 
             data.canonical !== data.finalUrl &&
             !data.canonical.startsWith('http') || 
             (data.canonical.startsWith('http') && data.canonical !== data.finalUrl);
    });

    // 2. 404 Not Found
    results.notFound404 = this.crawlData.filter(data => data.status === 404);

    // 3. Redirects (3xx status codes)
    results.redirects = this.crawlData.filter(data => 
      data.status >= 300 && data.status < 400
    );

    // 4. Discovered but not indexed (thin content, missing elements)
    results.discoveredNotIndexed = this.crawlData.filter(data => {
      return data.status === 200 && (
        data.contentLength < 500 || // Thin content
        !data.title || // Missing title
        data.h1Count === 0 || // No H1
        !data.hasMetaDescription || // No meta description
        data.internalLinks < 2 || // Poor internal linking
        data.title.length < 10 || // Very short title
        data.metaDescription.length < 50 // Short description
      );
    });

    // 5. Crawled but not indexed (indexing issues)
    results.crawledNotIndexed = this.crawlData.filter(data => {
      return data.status === 200 && (
        data.robots.includes('noindex') || // Explicitly noindex
        data.canonical !== data.finalUrl || // Non-self canonical
        data.internalLinks === 0 || // No internal links
        data.title === '' || // Empty title
        data.h1Count === 0 // No H1 tags
      );
    });

    // 6. Duplicate canonical URLs
    const canonicalMap = new Map<string, string[]>();
    this.crawlData.forEach(data => {
      if (data.canonical && data.status === 200) {
        const canonical = data.canonical;
        if (!canonicalMap.has(canonical)) {
          canonicalMap.set(canonical, []);
        }
        canonicalMap.get(canonical)!.push(data.finalUrl);
      }
    });

    results.duplicateCanonical = Array.from(canonicalMap.entries())
      .filter(([_, urls]) => urls.length > 1)
      .map(([canonical, urls]) => ({ canonical, urls }));

    return results;
  }

  private async generateReports(results: DiagnosticResult): Promise<void> {
    // Generate alt-with-canonical.csv
    await this.writeCSV('alt-with-canonical.csv', results.altWithCanonical);
    
    // Generate 404.csv
    await this.writeCSV('404.csv', results.notFound404);
    
    // Generate redirect.csv
    await this.writeCSV('redirect.csv', results.redirects);
    
    // Generate discovered-not-indexed.csv
    await this.writeCSV('discovered-not-indexed.csv', results.discoveredNotIndexed);
    
    // Generate crawled-not-indexed.csv
    await this.writeCSV('crawled-not-indexed.csv', results.crawledNotIndexed);
    
    // Generate duplicate-canonical.csv
    await this.writeCSV('duplicate-canonical.csv', results.duplicateCanonical.map(item => ({
      canonical: item.canonical,
      urls: item.urls.join(', ')
    })));

    console.log('📄 Generated diagnostic reports:');
    console.log(`  - alt-with-canonical.csv: ${results.altWithCanonical.length} issues`);
    console.log(`  - 404.csv: ${results.notFound404.length} issues`);
    console.log(`  - redirect.csv: ${results.redirects.length} issues`);
    console.log(`  - discovered-not-indexed.csv: ${results.discoveredNotIndexed.length} issues`);
    console.log(`  - crawled-not-indexed.csv: ${results.crawledNotIndexed.length} issues`);
    console.log(`  - duplicate-canonical.csv: ${results.duplicateCanonical.length} issues`);
  }

  private async writeCSV(filename: string, data: any[]): Promise<void> {
    if (data.length === 0) {
      console.log(`⚠️ No data for ${filename}`);
      return;
    }

    const csvPath = path.join(this.outputDir, filename);
    const stringifier = stringify({ header: true });
    const writeStream = fs.createWriteStream(csvPath);
    
    stringifier.pipe(writeStream);
    
    for (const record of data) {
      stringifier.write(record);
    }
    
    stringifier.end();
  }
}

// Main execution
async function main() {
  const diagnoser = new SEODiagnoser();
  await diagnoser.diagnose();
}

if (require.main === module) {
  main().catch(console.error);
}

export { SEODiagnoser };
