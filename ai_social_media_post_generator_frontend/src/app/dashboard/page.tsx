"use client";

import { useState } from "react";
import { toast } from "sonner";
import RouteGuard from "@/components/middleware/RouteGuard";
import DashboardGeneratorSection from "@/components/dashboard_component/dashboard_generator_section";
import DashboardResult from "@/components/dashboard_component/dashboard_result";

interface PostType {
  id: number;
  content: string;
  platform: string;
  tone: string;
  day: string;
}

const Dashboard = () => {
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [generatedPosts, setGeneratedPosts] = useState<PostType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate API call
  setTimeout(() => {
    const mockPosts = [
      {
        id: 1,
        content:
          "🚀 Excited to share some insights on team collaboration! Here are 3 key strategies that have transformed our workflow:\n\n✅ Daily standups with clear goals\n✅ Async communication tools\n✅ Regular feedback sessions\n\nWhat collaboration methods work best for your team?",
        platform,
        tone,
        day: "Day 1",
      },
      {
        id: 2,
        content:
          "💡 Pro tip: The best product features come from listening to your users. Here's how we gather feedback:\n\n• User interviews\n• Feature request tracking\n• Beta testing programs\n\nCustomer-driven development = successful products 📈",
        platform,
        tone,
        day: "Day 2",
      },
      {
        id: 3,
        content:
          "🎯 Industry insight: The future of remote work is hybrid. Companies that adapt quickly will attract top talent.\n\nKey trends to watch:\n→ Flexible work arrangements\n→ Digital-first processes\n→ Outcome-based performance\n\nThoughts?",
        platform,
        tone,
        day: "Day 3",
      },
    ];

    setGeneratedPosts(mockPosts);
    setIsGenerating(false);

    toast.success("Posts Generated!", {
      description: "Your social media posts are ready to use.",
    });
  }, 2000);

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">

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
            <DashboardResult
              generatedPosts={generatedPosts}
              isGenerating={isGenerating}
              handleGenerate={() => {}}
            />
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default Dashboard;
