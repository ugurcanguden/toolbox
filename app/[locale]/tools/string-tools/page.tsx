"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  removeUnicode,
  removeAccents,
  asciiOnly,
  removeEmoji,
  removeSpecialChars,
  lettersOnly,
  numbersOnly,
  alphanumericOnly,
  normalizeSpaces,
  trim,
  removeAllSpaces,
  tabsToSpaces,
  spacesToTabs,
  escapeJsonString,
  unescapeJsonString,
  urlQueryEncode,
  urlQueryDecode,
  formDataEncode,
  formDataDecode,
  removeZeroWidth,
  showInvisible,
  decodeHtmlEntities,
  encodeHtmlEntities,
  reverseText,
  getTextStats,
  type TextStats,
} from "@/lib";

export default function StringToolsPage() {
  const t = useTranslations("tools.stringTools");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();
  const params = useParams();
  const locale = params.locale as string;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersWithoutSpaces: 0,
    words: 0,
    lines: 0,
    bytes: 0,
  });

  const handleInputChange = (value: string) => {
    setInput(value);
    setStats(getTextStats(value));
  };

  const applyTransformation = (fn: (str: string, locale?: string) => string) => {
    const result = fn(input, locale);
    setOutput(result);
    setStats(getTextStats(result));
  };

  const applySimpleTransformation = (fn: (str: string) => string) => {
    const result = fn(input);
    setOutput(result);
    setStats(getTextStats(result));
  };

  const handleCopyResult = async () => {
    await copy(output);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {tCommon("input")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("inputPlaceholder")}
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[400px] font-mono"
              />
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {tCommon("output")}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleCopyResult} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t("copyResult")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                className="min-h-[400px] font-mono"
                placeholder={t("inputPlaceholder")}
              />
            </CardContent>
          </Card>
        </div>

        {/* Operations */}
        <Card>
          <CardHeader>
            <CardTitle>{t("operations")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Case Transform */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">{t("caseTransform")}</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => applyTransformation(toUpperCase)}>
                  {t("uppercase")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTransformation(toLowerCase)}>
                  {t("lowercase")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTransformation(toTitleCase)}>
                  {t("titleCase")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTransformation(toCamelCase)}>
                  {t("camelCase")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTransformation(toPascalCase)}>
                  {t("pascalCase")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTransformation(toSnakeCase)}>
                  {t("snakeCase")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTransformation(toKebabCase)}>
                  {t("kebabCase")}
                </Button>
              </div>
            </div>

            {/* Unicode & Special Characters */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">{t("unicodeOps")}</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(removeUnicode)}>
                  {t("removeUnicode")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(removeAccents)}>
                  {t("removeAccents")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(asciiOnly)}>
                  {t("asciiOnly")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(removeEmoji)}>
                  {t("removeEmoji")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(removeSpecialChars)}>
                  {t("removeSpecialChars")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(lettersOnly)}>
                  {t("lettersOnly")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(numbersOnly)}>
                  {t("numbersOnly")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(alphanumericOnly)}>
                  {t("alphanumericOnly")}
                </Button>
              </div>
            </div>

            {/* Whitespace Operations */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">{t("whitespaceOps")}</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(normalizeSpaces)}>
                  {t("normalizeSpaces")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(trim)}>
                  {t("trim")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(removeAllSpaces)}>
                  {t("removeAllSpaces")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(tabsToSpaces)}>
                  {t("tabsToSpaces")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(spacesToTabs)}>
                  {t("spacesToTabs")}
                </Button>
              </div>
            </div>

            {/* API & JSON Operations */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">{t("apiJsonOps")}</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(escapeJsonString)}>
                  {t("escapeJsonString")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(unescapeJsonString)}>
                  {t("unescapeJsonString")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(urlQueryEncode)}>
                  {t("urlQueryEncode")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(urlQueryDecode)}>
                  {t("urlQueryDecode")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(formDataEncode)}>
                  {t("formDataEncode")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(formDataDecode)}>
                  {t("formDataDecode")}
                </Button>
              </div>
            </div>

            {/* Other Operations */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">{t("otherOps")}</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(removeZeroWidth)}>
                  {t("removeZeroWidth")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(showInvisible)}>
                  {t("showInvisible")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(decodeHtmlEntities)}>
                  {t("decodeHtmlEntities")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(encodeHtmlEntities)}>
                  {t("encodeHtmlEntities")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => applySimpleTransformation(reverseText)}>
                  {t("reverse")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>{t("stats")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("characters")}</p>
                <p className="text-2xl font-bold">{stats.characters}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("withoutSpaces")}</p>
                <p className="text-2xl font-bold">{stats.charactersWithoutSpaces}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("words")}</p>
                <p className="text-2xl font-bold">{stats.words}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("lines")}</p>
                <p className="text-2xl font-bold">{stats.lines}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("bytes")}</p>
                <p className="text-2xl font-bold">{stats.bytes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
