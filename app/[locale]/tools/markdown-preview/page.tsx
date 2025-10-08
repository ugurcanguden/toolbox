"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FileText, Copy, Download, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";
import { marked } from "marked";

export default function MarkdownPreviewPage() {
  const t = useTranslations("tools.markdownPreview");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [markdown, setMarkdown] = useState("");

  const sampleMarkdown = `# Markdown Preview Sample

## Heading 2
### Heading 3

**Bold text** and *italic text* and ***bold italic***

- List item 1
- List item 2
  - Nested item
  - Another nested item

1. Numbered list
2. Second item
3. Third item

[Link to Google](https://google.com)

\`inline code\`

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> Blockquote
> Multiple lines

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

---

~~Strikethrough~~

Task list:
- [x] Completed task
- [ ] Incomplete task
`;

  const html = useMemo(() => {
    try {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
      return marked(markdown);
    } catch (error) {
      return "<p>Error parsing markdown</p>";
    }
  }, [markdown]);

  const handleLoadSample = () => {
    setMarkdown(sampleMarkdown);
  };

  const handleCopyHtml = async () => {
    await copy(html as string);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([html as string], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleLoadSample}>
                <FileText className="h-4 w-4 mr-2" />
                {t("loadSample")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyHtml} disabled={!markdown}>
                <Copy className="h-4 w-4 mr-2" />
                {t("copyHtml")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadHtml} disabled={!markdown}>
                <Download className="h-4 w-4 mr-2" />
                {t("downloadHtml")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadMd} disabled={!markdown}>
                <FileCode className="h-4 w-4 mr-2" />
                {t("downloadMd")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Editor & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Markdown Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                {t("markdownInput")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("inputPlaceholder")}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="min-h-[500px] font-mono"
              />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("preview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose dark:prose-invert max-w-none min-h-[500px] p-4 border rounded-md"
                dangerouslySetInnerHTML={{ __html: html as string }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t("info.title")}</CardTitle>
            <CardDescription>{t("info.description")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
