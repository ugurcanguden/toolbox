"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileJson, FileSpreadsheet, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks";

type Delimiter = "," | ";" | "\t";

export default function JsonToCsvPage() {
  const t = useTranslations("tools.jsonToCsv");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [jsonInput, setJsonInput] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const convertToCsv = () => {
    try {
      const data = JSON.parse(jsonInput);
      
      if (!Array.isArray(data) || data.length === 0) {
        setCsvOutput("Error: Input must be a non-empty JSON array");
        return;
      }

      const keys = Object.keys(data[0]);
      let csv = "";

      // Add headers
      if (includeHeaders) {
        csv = keys.join(delimiter) + "\n";
      }

      // Add rows
      data.forEach((row) => {
        const values = keys.map((key) => {
          const value = row[key];
          const stringValue = value === null || value === undefined ? "" : String(value);
          // Escape quotes and wrap in quotes if contains delimiter
          if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes("\n")) {
            return '"' + stringValue.replace(/"/g, '""') + '"';
          }
          return stringValue;
        });
        csv += values.join(delimiter) + "\n";
      });

      setCsvOutput(csv);
    } catch (error) {
      setCsvOutput("Error: Invalid JSON format");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([csvOutput], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
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
                  id="includeHeaders"
                  checked={includeHeaders}
                  onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
                />
                <Label htmlFor="includeHeaders" className="cursor-pointer">
                  {t("includeHeaders")}
                </Label>
              </div>
              <Button onClick={convertToCsv} className="ml-auto">
                {t("convert")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                {t("jsonInput")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("jsonPlaceholder")}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  {t("csvOutput")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(csvOutput)} disabled={!csvOutput}>
                    <Copy className="h-4 w-4 mr-2" />
                    {tCommon("copy")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={!csvOutput}>
                    <Download className="h-4 w-4 mr-2" />
                    {t("downloadCsv")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={csvOutput} readOnly className="min-h-[400px] font-mono text-sm" />
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
