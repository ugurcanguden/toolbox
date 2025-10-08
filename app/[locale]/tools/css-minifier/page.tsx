"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Code, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";

export default function CssMinifierPage() {
  const t = useTranslations("tools.cssMinifier");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const minifyCss = (css: string) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*{\s*/g, "{")
      .replace(/\s*}\s*/g, "}")
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*;\s*/g, ";")
      .replace(/;\s*}/g, "}")
      .trim();
  };

  const beautifyCss = (css: string) => {
    let formatted = "";
    let indent = 0;
    const tab = "  ";

    css.split("").forEach((char) => {
      if (char === "{") {
        formatted += " {\n";
        indent++;
      } else if (char === "}") {
        formatted += "\n" + tab.repeat(--indent) + "}\n";
      } else if (char === ";") {
        formatted += ";\n" + tab.repeat(indent);
      } else {
        formatted += char;
      }
    });

    return formatted.trim();
  };

  const handleMinify = () => {
    const result = minifyCss(input);
    setOutput(result);
  };

  const handleBeautify = () => {
    const result = beautifyCss(input);
    setOutput(result);
  };

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;
  const saved = originalSize - minifiedSize;
  const savedPercent = originalSize > 0 ? Math.round((saved / originalSize) * 100) : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  {tCommon("input")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleMinify}>
                    {t("minify")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBeautify}>
                    {t("beautify")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("inputPlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  {tCommon("output")}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => copy(output)} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {tCommon("copy")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={output} readOnly className="min-h-[500px] font-mono text-sm" />
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        {output && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("originalSize")}</p>
                  <p className="text-2xl font-bold">{originalSize} bytes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("minifiedSize")}</p>
                  <p className="text-2xl font-bold">{minifiedSize} bytes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("saved")}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {saved} bytes ({savedPercent}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
