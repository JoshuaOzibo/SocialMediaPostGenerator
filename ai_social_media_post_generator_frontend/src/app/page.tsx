"use client";

import Hero from "@/components/hero";
import CtaSection from "@/components/cta_section";
import Demo from "@/components/Demo";
import Features from "@/components/features";

export default function Home() {
  const demoSteps = [
    {
      title: "Share Your Ideas",
      description: "Simply jot down your thoughts, bullet points, or key messages you want to communicate. No need to write full posts just your raw ideas.",
      content:
        "📝 Your Input:\n\n" +
        "• Just launched our new collaboration feature\n" +
        "• Tips for remote team productivity\n" +
        "• Industry insights on AI in marketing\n" +
        "• Customer success story from last quarter\n\n" +
        "That's it! Just your ideas, nothing fancy needed.",
    },
    {
      title: "Customize for Your Audience",
      description: "Tell us where you're posting and how you want to sound. Our AI adapts the content to match each platform's style and your brand voice.",
      content:
        "🎯 Your Preferences:\n\n" +
        "Platform: LinkedIn\n" +
        "Tone: Professional (but approachable)\n" +
        "Days: 7 posts\n" +
        "Include hashtags: Yes\n" +
        "Suggest images: Yes\n\n" +
        "We'll optimize each post for LinkedIn's professional audience while maintaining your authentic voice.",
    },
    {
      title: "Get Ready-to-Publish Content",
      description: "Watch as our AI transforms your ideas into polished, engaging posts. Each one is unique, platform-optimized, and ready to share with your audience.",
      content:
        "✨ Generated Content:\n\n" +
        "Day 1: 🚀 Excited to share that we've just launched our new collaboration feature! This tool has been designed with remote teams in mind, making it easier than ever to stay connected and productive...\n\n" +
        "Day 2: 💡 Remote work doesn't have to mean disconnected teams. Here are three strategies we've found effective for maintaining team cohesion...\n\n" +
        "Day 3: 📊 The landscape of marketing is evolving rapidly. Here's what we're seeing in AI adoption across the industry...\n\n" +
        "All posts include relevant hashtags and image suggestions!",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <Hero />

      {/* Features */}
      <Features />

      {/* Demo Preview */}
      <Demo demoSteps={demoSteps} />

      {/* CTA Section */}
      <CtaSection />
    </div>
  );
}
