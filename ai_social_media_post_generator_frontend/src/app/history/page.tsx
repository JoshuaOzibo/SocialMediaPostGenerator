"use client";
import { useState, useMemo, useEffect } from "react";
import { usePosts } from "@/hooks/api/usePosts";
import { Post, PostFilters } from "@/lib/api/types";

import RouteGuard from "@/components/middleware/RouteGuard";
import HistoryFilterCard from "@/components/history_components/histoty_filter_card";
import HistoryPosts from "@/components/history_components/history_posts";
import EmptyCard from "@/components/history_components/empty_card";

const History = () => {
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterDate, setFilterDate] = useState("all");  
  const [posts, setPosts] = useState<Post[]>([]);

  // Build filters for API
  const filters: PostFilters = useMemo(() => {
    const apiFilters: PostFilters = {};
    
    if (filterPlatform !== "all") {
      apiFilters.platform = filterPlatform as "twitter" | "facebook" | "instagram" | "linkedin" | "tiktok";
    }
    
    if (filterDate !== "all") {
      const now = new Date();
      if (filterDate === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        apiFilters.startDate = weekAgo.toISOString();
      } else if (filterDate === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        apiFilters.startDate = monthAgo.toISOString();
      }
    }
    
    console.log("API Filters:", apiFilters);
    return apiFilters;
  }, [filterPlatform, filterDate]);

  // Fetch posts using the API
  const { data: postsData, isLoading, error } = usePosts(filters);

  useEffect(() => {    
    if (postsData) {
      setPosts(postsData.data.posts);
    }
    if (error) {
      console.error("❌ Posts fetch error:", error);
    }
  }, [postsData, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <RouteGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Filters */}
              <HistoryFilterCard
                filteredPosts={posts || []}
                filterPlatform={filterPlatform}
                setFilterPlatform={setFilterPlatform}
                filterDate={filterDate}
                setFilterDate={setFilterDate}
              />

              {/* Posts List */}
              <div className="space-y-4">
                {posts && posts.length > 0 ? (
                  <HistoryPosts
                    filteredPosts={posts}
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