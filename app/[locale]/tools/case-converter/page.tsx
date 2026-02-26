"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Type, Copy, Download } from "lucide-react";
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

export default function CaseConverterPage() {
  const t = useTranslations("tools.caseConverter");
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const { copy } = useCopyToClipboard();

  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState({
    sentence: "",
    lower: "",
    upper: "",
    capitalized: "",
    alternating: "",
    title: "",
    inverse: "",
  });

  const handleConvert = (text: string) => {
    setInput(text);

    setOutputs({
      sentence: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      lower: text.toLowerCase(),
      upper: text.toUpperCase(),
      capitalized: text.replace(/\b\w/g, (c) => c.toUpperCase()),
      alternating: text
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
      title: text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
      inverse: text
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
    });
  };

  const handleCopyOutput = async (output: string) => {
    await copy(output);
  };

  const handleDownload = () => {
    const content = Object.entries(outputs)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "case-conversions.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <PrivacyBadge />
        </div>

        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              {t("inputText")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("inputPlaceholder")}
              value={input}
              onChange={(e) => handleConvert(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        {/* Outputs */}
        {input && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("sentenceCase")}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyOutput(outputs.sentence)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm break-words">{outputs.sentence}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("lowerCase")}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyOutput(outputs.lower)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm break-words">{outputs.lower}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("upperCase")}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyOutput(outputs.upper)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm break-words">{outputs.upper}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("capitalizedCase")}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyOutput(outputs.capitalized)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm break-words">{outputs.capitalized}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("alternatingCase")}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyOutput(outputs.alternating)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm break-words">{outputs.alternating}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("titleCase")}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyOutput(outputs.title)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm break-words">{outputs.title}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("inverseCase")}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyOutput(outputs.inverse)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm break-words">{outputs.inverse}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t("downloadText")}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <ToolSeoContent toolId="caseConverter" />
        <ToolFaqSection toolId="caseConverter" />

        <JsonLdTool
          locale={locale}
          tool={{
            id: "case-converter",
            title: t("title"),
            description: t("description"),
            category: "text"
          }}
        />
      </div>
    </div>
  );
}
