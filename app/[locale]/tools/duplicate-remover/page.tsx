"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { 
  ToolSeoContent, 
  ToolFaqSection, 
  JsonLdTool,
  PrivacyBadge 
} from "@/components";

export default function DuplicateRemoverPage() {
  const t = useTranslations("tools.duplicateRemover");
  const tCommon = useTranslations("common");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [keepLast, setKeepLast] = useState(false);

  const result = useMemo(() => {
    const lines = input.split("\n");
    const seen = new Map<string, number>();
    const output: string[] = [];

    lines.forEach((line, index) => {
      const key = caseSensitive ? line : line.toLowerCase();
      
      if (!seen.has(key)) {
        seen.set(key, index);
        output.push(line);
      } else if (keepLast) {
        const prevIndex = seen.get(key)!;
        output[output.indexOf(lines[prevIndex])] = "";
        seen.set(key, index);
        output.push(line);
      }
    });

    const uniqueLines = output.filter((l) => l !== "");
    const originalCount = lines.filter((l) => l.trim()).length;
    const uniqueCount = uniqueLines.filter((l) => l.trim()).length;
    const duplicatesRemoved = originalCount - uniqueCount;

    return {
      output: uniqueLines.join("\n"),
      originalCount,
      uniqueCount,
      duplicatesRemoved,
    };
  }, [input, caseSensitive, keepLast]);

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

        <Card>
          <CardHeader>
            <CardTitle>{tCommon("options") || "Options"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="caseSensitive"
                  checked={caseSensitive}
                  onCheckedChange={(checked) => setCaseSensitive(checked as boolean)}
                />
                <Label htmlFor="caseSensitive" className="cursor-pointer">
                  {t("caseSensitive")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="keepLast"
                  checked={keepLast}
                  onCheckedChange={(checked) => setKeepLast(checked as boolean)}
                />
                <Label htmlFor="keepLast" className="cursor-pointer">
                  {keepLast ? t("keepLast") : t("keepFirst")}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("originalLines")}</p>
                <p className="text-2xl font-bold">{result.originalCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("uniqueLines")}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.uniqueCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("duplicatesRemoved")}</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.duplicatesRemoved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{tCommon("input")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("inputPlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tCommon("output")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={result.output} readOnly className="min-h-[400px] font-mono" />
            </CardContent>
          </Card>
        </div>

        <ToolSeoContent toolId="duplicateRemover" />
        <ToolFaqSection toolId="duplicateRemover" />

        <JsonLdTool
          locale={locale}
          tool={{
            id: "duplicate-remover",
            title: t("title"),
            description: t("description"),
            category: "utilities"
          }}
        />
      </div>
    </div>
  );
}
