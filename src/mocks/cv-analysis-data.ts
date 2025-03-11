import { CandidateData, MatchingData } from "@/types/cv-analysis"

// Mock data for candidate profile
export const mockCandidateData: CandidateData = {
  id: "11390d87-bcec-4831-add8-ed88c71fd0b8-Viktoriia Mkrtchian QA CV.pdf",
  userId: "anon-v1.1.3169+d01562dc2",
  name: "Viktoriia Mkrtchian",
  title: "QA Engineer",
  contact: {
    phone: "+38-066-210-6339",
    email: "viktoriia.mkrtchian.work@gmail.com",
    location: "Ukraine (remote)",
  },
  summary:
    "QA Engineer with over 2.5 years of experience and a comprehensive understanding of software development and QA lifecycle processes. Results-oriented team player with excellent organizational and communication skills.",
  education: [
    {
      degree: "Master's Degree",
      field: 'Program Subject Area "Law"',
      institution: "Yaroslav Mudryi National Law University, Ukraine",
      date: "September 2017 - March 2019",
    },
    {
      degree: "Bachelor's Degree",
      field: 'Program Subject Area "Law"',
      institution: "Yaroslav Mudryi National Law University, Ukraine",
      date: "September 2013 - August 2017",
    },
  ],
  experience: [
    {
      title: "QA Engineer",
      company: "You are launched",
      date: "April 2024 - nowadays",
      responsibilities: [
        "Testing of mobile (iOS, Android) and web applications",
        "Creating and maintaining test documentation",
        "Participating in Scrum ceremonies",
        "Reporting defects and failures",
        "Executing various types of testing",
        "Reporting verification results to stakeholders",
        "Checking event tracking in Mixpanel and Firebase",
      ],
    },
    {
      title: "QA Engineer",
      company: "Large international outsourcing company (name under NDA)",
      date: "November 2021 - November 2023",
      responsibilities: [
        "Performing testing on web platforms and mobile applications (Android)",
        "Creating and maintaining test cases, test suites, and checklists",
        "Reporting defects and failures",
        "Conducting various types of testing",
        "Executing API testing using Postman",
        "Executing basic SQL queries",
      ],
    },
    {
      title: "Lawyer",
      company: "Ukrainian companies",
      date: "May 2019 - September 2021",
    },
  ],
  skills: ["Understanding of Client/Server Architecture", "Understanding of SDLC/STLC"],
  tools: [
    "Jira",
    "Confluence",
    "TestRail",
    "Postman",
    "Swagger",
    "DevTools",
    "Android Studio",
    "Lambda Test",
    "Mixpanel",
    "Firebase",
    "DBeaver",
    "SQL",
  ],
}

// Mock data for matching analysis
export const mockMatchingData: MatchingData = {
  matchScore: 70,
  matchedSkills: ["QA testing", "Test documentation", "Defect reporting", "API testing", "SQL"],
  unmatchedSkills: ["Operations management", "Product scaling", "Legal knowledge"],
  experienceMatch: {
    yearsOfExperience: 2,
    requiredExperience: "Not specified",
    match: "Yes",
  },
  softSkillsAnalysis: {
    matched: ["Communication skills", "Team player"],
    missing: ["Leadership"],
  },
  potentialRisks: [
    "Lack of direct operations management experience",
    "No background in product scaling",
    "Legal background may not be directly applicable",
  ],
  finalRecommendation: {
    suitability: "Not Recommended",
    reason:
      "While the candidate has strong QA skills, they lack the specific operations and product scaling experience required for this Operations Manager role.",
  },
  createdAt: "2023-06-14T12:00:00Z",
}
