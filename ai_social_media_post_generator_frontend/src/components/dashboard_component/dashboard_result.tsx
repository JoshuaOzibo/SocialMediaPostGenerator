import React from "react";
import { Card, CardContent } from "../ui/card";
import { RefreshCw, Save, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import DashboardSkeleton from "./dashboard_skeleton";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface PostType {
  id: number;
  content: string;
  platform: string;
  tone: string;
  day: string;
}

const DashboardResult = ({
  generatedPosts,
  isGenerating,
  handleGenerate,
}: {
  generatedPosts: PostType[];
  isGenerating: boolean;
  handleGenerate: () => void;
}) => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied!", {
      description: "Post content copied to clipboard.",
    });
  };

  const handleSave = () => {
    toast.success("Saved!", {
      description: "Post saved to your history.",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Generated Posts</h2>
          {generatedPosts.length > 0 && (
            <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {generatedPosts.length} posts
            </span>
          )}

          {isGenerating && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-lg rounded-2xl">
                  <DashboardSkeleton />
                </Card>
              ))}
            </div>
          )}

          {generatedPosts.length > 0 && !isGenerating && (
            <div className="space-y-4">
              {generatedPosts.map((post: PostType) => (
                <Card
                  key={post.id}
                  className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {post.day}
                        </span>
                        <span className="text-sm text-slate-500 capitalize">
                          {post.platform}
                        </span>
                        <span className="text-sm text-slate-500 capitalize">
                          {post.tone}
                        </span>
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
                        onClick={handleSave}
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
    </>
  );
};

export default DashboardResult;
