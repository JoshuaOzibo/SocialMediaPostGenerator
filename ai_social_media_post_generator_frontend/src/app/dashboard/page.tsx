"use client";

import { useState } from "react";
import { toast } from "sonner";
import RouteGuard from "@/components/middleware/RouteGuard";
import DashboardGeneratorSection from "@/components/dashboard_component/dashboard_generator_section";
import DashboardResult from "@/components/dashboard_component/dashboard_result";
import { useCreatePost, useRegenerateIndividualPost } from "@/hooks/api/usePosts";
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
  const regenerateIndividualPostMutation = useRegenerateIndividualPost();

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
      const newPost = await createPostMutation.mutateAsync(postData);

      const finalPostData = (newPost as { data?: Post }).data || newPost;

      setGeneratedPosts((prev) => [finalPostData, ...prev]);

      toast.success("Posts Generated!", {
        description: "Your social media posts are ready to use.",
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: unknown };
        };
        toast.error("Failed to generate posts", {
          description: "Please try again later. Error: " + axiosError.response.data,
        });
      }

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
    if (!postId || !individualPostId) {
      toast.error("Post ID and individual post ID are required for regeneration");
      return;
    }

    setRegeneratingContentId(individualPostId);

    try {
      const updatedPost = await regenerateIndividualPostMutation.mutateAsync({
        postId,
        individualPostId
      });


      const finalPostData = (updatedPost as { data?: Post }).data || updatedPost;

      setGeneratedPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? finalPostData : post
        )
      );

      toast.success("Post regenerated!", {
        description: "The individual post content has been updated with new AI-generated content.",
      });
    } catch (error) {

      toast.error("Failed to regenerate post", {
        description: "Please try again later. Error: " + error,
      });
    } finally {
      setRegeneratingContentId(null);
    }
  };

  return (
    <RouteGuard requireAuth={true}>
      <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 lg:h-[calc(80vh-2rem)]">
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <DashboardGeneratorSection
                setPlatform={setPlatform}
                platform={platform}
                setTone={setTone}
                tone={tone}
                onGenerate={handleGenerate}
                isGenerating={isGenerating || createPostMutation.isPending}
              />
            </div>

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
