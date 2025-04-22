// Type that accepts either a ZodObject or a ZodEffects wrapping a ZodObject
export type ValidFormSchema =
  | ZodObject<any, any, any, any>
  | ZodEffects<ZodObject<any, any, any, any>>;

export type FieldConfig<T extends ValidFormSchema> = {
  name: keyof T & string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  label: string;
  placeholder?: string;
};
