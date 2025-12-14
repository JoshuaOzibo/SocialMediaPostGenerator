import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
       <Badge variant="secondary" className="mb-6 px-4 py-2 rounded-full">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Content Generation
          </Badge>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Turn Ideas into
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            7 Days of Posts
          </span>
          with AI
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Transform your bullet points into engaging social media content across
          multiple platforms. Save hours of content creation with AI-powered
          post generation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            disabled={true}            
            className="rounded-2xl px-8 py-6 text-lg font-semibold border-slate-200 hover:border-slate-300 transition-all duration-200"
          >
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
