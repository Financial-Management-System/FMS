'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LayoutDashboard, Shield, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { SectionCard } from '@/src/components/custom/sectionCard';
import { FormInput } from '@/src/components/custom/formInput';
import { Button } from '@/src/components/ui/button';
import { Form } from '@/src/components/ui/form';
import { Badge } from '@/src/components/ui/badge';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.email && data.password) {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance Management System</h1>
          <p className="text-gray-600">Secure access to your financial dashboard</p>
        </div>
        
        {/* Login Form */}
        <SectionCard className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                
                <FormInput
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                
                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <button 
                      type="button" 
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      disabled={isLoading}
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
              </form>
            </Form>
            

          </div>
        </SectionCard>
        
        {/* Security Badge */}
        <div className="flex items-center justify-center mt-6 mb-4">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Shield className="w-3 h-3 mr-1" />
            Secure Login
          </Badge>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 FinanceAdmin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}