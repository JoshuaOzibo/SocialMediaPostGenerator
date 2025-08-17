import React from "react";
import { Card, CardContent } from "../ui/card";
import { Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { Edit3 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface HistoryPostsProps {
  filteredPosts: any;
}

const HistoryPosts = ({ filteredPosts }: HistoryPostsProps) => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
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

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "🔗";
      case "twitter":
        return "🐦";
      case "facebook":
        return "💬";
      default:
        return "📝";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return filteredPosts.map((post: any) => (
    <Card
      key={post.id}
      className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200"
    >
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
  ));
};

export default HistoryPosts;
