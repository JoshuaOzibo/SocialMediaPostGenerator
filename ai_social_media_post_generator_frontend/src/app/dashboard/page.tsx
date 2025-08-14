"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, RefreshCw, Save, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import RouteGuard from "@/components/middleware/RouteGuard";
import DashboardGeneratorSection from "@/components/dashboard_generator_section";

const Dashboard = () => {
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [generatedPosts, setGeneratedPosts] = useState<unknown[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

    
    // Simulate API call
    setTimeout(() => {
      const mockPosts = [
        {
          id: 1,
          content: "🚀 Excited to share some insights on team collaboration! Here are 3 key strategies that have transformed our workflow:\n\n✅ Daily standups with clear goals\n✅ Async communication tools\n✅ Regular feedback sessions\n\nWhat collaboration methods work best for your team?",
          platform,
          tone,
          day: "Day 1"
        },
        {
          id: 2,
          content: "💡 Pro tip: The best product features come from listening to your users. Here's how we gather feedback:\n\n• User interviews\n• Feature request tracking\n• Beta testing programs\n\nCustomer-driven development = successful products 📈",
          platform,
          tone,
          day: "Day 2"
        },
        {
          id: 3,
          content: "🎯 Industry insight: The future of remote work is hybrid. Companies that adapt quickly will attract top talent.\n\nKey trends to watch:\n→ Flexible work arrangements\n→ Digital-first processes\n→ Outcome-based performance\n\nThoughts?",
          platform,
          tone,
          day: "Day 3"
        }
      ];
      
      setGeneratedPosts(mockPosts);
      setIsGenerating(false);
      
      toast.success("Posts Generated!", {
        description: "Your social media posts are ready to use.",
      });
    }, 2000);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied!", {
      description: "Post content copied to clipboard.",
    });
  };

  const handleSave = (post: unknown) => {
    toast.success("Saved!", {
      description: "Post saved to your history.",
    });
  };

  return (
    <RouteGuard requireAuth={true}>
      <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-slate-900">Dashboard</span>
            </div>
          </div>
          <Link href="/history">
            <Button variant="outline" className="rounded-xl">
              View History
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Generator Section */}
          <DashboardGeneratorSection
            setPlatform={setPlatform}
            platform={platform}
            setTone={setTone}
            tone={tone}
          
          />

          {/* Results Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Generated Posts</h2>
              {generatedPosts.length > 0 && (
                <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {generatedPosts.length} posts
                </span>
              )}
            </div>

            {isGenerating && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-0 shadow-lg rounded-2xl">
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-20 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {generatedPosts.length > 0 && !isGenerating && (
              <div className="space-y-4">
                {generatedPosts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {post.day}
                          </span>
                          <span className="text-sm text-slate-500 capitalize">{post.platform}</span>
                          <span className="text-sm text-slate-500 capitalize">{post.tone}</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                        {post.content}
                      </p>
                      
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
                          onClick={handleGenerate}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                        <Button
                          onClick={() => handleSave(post)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {generatedPosts.length === 0 && !isGenerating && (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-slate-600">
                    Fill in your ideas and generate your first set of posts
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
        </>
    </RouteGuard>
  );
};

export default Dashboard