import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Post } from "@/lib/api/types";

interface HistoryFilterCardProps {
  filteredPosts: Post[];
  filterPlatform: string;
  setFilterPlatform: (platform: string) => void;
  filterDate: string;
  setFilterDate: (date: string) => void;
}

const HistoryFilterCard = ({
  filteredPosts,  
  filterPlatform,
  setFilterPlatform,
  filterDate,
  setFilterDate,
}: HistoryFilterCardProps) => {
  console.log('filteredPosts', filteredPosts);
  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
          {/* <span className="text-sm text-slate-600">
            {filteredPosts.length} of {filteredPosts.length} posts
          </span> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Platform
            </label>
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="rounded-xl border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Date Range
            </label>
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="rounded-xl border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryFilterCard;
