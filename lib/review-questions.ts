/**
 * Types and mock data for exam review questions.
 * In production, this would come from Convex or an API.
 */

export type AnswerStatus = "correct" | "incorrect";

export interface AnsweredQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  userIndex: number;
  status: AnswerStatus;
  flagged: boolean;
  locked: boolean;
  explanation: string;
  references?: { title: string; isbn?: string; page?: string }[];
}

export const MOCK_ANSWERED_QUESTIONS: AnsweredQuestion[] = [
  {
    id: "1",
    subject: "Fire Safety Overview, Communications, Dynamics",
    question:
      "In type I buildings, structural components such as walls, ceilings, and floors must be constructed from materials capable of withstanding excessive heat and flames. Regarding exterior bearing walls that support more than one floor, how long are these structural members rated to resist collapse under intense fire conditions?",
    options: ["Up to 12 hours", "3-4 hours", "6-8 hours", "1.5-2 hours"],
    correctIndex: 1,
    userIndex: 0,
    status: "incorrect",
    flagged: false,
    locked: false,
    explanation:
      "Type I construction uses non-combustible materials such as reinforced concrete and protected steel. Exterior bearing walls that support more than one floor are required to have a fire-resistance rating of 3-4 hours to prevent collapse during a fire. The other options represent unrealistic or incorrect fire-resistance ratings for this structural component.",
    references: [
      { title: "Building Construction for the Fire Service", isbn: "978-0-7637-5972-4", page: "142" },
      { title: "Fire Protection Handbook", isbn: "978-0-87765-478-4", page: "3-45" },
    ],
  },
  {
    id: "2",
    subject: "Scene Response, First Aid, Risk Reduction",
    question:
      "The use of Air-purifying Respirators (APRs) at hazardous materials incidents is approved by NIOSH. Which of the following is not one of the three types of canisters that can be used with an APR at a hazardous material response?",
    options: ["Acid gas", "Organic vapor", "Particulate filter", "Ammonia/methylamine"],
    correctIndex: 1,
    userIndex: 2,
    status: "incorrect",
    flagged: false,
    locked: true,
    explanation:
      "NIOSH-approved APR canisters for hazmat are typically classified as acid gas, ammonia/methylamine, and organic vapor. Particulate filters are used in conjunction with other cartridges but are not one of the three primary canister types for chemical vapor protection.",
    references: [
      { title: "Hazardous Materials Awareness and Operations", isbn: "978-1-284-03964-8", page: "156" },
    ],
  },
  {
    id: "3",
    subject: "Building Materials and Structure",
    question:
      "Which type of composite building material is made from wood fibers, has a smooth finish, and is commonly used for doors and decorative moldings due to its ability to resemble the appearance of hardwood?",
    options: ["Particleboard", "Medium-density fiberboard (MDF)", "Oriented strand board (OSB)", "Plywood"],
    correctIndex: 1,
    userIndex: 0,
    status: "incorrect",
    flagged: false,
    locked: true,
    explanation:
      "Medium-density fiberboard (MDF) is made from fine wood fibers bonded with resin. It has a smooth, uniform surface that makes it ideal for doors, cabinetry, and decorative moldings where a painted or laminated finish is desired. It can be machined to resemble hardwood details.",
    references: [
      { title: "Building Construction for the Fire Service", isbn: "978-0-7637-5972-4", page: "89" },
    ],
  },
  {
    id: "4",
    subject: "Fire Safety Overview, Communications, Dynamics",
    question:
      "Emergency personnel should adhere to the ABCs of good communication. What are the ABCs of good communication?",
    options: [
      "Accuracy, Brevity, Clarity",
      "Assertiveness, Boldness, Confidence",
      "Attention, Balance, Control",
      "Action, Backup, Coordination",
    ],
    correctIndex: 0,
    userIndex: 0,
    status: "correct",
    flagged: false,
    locked: true,
    explanation:
      "The ABCs of good communication for emergency personnel are Accuracy (ensure information is correct), Brevity (keep messages concise), and Clarity (use clear, unambiguous language). These principles help prevent misunderstandings during critical incidents.",
    references: [
      { title: "Incident Command System", page: "ICS-100" },
    ],
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `extra-${i + 5}`,
    subject: ["Fire Safety Overview", "Building Materials", "Scene Response"][i % 3],
    question: `Sample review question ${i + 5} for pagination testing.`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: i % 4,
    userIndex: (i + 1) % 4,
    status: (i % 2 === 0 ? "incorrect" : "correct") as AnswerStatus,
    flagged: false,
    locked: false,
    explanation: "Sample explanation.",
    references: [],
  })),
];

export function getAnsweredQuestionsForExam(_examSlug: string): AnsweredQuestion[] {
  // In production, filter by examSlug from Convex
  return MOCK_ANSWERED_QUESTIONS;
}

export function getFilteredQuestions(
  questions: AnsweredQuestion[],
  tab: "all" | "flagged" | "incorrect" | "correct",
  search: string,
  subjectFilter: string | null
): AnsweredQuestion[] {
  let filtered = questions;

  if (tab === "flagged") filtered = filtered.filter((q) => q.flagged);
  if (tab === "incorrect") filtered = filtered.filter((q) => q.status === "incorrect");
  if (tab === "correct") filtered = filtered.filter((q) => q.status === "correct");

  if (search.trim()) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (q) =>
        q.question.toLowerCase().includes(s) ||
        q.subject.toLowerCase().includes(s)
    );
  }

  if (subjectFilter) {
    filtered = filtered.filter((q) => q.subject === subjectFilter);
  }

  return filtered;
}
