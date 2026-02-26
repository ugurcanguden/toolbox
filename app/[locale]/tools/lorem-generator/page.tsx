"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCopyToClipboard } from "@/hooks";
import { useParams } from "next/navigation";
import { 
  ToolSeoContent, 
  ToolFaqSection, 
  JsonLdTool,
  PrivacyBadge 
} from "@/components";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremGeneratorPage() {
  const t = useTranslations("tools.loremGenerator");
  const tCommon = useTranslations("common");
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const { copy } = useCopyToClipboard();

  const [paragraphCount, setParagraphCount] = useState(3);
  const [output, setOutput] = useState("");
  const [startWithLorem, setStartWithLorem] = useState(true);

  const generateLorem = (paragraphs: number) => {
    const result: string[] = [];

    for (let i = 0; i < paragraphs; i++) {
      const sentenceCount = 3 + Math.floor(Math.random() * 5);
      const sentences: string[] = [];

      for (let j = 0; j < sentenceCount; j++) {
        const wordCount = 5 + Math.floor(Math.random() * 10);
        const words: string[] = [];

        // First paragraph, first sentence starts with "Lorem ipsum"
        if (i === 0 && j === 0 && startWithLorem) {
          words.push("Lorem", "ipsum", "dolor", "sit", "amet");
        }

        for (let k = words.length; k < wordCount; k++) {
          words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }

        let sentence = words.join(" ");
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
        sentences.push(sentence);
      }

      result.push(sentences.join(" "));
    }

    return result.join("\n\n");
  };

  const handleGenerate = () => {
    const lorem = generateLorem(paragraphCount);
    setOutput(lorem);
  };

  const handleCopy = async () => {
    await copy(output);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lorem-ipsum.txt";
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

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>{t("options")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label>{t("paragraphs")}</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={paragraphCount}
                  onChange={(e) => setParagraphCount(parseInt(e.target.value) || 1)}
                />
              </div>
              <Button onClick={handleGenerate}>{t("generate")}</Button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="startWithLorem"
                checked={startWithLorem}
                onCheckedChange={(checked) => setStartWithLorem(checked as boolean)}
              />
              <Label htmlFor="startWithLorem" className="cursor-pointer">
                {t("startWithLorem")}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        {output && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {tCommon("output")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t("copyText")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    {t("downloadText")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={output} readOnly className="min-h-[400px]" />
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <ToolSeoContent toolId="loremGenerator" />
        <ToolFaqSection toolId="loremGenerator" />

        <JsonLdTool
          locale={locale}
          tool={{
            id: "lorem-generator",
            title: t("title"),
            description: t("description"),
            category: "utilities"
          }}
        />
      </div>
    </div>
  );
}
