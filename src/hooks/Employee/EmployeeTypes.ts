export interface Employee {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string; // ISO string
    joiningDate?: string; // ISO string
    contactNumber: string;
    jobRoleId?: string;
    gender: number; // Enum if needed (1=Male, 2=Female, 3=Other based on previous context)
}
