import React from "react";
import { Skeleton } from "../ui/skeleton";
import { CardContent } from "../ui/card";

const DashboardSkeleton = () => {
  return (
    <>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-20 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </>
  );
};

export default DashboardSkeleton;
