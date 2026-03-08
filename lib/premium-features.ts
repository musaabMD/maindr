/**
 * Premium features displayed on upgrade/pricing surfaces.
 * Keep in sync with product offering.
 */

export const PREMIUM_FEATURES = {
  core: [
    "1000 Questions and Explanations",
    "Performance by Subject",
    "Mobile & Web Access",
    "Prep for 9 EMS Exams",
    "Pass Guarantee",
  ],
  quizModes: [
    "1 Mock Exam",
    "Question of the Day",
    "Quick 10 Quiz",
    "Timed Quiz",
    "Missed Questions Quiz",
    "Weakest Subject Quiz",
    "Build Your Own Quiz",
    "Level Up Quiz",
  ],
} as const;

/** Flat list of all premium features for simple display */
export const ALL_PREMIUM_FEATURES = [
  ...PREMIUM_FEATURES.core,
  ...PREMIUM_FEATURES.quizModes,
];
