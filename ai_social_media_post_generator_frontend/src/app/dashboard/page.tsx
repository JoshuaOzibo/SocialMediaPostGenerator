"use client";

import { useState } from "react";
import { toast } from "sonner";
import RouteGuard from "@/components/middleware/RouteGuard";
import DashboardGeneratorSection from "@/components/dashboard_component/dashboard_generator_section";
import DashboardResult from "@/components/dashboard_component/dashboard_result";
import { useCreatePost } from "@/hooks/api/usePosts";
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

  // API hooks - only for creating posts
  const createPostMutation = useCreatePost();

  const handleGenerate = async (formData: GeneratorFormData) => {
    if (!platform || !tone) {
      toast.error("Please select both platform and tone before generating posts.");
      return;
    }

    setIsGenerating(true);

    try {
      // Parse ideas into bullet points
      const inputBullets = formData.ideas
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^[•\-\*]\s*/, '')); // Remove bullet point markers

      // Create post request data
      const postData: CreatePostRequest = {
        platform: platform as Platform,
        tone: tone as Tone,
        input_bullets: inputBullets,
        additionalContext: formData.ideas,
        includeHashtags: formData.includeHashtags,
        includeImages: formData.includeImages,
        days: formData.days ? parseInt(formData.days) : 3,
        scheduled_at: formData.scheduleDate || undefined,
      };

      // Debug: Log the request data
      console.log('🚀 Sending POST request to /api/v1/posts');
      console.log('Request data:', JSON.stringify(postData, null, 2));
      console.log('Platform:', platform);
      console.log('Tone:', tone);
      console.log('Input bullets:', inputBullets);

      // Call the API to create posts
      const newPost = await createPostMutation.mutateAsync(postData);
      
      // Add the new post to the list (only show current session posts)
      setGeneratedPosts(prev => [newPost, ...prev]);

      toast.success("Posts Generated!", {
        description: "Your social media posts are ready to use.",
      });
    } catch (error: unknown) {
      console.error("Error generating posts:", error);
      
      // Debug: Log more details about the error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data: unknown } };
        console.error('Response status:', axiosError.response.status);
        console.error('Response data:', axiosError.response.data);
      }
      
      // Check if it's a timeout error
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as { code: string; message: string };
        if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
          toast.error("Request timed out", {
            description: "The AI is taking longer than expected to generate content. Please try again.",
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

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8  mx-auto">
            {/* Generator Section */}
            <DashboardGeneratorSection
              setPlatform={setPlatform}
              platform={platform}
              setTone={setTone}
              tone={tone}
              onGenerate={handleGenerate}
              isGenerating={isGenerating || createPostMutation.isPending}
            />

            {/* Results Section */}
            <DashboardResult
              generatedPosts={generatedPosts}
              isGenerating={isGenerating || createPostMutation.isPending}
              handleGenerate={() => handleGenerate({ ideas: '', days: '', scheduleDate: '', includeHashtags: true, includeImages: false })}
            />
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default Dashboard;
