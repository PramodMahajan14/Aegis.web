import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormShell } from "../crm/forms/FormShell";
import { Field, Input, NativeSelect } from "../ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactMap, contactSchema, type ContactSchema, type ManageContactProps } from "../../hooks/Contact/contacttype";
import { Switch, TextArea } from "@blueprintjs/core";
import { useGetJobeRoles } from "../../hooks/Master/useMaster";
import { useCreateContact, useGetContactDeatils } from "../../hooks/Contact/useContact";
import { Select } from "@blueprintjs/select";
import { useProspectDropDown } from "../../hooks/Prospect/useProspect";

// 1. React.FC uses ManageContactProps for parent inputs
const ManageContact: React.FC<ManageContactProps> = ({
    prospectId,
    contactId,
    onDone,
    onCancel,
}) => {
    const { data: JobRoles, isLoading: jobLoading } = useGetJobeRoles();
    const { data: prospectList, isLoading: prospectLoading } = useProspectDropDown();
    const { data: contact, isLoading: contactLoading } = useGetContactDeatils(contactId!)

    const { mutate: createContact, isPending: createPending } = useCreateContact(() => onDone?.());

    // 2. useForm uses the structural <ContactSchema> type
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactSchema>({
        resolver: zodResolver(contactSchema), // 3. Pass runtime contactSchema object
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            designation: '',
            jobRoleId: '',
            isPrimary: false,
            notes: '',
            prospectId: prospectId
        },
        mode: 'onChange',
    });
    console.log(contactId)
    useEffect(() => {
        if (contactId && !contactLoading && contact) {
            reset(contactMap(contact))
        }
    }, [contactId, contactLoading])

    // 4. onSubmit receives validated ContactSchema data
    const onSubmit = (v: ContactSchema) => {
        if (contactId) return
        else createContact(v)
    };



    return (
        <FormShell
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onCancel}
            busy={createPending}
            submitLabel="Add contact"
        >
            {!prospectId && (
                <div className="grid grid-cols-1 gap-4">
                    <Field label="Prospect" required error={errors.prospectId?.message} >
                        <NativeSelect invalid={!!errors.prospectId} {...register('prospectId')} disabled={(!prospectId && !!contactId)}>
                            <option value="">Select Prospect</option>
                            {prospectLoading ? (
                                <option value="">Loading...</option>
                            ) : (
                                prospectList?.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))
                            )}
                        </NativeSelect>
                    </Field>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <Field label="First name" required error={errors.firstName?.message}>
                    <Input invalid={!!errors.firstName} {...register('firstName')} />
                </Field>
                <Field label="Last name" error={errors.lastName?.message}>
                    <Input {...register('lastName')} />
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Phone" error={errors.phoneNumber?.message}>
                    <Input type="tel" placeholder="+91…" {...register('phoneNumber')} />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                    <Input type="email" {...register('email')} />
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Designation" error={errors.designation?.message}>
                    <Input placeholder="e.g. Purchase Manager" {...register('designation')} />
                </Field>
                <Field label="Role on this project" required error={errors.jobRoleId?.message}>
                    <NativeSelect invalid={!!errors.jobRoleId} {...register('jobRoleId')}>
                        <option value="">Select Job Role</option>
                        {jobLoading ? (
                            <option value="">Loading...</option>
                        ) : (
                            JobRoles?.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))
                        )}
                    </NativeSelect>
                </Field>
            </div>

            <Field label="Notes" error={errors.notes?.message}>
                <TextArea rows={2} placeholder="e.g. Best reached mornings on site" {...register('notes')} />
            </Field>

            <label className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm">
                Primary contact for this prospect
                <Switch {...register('isPrimary')} />
            </label>
        </FormShell>
    );
};

export default ManageContact;
