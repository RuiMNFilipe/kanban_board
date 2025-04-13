"use client";

import { loginAction, registerAction } from "@/actions/authentication";
import { registerSchema, signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthForm } from "./AuthForm";
import { FieldConfig } from "@/types";

type AuthPageProps = {
  type: "login" | "register";
};

export default function AuthPage({ type }: AuthPageProps) {
  const router = useRouter();

  const schema = type === "login" ? signInSchema : registerSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "register" && { name: "", cPassword: "" }),
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value);
    }

    try {
      const action = type === "login" ? loginAction : registerAction;
      const result = await action(formData);

      if (result.success) {
        router.push("/");
      } else {
        if (result.error === "CredentialsSignin") {
          form.setError("root.invalidCredentials", {
            message:
              "Invalid credentials. Don't have an account? Please, register.",
            type: "valueAsNumber",
          });
        } else {
          form.setError("root.serverError", {
            message: "An error occurred. Please, try again later.",
          });
        }
      }
    } catch (error) {
      form.setError("root.serverError", {
        message: "An unexpected error occurred. Please, try again later.",
      });
    }
  }

  const fields: FieldConfig<z.infer<typeof schema>>[] =
    type === "login"
      ? [
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
        ]
      : [
          {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Your name here...",
          },
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
          {
            name: "cPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "Same password as above...",
          },
        ].map((field) => ({
          ...field,
          name: field.name as keyof z.infer<typeof schema>,
        }));

  const title = type === "login" ? "Sign in" : "Register";
  const submitLabel = type === "login" ? "Sign In" : "Register";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {title}
        </h2>
        <AuthForm
          schema={schema}
          form={form}
          fields={fields}
          onSubmit={onSubmit}
          submitLabel={submitLabel}
          defaultValues={{ email: "", password: "" }}
        />
      </div>
    </div>
  );
}
