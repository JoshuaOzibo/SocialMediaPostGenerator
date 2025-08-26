import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const HistoryPostsSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <Card
          key={index}
          className="border-0 px-4 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200"
        >
          {/* Image skeleton */}
          <div className="relative">
            <Skeleton className="w-full h-[300px] rounded-lg" />
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* Platform emoji skeleton */}
                <Skeleton className="w-6 h-6 rounded" />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {/* Platform name skeleton */}
                    <Skeleton className="w-16 h-4 rounded" />
                    <span className="text-xs text-slate-500">•</span>
                    {/* Tone skeleton */}
                    <Skeleton className="w-12 h-4 rounded" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Clock icon skeleton */}
                    <Skeleton className="w-3 h-3 rounded" />
                    {/* Date skeleton */}
                    <Skeleton className="w-20 h-3 rounded" />
                    {/* Status badge skeleton */}
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-2 mb-4">
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-1/2 h-4 rounded" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Skeleton className="w-16 h-8 rounded-xl" />
                <Skeleton className="w-16 h-8 rounded-xl" />
              </div>
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default HistoryPostsSkeleton;
