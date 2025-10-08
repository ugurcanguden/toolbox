"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Database, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER",
  "ON", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE",
  "ALTER", "DROP", "AS", "DISTINCT", "CASE", "WHEN", "THEN", "ELSE", "END",
  "INDEX", "VIEW", "TRIGGER", "PROCEDURE", "FUNCTION", "PRIMARY", "FOREIGN",
  "KEY", "REFERENCES", "DEFAULT", "NULL", "NOT", "IN", "BETWEEN", "LIKE",
  "EXISTS", "ALL", "ANY", "UNION", "INTERSECT", "EXCEPT"
];

const SQL_FUNCTIONS = [
  "COUNT", "SUM", "AVG", "MIN", "MAX", "CONCAT", "SUBSTRING", "LENGTH",
  "UPPER", "LOWER", "TRIM", "ROUND", "FLOOR", "CEIL", "NOW", "DATE", "TIME"
];

export default function SqlFormatterPage() {
  const t = useTranslations("tools.sqlFormatter");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const formatSql = (sql: string) => {
    const keywords = [
      "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER",
      "ON", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
      "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE",
      "ALTER", "DROP", "AS", "DISTINCT", "CASE", "WHEN", "THEN", "ELSE", "END"
    ];

    let formatted = sql;

    // Uppercase keywords
    keywords.forEach((keyword) => {
      const regex = new RegExp("\\b" + keyword + "\\b", "gi");
      formatted = formatted.replace(regex, keyword);
    });

    // Add newlines after major keywords
    formatted = formatted
      .replace(/\bSELECT\b/g, "\nSELECT\n  ")
      .replace(/\bFROM\b/g, "\nFROM\n  ")
      .replace(/\bWHERE\b/g, "\nWHERE\n  ")
      .replace(/\bJOIN\b/g, "\nJOIN\n  ")
      .replace(/\bON\b/g, "\n  ON ")
      .replace(/\bAND\b/g, "\n  AND ")
      .replace(/\bOR\b/g, "\n  OR ")
      .replace(/\bGROUP BY\b/g, "\nGROUP BY\n  ")
      .replace(/\bORDER BY\b/g, "\nORDER BY\n  ")
      .replace(/,\s*/g, ",\n  ");

    return formatted.trim();
  };

  const compactSql = (sql: string) => {
    return sql.replace(/\s+/g, " ").trim();
  };

  const handleFormat = () => {
    const result = formatSql(input);
    setOutput(result);
  };

  const handleCompact = () => {
    const result = compactSql(input);
    setOutput(result);
  };

  // Syntax highlighting for SQL - Token based approach
  const highlightedTokens = useMemo(() => {
    if (!output) return [];

    const tokens: Array<{ text: string; type: string }> = [];
    let current = "";
    let inString = false;
    let inComment = false;

    for (let i = 0; i < output.length; i++) {
      const char = output[i];
      const nextChar = output[i + 1];

      // Handle strings
      if (char === "'" && !inComment) {
        if (current) {
          tokens.push({ text: current, type: "normal" });
          current = "";
        }
        inString = !inString;
        current += char;
        if (!inString && current.length > 1) {
          tokens.push({ text: current, type: "string" });
          current = "";
        }
        continue;
      }

      // Handle comments
      if (char === "-" && nextChar === "-" && !inString && !inComment) {
        if (current) {
          tokens.push({ text: current, type: "normal" });
          current = "";
        }
        inComment = true;
        current += char;
        continue;
      }

      if (char === "\n" && inComment) {
        current += char;
        tokens.push({ text: current, type: "comment" });
        current = "";
        inComment = false;
        continue;
      }

      if (inString || inComment) {
        current += char;
        continue;
      }

      // Handle normal text
      if (/\s/.test(char) || /[(),;]/.test(char)) {
        if (current) {
          // Check if it's a keyword, function, or number
          const upperCurrent = current.toUpperCase();
          if (SQL_KEYWORDS.includes(upperCurrent)) {
            tokens.push({ text: current, type: "keyword" });
          } else if (SQL_FUNCTIONS.includes(upperCurrent)) {
            tokens.push({ text: current, type: "function" });
          } else if (/^\d+$/.test(current)) {
            tokens.push({ text: current, type: "number" });
          } else {
            tokens.push({ text: current, type: "normal" });
          }
          current = "";
        }
        tokens.push({ text: char, type: "normal" });
      } else {
        current += char;
      }
    }

    // Push remaining
    if (current) {
      if (inString) {
        tokens.push({ text: current, type: "string" });
      } else if (inComment) {
        tokens.push({ text: current, type: "comment" });
      } else {
        const upperCurrent = current.toUpperCase();
        if (SQL_KEYWORDS.includes(upperCurrent)) {
          tokens.push({ text: current, type: "keyword" });
        } else if (SQL_FUNCTIONS.includes(upperCurrent)) {
          tokens.push({ text: current, type: "function" });
        } else if (/^\d+$/.test(current)) {
          tokens.push({ text: current, type: "number" });
        } else {
          tokens.push({ text: current, type: "normal" });
        }
      }
    }

    return tokens;
  }, [output]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {tCommon("input")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleFormat}>
                    {t("format")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCompact}>
                    {t("compact")}
                  </Button>
                </div>
              </div>
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

          {/* Output with Syntax Highlighting */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {tCommon("output")}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => copy(output)} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {tCommon("copy")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {output ? (
                <div className="min-h-[500px] p-4 border rounded-md bg-muted/50 overflow-auto font-mono text-sm whitespace-pre">
                  {highlightedTokens.map((token, index) => {
                    const className =
                      token.type === "keyword"
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : token.type === "function"
                          ? "text-purple-600 dark:text-purple-400 font-semibold"
                          : token.type === "string"
                            ? "text-green-600 dark:text-green-400"
                            : token.type === "number"
                              ? "text-orange-600 dark:text-orange-400"
                              : token.type === "comment"
                                ? "text-gray-500 dark:text-gray-400 italic"
                                : "";

                    return (
                      <span key={index} className={className}>
                        {token.text}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <Textarea value={output} readOnly className="min-h-[500px] font-mono text-sm" />
              )}
            </CardContent>
          </Card>
        </div>

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
