export const CODING_LANGUAGES = [
  { value: "javascript", label: "JavaScript", monaco: "javascript" },
  { value: "python", label: "Python", monaco: "python" },
  { value: "java", label: "Java", monaco: "java" },
  { value: "cpp", label: "C++", monaco: "cpp" },
  { value: "c", label: "C", monaco: "c" },
  { value: "go", label: "Go", monaco: "go" },
  { value: "typescript", label: "TypeScript", monaco: "typescript" },
];

export const INTERVIEW_TYPES = [
  { value: "mixed", label: "Mixed (Recommended)", description: "Technical, behavioral, and one coding question" },
  { value: "technical", label: "Technical", description: "Deep dive into concepts relevant to your target role" },
  { value: "behavioral", label: "Behavioral", description: "Situational and experience-based questions" },
  { value: "coding", label: "Coding", description: "Pure problem-solving round with a live editor" },
];

// Grouped so the target-role dropdown can offer both software/tech roles and
// competitive-exam / government job roles (SSC, Banking, Railways, UPSC,
// Defence, Teaching, etc). "Other" always stays last so the user can type a
// custom role that isn't listed.
export const TARGET_ROLE_GROUPS = [
  {
    group: "Technology & IT",
    roles: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Data Analyst",
      "Data Scientist",
      "DevOps Engineer",
      "QA / Test Engineer",
      "Product Manager",
      "System Administrator",
    ],
  },
  {
    group: "Banking & Insurance",
    roles: [
      "Bank PO (IBPS/SBI)",
      "Bank Clerk (IBPS/SBI)",
      "RBI Grade B Officer",
      "RBI Assistant",
      "NABARD Grade A",
      "Insurance (LIC AAO)",
      "Insurance (LIC ADO)",
    ],
  },
  {
    group: "SSC (Staff Selection Commission)",
    roles: [
      "SSC CGL (Combined Graduate Level)",
      "SSC CHSL (Combined Higher Secondary Level)",
      "SSC GD Constable",
      "SSC MTS (Multi-Tasking Staff)",
      "SSC Steno (Stenographer)",
      "SSC JE (Junior Engineer)",
      "SSC CPO (Central Police Organisation)",
    ],
  },
  {
    group: "Railways (RRB)",
    roles: [
      "RRB NTPC",
      "RRB Group D",
      "RRB JE (Junior Engineer)",
      "RRB ALP (Assistant Loco Pilot)",
    ],
  },
  {
    group: "UPSC & Civil Services",
    roles: [
      "UPSC Civil Services (IAS/IPS/IFS)",
      "State PSC Officer",
      "UPSC CDS",
      "UPSC NDA",
    ],
  },
  {
    group: "Defence & Police",
    roles: [
      "Indian Army Officer",
      "Indian Navy Officer",
      "Indian Air Force Officer",
      "State Police Sub-Inspector",
      "State Police Constable",
      "CAPF / BSF / CRPF",
    ],
  },
  {
    group: "Teaching",
    roles: [
      "CTET / TET Teacher",
      "PGT / TGT Teacher",
      "Assistant Professor",
    ],
  },
  {
    group: "Other",
    roles: ["Other (type your own)"],
  },
];

export const STARTER_CODE = {
  javascript: "function solve() {\n  // your code here\n}\n",
  python: "def solve():\n    # your code here\n    pass\n",
  java: "class Solution {\n    public static void main(String[] args) {\n        // your code here\n    }\n}\n",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}\n",
  c: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}\n",
  go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // your code here\n}\n",
  typescript: "function solve(): void {\n  // your code here\n}\n",
};
