import { z } from "zod"

export const validation = {
  required: (message: string = "This field is required") => 
    z.string().min(1, { message }),
    
  email: (message: string = "Invalid email address") => 
    z.string().email({ message }),
    
  phone: (message: string = "Invalid phone number") => 
    z.string().regex(/^\+?[1-9]\d{1,14}$/, { message }),
    
  password: (message: string = "Password must be at least 8 characters") => 
    z.string().min(8, { message }),
    
  number: (message: string = "Please enter a valid number") => 
    z.preprocess((val) => Number(val), z.number({ message })),
    
  optionalString: z.string().optional().or(z.literal("")),
}

/**
 * Example User Schema
 */
export const userSchema = z.object({
  firstName: validation.required("First name is required"),
  lastName: validation.required("Last name is required"),
  email: validation.email(),
  role: z.enum(["admin", "user", "manager"] as const, {
    message: "Please select a role",
  }),
  bio: validation.optionalString,
  notifications: z.boolean().default(true),
})

export type UserFormData = z.infer<typeof userSchema>
