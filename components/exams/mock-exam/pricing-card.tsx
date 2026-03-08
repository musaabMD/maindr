"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureItem {
  text: string;
}

interface PricingCardProps {
  title: string;
  description: string;
  features: FeatureItem[];
  price: string;
  priceSubtext?: string;
  buttonLabel: string;
  onAction: () => void;
  variant?: "default" | "highlighted";
}

export function PricingCard({
  title,
  description,
  features,
  price,
  priceSubtext,
  buttonLabel,
  onAction,
  variant = "default",
}: PricingCardProps) {
  const isHighlighted = variant === "highlighted";

  return (
    <Card
      className={
        isHighlighted
          ? "border-2 border-blue-500 relative"
          : "border-2 border-gray-200"
      }
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-bold">
            BEST VALUE
          </Badge>
        </div>
      )}

      <CardHeader className={isHighlighted ? "text-center pt-8" : "text-center"}>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div
            className={`text-3xl font-bold mb-2 ${
              isHighlighted ? "text-blue-600" : "text-green-600"
            }`}
          >
            {price}
          </div>
          {priceSubtext && (
            <div className="text-gray-600 mb-4">{priceSubtext}</div>
          )}
          <Button
            className={`w-full ${
              isHighlighted
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            onClick={onAction}
          >
            {buttonLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
