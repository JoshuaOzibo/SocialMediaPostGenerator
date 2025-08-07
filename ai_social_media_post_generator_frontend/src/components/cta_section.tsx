import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Content Strategy?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of creators who've revolutionized their social media
          presence
        </p>
        <Link href="/auth/signup">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-2xl px-8 py-6 text-lg font-semibold"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
