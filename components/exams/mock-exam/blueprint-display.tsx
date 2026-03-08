"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlueprintSection, type BlueprintItem } from "./blueprint-section";

export interface ExamBlueprint {
  title: string;
  blueprint: BlueprintItem[];
}

const EXAM_BLUEPRINTS: Record<string, ExamBlueprint> = {
  "saudi-board-part-one": {
    title: "Saudi Board Part One",
    blueprint: [
      { section: "Family Medicine", percentage: 19 },
      { section: "Internal Medicine", percentage: 11 },
      { section: "Pediatric", percentage: 10 },
      { section: "Obstetrics and Gynecology", percentage: 10 },
      { section: "General Surgery", percentage: 6 },
      { section: "Psychiatry", percentage: 9 },
      { section: "Emergency Medicine (Adult and Pediatric)", percentage: 10 },
      { section: "Dermatology", percentage: 5 },
      { section: "Orthopedic and Musculoskeletal", percentage: 5 },
      { section: "Ophthalmology", percentage: 5 },
      { section: "Otolaryngology", percentage: 5 },
      { section: "Radiology", percentage: 5 },
    ],
  },
  "saudi-board-final": {
    title: "Saudi Board Final",
    blueprint: [
      { section: "Women's Health", percentage: 14 },
      { section: "Pediatrics", percentage: 12 },
      { section: "Geriatrics", percentage: 10 },
      { section: "Emergency Medicine", percentage: 10 },
      { section: "Pharmacology", percentage: 9 },
      { section: "Ethics and Professionalism", percentage: 9 },
      { section: "Palliative and End-of-Life Care", percentage: 8 },
      { section: "Population Health", percentage: 8 },
      { section: "Behavioral Health", percentage: 7 },
      { section: "Practice Management", percentage: 7 },
      { section: "Family Medicine", percentage: 6 },
    ],
  },
};

interface BlueprintDisplayProps {
  onStartPractice?: () => void;
}

export function BlueprintDisplay({ onStartPractice }: BlueprintDisplayProps) {
  const [selectedExam, setSelectedExam] = useState<string>("saudi-board-part-one");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Blueprint</CardTitle>
        <CardDescription>
          Review the exam content breakdown to understand what to expect
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedExam} onValueChange={setSelectedExam} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="saudi-board-part-one">Saudi Board Part One</TabsTrigger>
            <TabsTrigger value="saudi-board-final">Saudi Board Final</TabsTrigger>
          </TabsList>

          {Object.entries(EXAM_BLUEPRINTS).map(([examKey, data]) => (
            <TabsContent key={examKey} value={examKey}>
              <BlueprintSection title={data.title} blueprint={data.blueprint} />
              <div className="mt-6 flex justify-center">
                <Button
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={onStartPractice}
                >
                  Start Practice Questions
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
