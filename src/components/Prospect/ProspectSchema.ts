import { z } from 'zod';

export const ProspectSchema = z.object({
  id: z.number().optional(), // Optional for creation, required for updates
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  estimatedValue: z.number().min(0, "Value cannot be negative").optional(),
  location: z.string().min(1, "Location is required"),
  expectedDecisionDate: z.string().min(1, "Date is required"),
});

// Infer TypeScript types directly from Zod schema
export type Prospect = z.infer<typeof ProspectSchema>;
export type ProspectFormData = z.infer<typeof ProspectSchema>;
