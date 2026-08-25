import { z } from 'zod';

export const basicFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  message: z.string().optional(),
  department: z.string().min(1, 'Select a department'),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  billingPlan: z.enum(['monthly', 'annual']),
  twoFactor: z.boolean().optional(),
});
export type BasicFormValues = z.infer<typeof basicFormSchema>;

export const validationFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'A valid email is required').email('A valid email is required'),
  phone: z
    .string()
    .min(1, 'Enter a 10-digit phone number')
    .regex(/^\d{10}$/, 'Enter a 10-digit phone number'),
  agree: z.boolean().refine((v) => v === true, { message: 'You must agree before submitting' }),
});
export type ValidationFormValues = z.infer<typeof validationFormSchema>;
