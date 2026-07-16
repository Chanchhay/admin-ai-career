import type { PortfolioQuality, RequiredDoc } from "@/types/company";

export const mockRequiredDocs: RequiredDoc[] = [
  {
    id: "doc_articles",
    title: "Articles of Inc.",
    description: "PDF, Max 5MB",
    maxSizeMb: 5,
    accepts: ["application/pdf"],
    status: "PENDING",
  },
  {
    id: "doc_w9",
    title: "W-9 Tax Form",
    description: "Signed digital copy",
    maxSizeMb: 5,
    accepts: ["application/pdf", "image/png", "image/jpeg"],
    status: "PENDING",
  },
];

export const mockPortfolioQuality: PortfolioQuality = {
  score: 98,
  deltaThisWeek: 1.2,
  message:
    "Your current database meets high-tier compliance standards. Keep it up!",
};