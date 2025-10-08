"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileSpreadsheet, FileJson, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks";

type Delimiter = "," | ";" | "\t";

export default function CsvToJsonPage() {
  const t = useTranslations("tools.csvToJson");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [firstRowHeaders, setFirstRowHeaders] = useState(true);

  const convertToJson = () => {
    try {
      const lines = csvInput.trim().split("\n");
      if (lines.length === 0) {
        setJsonOutput("Error: Empty input");
        return;
      }

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      let headers: string[];
      let dataLines: string[][];

      if (firstRowHeaders) {
        headers = parseCSVLine(lines[0]);
        dataLines = lines.slice(1).map((line) => parseCSVLine(line));
      } else {
        const firstLine = parseCSVLine(lines[0]);
        headers = firstLine.map((_, index) => `column${index + 1}`);
        dataLines = lines.map((line) => parseCSVLine(line));
      }

      const jsonData = dataLines.map((line) => {
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = line[index] || "";
        });
        return obj;
      });

      setJsonOutput(JSON.stringify(jsonData, null, 2));
    } catch (error) {
      setJsonOutput("Error: Failed to parse CSV");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
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
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-2">
                <Label>{t("delimiter")}</Label>
                <div className="flex gap-2">
                  <Button
                    variant={delimiter === "," ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDelimiter(",")}
                  >
                    {t("comma")}
                  </Button>
                  <Button
                    variant={delimiter === ";" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDelimiter(";")}
                  >
                    {t("semicolon")}
                  </Button>
                  <Button
                    variant={delimiter === "\t" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDelimiter("\t")}
                  >
                    {t("tab")}
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="firstRowHeaders"
                  checked={firstRowHeaders}
                  onCheckedChange={(checked) => setFirstRowHeaders(checked as boolean)}
                />
                <Label htmlFor="firstRowHeaders" className="cursor-pointer">
                  {t("firstRowHeaders")}
                </Label>
              </div>
              <Button onClick={convertToJson} className="ml-auto">
                {t("convert")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                {t("csvInput")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("csvPlaceholder")}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  {t("jsonOutput")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(jsonOutput)} disabled={!jsonOutput}>
                    <Copy className="h-4 w-4 mr-2" />
                    {tCommon("copy")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={!jsonOutput}>
                    <Download className="h-4 w-4 mr-2" />
                    {t("downloadJson")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={jsonOutput} readOnly className="min-h-[400px] font-mono text-sm" />
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
