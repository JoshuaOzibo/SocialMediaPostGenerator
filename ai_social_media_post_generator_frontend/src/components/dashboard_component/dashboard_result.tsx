import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { RefreshCw, Save, Edit, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import DashboardSkeleton from "./dashboard_skeleton";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/lib/api/types";
import Image from "next/image";
import ImageEditor from "./ImageEditor";
import EmptyPostCard from "./empty_post";

const DashboardResult = ({
  generatedPosts,
  isGenerating,
  handleReGenerate,
  regeneratingContentId,
}: {
  generatedPosts: Post[];
  isGenerating: boolean;
  handleReGenerate: (postId: string, individualPostId: string) => void;
  regeneratingContentId: string | null;
}) => {
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [selectedContentIndex, setSelectedContentIndex] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
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

  const handleEditImages = (
    postId: string,
    contentIndex: number,
    currentImages: string[]
  ) => {
    setSelectedPostId(postId);
    setSelectedContentIndex(contentIndex);
    setSelectedImages(currentImages);
    setImageEditorOpen(true);
  };

  const handleCloseImageEditor = () => {
    setImageEditorOpen(false);
    setSelectedPostId("");
    setSelectedContentIndex(0);
    setSelectedImages([]);
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
            {generatedPosts.map(
              (post: Post, postIndex: number) =>
                // Create a separate card for each individual post
                post.individual_posts &&
                post.individual_posts.map((individualPost, contentIndex) => (
                  <Card
                    key={`individual-post-${individualPost.id}`}
                    className={`border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200 ${
                      regeneratingContentId === individualPost.id ? 'opacity-75 bg-blue-50/30' : ''
                    }`}
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
                          {individualPost.content}
                        </p>

                        {/* Display hashtags if available */}
                        {individualPost.hashtags && individualPost.hashtags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {individualPost.hashtags.map((hashtag, hashtagIndex) => (
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
                        {individualPost.images && individualPost.images.length > 0 && (
                          <div className="relative">
                            <Image
                              src={individualPost.images[0]}
                              alt="Generated post image"
                              width={400}
                              height={192}
                              className="w-full h-48 object-cover rounded-lg border border-slate-200"
                            />
                            <div className="absolute top-2 right-2">
                              <Button
                                onClick={() =>
                                  handleEditImages(
                                    post.id || "",
                                    contentIndex,
                                    individualPost.images || []
                                  )
                                }
                                variant="secondary"
                                size="sm"
                                className="bg-white/80 hover:bg-white text-slate-700 rounded-full"
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopy(individualPost.content)}
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
                            onClick={() => handleReGenerate(post.id || "", individualPost.id)}
                            variant="outline"
                            size="sm"
                            className="rounde
                            d-xl"
                            disabled={regeneratingContentId === individualPost.id}
                          >
                            <RefreshCw 
                              className={`h-4 w-4 mr-1 ${
                                regeneratingContentId === individualPost.id ? 'animate-spin' : ''
                              }`} 
                            />
                            {regeneratingContentId === individualPost.id ? 'Regenerating...' : 'Regenerate'}
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
            )}
          </div>
        )}

        {/* Empty state */}
        {generatedPosts.length === 0 && !isGenerating && <EmptyPostCard />}
      </div>

      {/* Image Editor Modal */}
      {imageEditorOpen && (
        <ImageEditor
          postId={selectedPostId}
          contentIndex={selectedContentIndex}
          currentImages={selectedImages}
          onClose={handleCloseImageEditor}
        />
      )}
    </>
  );
};

export default DashboardResult;
