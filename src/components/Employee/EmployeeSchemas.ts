import { z } from 'zod';

export enum Gender {
  Female = 0,
  Male = 1,
  Other = 2
}

export const EmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  eMail: z.string().min(1, 'Email is required').email('Invalid email address'),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'Please select a gender' }) }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  jobRoleId: z.string().min(1, 'Job role is required'),
});

export type EmployeeFormData = z.infer<typeof EmployeeSchema>;
