import { z } from 'zod';

export const JobRoleSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean()
});

export const ApplicationRoleSchema = z.object({
  id: z.number().optional(),
  roleName: z.string().min(1, "Role name is required").max(50, "Role name is too long"),
  accessLevel: z.enum(['Admin', 'Manager', 'User', 'Read-Only'], {
    message: "Please select a valid access level"
  }),
  isActive: z.boolean()
});

export type JobRoleFormData = z.infer<typeof JobRoleSchema>;
export type ApplicationRoleFormData = z.infer<typeof ApplicationRoleSchema>;
