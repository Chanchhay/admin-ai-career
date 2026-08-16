"use client";

import { HelpCircle, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function HelpCenterPage() {
  useSetPageHeading("Help Center");

  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: 1,
      title: "Getting Started",
      description: "Learn the basics of platform administration",
      articles: 8,
    },
    {
      id: 2,
      title: "User Management",
      description: "Create, edit, and manage platform users",
      articles: 12,
    },
    {
      id: 3,
      title: "Moderation",
      description: "Review and moderate user-generated content",
      articles: 15,
    },
    {
      id: 4,
      title: "Analytics & Reports",
      description: "Generate and interpret platform reports",
      articles: 10,
    },
    {
      id: 5,
      title: "API Documentation",
      description: "Integrate with platform APIs",
      articles: 25,
    },
    {
      id: 6,
      title: "Troubleshooting",
      description: "Solve common issues and problems",
      articles: 18,
    },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-green-400 dark:focus:ring-green-400"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            className="rounded-lg border border-gray-200 bg-white p-6 text-left transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
                <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-500">
                  {category.articles} articles
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>

      {/* Contact Support */}
      <div className="rounded-lg border border-gray-200 bg-linear-to-r from-green-50 to-emerald-50 p-6 dark:border-gray-800 dark:from-green-900/20 dark:to-emerald-900/20">
        <h3 className="font-semibold text-gray-900 dark:text-white">Can't find what you need?</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Contact our support team for additional help.
        </p>
        <button className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
          Contact Support
        </button>
      </div>
    </div>
  );
}
