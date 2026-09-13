import { useState } from 'react';
import { Drawer, Position } from '@blueprintjs/core';
import { useWindowStore } from '../../store/useWindowStore';
import { useConfirmStore } from '../../store/useConfirmStore';
import { ProjectStageModal } from './ProjectStageModal';
import { useGetProjectStages, useDeleteProjectStage } from '../../hooks/Master/useMaster';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';

export function ProjectStagesCard() {
  const { openWindow } = useWindowStore();
  const { data: stages, isLoading, isError } = useGetProjectStages();
  const deleteStage = useDeleteProjectStage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { openConfirm } = useConfirmStore();

  const openModal = (stage?: { id?: string; name?: string; description?: string }) => {
    setIsDrawerOpen(false);
    const windowId = 'modal-project-stage';
    openWindow({
      id: windowId,
      title: stage ? 'Edit Project Stage' : 'Create Project Stage',
      icon: 'flow-linear',
      width: 500,
      content: <ProjectStageModal windowId={windowId} initialData={stage} />,
    });
  };

  const confirmDelete = (stage: { id?: string; name: string }) =>
    openConfirm({
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete Stage',
      icon: 'trash',
      intent: 'danger',
      content: (
        <p>
          Are you sure you want to delete <b>{stage.name}</b>? This action cannot be undone.
        </p>
      ),
      onConfirm: async () => {
        if (stage.id) await deleteStage.mutateAsync(stage.id);
      },
    });

  return (
    <>
      <Card className="h-full">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-[0.9375rem] font-semibold">
            <i className="bi bi-kanban text-muted-foreground" /> Project Stages
          </h3>
          <Button size="sm" onClick={() => openModal()}>
            <i className="bi bi-plus-lg" /> Add
          </Button>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Spinner className="size-5" />
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-sm text-danger">Failed to load project stages</div>
          ) : (stages ?? []).slice(0, 5).map((stage) => (
            <div key={stage.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <div className="font-semibold text-foreground">{stage.name}</div>
                <div className="truncate text-[0.8125rem] text-muted-foreground">
                  {stage.description}
                </div>
              </div>
              <Badge variant="success" dot>
                Active
              </Badge>
            </div>
          ))}
          {!isLoading && !isError && (stages ?? []).length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No project stages found.</div>
          )}
        </div>

        <button
          className="border-t border-border bg-surface-2 py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => setIsDrawerOpen(true)}
        >
          View all project stages
        </button>
      </Card>

      <Drawer
        icon="flow-linear"
        title="All Project Stages"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={Position.RIGHT}
        size="480px"
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex shrink-0 justify-end border-b border-border px-4 pt-4">
            <Button size="sm" className="my-2" onClick={() => openModal()}>
              <i className="bi bi-plus-lg" /> Add Project Stage
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="divide-y divide-border rounded-lg border border-border">
              {(stages ?? []).map((stage) => (
                <div key={stage.id} className="flex items-start justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{stage.name}</div>
                    <div className="text-[0.8125rem] text-muted-foreground">{stage.description}</div>
                    <Badge variant="success" dot className="mt-1.5">
                      Active
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <IconButton size="sm" title="Edit stage" onClick={() => openModal(stage)}>
                      <i className="bi bi-pencil" />
                    </IconButton>
                    <IconButton
                      size="sm"
                      title="Delete stage"
                      className="hover:text-danger"
                      onClick={() => confirmDelete(stage)}
                    >
                      <i className="bi bi-trash" />
                    </IconButton>
                  </div>
                </div>
              ))}
              {(stages ?? []).length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">No project stages found.</div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
