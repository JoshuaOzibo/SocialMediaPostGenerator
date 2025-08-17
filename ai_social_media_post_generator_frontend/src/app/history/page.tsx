"use client";
import { useState } from "react";

import RouteGuard from "@/components/middleware/RouteGuard";
import HistoryFilterCard from "@/components/history_components/histoty_filter_card";
import HistoryPosts from "@/components/history_components/history_posts";
import EmptyCard from "@/components/history_components/empty_card";

const History = () => {
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  // Mock data for post history
  const savedPosts = [
    {
      id: 1,
      content:
        "🚀 Excited to share some insights on team collaboration! Here are 3 key strategies that have transformed our workflow...",
      platform: "linkedin",
      tone: "professional",
      createdAt: "2024-01-15",
      status: "published",
    },
    {
      id: 2,
      content:
        "💡 Pro tip: The best product features come from listening to your users. Here's how we gather feedback...",
      platform: "twitter",
      tone: "educational",
      createdAt: "2024-01-14",
      status: "draft",
    },
    {
      id: 3,
      content:
        "🎯 Industry insight: The future of remote work is hybrid. Companies that adapt quickly will attract top talent...",
      platform: "instagram",
      tone: "professional",
      createdAt: "2024-01-13",
      status: "scheduled",
    },
    {
      id: 4,
      content:
        "🔥 Just shipped a new feature! Here's what our users are saying about the improved workflow...",
      platform: "linkedin",
      tone: "funny",
      createdAt: "2024-01-12",
      status: "published",
    },
    {
      id: 5,
      content:
        "📚 Learning in public: My journey from junior to senior developer in 2 years...",
      platform: "twitter",
      tone: "educational",
      createdAt: "2024-01-11",
      status: "draft",
    },
  ];

  const filteredPosts = savedPosts.filter((post) => {
    const platformMatch =
      filterPlatform === "all" || post.platform === filterPlatform;
    const dateMatch =
      filterDate === "all" ||
      (filterDate === "week" &&
        new Date(post.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterDate === "month" &&
        new Date(post.createdAt) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    return platformMatch && dateMatch;
  });

  return (
    <>
      <RouteGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Filters */}
              <HistoryFilterCard
                filteredPosts={filteredPosts}
                savedPosts={savedPosts}
                filterPlatform={filterPlatform}
                setFilterPlatform={setFilterPlatform}
                filterDate={filterDate}
                setFilterDate={setFilterDate}
              />

              {/* Posts List */}
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  <HistoryPosts
                    filteredPosts={filteredPosts}
                  />
                ) : (
                  <EmptyCard
                    filterPlatform={filterPlatform}
                    filterDate={filterDate}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </RouteGuard>
    </>
  );
};

export default History;
