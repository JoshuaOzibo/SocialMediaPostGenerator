import React from "react";
import { Card, CardContent } from "../ui/card";
import { RefreshCw, Save, Sparkles, Edit, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import DashboardSkeleton from "./dashboard_skeleton";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/lib/api/types";
import Image from "next/image";

const DashboardResult = ({
  generatedPosts,
  isGenerating,
  handleGenerate,
}: {
  generatedPosts: Post[];
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

  const handleEdit = () => {
    toast.info("Edit feature coming soon!", {
      description: "You'll be able to edit posts in the next update.",
    });
  };


  return (
    <>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Generated Posts</h2>
          {generatedPosts.length > 0 && (
            <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {generatedPosts.length} posts
            </span>
          )}
        </div>

        {/* Skeleton loading state */}
        {isGenerating && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg rounded-2xl">
                <DashboardSkeleton />
              </Card>
            ))}
          </div>
        )}

        {/* Display generated posts */}
        {generatedPosts.length > 0 && !isGenerating && (
          <div className="space-y-4">
            {generatedPosts.map((post: Post, postIndex: number) => (
              // Create a separate card for each generated post
              post.generated_posts && post.generated_posts.map((content, contentIndex) => (
                <Card
                  key={`post-${post.id}-content-${contentIndex}`}
                  className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          Day {postIndex + 1} - Post {contentIndex + 1}
                        </span>
                        <span className="text-sm text-slate-500 capitalize">
                          {post.platform}
                        </span>
                        <span className="text-sm text-slate-500 capitalize">
                          {post.tone}
                        </span>
                      </div>
                    </div>

                    {/* Display the single generated post content */}
                    <div className="space-y-3">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {content}
                      </p>
                      
                      {/* Display hashtags if available */}
                      {(post.hashtags && post.hashtags.length > 0) || 
                       (post.individual_posts && post.individual_posts[contentIndex]?.hashtags && post.individual_posts[contentIndex].hashtags.length > 0) ? (
                        <div className="flex flex-wrap gap-1">
                          {(post.individual_posts?.[contentIndex]?.hashtags || post.hashtags || []).map((hashtag, hashtagIndex) => (
                            <span
                              key={`hashtag-${hashtagIndex}`}
                              className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                                             {/* Generated Image Display */}
                       
                        
                         <div className="relative">
                           <Image
                             src={post.individual_posts?.[contentIndex]?.images?.[0] || post.images[0]}
                             alt="Generated post image"
                             width={400}
                             height={192}
                             className="w-full h-48 object-cover rounded-lg border border-slate-200"
                             style={{ cursor: 'pointer' }}
                           />
                           <div className="absolute top-2 right-2">
                             <Button
                               onClick={() => {}}
                               variant="secondary"
                               size="sm"
                               className="bg-white/80 hover:bg-white text-slate-700 rounded-full"
                             >
                               <ImageIcon className="h-4 w-4" />
                             </Button>
                           </div>
                         </div>
                       

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopy(content)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={handleEdit}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
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
                    </div>
                  </CardContent>
                </Card>
              ))
            ))}
          </div>
        )}

        {/* Empty state */}
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
    </>
  );
};

export default DashboardResult;
