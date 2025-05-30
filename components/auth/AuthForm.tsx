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
import { DefaultValues, UseFormReturn } from "react-hook-form";
import { FieldConfig, ValidFormSchema } from "@/types";

type AuthFormProps<TSchema extends ValidFormSchema> = {
  schema: TSchema;
  onSubmit: (values: z.infer<TSchema>) => Promise<void>;
  fields: FieldConfig<z.infer<TSchema>>[];
  submitLabel: "Register" | "Sign In";
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  form: UseFormReturn<z.TypeOf<TSchema>, any, z.TypeOf<TSchema>>;
};

export function AuthForm<TSchema extends ValidFormSchema>({
  fields,
  onSubmit,
  schema,
  submitLabel,
  defaultValues = {} as DefaultValues<z.infer<TSchema>>,
  form,
}: AuthFormProps<TSchema>) {
  type FormValues = z.infer<TSchema>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((fieldConfig) => (
          <FormField
            key={fieldConfig.name}
            control={form.control}
            name={fieldConfig.name as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldConfig.label}</FormLabel>
                <FormControl>
                  <Input
                    type={fieldConfig.type}
                    placeholder={fieldConfig.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button className="hover:cursor-pointer" type="submit">
          {submitLabel}
        </Button>
      </form>
      {form.formState.errors.root?.invalidCredentials && (
        <div className="text-red-500">
          {form.formState.errors.root.invalidCredentials.message}
        </div>
      )}

      {form.formState.errors.root?.serverError && (
        <div className="text-red-500">
          {form.formState.errors.root.serverError.message}
        </div>
      )}
    </Form>
  );
}
