import { useMemo } from "react";
import { type GridColumn } from "pam-grid";
import type { ContactRow } from "../../hooks/Contact/contacttype";
import { Avatar } from "../../components/common/Avatar";
import { formatDate } from "../../crm/format";

export const useContactColumns = (): GridColumn<ContactRow>[] => {

    return useMemo(() => [
        {
            key: "name",
            title: "Contact Name",
            Width: 250,
            render: (row: ContactRow) => (
                <div className="flex align-center gap-3">
                    <Avatar
                        firstName={row.firstName}
                        lastName={row.lastName}
                        jobRole={row.jobRole?.name ?? null} />
                </div>
            )
        },
        {
            key: "prospect",
            title: "Prospect",
            Width: 250,
            render: (row: ContactRow) =>
                <span className="underline bold" >{row?.prospect?.name ?? ""}</span>

        },

        {
            key: "email",
            title: "Email",
            Width: 150,
            render: (row: ContactRow) => (
                <span>{row?.email ?? ""}</span>
            )
        },
        {
            key: "designation",
            title: "Designation",
            Width: 150,
            render: (row: ContactRow) => (
                <span>{row?.designation ?? ""}</span>
            )
        },
        {
            key: "roleForProject",
            title: "Role For project",
            Width: 150,
            render: (row: ContactRow) => (
                <span>{row?.jobRole.name ?? ""}</span>
            )
        },
        {
            key: "CreatedAt",
            title: "Date Added",
            Width: 150,
            render: (row: ContactRow) => (
                <span>{formatDate(row?.createdAt) ?? ""}</span>
            )
        }

    ] as unknown as GridColumn<ContactRow>[], [])
}