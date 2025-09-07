import React from "react";
import { Card, CardContent } from "../ui/card";
import { Sparkles } from "lucide-react";

const EmptyPostCard = () => {
  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-12 text-center">
        <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No posts yet
        </h3>
        <p className="text-slate-600">
          Fill in your ideas and generate your first set of posts
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyPostCard;
