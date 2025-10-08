"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Key, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";

interface JWTDecoded {
  header: Record<string, any>;
  payload: Record<string, any>;
  signature: string;
  isValid: boolean;
  error?: string;
}

export default function JWTDecoderPage() {
  const t = useTranslations("tools.jwtDecoder");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [token, setToken] = useState("");

  const sampleToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzY4MTIzNDUsImlzcyI6InRvb2xib3guZGV2IiwiYXVkIjoidXNlcnMifQ.4TQz8qVKzZ0VxQz6tZLW8xHxQz0VxQz6tZLW8xHxQz0";

  const decoded = useMemo((): JWTDecoded => {
    if (!token) {
      return {
        header: {},
        payload: {},
        signature: "",
        isValid: false,
      };
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return {
          header: {},
          payload: {},
          signature: "",
          isValid: false,
          error: t("invalidToken"),
        };
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      return {
        header,
        payload,
        signature,
        isValid: true,
      };
    } catch (error) {
      return {
        header: {},
        payload: {},
        signature: "",
        isValid: false,
        error: t("invalidToken"),
      };
    }
  }, [token, t]);

  const handleLoadSample = () => {
    setToken(sampleToken);
  };

  const handleCopyDecoded = async () => {
    const output = {
      header: decoded.header,
      payload: decoded.payload,
      signature: decoded.signature,
    };
    await copy(JSON.stringify(output, null, 2));
  };

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Token Input */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {t("tokenInput")}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleLoadSample}>
                {t("loadSample")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("tokenPlaceholder")}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Error Message */}
        {decoded.error && (
          <Card className="border-red-500 bg-red-50 dark:bg-red-900/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p>{decoded.error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Decoded Output */}
        {decoded.isValid && (
          <>
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("header")}</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleCopyDecoded}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t("copyDecoded")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                  <code>{JSON.stringify(decoded.header, null, 2)}</code>
                </pre>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">{t("algorithm")}:</span>
                    <span className="text-sm">{decoded.header.alg || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">{t("type")}:</span>
                    <span className="text-sm">{decoded.header.typ || "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payload */}
            <Card>
              <CardHeader>
                <CardTitle>{t("payload")}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                  <code>{JSON.stringify(decoded.payload, null, 2)}</code>
                </pre>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {decoded.payload.iat && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground">{t("issuedAt")}</p>
                      <p className="text-sm">{formatTimestamp(decoded.payload.iat)}</p>
                    </div>
                  )}
                  {decoded.payload.exp && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground">{t("expiresAt")}</p>
                      <p className="text-sm">{formatTimestamp(decoded.payload.exp)}</p>
                    </div>
                  )}
                  {decoded.payload.nbf && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground">{t("notBefore")}</p>
                      <p className="text-sm">{formatTimestamp(decoded.payload.nbf)}</p>
                    </div>
                  )}
                  {decoded.payload.iss && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground">{t("issuer")}</p>
                      <p className="text-sm">{decoded.payload.iss}</p>
                    </div>
                  )}
                  {decoded.payload.sub && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground">{t("subject")}</p>
                      <p className="text-sm">{decoded.payload.sub}</p>
                    </div>
                  )}
                  {decoded.payload.aud && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground">{t("audience")}</p>
                      <p className="text-sm">{decoded.payload.aud}</p>
                    </div>
                  )}
                  {decoded.payload.jti && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground">{t("jwtId")}</p>
                      <p className="text-sm font-mono">{decoded.payload.jti}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Signature */}
            <Card>
              <CardHeader>
                <CardTitle>{t("signature")}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                  <code className="text-sm break-all">{decoded.signature}</code>
                </pre>
              </CardContent>
            </Card>
          </>
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
