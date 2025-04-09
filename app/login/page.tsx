"use client";

import { loginAction } from "@/actions/authentication";
import { AuthForm } from "@/components/AuthForm";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginPage() {
  const router = useRouter();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const result = await loginAction(formData);

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
    <AuthForm
      schema={signInSchema}
      form={signInForm}
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Your@email.com",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Your password here...",
        },
      ]}
      onSubmit={onSubmit}
      submitLabel="Sign In"
      defaultValues={{ email: "", password: "" }}
    />
  );
}
