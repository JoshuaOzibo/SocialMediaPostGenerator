import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import GoogleSignInButton from '@/components/googleButton';
import FloatingLabelInput from '@/components/floatinglabel';

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account or create a new one
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin" className="text-sm font-medium">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-medium">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-6">
              <div className="space-y-4">
                <FloatingLabelInput
                  id="signin-email"
                  type="email"
                  label="Email"
                  value=""
                  onChange={() => {}}
                  icon={<Mail className="w-4 h-4" />}
                />

                <FloatingLabelInput
                  id="signin-password"
                  type="password"
                  label="Password"
                  value=""
                  onChange={() => {}}
                  icon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  }
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Forgot password?
                </a>
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]">
                Sign In
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <div className="space-y-4">
                <FloatingLabelInput
                  id="signup-name"
                  type="text"
                  label="Full Name"
                  value=""
                  onChange={() => {}}
                  icon={<User className="w-4 h-4" />}
                />

                <FloatingLabelInput
                  id="signup-email"
                  type="email"
                  label="Email"
                  value=""
                  onChange={() => {}}
                  icon={<Mail className="w-4 h-4" />}
                />

                <FloatingLabelInput
                  id="signup-password"
                  type="password"
                  label="Password"
                  value=""
                  onChange={() => {}}
                  icon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  }
                />

                <FloatingLabelInput
                  id="signup-confirm-password"
                  type="password"
                  label="Confirm Password"
                  value=""
                  onChange={() => {}}
                  icon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                  }
                />
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" required />
                <span className="text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Privacy Policy
                  </a>
                </span>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]">
                Create Account
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <GoogleSignInButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;