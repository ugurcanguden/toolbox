"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Code, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";
import { useParams } from "next/navigation";
import { 
  ToolSeoContent, 
  ToolFaqSection, 
  JsonLdTool,
  PrivacyBadge 
} from "@/components";

export default function HtmlFormatterPage() {
  const t = useTranslations("tools.htmlFormatter");
  const tCommon = useTranslations("common");
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const { copy } = useCopyToClipboard();

  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [minified, setMinified] = useState("");

  const formatHtml = (html: string) => {
    let formatted = "";
    let indent = 0;
    const tab = "  ";

    html.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) indent--;
      formatted += tab.repeat(indent > 0 ? indent : 0) + "<" + node + ">\n";
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("input")) indent++;
    });

    return formatted.substring(1, formatted.length - 2);
  };

  const minifyHtml = (html: string) => {
    return html
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .trim();
  };

  const handleFormat = () => {
    try {
      const result = formatHtml(input);
      setFormatted(result);
    } catch (error) {
      setFormatted("Error formatting HTML");
    }
  };

  const handleMinify = () => {
    const result = minifyHtml(input);
    setMinified(result);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <PrivacyBadge />
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
                  <Button variant="outline" size="sm" onClick={handleFormat}>
                    {t("format")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleMinify}>
                    {t("minify")}
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
          <div className="space-y-6">
            {/* Formatted */}
            {formatted && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{t("formatted")}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => copy(formatted)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea value={formatted} readOnly className="min-h-[200px] font-mono text-sm" />
                </CardContent>
              </Card>
            )}

            {/* Minified */}
            {minified && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{t("minified")}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => copy(minified)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea value={minified} readOnly className="min-h-[200px] font-mono text-sm" />
                  <div className="mt-2 text-sm text-muted-foreground">
                    {tCommon("bytes")}: {new Blob([input]).size} → {new Blob([minified]).size} (
                    {Math.round(((new Blob([input]).size - new Blob([minified]).size) / new Blob([input]).size) * 100)}
                    % saved)
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <ToolSeoContent toolId="htmlFormatter" />
        <ToolFaqSection toolId="htmlFormatter" />

        <JsonLdTool
          locale={locale}
          tool={{
            id: "html-formatter",
            title: t("title"),
            description: t("description"),
            category: "utilities"
          }}
        />
      </div>
    </div>
  );
}
