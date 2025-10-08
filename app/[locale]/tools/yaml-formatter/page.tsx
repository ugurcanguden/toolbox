"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileCode, Copy, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";
import yaml from "js-yaml";

export default function YamlFormatterPage() {
  const t = useTranslations("tools.yamlFormatter");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleFormat = () => {
    try {
      const parsed = yaml.load(input);
      const formatted = yaml.dump(parsed, {
        indent: 2,
        lineWidth: 80,
        noRefs: true,
      });
      setOutput(formatted);
      setIsValid(true);
    } catch (error) {
      setOutput("Error: " + (error as Error).message);
      setIsValid(false);
    }
  };

  const handleValidate = () => {
    try {
      yaml.load(input);
      setIsValid(true);
      setOutput(t("valid"));
    } catch (error) {
      setIsValid(false);
      setOutput(t("invalid") + ": " + (error as Error).message);
    }
  };

  const handleToJson = () => {
    try {
      const parsed = yaml.load(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setIsValid(true);
    } catch (error) {
      setOutput("Error: " + (error as Error).message);
      setIsValid(false);
    }
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
              <Button variant="outline" onClick={handleFormat}>
                {t("format")}
              </Button>
              <Button variant="outline" onClick={handleValidate}>
                {t("validate")}
              </Button>
              <Button variant="outline" onClick={handleToJson}>
                {t("toJson")}
              </Button>
              {isValid !== null && (
                <div
                  className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full ${isValid ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}
                >
                  {isValid ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {t("valid")}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      {t("invalid")}
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                {tCommon("input")}
              </CardTitle>
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
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
