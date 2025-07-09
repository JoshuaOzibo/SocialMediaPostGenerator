"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Target, Clock } from "lucide-react";

import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import CtaSection from "@/components/cta_section";
import Demo from "@/components/Demo";
import Features from "@/components/features";

export default function Home() {
  const demoSteps = [
    {
      title: "Enter Your Ideas",
      description: "Type in bullet points of what you want to share",
      content:
        "• Launched new product feature\n• Team collaboration tips\n• Industry insights",
    },
    {
      title: "Choose Platform & Tone",
      description: "Select where you'll post and your desired tone",
      content: "Platform: LinkedIn\nTone: Professional",
    },
    {
      title: "AI Generates Posts",
      description: "Get 7 days of engaging content ready to publish",
      content:
        "🚀 Excited to announce our latest product feature...\n\n💡 Effective team collaboration starts with...",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <Navbar />
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
