'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Utensils,
  ChefHat,
  Calculator,
  Crown,
  ChefHat as KitchenIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { authAPI } from '@/lib/api/auth';
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authAPI.login({
        email: data.email,
        password: data.password
      });

      // Handle success using the actual response structure
      if (response.success && response.data) {
        const { access_token, user } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // Also store token in cookie for middleware protection
        Cookies.set('token', access_token, { expires: data.rememberMe ? 30 : 1 });
        Cookies.set('user', JSON.stringify(user), { expires: data.rememberMe ? 30 : 1 });

        setSuccess(response.message || "Login successful! Redirecting...");
        setUserRole(user.role);

        // Animation delay for role badge display
        setTimeout(() => {
          switch (user.role) {
            case 'admin':
              router.push('/dashboard');
              break;
            case 'cashier':
              router.push('/orders');
              break;
            case 'kitchen':
              router.push('/kitchen');
              break;
            default:
              router.push('/dashboard');
          }
        }, 1500);
      } else {
        throw new Error(response.message || "Login failed");
      }

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password. Please try again.");
      resetField('password');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1.5 py-1 px-3">
            <Crown size={14} /> Admin
          </Badge>
        );
      case 'cashier':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1.5 py-1 px-3">
            <Calculator size={14} /> Cashier
          </Badge>
        );
      case 'kitchen':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1.5 py-1 px-3">
            <KitchenIcon size={14} /> Kitchen
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Side: Branding */}
      <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-orange-500 to-red-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/30">
            <Utensils className="text-white" size={32} />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">RMS Pro</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-white text-5xl lg:text-6xl font-extrabold leading-tight">
            Modern Restaurant <br /> Management
          </h1>
          <p className="text-orange-50/80 text-lg lg:text-xl max-w-md font-medium">
            The all-in-one solution for your restaurant operations. Streamline orders, manage your kitchen, and grow your business.
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <ChefHat className="text-white/80" size={24} />
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <Calculator className="text-white/80" size={24} />
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <Utensils className="text-white/80" size={24} />
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Branding (only visible on small screens) */}
          <div className="md:hidden flex flex-col items-center mb-8 text-center">
            <div className="bg-linear-to-br from-orange-500 to-red-600 p-3 rounded-2xl mb-4 shadow-lg">
              <Utensils className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold">RMS Pro</h2>
            <p className="text-muted-foreground text-sm">Modern Restaurant Management</p>
          </div>

          <Card className="border-none shadow-none md:shadow-sm md:border">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center md:text-left">Welcome Back</CardTitle>
              <CardDescription className="text-center md:text-left">
                Sign in to continue to your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error-alert"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: [0, -10, 10, -10, 10, 0], opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6"
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    key="success-alert"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6"
                  >
                    <Alert className="border-green-500 bg-green-50 text-green-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <div className="flex flex-col gap-2">
                        <div>
                          <AlertTitle className="font-semibold">Success</AlertTitle>
                          <AlertDescription>{success}</AlertDescription>
                        </div>
                        <div className="mt-1">
                          {getRoleBadge(userRole)}
                        </div>
                      </div>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 h-11 transition-all focus:ring-2 focus:ring-orange-500/20 ${errors.email ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                      disabled={isLoading || !!success}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                      tabIndex="-1"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 h-11 transition-all focus:ring-2 focus:ring-orange-500/20 ${errors.password ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                      disabled={isLoading || !!success}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading || !!success}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" {...register('rememberMe')} disabled={isLoading || !!success} />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  disabled={isLoading || !!success}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            Don&apos;t have an account? Contact your administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
