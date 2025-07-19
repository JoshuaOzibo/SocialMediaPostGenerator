"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, RefreshCw, Save, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const [ideas, setIdeas] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeImages, setIncludeImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [days, setDays] = useState("1");

  const handleGenerate = async () => {
    if (!ideas.trim() || !platform || !tone) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields before generating posts.",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockPosts = [
        {
          id: 1,
          content: "🚀 Excited to share some insights on team collaboration! Here are 3 key strategies that have transformed our workflow:\n\n✅ Daily standups with clear goals\n✅ Async communication tools\n✅ Regular feedback sessions\n\nWhat collaboration methods work best for your team?",
          platform,
          tone,
          day: "Day 1"
        },
        {
          id: 2,
          content: "💡 Pro tip: The best product features come from listening to your users. Here's how we gather feedback:\n\n• User interviews\n• Feature request tracking\n• Beta testing programs\n\nCustomer-driven development = successful products 📈",
          platform,
          tone,
          day: "Day 2"
        },
        {
          id: 3,
          content: "🎯 Industry insight: The future of remote work is hybrid. Companies that adapt quickly will attract top talent.\n\nKey trends to watch:\n→ Flexible work arrangements\n→ Digital-first processes\n→ Outcome-based performance\n\nThoughts?",
          platform,
          tone,
          day: "Day 3"
        }
      ];
      
      setGeneratedPosts(mockPosts);
      setIsGenerating(false);
      
      toast.success("Posts Generated!", {
        description: "Your social media posts are ready to use.",
      });
    }, 2000);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied!", {
      description: "Post content copied to clipboard.",
    });
  };

  const handleSave = (post: any) => {
    toast.success("Saved!", {
      description: "Post saved to your history.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-slate-900">Dashboard</span>
            </div>
          </div>
          <Link href="/history">
            <Button variant="outline" className="rounded-xl">
              View History
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Generator Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Create Your Posts
                </CardTitle>
                <p className="text-slate-600">
                  Enter your ideas and let AI craft engaging social media content
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="ideas" className="text-sm font-medium text-slate-700 mb-2 block">
                    Your Ideas (bullet points work best)
                  </Label>
                  <Textarea
                    id="ideas"
                    placeholder="• Launched new product feature&#10;• Team collaboration tips&#10;• Industry insights&#10;• Customer success story"
                    value={ideas}
                    onChange={(e) => setIdeas(e.target.value)}
                    className="min-h-32 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 just gap-8">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Platform
                    </Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue placeholder="Choose platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Tone
                    </Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      select Days
                    </Label>
                    <Select
                      value={days}
                      onValueChange={setDays}
                    >
                      <SelectTrigger className="rounded-xl sm:w-[50%] w-[40%] border-slate-200">
                        <SelectValue placeholder="Select days to start posting" />
                      </SelectTrigger>
                      <SelectContent> 
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Schedule Date Posting
                    </Label>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleDate(e.target.value)}
                      className="rounded-xl sm:w-[70%] w-[40%] border-slate-200"
                    />
                  </div>

                  
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hashtags" className="text-sm font-medium text-slate-700">
                      Include hashtags
                    </Label>
                    <Switch
                      id="hashtags"
                      checked={includeHashtags}
                      onCheckedChange={setIncludeHashtags}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="images" className="text-sm font-medium text-slate-700">
                      Suggest images
                    </Label>
                    <Switch
                      id="images"
                      checked={includeImages}
                      onCheckedChange={setIncludeImages}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating Posts...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Posts
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Generated Posts</h2>
              {generatedPosts.length > 0 && (
                <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {generatedPosts.length} posts
                </span>
              )}
            </div>

            {isGenerating && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-0 shadow-lg rounded-2xl">
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
                  </Card>
                ))}
              </div>
            )}

            {generatedPosts.length > 0 && !isGenerating && (
              <div className="space-y-4">
                {generatedPosts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {post.day}
                          </span>
                          <span className="text-sm text-slate-500 capitalize">{post.platform}</span>
                          <span className="text-sm text-slate-500 capitalize">{post.tone}</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                        {post.content}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopy(post.content)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={handleGenerate}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                        <Button
                          onClick={() => handleSave(post)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {generatedPosts.length === 0 && !isGenerating && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard