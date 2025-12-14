"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface DemoStep {
  demoSteps: {
    title: string;
    description: string;
    content: string;
  }[];
}

const Demo = ({ demoSteps }: DemoStep) => {
  const [demoStep, setDemoStep] = useState(0);
    const [direction, setDirection] = useState<"right">();
  const [isAnimating, setIsAnimating] = useState(false);

  const goToStep = (index: number) => {
    if (index !== demoStep) {
      setDirection("right");
      setIsAnimating(true);
      setTimeout(() => {
        setDemoStep(index);
        setIsAnimating(false);
      }, 150);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (demoStep < demoSteps.length - 1) {
        setDirection("right");
        setIsAnimating(true);
        setTimeout(() => {
          setDemoStep(demoStep + 1);
          setIsAnimating(false);
        }, 150);
      } else {
        setDirection("right");
        setIsAnimating(true);
        setTimeout(() => {
          setDemoStep(0);
          setIsAnimating(false);
        }, 150);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [demoStep, demoSteps.length]);

  return (
    <section className="container mx-auto px-4 py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            How PostGenius Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into engaging social media content in just three simple steps. 
            Our AI understands your brand voice and creates platform-optimized posts that resonate with your audience.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-6 md:p-10 shadow-xl">
          <div className="flex justify-center mb-8">
            <div className="flex space-x-3">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`transition-all duration-300 ${
                    index === demoStep
                      ? "w-10 h-3 bg-blue-600 rounded-full"
                      : "w-3 h-3 bg-slate-300 rounded-full hover:bg-slate-400"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-[400px] md:min-h-[450px]">
            <div
              key={demoStep}
              className={`transition-all duration-500 ease-in-out ${
                isAnimating
                  ? direction === 'right'
                    ? 'opacity-0 translate-x-8'
                    : 'opacity-0 -translate-x-8'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  {demoSteps[demoStep].title}
                </h3>
                <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  {demoSteps[demoStep].description}
                </p>
              </div>

              <Card className="max-w-2xl mx-auto rounded-2xl border-0 shadow-lg bg-white">
                <CardContent className="p-6 md:p-8">
                  <div className="text-sm md:text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {demoSteps[demoStep].content}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
