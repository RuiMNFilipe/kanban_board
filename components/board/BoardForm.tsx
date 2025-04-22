"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { boardFormSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import createBoardAction from "@/actions/boards/createBoard";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export function BoardForm() {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<
    {
      type: string;
      message: string;
    }[]
  >([]);

  const createBoardForm = useForm<z.infer<typeof boardFormSchema>>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof boardFormSchema>) {
    setServerErrors([]);

    const formData = new FormData();
    formData.append("name", values.name);

    try {
      const result = await createBoardAction(formData);
      if (result.success) {
        router.push("/boards");
      } else {
        if (result.error === "CredentialsSignin") {
          setServerErrors([
            {
              type: "credentials",
              message: "To create a board, you need to be signed in.",
            },
          ]);
        } else if (result.error === "ValidationError") {
          setServerErrors([
            {
              type: "validation",
              message: "Please enter a valid board name.",
            },
          ]);
        } else if (result.error === "UnknownError") {
          setServerErrors([
            {
              type: "unknown",
              message: "Something went wrong. Please try again later.",
            },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      setServerErrors([
        {
          type: "exception",
          message: "An unexpected error occurred. Please try again.",
        },
      ]);
    }
  }

  const dismissError = (errorType: string) => {
    setServerErrors(serverErrors.filter((error) => error.type !== errorType));
  };

  return (
    <>
      {serverErrors.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {serverErrors.map((error) => (
            <div
              key={error.type}
              className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex justify-between items-center"
            >
              <span>{error.message}</span>
              <button
                onClick={() => dismissError(error.type)}
                className="text-red-400 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Form {...createBoardForm}>
        <form
          onSubmit={createBoardForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={createBoardForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter board name..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="hover:cursor-pointer" type="submit">
            <Plus /> Create Board
          </Button>
        </form>
      </Form>
    </>
  );
}
