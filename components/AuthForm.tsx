"use client";

import { z, ZodEffects, ZodObject } from "zod";
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
import { InputHTMLAttributes } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Type that accepts either a ZodObject or a ZodEffects wrapping a ZodObject
type ValidFormSchema =
  | ZodObject<any, any, any, any>
  | ZodEffects<ZodObject<any, any, any, any>>;

type FieldConfig<T extends ValidFormSchema> = {
  name: keyof T & string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  label: string;
  placeholder?: string;
};

type AuthFormProps<TSchema extends ValidFormSchema> = {
  schema: TSchema;
  onSubmit: (values: z.infer<TSchema>) => Promise<void>;
  fields: FieldConfig<z.infer<TSchema>>[];
  submitLabel: "Register" | "Sign In";
  defaultValues?: DefaultValues<z.infer<TSchema>>;
};

export function AuthForm<TSchema extends ValidFormSchema>({
  fields,
  onSubmit,
  schema,
  submitLabel,
  defaultValues = {} as DefaultValues<z.infer<TSchema>>,
}: AuthFormProps<TSchema>) {
  type FormValues = z.infer<TSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

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
        <Button type="submit">{submitLabel}</Button>
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
