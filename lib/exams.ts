export interface CommunityPost {
  user: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

export interface Experience {
  user: string;
  avatar: string;
  score: string;
  date: string;
  text: string;
  rating: number;
}

export interface Exam {
  id: number;
  name: string;
  community: string;
  questions: number;
  color: string;
  members: string;
  online: number;
  subjects: string[];
  tags: string[];
  description: string;
  passRate: number;
  duration: string;
  difficulty: string;
  experiences: Experience[];
  communityPosts: CommunityPost[];
}

const defaultExperience: Experience = {
  user: "Student",
  avatar: "ST",
  score: "Pass",
  date: "2025",
  text: "Study tips and experiences shared by exam takers.",
  rating: 5,
};

const defaultPost: CommunityPost = {
  user: "User",
  avatar: "U",
  time: "1h ago",
  text: "Discussion and study tips for this exam.",
  likes: 0,
};

export const exams: Exam[] = [
  {
    id: 1,
    name: "SMLE",
    community: "",
    questions: 200,
    color: "#006450",
    members: "0",
    online: 0,
    subjects: ["Medicine", "Clinical Sciences", "Basic Sciences"],
    tags: ["medical", "licensing"],
    description: "Saudi Medical License Examination for medical practice licensing.",
    passRate: 65,
    duration: "4h",
    difficulty: "Hard",
    experiences: [defaultExperience],
    communityPosts: [defaultPost],
  },
  {
    id: 2,
    name: "SDLE",
    community: "",
    questions: 200,
    color: "#1e5a8e",
    members: "0",
    online: 0,
    subjects: ["Dental Sciences", "Clinical Dentistry", "Basic Sciences"],
    tags: ["dental", "licensing"],
    description: "Saudi Dental License Examination for dental practice licensing.",
    passRate: 62,
    duration: "4h",
    difficulty: "Hard",
    experiences: [defaultExperience],
    communityPosts: [defaultPost],
  },
  {
    id: 3,
    name: "SPLE",
    community: "",
    questions: 200,
    color: "#7d3cca",
    members: "0",
    online: 0,
    subjects: ["Pharmacy", "Clinical Pharmacy", "Pharmaceutical Sciences"],
    tags: ["pharmacy", "licensing"],
    description: "Saudi Pharmacy License Examination for pharmacy practice licensing.",
    passRate: 60,
    duration: "4h",
    difficulty: "Hard",
    experiences: [defaultExperience],
    communityPosts: [defaultPost],
  },
  {
    id: 4,
    name: "SNLE",
    community: "",
    questions: 200,
    color: "#e8114b",
    members: "0",
    online: 0,
    subjects: ["Nursing", "Clinical Nursing", "Patient Care"],
    tags: ["nursing", "licensing"],
    description: "Saudi Nursing License Examination for nursing practice licensing.",
    passRate: 68,
    duration: "4h",
    difficulty: "Medium",
    experiences: [defaultExperience],
    communityPosts: [defaultPost],
  },
  {
    id: 5,
    name: "Family Medicine",
    community: "",
    questions: 250,
    color: "#3d6b21",
    members: "0",
    online: 0,
    subjects: ["Family Medicine", "Primary Care", "Preventive Medicine"],
    tags: ["medical", "family medicine", "specialty"],
    description: "Family Medicine specialty examination for board certification.",
    passRate: 58,
    duration: "5h",
    difficulty: "Hard",
    experiences: [defaultExperience],
    communityPosts: [defaultPost],
  },
  {
    id: 6,
    name: "SLLE",
    community: "",
    questions: 200,
    color: "#1f3264",
    members: "0",
    online: 0,
    subjects: ["Law", "Legal Practice", "Regulations"],
    tags: ["law", "licensing"],
    description: "Saudi Law License Examination for legal practice licensing.",
    passRate: 55,
    duration: "4h",
    difficulty: "Hard",
    experiences: [defaultExperience],
    communityPosts: [defaultPost],
  },
];
