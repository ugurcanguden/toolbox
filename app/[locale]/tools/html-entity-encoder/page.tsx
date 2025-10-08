"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Code, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";

const HTML_ENTITIES: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&apos;": "'",
  "&nbsp;": " ",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&euro;": "€",
  "&pound;": "£",
  "&yen;": "¥",
};

export default function HtmlEntityEncoderPage() {
  const t = useTranslations("tools.htmlEntityEncoder");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    let result = input;
    result = result.replace(/&/g, "&amp;");
    result = result.replace(/</g, "&lt;");
    result = result.replace(/>/g, "&gt;");
    result = result.replace(/"/g, "&quot;");
    result = result.replace(/'/g, "&apos;");
    setOutput(result);
  };

  const decode = () => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    setOutput(textarea.value);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={encode}>
                {t("encode")}
              </Button>
              <Button variant="outline" onClick={decode}>
                {t("decode")}
              </Button>
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
              <div className="flex items-center justify-between">
                <CardTitle>{tCommon("output")}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copy(output)} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {tCommon("copy")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={output} readOnly className="min-h-[400px] font-mono" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("commonEntities")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(HTML_ENTITIES).map(([entity, char]) => (
                <div key={entity} className="flex items-center justify-between p-2 border rounded">
                  <code className="text-sm text-muted-foreground">{entity}</code>
                  <span className="text-lg">{char}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
