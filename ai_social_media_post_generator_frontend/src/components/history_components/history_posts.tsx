import React from "react";
import { Card, CardContent } from "../ui/card";
import { Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { Edit3 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeletePost } from "@/hooks/api/usePosts";
import { Post } from "@/lib/api/types";
import Image from "next/image";

interface HistoryPostsProps {
  filteredPosts: Post[];
}

const HistoryPosts = ({ filteredPosts }: HistoryPostsProps) => {
  console.log("filteredPosts", filteredPosts);
  const deletePostMutation = useDeletePost();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePostMutation.mutateAsync(id);
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Delete error:", error);
    }
  };

  const handleEdit = () => {
    toast.success("Edit Mode", {
      description: "Redirecting to edit this post...",
    });
    // TODO: Implement navigation to edit page
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "🔗";
      case "twitter":
        return "🐦";
      case "facebook":
        return "💬";
      case "instagram":
        return "📸";
      case "tiktok":
        return "🎵";
      default:
        return "📝";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get the main content from a post
  const getPostContent = (post: Post): string => {
    // If there are individual posts, use the first one's content
    if (post.individual_posts && post.individual_posts.length > 0) {
      return post.individual_posts[0].content;
    }

    // If there are generated posts, use the first one
    if (post.generated_posts && post.generated_posts.length > 0) {
      return post.generated_posts[0];
    }

    // Fallback to input bullets joined
    return post.input_bullets.join(" ");
  };

  return filteredPosts.map((post: Post) => (
    <Card
      key={post.id}
      className="border-0 px-4 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200"
    >
      <Image
        src={
          post.images[0]
        }
        alt="Generated post image"
        width={350}
        height={300}
        className="w-full object-cover rounded-lg border border-slate-200"
      />
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
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                    post.status
                  )}`}
                >
                  {post.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed mb-4 line-clamp-3">
          {getPostContent(post)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              onClick={() => handleCopy(getPostContent(post))}
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
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <Button
            onClick={() => handleDelete(post.id)}
            variant="outline"
            size="sm"
            className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
            disabled={deletePostMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  ));
};

export default HistoryPosts;
