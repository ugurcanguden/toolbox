"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function WordCounterPage() {
  const t = useTranslations("tools.wordCounter");

  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\n+/).filter((p) => p.trim()).length;
    const lines = text === "" ? 0 : text.split(/\n/).length;
    const readingTime = Math.ceil(words / 200);

    return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime };
  }, [text]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t("textInput")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("inputPlaceholder")}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("statistics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("characters")}</p>
                <p className="text-3xl font-bold">{stats.characters}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("charactersNoSpaces")}</p>
                <p className="text-3xl font-bold">{stats.charactersNoSpaces}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("words")}</p>
                <p className="text-3xl font-bold">{stats.words}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("sentences")}</p>
                <p className="text-3xl font-bold">{stats.sentences}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("paragraphs")}</p>
                <p className="text-3xl font-bold">{stats.paragraphs}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("lines")}</p>
                <p className="text-3xl font-bold">{stats.lines}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("readingTime")}</p>
                <p className="text-3xl font-bold">
                  {stats.readingTime} {t("minutes")}
                </p>
              </div>
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
