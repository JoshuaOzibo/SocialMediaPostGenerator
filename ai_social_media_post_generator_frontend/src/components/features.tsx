import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Target, Clock } from "lucide-react";

const Features = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Lightning Fast
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Generate a week's worth of content in under 30 seconds. No more
              staring at blank screens.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Multi-Platform
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Optimized content for LinkedIn, Twitter, and Instagram. Each post
              tailored to platform best practices.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Save Hours
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Spend less time writing and more time engaging. Consistent posting
              has never been easier.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Features;
