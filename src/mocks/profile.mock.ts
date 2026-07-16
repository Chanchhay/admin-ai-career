import type {
  CompanyDocument,
  RecruiterProfile,
  RecruitmentScore,
  SecuritySettings,
} from "@/types/profile";

export const mockProfile: RecruiterProfile = {
  id: "usr_alex_rivera",
  displayName: "Alex Rivera",
  legalFullName: "Alexandro Miguel Rivera",
  title: "Senior Talent Lead",
  headline: "Senior Talent Lead & Executive Headhunter",
  email: "alex.rivera@talentpulse.ai",
  phone: "+1 (512) 555-0198",
  location: "Austin, TX",
  joinedAt: "2022-08-01",
  avatarUrl: "https://i.pravatar.cc/240?img=13",
  verified: true,
  specializations: [
    "AI / Machine Learning",
    "Executive Search",
    "Fintech",
    "LATAM Markets",
  ],
  schemaId: "PRF_09923",
};

export const mockScore: RecruitmentScore = {
  score: 98,
  outOf: 100,
  monthlyTargetPct: 92,
};

export const mockSecurity: SecuritySettings = {
  twoFactorEnabled: true,
  lastPasswordChange: "2024-03-18",
  activeDevices: 3,
};

export const mockDocuments: CompanyDocument[] = [
  {
    id: "cdoc_articles",
    title: "Articles of Incorporation",
    subtitle: "Verified on Jan 12, 2024",
    status: "VERIFIED",
    icon: "incorporation",
    downloadUrl: "/api/documents/cdoc_articles",
  },
  {
    id: "cdoc_tax",
    title: "Tax Identification (W-9)",
    subtitle: "Expires in 11 months",
    status: "EXPIRING",
    icon: "tax",
    downloadUrl: "/api/documents/cdoc_tax",
  },
  {
    id: "cdoc_insurance",
    title: "Professional Liability Insurance",
    subtitle: "Uploaded Dec 05, 2023",
    status: "VERIFIED",
    icon: "insurance",
    downloadUrl: "/api/documents/cdoc_insurance",
  },
];