import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import type { CalendarDateTemplateEvent } from 'primereact/calendar';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';

interface CalendarEvent {
  label: string;
  color: string;
}

const events: Record<number, CalendarEvent[]> = {
  3: [{ label: 'Team standup', color: '#17c9b6' }],
  8: [{ label: 'Client demo', color: '#8e6fce' }],
  14: [{ label: 'Design review', color: '#f2a154' }],
  21: [{ label: 'Sprint planning', color: '#3bb6c9' }],
  27: [{ label: 'Release day', color: '#e15b64' }],
};

export default function CalendarPage() {
  const [value, setValue] = useState<Date | null>(new Date());
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  function dateTemplate(date: CalendarDateTemplateEvent) {
    const isToday = date.today;
    const dayEvents = date.month === today.getMonth() ? events[date.day] : undefined;
    return (
      <div
        className="w-100 h-100 rounded-3 p-2 text-start"
        style={{
          minHeight: 84,
          background: isToday ? 'rgba(23,201,182,0.12)' : 'transparent',
          border: isToday ? '1px solid var(--lucid-accent)' : '1px solid transparent',
        }}
      >
        <div className="small fw-semibold mb-1">{date.day}</div>
        {dayEvents?.map((ev) => (
          <div
            key={ev.label}
            className="small text-truncate rounded px-1 mb-1"
            style={{ background: ev.color + '22', color: ev.color, fontSize: '.7rem' }}
          >
            {ev.label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Calendar" crumbs={['App', 'Calendar']} />
      <Card title={monthName}>
        <Calendar
          value={value}
          onChange={(e) => setValue(e.value ?? null)}
          inline
          dateTemplate={dateTemplate}
          className="w-100 lucid-inline-calendar"
        />
      </Card>
    </>
  );
}
