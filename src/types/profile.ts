export type RecruiterProfile = {
  id: string;
  displayName: string;
  legalFullName: string;
  title: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  joinedAt: string;
  avatarUrl: string;
  verified: boolean;
  specializations: string[];
  schemaId: string;
};

export type RecruitmentScore = {
  score: number;
  outOf: number;
  monthlyTargetPct: number;
};

export type SecuritySettings = {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeDevices: number;
};

export type CompanyDocumentStatus = "VERIFIED" | "EXPIRING" | "PENDING";

export type CompanyDocumentIcon = "incorporation" | "tax" | "insurance";

export type CompanyDocument = {
  id: string;
  title: string;
  subtitle: string;
  status: CompanyDocumentStatus;
  icon: CompanyDocumentIcon;
  downloadUrl: string;
};

export type ProfileOverview = {
  profile: RecruiterProfile;
  score: RecruitmentScore;
  security: SecuritySettings;
  documents: CompanyDocument[];
};
