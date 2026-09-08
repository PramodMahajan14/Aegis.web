import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useWorkspacesQuery } from '../../hooks/authApi/useAuthApi';
import { AuthStage } from '../../hooks/authApi/authTypes';
import Loader from '../../components/common/Loader';
import AuthShell from '../../components/common/AuthShell';
import { Spinner } from '../../components/ui/Spinner';

export default function WorkspaceSelect() {
  const { selectWorkspace, stage } = useAuth();
  const navigate = useNavigate();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workspacesQuery = useWorkspacesQuery(stage === AuthStage.AUTHENTICATED_NO_WORKSPACE);

  const handleSelect = async (workspaceId: string) => {
    setSelectingId(workspaceId);
    setError(null);
    try {
      await selectWorkspace(workspaceId);
      navigate('/', { replace: true });
    } catch {
      setError("Couldn't switch to that workspace. Please try again.");
      setSelectingId(null);
    }
  };

  if (workspacesQuery.isPending) {
    return <Loader fullscreen />;
  }

  const workspaces = workspacesQuery.data ?? [];
  const fetchError = workspacesQuery.isError
    ? "Couldn't load your workspaces. Please try again."
    : null;
  const displayError = fetchError ?? error;

  return (
    <AuthShell title="Choose a workspace" subtitle="Select the workspace you want to access.">
      {displayError && (
        <div
          className="mb-4 flex items-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-[0.8125rem] text-danger"
          role="alert"
        >
          <i className="bi bi-exclamation-circle" />
          {displayError}
        </div>
      )}

      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {workspaces.map((ws) => (
          <button
            key={ws.id}
            id={`workspace-btn-${ws.id}`}
            type="button"
            onClick={() => handleSelect(ws.id)}
            disabled={selectingId !== null}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent disabled:opacity-60"
          >
            <div>
              <div className="text-sm font-medium text-foreground">{ws.name}</div>
              <div className="text-xs text-muted-foreground">{ws.role}</div>
            </div>
            {selectingId === ws.id ? (
              <Spinner className="size-4" />
            ) : (
              <i className="bi bi-chevron-right text-sm text-muted-foreground" />
            )}
          </button>
        ))}

        {workspaces.length === 0 && !workspacesQuery.isError && (
          <div className="px-4 py-8 text-center text-[0.8125rem] text-muted-foreground">
            No workspaces found for your account.
          </div>
        )}
      </div>

      {workspacesQuery.isError && (
        <button
          type="button"
          className="mt-3 text-sm font-medium text-brand-strong hover:text-brand-stronger"
          onClick={() => workspacesQuery.refetch()}
        >
          Retry
        </button>
      )}
    </AuthShell>
  );
}
