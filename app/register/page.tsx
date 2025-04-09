"use client";

import { registerAction } from "@/actions/authentication";
import { AuthForm } from "@/components/AuthForm";
import { registerSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function RegisterPage() {
  const router = useRouter();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("cPassword", values.cPassword);
    formData.append("name", values.name);

    try {
      const result = await registerAction(formData);

      if (result?.success) {
        router.push("/");
      } else {
        if (result?.error === "CredentialsSignin") {
          registerForm.setError("root.invalidCredentials", {
            message:
              "Invalid credentials. Don't have an account? Please, register.",
            type: "valueAsNumber",
          });
        } else {
          registerForm.setError("root.serverError", {
            message: "An error occurred. Please try again.",
          });
        }
      }
    } catch (error) {
      registerForm.setError("root.serverError", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <AuthForm
      schema={registerSchema}
      form={registerForm}
      fields={[
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
      ]}
      onSubmit={onSubmit}
      submitLabel="Sign In"
      defaultValues={{ email: "", password: "" }}
    />
  );
}
