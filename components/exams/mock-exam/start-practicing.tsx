"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { ALL_PREMIUM_FEATURES } from "@/lib/premium-features";

interface StartPracticingProps {
  onStartDemo?: () => void;
  onPreorder?: () => void;
}

export function StartPracticing({ onStartDemo, onPreorder }: StartPracticingProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Start Practicing</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Demo Card */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Free Demo</CardTitle>
            <CardDescription className="text-lg">
              Try our platform with 10 sample questions to experience our exam interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>10 sample questions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Full exam interface experience</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Instant results and explanations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>No registration required</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">FREE</div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={onStartDemo}
              >
                Start Free Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Full Access Card */}
        <Card className="border-2 border-blue-500 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-bold">
              BEST VALUE
            </Badge>
          </div>

          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl">Full Access</CardTitle>
            <CardDescription className="text-lg">
              Get complete access to all our exam preparation materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {ALL_PREMIUM_FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">$199</div>
              <div className="text-gray-600 mb-4">one-time payment</div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={onPreorder}
              >
                Preorder Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
