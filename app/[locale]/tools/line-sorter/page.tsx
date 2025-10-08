"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowDownAZ, ArrowUpAZ, Shuffle, ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function LineSorterPage() {
  const t = useTranslations("tools.lineSorter");
  const tCommon = useTranslations("common");

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const sortAZ = () => {
    const lines = input.split("\n").filter((l) => l.trim());
    setOutput(lines.sort((a, b) => a.localeCompare(b)).join("\n"));
  };

  const sortZA = () => {
    const lines = input.split("\n").filter((l) => l.trim());
    setOutput(lines.sort((a, b) => b.localeCompare(a)).join("\n"));
  };

  const sortNumeric = () => {
    const lines = input.split("\n").filter((l) => l.trim());
    setOutput(lines.sort((a, b) => parseFloat(a) - parseFloat(b)).join("\n"));
  };

  const shuffle = () => {
    const lines = input.split("\n").filter((l) => l.trim());
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setOutput(lines.join("\n"));
  };

  const reverse = () => {
    const lines = input.split("\n").filter((l) => l.trim());
    setOutput(lines.reverse().join("\n"));
  };

  const removeDuplicates = () => {
    const lines = input.split("\n").filter((l) => l.trim());
    const unique = [...new Set(lines)];
    setOutput(unique.join("\n"));
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
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={sortAZ}>
                <ArrowDownAZ className="h-4 w-4 mr-2" />
                {t("sortAZ")}
              </Button>
              <Button variant="outline" size="sm" onClick={sortZA}>
                <ArrowUpAZ className="h-4 w-4 mr-2" />
                {t("sortZA")}
              </Button>
              <Button variant="outline" size="sm" onClick={sortNumeric}>
                {t("sortNumeric")}
              </Button>
              <Button variant="outline" size="sm" onClick={shuffle}>
                <Shuffle className="h-4 w-4 mr-2" />
                {t("sortRandom")}
              </Button>
              <Button variant="outline" size="sm" onClick={reverse}>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {t("reverse")}
              </Button>
              <Button variant="outline" size="sm" onClick={removeDuplicates}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("removeDuplicates")}
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
              <CardTitle>{tCommon("output")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={output} readOnly className="min-h-[400px] font-mono" />
            </CardContent>
          </Card>
        </div>

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
