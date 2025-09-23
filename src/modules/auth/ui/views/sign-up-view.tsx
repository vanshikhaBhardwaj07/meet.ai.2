"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { OctagonAlert } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema
const formSchema = z.object({
  name:z.string().min(1,{message:"Name is required"}),
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
   confirmPassword: z.string().min(1, { message: "Password is required" }),
})
.refine((data)=> data.password ===data.confirmPassword, {
  message:"Paaswords don't match",
  path: ["confirmPassword"],
});

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const[pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:" ",
      confirmPassword:"",
      email: "",
      password: "",
    },
  });

  const onSubmit =  (data: z.infer<typeof formSchema>) => {
    setError(null);
setPending(true);

     authClient.signIn.email(
     {
      email:data.email,
      password: data.password,
     },
     {
      onSuccess: () =>{
          setPending(false);
        router.push("/");
      },
      onError:({error}) =>{
        setError(error.message)
      }

     }

     );
   
    };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left side form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 p-6 md:p-8"
            >
              {/* Welcome text */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold"> Let&apos; get started </h1>
                <p className="text-muted-foreground">
                 Create  your account
                </p>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <OctagonAlert className="h-4 w-4 !text-destructive" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
            <Button
  disabled={pending}
  type="submit"
  className="w-full"
>
  Sign In
</Button>


              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="px-2 text-sm text-muted-foreground">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  GitHub
                </Button>
              </div>

              {/* Sign up link */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign Up
                </Link>
              </div>
            </form>
          </Form>

          {/* Right side logo */}
          <div className="bg-gradient-to-br from-blue-700 to-green-900 hidden md:flex flex-col gap-y-4 items-center justify-center p-6">
            <img src="/logo.svg" alt="Logo" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">MEET.AI</p>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">
          Terms of Services
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};
