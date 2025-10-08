"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TEST_CARDS = {
  visa: "4532015112830366",
  mastercard: "5425233430109903",
  amex: "374245455400126",
  discover: "6011111111111117",
};

export default function CreditCardValidatorPage() {
  const t = useTranslations("tools.creditCardValidator");
  const tCommon = useTranslations("common");

  const [cardNumber, setCardNumber] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [cardType, setCardType] = useState<string>("");

  const luhnCheck = (num: string): boolean => {
    const digits = num.replace(/\D/g, "");
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const detectCardType = (num: string): string => {
    const digits = num.replace(/\D/g, "");

    if (/^4/.test(digits)) return t("visa");
    if (/^5[1-5]/.test(digits)) return t("mastercard");
    if (/^3[47]/.test(digits)) return t("amex");
    if (/^6(?:011|5)/.test(digits)) return t("discover");

    return t("unknown");
  };

  const handleValidate = () => {
    const digits = cardNumber.replace(/\D/g, "");

    if (digits.length < 13 || digits.length > 19) {
      setIsValid(false);
      setCardType(t("unknown"));
      return;
    }

    const valid = luhnCheck(digits);
    const type = detectCardType(digits);

    setIsValid(valid);
    setCardType(type);
  };

  const handleTestCard = (card: string) => {
    setCardNumber(card);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("cardNumber")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t("cardPlaceholder")}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleValidate}>{t("validate")}</Button>
            </div>

            {isValid !== null && (
              <div className="space-y-3">
                <div
                  className={`flex items-center gap-2 p-4 rounded-lg ${isValid ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                >
                  {isValid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-700 dark:text-green-300">{t("valid")}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-700 dark:text-red-300">{t("invalid")}</span>
                    </>
                  )}
                </div>

                {cardType && (
                  <div className="flex items-center gap-2">
                    <Label>{t("cardType")}:</Label>
                    <span className="font-semibold">{cardType}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("testCards")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(TEST_CARDS).map(([type, number]) => (
                <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{t(type)}</p>
                    <p className="text-sm text-muted-foreground font-mono">{number}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleTestCard(number)}>
                    {tCommon("sample") || "Use"}
                  </Button>
                </div>
              ))}
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
