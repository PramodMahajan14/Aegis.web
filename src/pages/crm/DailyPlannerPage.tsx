import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/crm/EmptyState';
import { TaskRow } from '../../components/crm/items';
import { useMyTasks, useCrmActions } from '../../crm/hooks';
import { isOverdue, isToday } from '../../crm/format';
import type { Task } from '../../crm/types';
import { PageContainer } from '../../components/ui/PageContainer';

function endOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() + (7 - d.getDay()));
  d.setHours(23, 59, 59, 999);
  return d;
}

export default function DailyPlannerPage() {
  const navigate = useNavigate();
  const tasks = useMyTasks();
  const { completeTask } = useCrmActions();

  const groups = useMemo(() => {
    const open = tasks.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS');
    const eow = endOfWeek().getTime();
    const buckets: { key: string; label: string; tone: string; items: Task[] }[] = [
      { key: 'overdue', label: 'Overdue', tone: 'text-danger', items: [] },
      { key: 'today', label: 'Today', tone: 'text-warning', items: [] },
      { key: 'week', label: 'This week', tone: 'text-foreground', items: [] },
      { key: 'later', label: 'Later', tone: 'text-muted-foreground', items: [] },
    ];
    for (const t of open) {
      if (isOverdue(t.dueAt)) buckets[0].items.push(t);
      else if (isToday(t.dueAt)) buckets[1].items.push(t);
      else if (new Date(t.dueAt).getTime() <= eow) buckets[2].items.push(t);
      else buckets[3].items.push(t);
    }
    return {
      buckets: buckets.filter((b) => b.items.length > 0),
      completed: tasks.filter((t) => t.status === 'COMPLETED').slice(0, 12),
      openCount: open.length,
    };
  }, [tasks]);

  return (
    <PageContainer width="prose">
      <PageHeader
        crumbs={['Sales', 'Daily Planner']}
        description={`${groups.openCount} open task${groups.openCount === 1 ? '' : 's'} across your prospects.`}
      />

      {groups.buckets.length === 0 ? (
        <Card>
          <EmptyState
            icon="bi-emoji-sunglasses"
            title="Inbox zero"
            description="No open follow-ups. Log activity on a prospect to generate the next one."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.buckets.map((b) => (
            <Card key={b.key}>
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <h3 className={`text-[0.8125rem] font-semibold uppercase tracking-wide ${b.tone}`}>
                  {b.label}
                </h3>
                <span className="rounded-full bg-accent px-1.5 text-xs text-muted-foreground">
                  {b.items.length}
                </span>
              </div>
              <div className="divide-y divide-border px-5">
                {b.items.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    onComplete={completeTask}
                    showProspect
                    onOpenProspect={(pid) => navigate(`/prospects/${pid}`)}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {groups.completed.length > 0 && (
        <Card className="mt-4">
          <details>
            <summary className="cursor-pointer px-5 py-3 text-[0.8125rem] font-medium text-muted-foreground">
              Recently completed ({groups.completed.length})
            </summary>
            <div className="divide-y divide-border px-5 pb-2">
              {groups.completed.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onComplete={completeTask}
                  showProspect
                  onOpenProspect={(pid) => navigate(`/prospects/${pid}`)}
                />
              ))}
            </div>
          </details>
        </Card>
      )}
    </PageContainer>
  );
}
