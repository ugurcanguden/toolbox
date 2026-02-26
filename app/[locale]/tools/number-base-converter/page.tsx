"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Binary, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCopyToClipboard } from "@/hooks";
import { useParams } from "next/navigation";
import { 
  ToolSeoContent, 
  ToolFaqSection, 
  JsonLdTool,
  PrivacyBadge 
} from "@/components";

export default function NumberBaseConverterPage() {
  const t = useTranslations("tools.numberBaseConverter");
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const { copy } = useCopyToClipboard();

  const [decimal, setDecimal] = useState("");
  const [binary, setBinary] = useState("");
  const [octal, setOctal] = useState("");
  const [hex, setHex] = useState("");

  const handleDecimalChange = (value: string) => {
    setDecimal(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setBinary(num.toString(2));
      setOctal(num.toString(8));
      setHex(num.toString(16).toUpperCase());
    } else {
      setBinary("");
      setOctal("");
      setHex("");
    }
  };

  const handleBinaryChange = (value: string) => {
    setBinary(value);
    const num = parseInt(value, 2);
    if (!isNaN(num)) {
      setDecimal(num.toString(10));
      setOctal(num.toString(8));
      setHex(num.toString(16).toUpperCase());
    } else {
      setDecimal("");
      setOctal("");
      setHex("");
    }
  };

  const handleOctalChange = (value: string) => {
    setOctal(value);
    const num = parseInt(value, 8);
    if (!isNaN(num)) {
      setDecimal(num.toString(10));
      setBinary(num.toString(2));
      setHex(num.toString(16).toUpperCase());
    } else {
      setDecimal("");
      setBinary("");
      setHex("");
    }
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    const num = parseInt(value, 16);
    if (!isNaN(num)) {
      setDecimal(num.toString(10));
      setBinary(num.toString(2));
      setOctal(num.toString(8));
    } else {
      setDecimal("");
      setBinary("");
      setOctal("");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <PrivacyBadge />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Decimal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-muted-foreground font-medium">{t("decimal")}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copy(decimal)} disabled={!decimal}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder={t("decimalPlaceholder")}
                value={decimal}
                onChange={(e) => handleDecimalChange(e.target.value)}
                className="font-mono text-lg"
              />
            </CardContent>
          </Card>

          {/* Binary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-muted-foreground font-medium">{t("binary")}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copy(binary)} disabled={!binary}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder={t("binaryPlaceholder")}
                value={binary}
                onChange={(e) => handleBinaryChange(e.target.value)}
                className="font-mono text-lg"
              />
            </CardContent>
          </Card>

          {/* Octal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-muted-foreground font-medium">{t("octal")}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copy(octal)} disabled={!octal}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder={t("octalPlaceholder")}
                value={octal}
                onChange={(e) => handleOctalChange(e.target.value)}
                className="font-mono text-lg"
              />
            </CardContent>
          </Card>

          {/* Hexadecimal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-muted-foreground font-medium">{t("hexadecimal")}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copy(hex)} disabled={!hex}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                placeholder={t("hexPlaceholder")}
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="font-mono text-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <ToolSeoContent toolId="numberBaseConverter" />
        <ToolFaqSection toolId="numberBaseConverter" />

        <JsonLdTool
          locale={locale}
          tool={{
            id: "number-base-converter",
            title: t("title"),
            description: t("description"),
            category: "utilities"
          }}
        />
      </div>
    </div>
  );
}
