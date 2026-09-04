import React, { useState } from "react";
import { Icon, Button, InputGroup, Menu, MenuItem, MenuDivider, Popover, Alert, Intent } from "@blueprintjs/core";
import { Avatar } from "../common/Avatar";
import { type Prospect } from "./ProspectSchema";

const DUMMY_DATA: Prospect[] = [
    { id: 1, name: "Alice Johnson", description: "Looking for ERP integration", estimatedValue: 50000, location: "New York", expectedDecisionDate: "2024-12-01", stage: "Lead" },
    { id: 2, name: "Bob Smith", description: "Needs CRM solution", estimatedValue: 75000, location: "London", expectedDecisionDate: "2024-11-15", stage: "Negotiation" },
    { id: 3, name: "Charlie Davis", description: "Cloud migration project", estimatedValue: 120000, location: "Sydney", expectedDecisionDate: "2025-01-10", stage: "Closed Won" },
    { id: 4, name: "Diana Prince", description: "Security audit", estimatedValue: 25000, location: "Paris", expectedDecisionDate: "2024-10-31", stage: "Lead" },
    { id: 5, name: "Evan Wright", description: "Custom software development", estimatedValue: 100000, location: "Berlin", expectedDecisionDate: "2025-03-01", stage: "Qualified" },
];

export const ProspectTable: React.FC = () => {
    const [data, setData] = useState<Prospect[]>(DUMMY_DATA);
    const [searchQuery, setSearchQuery] = useState('');
    const [stageFilter, setStageFilter] = useState('All');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const filteredProspects = data.filter(p => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStage = stageFilter === 'All' || p.stage === stageFilter;
        return matchesSearch && matchesStage;
    });

    const toggleSelection = (id: number) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredProspects.length && filteredProspects.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProspects.map(p => p.id as number)));
        }
    };

    const handleDeleteConfirm = () => {
        if (!deletingId) return;
        setData(prev => prev.filter(p => p.id !== deletingId));
        setDeletingId(null);
    };

    return (
        <div className="d-flex flex-column w-100 mt-2">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ minHeight: '64px' }}>
                {selectedIds.size > 0 ? (
                    <div className="d-flex align-items-center bg-primary-subtle rounded px-3 py-1 shadow-sm border border-primary text-primary">
                        <span className="fw-medium me-3 small">{selectedIds.size} selected</span>
                        <div className="d-flex gap-1 border-start border-primary border-opacity-25 ps-2">
                            <Button icon="trash" intent="danger" minimal small text="Delete" onClick={() => setSelectedIds(new Set())} />
                            <Button icon="envelope" intent="primary" minimal small text="Email" />
                            <Button icon="cross" minimal small onClick={() => setSelectedIds(new Set())} />
                        </div>
                    </div>
                ) : (
                    <div className="d-flex align-items-center gap-3">
                        <InputGroup
                            leftIcon="search"
                            placeholder="Search prospects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded shadow-sm"
                            style={{ minWidth: '280px' }}
                        />
                        <Popover
                            content={
                                <Menu>
                                    <MenuItem icon={stageFilter === 'All' ? 'tick' : 'blank'} text="All Stages" onClick={() => setStageFilter('All')} />
                                    <MenuItem icon={stageFilter === 'Lead' ? 'tick' : 'blank'} text="Lead" onClick={() => setStageFilter('Lead')} />
                                    <MenuItem icon={stageFilter === 'Qualified' ? 'tick' : 'blank'} text="Qualified" onClick={() => setStageFilter('Qualified')} />
                                    <MenuItem icon={stageFilter === 'Negotiation' ? 'tick' : 'blank'} text="Negotiation" onClick={() => setStageFilter('Negotiation')} />
                                    <MenuItem icon={stageFilter === 'Closed Won' ? 'tick' : 'blank'} text="Closed Won" onClick={() => setStageFilter('Closed Won')} />
                                </Menu>
                            }
                            placement="bottom-start"
                        >
                            <Button icon="filter" text={`Stage: ${stageFilter}`} rightIcon="caret-down" className="btn-ghost" />
                        </Popover>
                    </div>
                )}
                <div>
                    <Button icon="export" text="Export CSV" className="btn-ghost me-2" />
                    <Button icon="plus" intent="primary" text="New Prospect" className="shadow-sm" />
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 border-0">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 border-0 border-bottom" style={{ width: '48px' }}>
                                <input
                                    type="checkbox"
                                    className="form-check-input shadow-sm"
                                    style={{ cursor: 'pointer' }}
                                    checked={selectedIds.size === filteredProspects.length && filteredProspects.length > 0}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom text-uppercase fs-6" >Prospect</th>
                            <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom text-uppercase fs-6" >Opportunity</th>
                            <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom text-uppercase fs-6" >Est. Value</th>
                            <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom text-uppercase fs-6" >Stage</th>
                            <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom text-end text-uppercase fs-6" >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProspects.map((prospect) => (
                            <tr
                                key={prospect.id}
                                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                className={selectedIds.has(prospect.id as number) ? 'bg-primary-subtle' : ''}
                                onClick={(e) => {
                                    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.bp5-popover-target')) return;
                                    toggleSelection(prospect.id as number);
                                }}
                            >
                                <td className="px-4 py-3 border-0 border-bottom" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input shadow-sm"
                                        style={{ cursor: 'pointer' }}
                                        checked={selectedIds.has(prospect.id as number)}
                                        onChange={() => toggleSelection(prospect.id as number)}
                                    />
                                </td>
                                <td className="px-4 py-3 border-0 border-bottom">
                                    <div className="d-flex align-items-center gap-3">
                                        <Avatar name={prospect.name} />
                                        <div>
                                            <div className="fw-semibold text-body-emphasis">{prospect.name}</div>
                                            <div className="text-muted small"><Icon icon="map-marker" size={10} className="me-1" style={{ opacity: 0.7 }} />{prospect.location}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-0 border-bottom">
                                    <div className="text-body-emphasis fw-medium">{prospect.description}</div>
                                    <div className="text-muted small">Decision: {prospect.expectedDecisionDate}</div>
                                </td>
                                <td className="px-4 py-3 border-0 border-bottom">
                                    <span className="text-success fw-bold font-monospace">
                                        ${prospect.estimatedValue?.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-4 py-3 border-0 border-bottom">
                                    {prospect.stage === 'Closed Won' ? (
                                        <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-2 rounded-pill px-2 py-1 shadow-sm">
                                            <div className="rounded-circle bg-success shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                                            Won
                                        </span>
                                    ) : prospect.stage === 'Negotiation' ? (
                                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle d-inline-flex align-items-center gap-2 rounded-pill px-2 py-1 shadow-sm">
                                            <div className="rounded-circle bg-warning shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                                            Negotiation
                                        </span>
                                    ) : (
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-2 rounded-pill px-2 py-1 shadow-sm">
                                            <div className="rounded-circle bg-primary shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                                            {prospect.stage || 'Lead'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 border-0 border-bottom text-end">
                                    <div className="d-flex justify-content-end gap-1">
                                        <Button icon="edit" minimal intent="primary" title="Edit Prospect" />
                                        <Popover
                                            content={
                                                <Menu>
                                                    <MenuItem icon="eye-open" text="View Details" />
                                                    <MenuItem icon="clipboard" text="Copy Link" />
                                                    <MenuDivider />
                                                    <MenuItem icon="trash" text="Delete" intent="danger" onClick={() => {
                                                        if (prospect.id) setDeletingId(prospect.id);
                                                    }} />
                                                </Menu>
                                            }
                                            placement="bottom-end"
                                        >
                                            <Button icon="more" minimal />
                                        </Popover>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProspects.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-5 border-0">
                                    <Icon icon="search" size={32} className="text-muted mb-3 opacity-50" />
                                    <h6 className="text-muted fw-normal">No prospects found matching your criteria.</h6>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="d-flex justify-content-between align-items-center p-3  border-top">
                <span className="text-muted small fw-medium">Showing {filteredProspects.length} of {data.length} results</span>
                <div className="d-flex gap-2">
                    <Button icon="chevron-left" disabled minimal className="text-muted" />
                    <Button icon="chevron-right" disabled minimal className="text-muted" />
                </div>
            </div>

            <Alert
                cancelButtonText="Cancel"
                confirmButtonText="Delete Prospect"
                icon="trash"
                intent={Intent.DANGER}
                isOpen={deletingId !== null}
                onCancel={() => setDeletingId(null)}
                onConfirm={handleDeleteConfirm}
            >
                <p>Are you sure you want to delete this prospect? This action cannot be undone.</p>
            </Alert>
        </div >
    );
};
