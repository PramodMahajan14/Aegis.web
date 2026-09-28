import z from "zod";
import type { basicNext, BasicProspect } from "../Prospect/ProspectType";
import type { ApiResponse, BasicEmployee } from "../authApi/authTypes";
import type { BasicJobeRole } from "../Master/MasterTypes";

export const contactSchema = z.object({
    prospectId: z.string().optional(),
    firstName: z.string().min(3, "Required").trim(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().or(z.literal("")).optional(), // allows empty strings without failing email check
    designation: z.string().optional(),
    jobRoleId: z.string().min(1, "Required").trim(),
    isPrimary: z.boolean(),
    notes: z.string().optional().nullable(),
})

// Infer the form values type
export type ContactSchema = z.infer<typeof contactSchema>;

// Props passed from parent component
export type ManageContactProps = {
    prospectId?: string;
    contactId?: string;
    onDone?: () => void;
    onCancel: () => void;
};

export interface ContactTabProps {
    ProspectId: string
}


export interface ContactRow {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    designation: string;
    notes: string
    prospect: BasicProspect;
    isPrimary: boolean;
    jobRole: BasicJobeRole
    createdBy: BasicEmployee;
    createdAt: string
}



export const contactMap = (contact: ContactRow) => ({
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    designation: contact.designation,
    jobRoleId: contact.jobRole.id,
    isPrimary: contact.isPrimary,
    notes: contact.notes,
    prospectId: contact.prospect.id,
});



export type ContactDetails = ApiResponse<ContactRow>;
export type ContactsList = ApiResponse<ContactRow[]>;

export interface PagedContactResponse {
    items: ContactRow[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}