import React, { useState } from "react"
import { DataTable } from "../common/DataTable"
import type { ColumnConfig } from "../common/DataTable"
import { type Prospect } from "./ProspectSchema"

const DUMMY_DATA: Prospect[] = [
    { id: 1, name: "Alice Johnson", description: "Looking for ERP integration", estimatedValue: 50000, location: "New York", expectedDecisionDate: "2024-12-01" },
    { id: 2, name: "Bob Smith", description: "Needs CRM solution", estimatedValue: 75000, location: "London", expectedDecisionDate: "2024-11-15" },
    { id: 3, name: "Charlie Davis", description: "Cloud migration project", estimatedValue: 120000, location: "Sydney", expectedDecisionDate: "2025-01-10" },
    { id: 4, name: "Diana Prince", description: "Security audit", estimatedValue: 25000, location: "Paris", expectedDecisionDate: "2024-10-31" },
    { id: 5, name: "Evan Wright", description: "Custom software development", estimatedValue: 100000, location: "Berlin", expectedDecisionDate: "2025-03-01" },
];

import { Popover, Menu, MenuItem, Button, Position, Alert, Intent } from "@blueprintjs/core"

export const ProspectTable: React.FC = () => {
    const [data, setData] = useState<Prospect[]>(DUMMY_DATA);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Handle our custom inline editing
    const handleCellEdit = (rowIndex: number, columnId: string, newValue: string) => {
        const newData = [...data];
        (newData[rowIndex] as any)[columnId] = newValue;
        setData(newData);
    };

    // Handle Selection
    const handleSelectionChange = (selectedIndices: number[]) => {
        console.log("Selected Rows:", selectedIndices.map(index => data[index]));
    };

    const handleDeleteConfirm = () => {
        if (!deletingId) return;
        setData(prev => prev.filter(p => p.id !== deletingId));
        console.log("Deleted Prospect ID:", deletingId);
        setDeletingId(null);
    };

    const handleEdit = (row: Prospect) => {
        console.log("Edit Prospect:", row);
        // In the future, this could navigate to the edit page /prospects/manage/:id
    };

    const columns = React.useMemo<ColumnConfig<Prospect>[]>(() => [
        { id: "id", name: "ID", accessor: "id", sortable: true },
        { id: "name", name: "Name", accessor: "name", editable: true, sortable: true },
        { id: "description", name: "Description", accessor: "description", sortable: true, editable: true },
        { id: "location", name: "Location", accessor: "location", sortable: true },
        {
            id: "estimatedValue",
            name: "Est. Value",
            accessor: "estimatedValue",
            sortable: true,
            cellRenderer: (row) => row.estimatedValue ? `$${row.estimatedValue.toLocaleString()}` : 'N/A'
        },
        { id: "expectedDecisionDate", name: "Decision Date", accessor: "expectedDecisionDate", sortable: true, editable: true },
        {
            id: "actions",
            name: "Action", // Added the header name you wanted!
            accessor: "id" as any, // Dummy accessor
            cellRenderer: (row) => (
                <div onClick={(e) => e.stopPropagation()} className="text-start px-2">
                    <Popover
                        position={Position.BOTTOM_RIGHT}
                        usePortal={true}
                        content={
                            <Menu>
                                <MenuItem icon="edit" text="Edit Prospect" onClick={() => handleEdit(row)} />
                                <MenuItem icon="trash" text="Delete" intent="danger" onClick={() => {
                                    if(row.id) setDeletingId(row.id);
                                }} />
                            </Menu>
                        }
                    >
                        <Button icon="more" minimal={true} />
                    </Popover>
                </div>
            )
        }
    ], [data]);

    return (
        <div className="mt-4">
            <h5 className="mb-3 text-strong">Prospect Pipeline</h5>
            <DataTable
                data={data}
                columns={columns}
                enableRowHeader={true}
                enableRowSelection={true}
                onCellEdit={handleCellEdit}
                onSelectionChange={handleSelectionChange}
                pageSize={10}
            />
            
            <Alert
                cancelButtonText="Cancel"
                confirmButtonText="Delete Prospect"
                icon="trash"
                intent={Intent.DANGER}
                isOpen={deletingId !== null}
                onCancel={() => setDeletingId(null)}
                onConfirm={handleDeleteConfirm}
            >
                <p>
                    Are you sure you want to delete this prospect? This action cannot be undone.
                </p>
            </Alert>
        </div>
    );
};
