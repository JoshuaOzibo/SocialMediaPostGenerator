import React from "react";
import { Card, CardContent } from "../ui/card";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface EmptyCardProps {
  filterPlatform: string;
  filterDate: string;
}

const EmptyCard = ({ filterPlatform, filterDate }: EmptyCardProps) => {
  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-12 text-center">
        <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No posts found
        </h3>
        <p className="text-slate-600 mb-6">
          {filterPlatform !== "all" || filterDate !== "all"
            ? "Try adjusting your filters to see more posts"
            : "You haven't created any posts yet"}
        </p>
        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
            Create Your First Post
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EmptyCard;
