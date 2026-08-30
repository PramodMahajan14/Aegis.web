import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useWorkspacesQuery } from '../../hooks/authApi/useAuthApi';
import { AuthStage } from '../../hooks/authApi/authTypes';
import Loader from '../../components/common/Loader';

export default function WorkspaceSelect() {
  const { selectWorkspace, stage } = useAuth();
  const navigate = useNavigate();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only fetch workspaces when the user is authenticated at the user level
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
    <div className="auth-shell">
      <div className="auth-card">
        <div className="mb-4">
          <h1>Choose a workspace</h1>
          <p className="text-muted mb-0">Select the workspace you want to access.</p>
        </div>

        {displayError && (
          <div className="alert alert-danger py-2" style={{ fontSize: 13.5 }} role="alert">
            {displayError}
          </div>
        )}

        <div className="border rounded overflow-hidden">
          {workspaces.map((ws, i) => (
            <button
              key={ws.id}
              id={`workspace-btn-${ws.id}`}
              type="button"
              onClick={() => handleSelect(ws.id)}
              disabled={selectingId !== null}
              className={`btn w-100 text-start d-flex align-items-center justify-content-between px-3 py-3 rounded-0 shadow-none${
                i !== 0 ? ' border-top' : ''
              }`}
            >
              <div>
                <div className="fw-medium" style={{ fontSize: 14 }}>
                  {ws.name}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {ws.role}
                </div>
              </div>

              {selectingId === ws.id && (
                <span
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                  aria-label="Loading"
                />
              )}
            </button>
          ))}

          {workspaces.length === 0 && !workspacesQuery.isError && (
            <div className="text-center text-muted p-4" style={{ fontSize: 13.5 }}>
              No workspaces found for your account.
            </div>
          )}
        </div>

        {workspacesQuery.isError && (
          <button
            type="button"
            className="btn btn-link p-0 mt-3 shadow-none"
            onClick={() => workspacesQuery.refetch()}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
