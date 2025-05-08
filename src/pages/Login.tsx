
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";

// Form schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState("");

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError("");
    try {
      const success = await login(data.email, data.password);
      if (!success) {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Budget Management System</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" type="email" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-muted-foreground mt-4">
            <p className="font-semibold text-foreground">Demo Accounts</p>
            <div className="grid grid-cols-3 mt-2 gap-2 text-xs">
              <div className="p-1.5 bg-finance-light text-finance rounded">
                <p>Finance User</p>
                <p>finance@example.com</p>
                <p>finance123</p>
              </div>
              <div className="p-1.5 bg-hod-light text-hod rounded">
                <p>HOD User</p>
                <p>hod@example.com</p>
                <p>hod123</p>
              </div>
              <div className="p-1.5 bg-clerk-light text-clerk rounded">
                <p>Clerk User</p>
                <p>clerk@example.com</p>
                <p>clerk123</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
