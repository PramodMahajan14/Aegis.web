import { PageContainer } from "../../components/ui/PageContainer";
import { ServerGridView } from "../../components/grid/ServerGrid";
import { useServerGrid } from "../../components/grid/useServerGrid";
import { useContactGrid, useDeleteContact } from "../../hooks/Contact/useContact";
import { useContactColumns } from "./useContactColumns";
import { useComposers } from "../../components/crm/useComposers";
import type { ContactRow } from "../../hooks/Contact/contacttype";
import { useConfirmStore } from "../../store/useConfirmStore";

const ContactPage = () => {
    const composer = useComposers();
    const columns = useContactColumns();
    const { openConfirm } = useConfirmStore();
    const deleteContact = useDeleteContact();
    const { grid, params } = useServerGrid(columns,
        {
            pageSize: 10,
            addNewRecord: { label: "Add new contact", name: "Add Contact", onClick: () => composer.addContact() }
        });
    const { data, isLoading, isFetching } = useContactGrid(params);


    const confirmDelete = (contact: { id?: string; name: string }) =>
        openConfirm({
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Delete Contact',
            icon: 'trash',
            intent: 'danger',
            loading: deleteContact.isPending,
            content: (
                <p>
                    Are you sure you want to delete <b>{contact.name}</b>? This action can be undone.
                </p>
            ),
            onConfirm: async () => {
                if (contact.id) await deleteContact.mutateAsync(contact.id);
            },
        });

    return (
        <PageContainer>
            <ServerGridView
                columns={columns}
                grid={grid}
                data={data}
                loading={isLoading}
                isFetching={isFetching}
                bulkActions={[
                    {
                        label: "Delete",
                        isVisible: true,
                        icon: "trash",
                        className: "text-danger",
                        onBulkClick: (ids) => {
                            console.log("Selected contacts:", [...ids]);
                        },
                    },

                    {
                        label: "Mail",
                        isVisible: true,
                        icon: "envelope",
                        className: "text-info",
                        onBulkClick: (ids) => {
                            console.log("Selected contacts:", [...ids]);
                        },
                    },
                ]}
                isDropdown={false}
                actions={
                    [
                        {
                            isVisible: true,
                            icon: "pencil-square",
                            className: "text-info cursor-pointer px-1",
                            tooltip: "Edit",
                            onClick: (row: ContactRow) => {
                                composer.addContact(row.id, row.prospect.id);
                            },
                        },
                        {
                            isVisible: true,
                            icon: "trash",
                            className: "text-danger cursor-pointer px-1",
                            onClick: (row: ContactRow) => {
                                confirmDelete({ id: row.id, name: `${row.firstName} ${row.lastName}` });
                            },
                        },
                    ]
                }
            />
        </PageContainer>
    )
}
export default ContactPage;
