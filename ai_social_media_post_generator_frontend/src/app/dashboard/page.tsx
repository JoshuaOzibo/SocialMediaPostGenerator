"use client";

import { useState } from "react";
import { toast } from "sonner";
import RouteGuard from "@/components/middleware/RouteGuard";
import DashboardGeneratorSection from "@/components/dashboard_component/dashboard_generator_section";
import DashboardResult from "@/components/dashboard_component/dashboard_result";
import { useCreatePost, useRegenerateContent } from "@/hooks/api/usePosts";
import { CreatePostRequest, Post, Platform, Tone } from "@/lib/api/types";

interface GeneratorFormData {
  ideas: string;
  days: string;
  scheduleDate: string;
  includeHashtags: boolean;
  includeImages: boolean;
}

const Dashboard = () => {
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingContentId, setRegeneratingContentId] = useState<string | null>(null);

  // API hooks - only for creating posts
  const createPostMutation = useCreatePost();
  const regenerateSinglePostMutation = useRegenerateContent();

  const handleGenerate = async (formData: GeneratorFormData) => {
    if (!platform || !tone) {
      toast.error(
        "Please select both platform and tone before generating posts."
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Parse ideas into bullet points
      const inputBullets = formData.ideas
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => line.replace(/^[•\-\*]\s*/, ""));

      // Create post request data
      const postData: CreatePostRequest = {
        platform: platform as Platform,
        tone: tone as Tone,
        input_bullets: inputBullets,
        additionalContext: formData.ideas,
        includeHashtags: formData.includeHashtags,
        includeImages: formData.includeImages,
        days: formData.days ? parseInt(formData.days) : 1,
        scheduled_at: formData.scheduleDate || undefined,
      };

      // Debug: Log the request data
      console.log("🚀 Sending POST request to /api/v1/posts");
      console.log("Request data:", JSON.stringify(postData, null, 2));
      console.log("Platform:", platform);
      console.log("Tone:", tone);
      console.log("Input bullets:", inputBullets);

      // Call the API to create posts
      const newPost = await createPostMutation.mutateAsync(postData);

      // Debug: Log the API response
      console.log("🎉 API Response received:", newPost);
      console.log("Generated posts:", newPost.generated_posts);
      console.log("Hashtags:", newPost.hashtags);

      // Check if response has a data wrapper (backend might return { success: true, data: {...} })
      const finalPostData = (newPost as { data?: Post }).data || newPost;

      console.log("📝 Final post data to display:", finalPostData);
      console.log(
        "Generated posts in final data:",
        finalPostData.generated_posts
      );

      // Add the new post to the list (only show current session posts)
      setGeneratedPosts((prev) => [finalPostData, ...prev]);

      toast.success("Posts Generated!", {
        description: "Your social media posts are ready to use.",
      });
    } catch (error: unknown) {
      console.error("Error generating posts:", error);

      // Debug: Log more details about the error
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: unknown };
        };
        console.error("Response status:", axiosError.response.status);
        console.error("Response data:", axiosError.response.data);
      }

      // Check if it's a timeout error
      if (error && typeof error === "object" && "code" in error) {
        const axiosError = error as { code: string; message: string };
        if (
          axiosError.code === "ECONNABORTED" ||
          axiosError.message.includes("timeout")
        ) {
          toast.error("Request timed out", {
            description:
              "The AI is taking longer than expected to generate content. Please try again.",
          });
          return;
        }
      }

      toast.error("Failed to generate posts", {
        description: "Please try again later.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReGenerate = async (postId: string, individualPostId: string) => {
    if (!postId) {
      toast.error("Post ID is required for regeneration");
      return;
    }

    setRegeneratingContentId(individualPostId);

    try {
      console.log("🔄 Regenerating post with ID:", postId, "individual post ID:", individualPostId);
      
      // Call the regeneration API
      const updatedPost = await regenerateSinglePostMutation.mutateAsync(postId);
      
      console.log("✅ Post regenerated successfully:", updatedPost);
      
      // Check if response has a data wrapper (backend might return { success: true, data: {...} })
      const finalPostData = (updatedPost as { data?: Post }).data || updatedPost;
      
      // Update the post in the local state
      setGeneratedPosts((prev) => 
        prev.map((post) => 
          post.id === postId ? finalPostData : post
        )
      );
      
      toast.success("Post regenerated!", {
        description: "The post content has been updated with new AI-generated content.",
      });
    } catch (error) {
      console.error("❌ Error regenerating post:", error);
      toast.error("Failed to regenerate post", {
        description: "Please try again later.",
      });
    } finally {
      setRegeneratingContentId(null);
    }
  };

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 h-[calc(80vh-2rem)]">
            {/* Generator Section - Fixed */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <DashboardGeneratorSection
                setPlatform={setPlatform}
                platform={platform}
                setTone={setTone}
                tone={tone}
                onGenerate={handleGenerate}
                isGenerating={isGenerating || createPostMutation.isPending}
              />
            </div>

            {/* Results Section - Scrollable */}
            <div className="lg:overflow-y-auto lg:pr-4 scrollbar-hide">
              <DashboardResult
                generatedPosts={generatedPosts}
                isGenerating={isGenerating || createPostMutation.isPending}
                handleReGenerate={handleReGenerate}
                regeneratingContentId={regeneratingContentId}
              />
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default Dashboard;
