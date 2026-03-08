/**
 * Mock questions for self-assessment mock exams.
 * In production, this would come from Convex or an API.
 * Each exam gets questions based on meta.questions count.
 */

export interface SelfAssessmentQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTION_POOL: SelfAssessmentQuestion[] = [
  {
    id: "1",
    subject: "Basic Sciences",
    question:
      "A 45-year-old patient presents with chest pain. Which enzyme is most specific for myocardial infarction in the first 6 hours?",
    options: ["CK-MB", "Troponin I", "LDH", "AST"],
    correctIndex: 1,
  },
  {
    id: "2",
    subject: "Clinical Sciences",
    question:
      "What is the first-line treatment for uncomplicated hypertension in a 55-year-old African American patient?",
    options: ["ACE inhibitor", "Thiazide diuretic", "Beta-blocker", "Calcium channel blocker"],
    correctIndex: 1,
  },
  {
    id: "3",
    subject: "Medicine",
    question:
      "A patient with type 2 diabetes has an HbA1c of 9.2% on metformin alone. What is the recommended next step?",
    options: ["Add sulfonylurea", "Add SGLT2 inhibitor", "Add DPP-4 inhibitor", "Switch to insulin"],
    correctIndex: 1,
  },
  {
    id: "4",
    subject: "Basic Sciences",
    question:
      "Which of the following is the rate-limiting step in cholesterol synthesis?",
    options: ["HMG-CoA reductase", "Acetyl-CoA carboxylase", "Cholesterol esterase", "LDL receptor"],
    correctIndex: 0,
  },
  {
    id: "5",
    subject: "Clinical Sciences",
    question:
      "A 3-year-old presents with barking cough and stridor. What is the most likely diagnosis?",
    options: ["Epiglottitis", "Croup", "Foreign body aspiration", "Bacterial tracheitis"],
    correctIndex: 1,
  },
  {
    id: "6",
    subject: "Medicine",
    question:
      "Which antibiotic is contraindicated in myasthenia gravis due to neuromuscular blockade?",
    options: ["Penicillin", "Aminoglycosides", "Cephalosporins", "Macrolides"],
    correctIndex: 1,
  },
  {
    id: "7",
    subject: "Basic Sciences",
    question:
      "In the renin-angiotensin-aldosterone system, what converts angiotensin I to angiotensin II?",
    options: ["Renin", "ACE", "Aldosterone", "Angiotensinogen"],
    correctIndex: 1,
  },
  {
    id: "8",
    subject: "Clinical Sciences",
    question:
      "A patient with atrial fibrillation and CHA2DS2-VASc score of 3 should receive:",
    options: ["Aspirin only", "No anticoagulation", "Oral anticoagulation", "Clopidogrel"],
    correctIndex: 2,
  },
  {
    id: "9",
    subject: "Medicine",
    question:
      "Which finding is most suggestive of bacterial meningitis rather than viral?",
    options: ["Lymphocytic pleocytosis", "Normal glucose", "Elevated protein", "Positive Gram stain"],
    correctIndex: 3,
  },
  {
    id: "10",
    subject: "Basic Sciences",
    question:
      "The P wave on ECG represents:",
    options: ["Ventricular depolarization", "Atrial depolarization", "Ventricular repolarization", "Atrial repolarization"],
    correctIndex: 1,
  },
  {
    id: "11",
    subject: "Clinical Sciences",
    question:
      "First-line treatment for community-acquired pneumonia in an outpatient without comorbidities is:",
    options: ["Levofloxacin", "Amoxicillin", "Azithromycin", "Doxycycline"],
    correctIndex: 2,
  },
  {
    id: "12",
    subject: "Medicine",
    question:
      "A patient with cirrhosis presents with altered mental status. What is the most appropriate initial treatment?",
    options: ["Lactulose", "Rifaximin", "Neomycin", "Both lactulose and rifaximin"],
    correctIndex: 0,
  },
  {
    id: "13",
    subject: "Basic Sciences",
    question:
      "Which vitamin requires intrinsic factor for absorption?",
    options: ["Vitamin B1", "Vitamin B6", "Vitamin B12", "Folic acid"],
    correctIndex: 2,
  },
  {
    id: "14",
    subject: "Clinical Sciences",
    question:
      "The most common cause of acute pancreatitis is:",
    options: ["Gallstones", "Alcohol", "Hypertriglyceridemia", "ERCP"],
    correctIndex: 0,
  },
  {
    id: "15",
    subject: "Medicine",
    question:
      "In a patient with suspected pulmonary embolism, which D-dimer cutoff has the highest sensitivity?",
    options: ["< 250 ng/mL", "< 500 ng/mL", "> 500 ng/mL", "D-dimer is not used for PE"],
    correctIndex: 1,
  },
  {
    id: "16",
    subject: "Basic Sciences",
    question:
      "Which immunoglobulin crosses the placenta and provides passive immunity to the fetus?",
    options: ["IgA", "IgG", "IgM", "IgE"],
    correctIndex: 1,
  },
  {
    id: "17",
    subject: "Clinical Sciences",
    question:
      "First-line treatment for acute gout is:",
    options: ["Allopurinol", "Colchicine", "Probenecid", "Febuxostat"],
    correctIndex: 1,
  },
  {
    id: "18",
    subject: "Medicine",
    question:
      "A patient with heart failure has an ejection fraction of 25%. Which medication has been shown to reduce mortality?",
    options: ["Digoxin", "Sacubitril-valsartan", "Hydralazine", "All of the above"],
    correctIndex: 1,
  },
  {
    id: "19",
    subject: "Basic Sciences",
    question:
      "The primary site of iron absorption in the gastrointestinal tract is:",
    options: ["Stomach", "Duodenum", "Jejunum", "Ileum"],
    correctIndex: 1,
  },
  {
    id: "20",
    subject: "Clinical Sciences",
    question:
      "Which antibiotic class is associated with tendon rupture?",
    options: ["Penicillins", "Fluoroquinolones", "Macrolides", "Tetracyclines"],
    correctIndex: 1,
  },
];

/** Get mock questions for a self-assessment. Cycles through pool to reach desired count. */
export function getSelfAssessmentQuestions(
  examSlug: string,
  count: number,
  subjects: string[]
): SelfAssessmentQuestion[] {
  const result: SelfAssessmentQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const src = QUESTION_POOL[i % QUESTION_POOL.length];
    result.push({
      ...src,
      id: `${examSlug}-sa-${i + 1}`,
      subject: subjects[i % subjects.length] ?? src.subject,
    });
  }
  return result;
}

/** Parse duration string (e.g. "4h", "2h 30m") to total minutes */
export function parseDurationToMinutes(duration: string): number {
  let total = 0;
  const hours = duration.match(/(\d+)\s*h/);
  const mins = duration.match(/(\d+)\s*m/);
  if (hours) total += parseInt(hours[1], 10) * 60;
  if (mins) total += parseInt(mins[1], 10);
  if (total === 0 && /^\d+$/.test(duration)) total = parseInt(duration, 10) * 60; // assume hours if just number
  return total || 240; // default 4h
}
