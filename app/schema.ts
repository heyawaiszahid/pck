import { z } from "zod";

export const signUpSchema = z.object({
  firstname: z.string().min(1, "First name is required."),
  lastname: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  companyName: z.string().min(1, "Company name is required."),
  companyLogo: z.custom<File>((file) => file instanceof File, {
    message: "Company logo is required",
  }),
  primaryColor: z.string().min(1, "Primary color is required."),
  secondaryColor: z.string().min(1, "Secondary color is required."),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const addMemberSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
});

export const editMemberSchema = z.object({
  name: z.string().min(1, "Name is required."),
});

export const personalInfoSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    password: z.string().min(8, "Password must be at least 8 characters long.").optional().or(z.literal("")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password did not match.",
    path: ["confirmPassword"],
  });

export const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  companyLogo: z.custom<File>((file) => file instanceof File, {
    message: "Company logo is required",
  }),
  primaryColor: z.string().min(1, "Primary color is required."),
  secondaryColor: z.string().min(1, "Secondary color is required."),
});

export const verifyInviteSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password did not match.",
    path: ["confirmPassword"],
  });
