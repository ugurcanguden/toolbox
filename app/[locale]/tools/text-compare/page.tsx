"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftRight, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { diffLines, diffWords, Change } from "diff";

type ViewMode = "side-by-side" | "unified";

interface DiffStats {
  linesAdded: number;
  linesRemoved: number;
  linesChanged: number;
  linesUnchanged: number;
  charactersAdded: number;
  charactersRemoved: number;
}

export default function TextComparePage() {
  const t = useTranslations("tools.textCompare");

  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);

  const processText = useCallback(
    (text: string): string => {
      let processed = text;
      if (!caseSensitive) {
        processed = processed.toLowerCase();
      }
      if (ignoreWhitespace) {
        processed = processed.replace(/\s+/g, " ").trim();
      }
      return processed;
    },
    [caseSensitive, ignoreWhitespace]
  );

  const diffResult = useMemo(() => {
    const text1 = processText(originalText);
    const text2 = processText(modifiedText);
    return diffLines(text1, text2);
  }, [originalText, modifiedText, processText]);

  const stats = useMemo((): DiffStats => {
    let linesAdded = 0;
    let linesRemoved = 0;
    let linesChanged = 0;
    let linesUnchanged = 0;
    let charactersAdded = 0;
    let charactersRemoved = 0;

    diffResult.forEach((part) => {
      const lineCount = part.value.split("\n").length - 1 || 1;
      const charCount = part.value.length;

      if (part.added) {
        linesAdded += lineCount;
        charactersAdded += charCount;
      } else if (part.removed) {
        linesRemoved += lineCount;
        charactersRemoved += charCount;
      } else {
        linesUnchanged += lineCount;
      }
    });

    linesChanged = Math.min(linesAdded, linesRemoved);
    linesAdded -= linesChanged;
    linesRemoved -= linesChanged;

    return {
      linesAdded,
      linesRemoved,
      linesChanged,
      linesUnchanged,
      charactersAdded,
      charactersRemoved,
    };
  }, [diffResult]);

  const isIdentical = useMemo(() => {
    return diffResult.every((part) => !part.added && !part.removed);
  }, [diffResult]);

  const handleClear = () => {
    setOriginalText("");
    setModifiedText("");
  };

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  const renderDiffLine = (line: string, type: "added" | "removed" | "unchanged", lineNum: number) => {
    const bgColor =
      type === "added"
        ? "bg-green-100 dark:bg-green-900/30"
        : type === "removed"
          ? "bg-red-100 dark:bg-red-900/30"
          : "";

    const textColor =
      type === "added"
        ? "text-green-800 dark:text-green-200"
        : type === "removed"
          ? "text-red-800 dark:text-red-200"
          : "text-foreground";

    const prefix = type === "added" ? "+ " : type === "removed" ? "- " : "  ";

    return (
      <div key={`${type}-${lineNum}`} className={`flex font-mono text-sm ${bgColor} ${textColor}`}>
        <span className="w-12 flex-shrink-0 text-right pr-2 text-muted-foreground select-none">{lineNum}</span>
        <span className="flex-1 whitespace-pre-wrap break-all">
          {prefix}
          {line}
        </span>
      </div>
    );
  };

  const renderUnifiedView = () => {
    let lineNumber = 1;
    const lines: JSX.Element[] = [];

    diffResult.forEach((part, index) => {
      const partLines = part.value.split("\n");
      partLines.forEach((line, i) => {
        // Skip empty last line
        if (i === partLines.length - 1 && line === "") return;

        if (part.added) {
          lines.push(renderDiffLine(line, "added", lineNumber++));
        } else if (part.removed) {
          lines.push(renderDiffLine(line, "removed", lineNumber++));
        } else {
          lines.push(renderDiffLine(line, "unchanged", lineNumber++));
        }
      });
    });

    return <div className="border rounded-md overflow-hidden">{lines}</div>;
  };

  const renderSideBySideView = () => {
    const originalLines = originalText.split("\n");
    const modifiedLines = modifiedText.split("\n");
    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Original Text */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t("originalText")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              {originalLines.map((line, index) => {
                const isChanged = modifiedLines[index] !== line;
                return (
                  <div
                    key={`orig-${index}`}
                    className={`flex font-mono text-sm ${isChanged && modifiedLines[index] !== undefined ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200" : ""}`}
                  >
                    <span className="w-12 flex-shrink-0 text-right pr-2 text-muted-foreground select-none">
                      {index + 1}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-all">{line}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Modified Text */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t("modifiedText")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              {modifiedLines.map((line, index) => {
                const isChanged = originalLines[index] !== line;
                return (
                  <div
                    key={`mod-${index}`}
                    className={`flex font-mono text-sm ${isChanged && originalLines[index] !== undefined ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" : ""}`}
                  >
                    <span className="w-12 flex-shrink-0 text-right pr-2 text-muted-foreground select-none">
                      {index + 1}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-all">{line}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Input Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Text */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("originalText")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("originalPlaceholder")}
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                className="min-h-[300px] font-mono"
              />
            </CardContent>
          </Card>

          {/* Modified Text */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("modifiedText")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("modifiedPlaceholder")}
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                className="min-h-[300px] font-mono"
              />
            </CardContent>
          </Card>
        </div>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>{t("options")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              {/* View Mode */}
              <div className="space-y-2">
                <Label>{t("viewMode")}</Label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "side-by-side" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("side-by-side")}
                  >
                    {t("sideBySide")}
                  </Button>
                  <Button
                    variant={viewMode === "unified" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("unified")}
                  >
                    {t("unified")}
                  </Button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignoreWhitespace"
                    checked={ignoreWhitespace}
                    onCheckedChange={(checked) => setIgnoreWhitespace(checked as boolean)}
                  />
                  <Label htmlFor="ignoreWhitespace" className="cursor-pointer">
                    {t("ignoreWhitespace")}
                  </Label>
                </div>
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
              </div>

              {/* Actions */}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm" onClick={handleSwap}>
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  {t("swap")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("clear")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>{t("statistics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status */}
              <div
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${isIdentical ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"}`}
              >
                {isIdentical ? t("identical") : t("different")}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("linesAdded")}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.linesAdded}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("linesRemoved")}</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.linesRemoved}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("linesChanged")}</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.linesChanged}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("linesUnchanged")}</p>
                  <p className="text-2xl font-bold">{stats.linesUnchanged}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("charactersAdded")}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.charactersAdded}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("charactersRemoved")}</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.charactersRemoved}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diff View */}
        {originalText && modifiedText && (
          <Card>
            <CardHeader>
              <CardTitle>{t("showDiff")}</CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === "unified" ? renderUnifiedView() : renderSideBySideView()}
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
