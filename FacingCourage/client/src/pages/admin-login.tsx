import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { adminLoginSchema, type AdminLogin } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<AdminLogin>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: AdminLogin) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));
      toast({
        title: "Login Successful",
        description: "Welcome back, admin!",
      });
      navigate("/admin/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AdminLogin) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="faction-card p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[var(--gta-orange)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-2">
                  ADMIN LOGIN
                </h1>
                <p className="text-gray-300">
                  Access the Face the Fear admin panel
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Username</FormLabel>
                        <FormControl>
                          <Input 
                            className="form-input"
                            placeholder="Enter your username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="gta-button w-full py-3 font-[Orbitron] text-lg"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        LOGGING IN...
                      </>
                    ) : (
                      "LOGIN"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}