import { PageContainer } from "../../components/ui/PageContainer";
import { ServerGridView } from "../../components/grid/ServerGrid";
import { useServerGrid } from "../../components/grid/useServerGrid";
import { useContactGrid } from "../../hooks/Contact/useContact";
import { useContactColumns } from "./useContactColumns";
import { useComposers } from "../../components/crm/useComposers";
import type { ContactRow } from "../../hooks/Contact/contacttype";

const ContactPage = () => {
    const composer = useComposers();
    const columns = useContactColumns();
    const { grid, params } = useServerGrid(columns,
        {
            pageSize: 10,
            addNewRecord: { label: "Add new contact", name: "Add Contact", onClick: () => composer.addContact() }
        });
    const { data, isLoading, isFetching } = useContactGrid(params);

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
                            onClick: (id) => {
                                console.log("Selected contacts:", id);
                            },
                        },
                    ]
                }
            />
        </PageContainer>
    )
}
export default ContactPage;
