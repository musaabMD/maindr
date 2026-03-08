"use client";

import { Progress } from "@/components/ui/progress";

export interface BlueprintItem {
  section: string;
  percentage: number;
}

interface BlueprintSectionProps {
  title: string;
  blueprint: BlueprintItem[];
}

export function BlueprintSection({ title, blueprint }: BlueprintSectionProps) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">{title} Blueprint</h2>
      <div className="space-y-4">
        {blueprint.map((subject, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">{subject.section}</span>
              <span className="text-gray-600">{subject.percentage}%</span>
            </div>
            <Progress value={subject.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </>
  );
}
