export type Industry =
  | "TECH"
  | "FINANCE"
  | "HEALTHCARE"
  | "RETAIL"
  | "MANUFACTURING"
  | "EDUCATION";

export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

export type DocStatus = "PENDING" | "VERIFIED" | "EXPIRED";

export type RequiredDoc = {
  id: string;
  title: string;
  description: string;
  maxSizeMb: number;
  accepts: string[];
  status: DocStatus;
};

export type Company = {
  id: string;
  name: string;
  websiteUrl: string;
  industry: Industry;
  size: CompanySize;
  logoUrl?: string;
  selfVerified: boolean;
  createdAt: string;
};

export type CreateCompanyRequest = Omit
  Company,
  "id" | "createdAt" | "logoUrl"
> & {
  logo?: File | null;
};

export type PortfolioQuality = {
  score: number;
  deltaThisWeek: number;
  message: string;
};

/// this page is error happned so need to fix it later