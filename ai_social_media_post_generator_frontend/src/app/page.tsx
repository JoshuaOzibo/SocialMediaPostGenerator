"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Target, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [demoStep, setDemoStep] = useState(0);

  const demoSteps = [
    {
      title: "Enter Your Ideas",
      description: "Type in bullet points of what you want to share",
      content: "• Launched new product feature\n• Team collaboration tips\n• Industry insights"
    },
    {
      title: "Choose Platform & Tone",
      description: "Select where you'll post and your desired tone",
      content: "Platform: LinkedIn\nTone: Professional"
    },
    {
      title: "AI Generates Posts",
      description: "Get 7 days of engaging content ready to publish",
      content: "🚀 Excited to announce our latest product feature...\n\n💡 Effective team collaboration starts with..."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">PostGenius</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Dashboard
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                History
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Turn Ideas into{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              7 Days of Posts
            </span>{" "}
            with AI
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your bullet points into engaging social media content across multiple platforms. 
            Save hours of content creation with AI-powered post generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-2xl px-8 py-6 text-lg font-semibold border-slate-200 hover:border-slate-300 transition-all duration-200">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">
                Generate a week's worth of content in under 30 seconds. No more staring at blank screens.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Multi-Platform</h3>
              <p className="text-slate-600 leading-relaxed">
                Optimized content for LinkedIn, Twitter, and Instagram. Each post tailored to platform best practices.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Save Hours</h3>
              <p className="text-slate-600 leading-relaxed">
                Spend less time writing and more time engaging. Consistent posting has never been easier.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            See How It Works
          </h2>
          
          <div className="bg-slate-50 rounded-2xl p-8">
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setDemoStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === demoStep ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {demoSteps[demoStep].title}
              </h3>
              <p className="text-slate-600">{demoSteps[demoStep].description}</p>
            </div>
            
            <Card className="max-w-md mx-auto rounded-2xl border-0 shadow-md">
              <CardContent className="p-6">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                  {demoSteps[demoStep].content}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content Strategy?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who've revolutionized their social media presence
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="rounded-2xl px-8 py-6 text-lg font-semibold">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-slate-600 border-t border-slate-200">
        <p>&copy; 2024 PostGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
