"use client";

import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signOut } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long."),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      confirmPassword: "",
      newPassword: "",
    },
  });

  const handleShowPasswordChange = () => {
    setShowPasswordChange(true);
    form.reset();
  };

  const onSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    console.log(data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Appearance Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <ThemeSettings />
      </div>

      {/* Account Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <div className="space-y-4">
          {/* Change Password Trigger */}
          {!showPasswordChange && (
            <Button
              className="hover:cursor-pointer"
              onClick={handleShowPasswordChange}
              variant="secondary"
            >
              Change Password
            </Button>
          )}

          {/* Change Password Form (Conditionally Rendered) */}
          {showPasswordChange && (
            <div>
              <h3 className="text-md font-semibold mb-2">Change Password</h3>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="New password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    onClick={() => console.log(form.formState.errors)}
                    type="submit"
                    className="hover:cursor-pointer"
                  >
                    Update Password
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordChange(false)}
                    className="hover:cursor-pointer"
                  >
                    Cancel
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {/* Logout Button */}
          <div>
            <Button
              onClick={() => signOut()}
              variant="destructive"
              className="hover:cursor-pointer"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
