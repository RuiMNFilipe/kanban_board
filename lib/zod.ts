import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email cannot be left empty")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    // .min(8, "Password must be more than 8 characters")
    .max(32, "Password cannot exceed 32 characers"),
});

export const registerSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, {
      message: "Name cannot be left empty",
    })
    .trim(),
  email: string({ required_error: "Email is required" })
    .min(1, "Email cannot be left empty")
    .trim()
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password cannot exceed 32 characers")
    .trim(),
  cPassword: string({ required_error: "Confirmation password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password cannot exceed 32 characers")
    .trim(),
}).refine((data) => data.password === data.cPassword, {
  path: ["cPassword"],
  message: "Passwords do not match.",
});

export const boardFormSchema = object({
  name: string({ required_error: "Board name is required" })
    .min(1, {
      message: "Board name cannot be empty",
    })
    .trim(),
});

export const createTaskSchema = object({
  title: string({ required_error: "Task title is required" })
    .min(1, {
      message: "Task title cannot be empty.",
    })
    .trim(),
  columnId: string().uuid().optional(),
});

export const boardIdSchema = object({
  id: string().uuid(),
});

export const taskTitleSchema = object({
  title: string().min(1, "Task title is required").trim(),
});
