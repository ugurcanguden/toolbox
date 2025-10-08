"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Clock, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@/hooks";

export default function TimestampConverterPage() {
  const t = useTranslations("tools.timestampConverter");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [timestamp, setTimestamp] = useState("");
  const [timestampMs, setTimestampMs] = useState("");
  const [dateOutput, setDateOutput] = useState({
    human: "",
    iso: "",
    utc: "",
    local: "",
  });

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConvertTimestamp = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) return;

      // Determine if it's seconds or milliseconds
      const date = ts > 10000000000 ? new Date(ts) : new Date(ts * 1000);

      setDateOutput({
        human: date.toLocaleString(),
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
      });
    } catch (error) {
      setDateOutput({
        human: "Invalid timestamp",
        iso: "",
        utc: "",
        local: "",
      });
    }
  };

  const handleConvertMs = () => {
    try {
      const ts = parseInt(timestampMs);
      if (isNaN(ts)) return;

      const date = new Date(ts);

      setDateOutput({
        human: date.toLocaleString(),
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
      });
    } catch (error) {
      setDateOutput({
        human: "Invalid timestamp",
        iso: "",
        utc: "",
        local: "",
      });
    }
  };

  const handleNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
    setTimestampMs(Date.now().toString());
    handleConvertTimestamp();
  };

  const currentDate = new Date(currentTimestamp * 1000);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Current Timestamp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("currentTimestamp")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("seconds")}</Label>
                <div className="flex gap-2">
                  <Input value={currentTimestamp} readOnly className="font-mono" />
                  <Button variant="outline" size="icon" onClick={() => copy(currentTimestamp.toString())}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("milliseconds")}</Label>
                <div className="flex gap-2">
                  <Input value={currentTimestamp * 1000} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copy((currentTimestamp * 1000).toString())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-lg font-semibold">{currentDate.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">{currentDate.toISOString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timestamp to Date */}
        <Card>
          <CardHeader>
            <CardTitle>{t("timestampToDate")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seconds */}
            <div className="space-y-2">
              <Label>{t("seconds")}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={t("timestampPlaceholder")}
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={handleConvertTimestamp}>{t("convert")}</Button>
                <Button variant="outline" onClick={handleNow}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("now")}
                </Button>
              </div>
            </div>

            {/* Milliseconds */}
            <div className="space-y-2">
              <Label>{t("milliseconds")}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={t("timestampPlaceholder")}
                  value={timestampMs}
                  onChange={(e) => setTimestampMs(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={handleConvertMs}>{t("convert")}</Button>
              </div>
            </div>

            {/* Output */}
            {dateOutput.human && (
              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <Label>{t("humanReadable")}</Label>
                  <div className="flex gap-2">
                    <Input value={dateOutput.human} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={() => copy(dateOutput.human)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("iso8601")}</Label>
                  <div className="flex gap-2">
                    <Input value={dateOutput.iso} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={() => copy(dateOutput.iso)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("utc")}</Label>
                  <div className="flex gap-2">
                    <Input value={dateOutput.utc} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={() => copy(dateOutput.utc)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("local")}</Label>
                  <div className="flex gap-2">
                    <Input value={dateOutput.local} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={() => copy(dateOutput.local)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
