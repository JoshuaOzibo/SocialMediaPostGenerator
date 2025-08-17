import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { RefreshCw, Sparkles } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface GeneratorFormData {
  ideas: string;
  days: string;
  scheduleDate: string;
  includeHashtags: boolean;
  includeImages: boolean;
}

const DashboardGeneratorSection = ({ 
  setPlatform, 
  platform, 
  setTone, 
  tone,
  onGenerate,
  isGenerating
}: { 
  setPlatform: (platform: string) => void, 
  platform: string, 
  setTone: (tone: string) => void, 
  tone: string,
  onGenerate: (formData: GeneratorFormData) => void,
  isGenerating: boolean
}) => {
  const [ideas, setIdeas] = useState('')
  const [days, setDays] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [includeImages, setIncludeImages] = useState(false)

  const handleGenerate = async () => {
    if (!ideas.trim() || !platform || !tone) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields before generating posts.",
      });
      return;
    }

    const formData: GeneratorFormData = {
      ideas,
      days,
      scheduleDate,
      includeHashtags,
      includeImages
    };

    onGenerate(formData);
  };

  return (
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

                <div className="grid sm:grid-cols-2 gap-8">
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
  )
}

export default DashboardGeneratorSection;