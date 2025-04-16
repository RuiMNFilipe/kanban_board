"use client";

import { loginAction } from "@/actions/auth/authentication";
import { signInSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function SignIn() {
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const result = await loginAction(formData);

      console.log(result);

      if (result?.success) {
        router.push("/");
      } else {
        if (result?.error === "CredentialsSignin") {
          signInForm.setError("root.invalidCredentials", {
            message:
              "Invalid credentials. Don't have an account? Please, register.",
            type: "valueAsNumber",
          });
        } else {
          signInForm.setError("root.serverError", {
            message: "An error occurred. Please try again.",
          });
        }
      }
    } catch (error) {
      signInForm.setError("root.serverError", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <Form {...signInForm}>
      <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={signInForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signInForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Your password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign In</Button>
      </form>
      {signInForm.formState.errors.root?.invalidCredentials && (
        <div className="text-red-500">
          {signInForm.formState.errors.root.invalidCredentials.message}
        </div>
      )}

      {signInForm.formState.errors.root?.serverError && (
        <div className="text-red-500">
          {signInForm.formState.errors.root.serverError.message}
        </div>
      )}
    </Form>
  );
}
