"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  AlertCircle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Import all hooks
import {
  // Auth hooks
  useLogin,
  useSignup,
  useLogout,
  useCurrentUser,
  useAuthStatus,
  
  // Posts hooks
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useRegenerateContent,
  usePostStats,
  useScheduledPosts,
  useBulkDeletePosts,
  useExportPosts,
} from '@/hooks/api';

// Import types
import { CreatePostRequest, PostFilters, Platform, Tone } from '@/lib/api/types';

const ApiExample = () => {
  // State for form inputs
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [postData, setPostData] = useState<CreatePostRequest>({
    platform: 'linkedin',
    tone: 'professional',
    input_bullets: [],
    includeHashtags: true,
    includeImages: false,
  });
  const [filters, setFilters] = useState<PostFilters>({});

  // Auth hooks
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStatus();

  // Posts hooks
  const { 
    data: postsData, 
    isLoading: postsLoading, 
    error: postsError,
    refetch: refetchPosts 
  } = usePosts(filters);
  
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const regenerateMutation = useRegenerateContent();
  const { data: stats, isLoading: statsLoading } = usePostStats();
  const { data: scheduledPosts, isLoading: scheduledLoading } = useScheduledPosts();
  const bulkDeleteMutation = useBulkDeletePosts();
  const exportMutation = useExportPosts();

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(loginData);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await signupMutation.mutateAsync(signupData);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  // Handle create post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPostMutation.mutateAsync(postData);
      toast.success('Post created successfully!');
      setPostData({
        platform: 'linkedin',
        tone: 'professional',
        input_bullets: [],
        includeHashtags: true,
        includeImages: false,
      });
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  // Handle delete post
  const handleDeletePost = async (id: string) => {
    try {
      await deletePostMutation.mutateAsync(id);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  // Handle regenerate content
  const handleRegenerate = async (id: string) => {
    try {
      await regenerateMutation.mutateAsync(id);
      toast.success('Content regenerated successfully!');
    } catch (error) {
      toast.error('Failed to regenerate content');
    }
  };

  // Handle export posts
  const handleExport = async () => {
    try {
      const data = await exportMutation.mutateAsync({ filters, format: 'json' });
      // Create and download file
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'posts-export.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Posts exported successfully!');
    } catch (error) {
      toast.error('Failed to export posts');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">API Integration Example</h1>

      {/* Authentication Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auth Status */}
          <div className="flex items-center gap-4">
            <Badge variant={isAuthenticated ? "default" : "secondary"}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </Badge>
            {authLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {user && (
              <span className="text-sm text-gray-600">
                Welcome, {user.username}!
              </span>
            )}
          </div>

          {/* Login Form */}
          {!isAuthenticated && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h3 className="font-semibold">Login</h3>
              <Input
                placeholder="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                disabled={loginMutation.isLoading}
              />
              <Input
                placeholder="Password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                disabled={loginMutation.isLoading}
              />
              <Button 
                type="submit" 
                disabled={loginMutation.isLoading}
                className="w-full"
              >
                {loginMutation.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {!isAuthenticated && (
            <form onSubmit={handleSignup} className="space-y-4">
              <h3 className="font-semibold">Signup</h3>
              <Input
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                disabled={signupMutation.isLoading}
              />
              <Input
                placeholder="Email"
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                disabled={signupMutation.isLoading}
              />
              <Input
                placeholder="Password"
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                disabled={signupMutation.isLoading}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                disabled={signupMutation.isLoading}
              />
              <Button 
                type="submit" 
                disabled={signupMutation.isLoading}
                className="w-full"
              >
                {signupMutation.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Signup'
                )}
              </Button>
            </form>
          )}

          {/* Logout Button */}
          {isAuthenticated && (
            <Button 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isLoading}
              variant="outline"
            >
              {logoutMutation.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Posts Section */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Posts Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Create Post Form */}
            <form onSubmit={handleCreatePost} className="space-y-4">
              <h3 className="font-semibold">Create New Post</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={postData.platform}
                  onValueChange={(value: Platform) => 
                    setPostData({ ...postData, platform: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={postData.tone}
                  onValueChange={(value: Tone) => 
                    setPostData({ ...postData, tone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Enter your ideas (bullet points)"
                value={postData.input_bullets.join('\n')}
                onChange={(e) => setPostData({ 
                  ...postData, 
                  input_bullets: e.target.value.split('\n').filter(line => line.trim()) 
                })}
                disabled={createPostMutation.isLoading}
              />
              <Button 
                type="submit" 
                disabled={createPostMutation.isLoading}
                className="w-full"
              >
                {createPostMutation.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating post...
                  </>
                ) : (
                  'Create Post'
                )}
              </Button>
            </form>

            {/* Posts List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Posts List</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => refetchPosts()}
                    disabled={postsLoading}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleExport}
                    disabled={exportMutation.isLoading}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {postsLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {postsError && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Failed to load posts</span>
                </div>
              )}

              {/* Success State */}
              {postsData && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Total: {postsData.total}</span>
                    <span>Page: {postsData.page}</span>
                    <span>Has More: {postsData.hasMore ? 'Yes' : 'No'}</span>
                  </div>
                  
                  {postsData.posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.platform}</Badge>
                          <Badge variant="outline">{post.tone}</Badge>
                          <Badge variant="outline">{post.status}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleRegenerate(post.id)}
                            disabled={regenerateMutation.isLoading}
                            variant="outline"
                            size="sm"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deletePostMutation.isLoading}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {post.input_bullets.join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                  <div className="text-sm text-gray-600">Published</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.scheduled}</div>
                  <div className="text-sm text-gray-600">Scheduled</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
                  <div className="text-sm text-gray-600">Draft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
                  <div className="text-sm text-gray-600">Archived</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiExample;
