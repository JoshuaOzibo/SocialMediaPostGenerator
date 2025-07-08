"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Filter, Trash2, Edit3, Clock, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const History = () => {
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  // Mock data for post history
  const savedPosts = [
    {
      id: 1,
      content: "🚀 Excited to share some insights on team collaboration! Here are 3 key strategies that have transformed our workflow...",
      platform: "linkedin",
      tone: "professional",
      createdAt: "2024-01-15",
      status: "published"
    },
    {
      id: 2,
      content: "💡 Pro tip: The best product features come from listening to your users. Here's how we gather feedback...",
      platform: "twitter",
      tone: "educational",
      createdAt: "2024-01-14",
      status: "draft"
    },
    {
      id: 3,
      content: "🎯 Industry insight: The future of remote work is hybrid. Companies that adapt quickly will attract top talent...",
      platform: "instagram",
      tone: "professional",
      createdAt: "2024-01-13",
      status: "scheduled"
    },
    {
      id: 4,
      content: "🔥 Just shipped a new feature! Here's what our users are saying about the improved workflow...",
      platform: "linkedin",
      tone: "funny",
      createdAt: "2024-01-12",
      status: "published"
    },
    {
      id: 5,
      content: "📚 Learning in public: My journey from junior to senior developer in 2 years...",
      platform: "twitter",
      tone: "educational",
      createdAt: "2024-01-11",
      status: "draft"
    }
  ];

  const filteredPosts = savedPosts.filter(post => {
    const platformMatch = filterPlatform === "all" || post.platform === filterPlatform;
    const dateMatch = filterDate === "all" || 
      (filterDate === "week" && new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterDate === "month" && new Date(post.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return platformMatch && dateMatch;
  });

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied!", {
      description: "Post content copied to clipboard.",
    });
  };

  const handleDelete = (id: number) => {
    toast.success("Deleted!", {
      description: "Post removed from history.",
    });
  };

  const handleEdit = (id: number) => {
    toast.success("Edit Mode", {
      description: "Redirecting to edit this post...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "💼";
      case "twitter":
        return "🐦";
      case "instagram":
        return "📸";
      default:
        return "📱";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-slate-900">Post History</span>
            </div>
          </div>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
              Create New Posts
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Filters */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
                <span className="text-sm text-slate-600">
                  {filteredPosts.length} of {savedPosts.length} posts
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Platform
                  </label>
                  <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Date Range
                  </label>
                  <Select value={filterDate} onValueChange={setFilterDate}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getPlatformEmoji(post.platform)}</span>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-slate-900 capitalize">
                              {post.platform}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-sm text-slate-600 capitalize">
                              {post.tone}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(post.status)}`}>
                              {post.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4 line-clamp-3">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopy(post.content)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => handleEdit(post.id)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No posts found
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {filterPlatform !== "all" || filterDate !== "all"
                      ? "Try adjusting your filters to see more posts"
                      : "You haven't created any posts yet"
                    }
                  </p>
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                      Create Your First Post
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;