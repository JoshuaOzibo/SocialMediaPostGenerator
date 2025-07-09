import React, { useState } from "react";
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
  return (
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
  );
};

export default Demo;
