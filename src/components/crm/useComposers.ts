import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowStore } from '../../store/useWindowStore';
import { useToast } from '../../Services/ToastServices';
import { STATUS_LABEL } from '../../crm/constants';
import type { Prospect, ProspectStatus } from '../../crm/types';
import { ProspectForm } from './forms/ProspectForm';
import {
  ChangeStatusForm,
  ContactForm,
  ConvertForm,
  DocumentUploadForm,
  LogActivityForm,
  MeetingForm,
  TaskForm,
} from './forms/quickForms';
import { RequirementForm } from './forms/RequirementForm';
import { SiteVisitForm } from './forms/SiteVisitForm';
import { createElement } from 'react';

/** Opens every Layer 1 capture form as a modal and wires success toasts +
    navigation. One hook so screens don't each re-implement the plumbing. */
export function useComposers() {
  const { openWindow, closeWindow } = useWindowStore();
  const toast = useToast();
  const navigate = useNavigate();

  return {
    newProspect: useCallback(() => {
      const id = 'cmp-prospect';
      openWindow({
        id,
        title: 'New prospect',
        icon: 'projects',
        width: 620,
        content: createElement(ProspectForm, {
          onCancel: () => closeWindow(id),
          onDone: (pid: string) => {
            closeWindow(id);
            toast.success('Prospect created');
            navigate(`/prospects/${pid}`);
          },
        }),
      });
    }, [openWindow, closeWindow, toast, navigate]),

    editProspect: useCallback(
      (prospect: Prospect) => {
        const id = 'cmp-prospect';
        openWindow({
          id,
          title: 'Edit prospect',
          icon: 'edit',
          width: 620,
          content: createElement(ProspectForm, {
            existing: prospect,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success('Prospect updated');
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    logActivity: useCallback(
      (prospectId: string) => {
        const id = 'cmp-activity';
        openWindow({
          id,
          title: 'Log activity',
          icon: 'chat',
          width: 560,
          content: createElement(LogActivityForm, {
            prospectId,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success('Activity logged');
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    addTask: useCallback(
      (prospectId: string) => {
        const id = 'cmp-task';
        openWindow({
          id,
          title: 'Add task',
          icon: 'tick',
          width: 520,
          content: createElement(TaskForm, {
            prospectId,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success('Task added');
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    addContact: useCallback(
      (prospectId: string) => {
        const id = 'cmp-contact';
        openWindow({
          id,
          title: 'Add contact',
          icon: 'new-person',
          width: 560,
          content: createElement(ContactForm, {
            prospectId,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success('Contact added');
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    scheduleMeeting: useCallback(
      (prospectId: string) => {
        const id = 'cmp-meeting';
        openWindow({
          id,
          title: 'Schedule meeting',
          icon: 'calendar',
          width: 560,
          content: createElement(MeetingForm, {
            prospectId,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success('Meeting scheduled');
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    uploadDocument: useCallback(
      (prospectId: string, previousVersionId?: string) => {
        const id = 'cmp-doc';
        openWindow({
          id,
          title: previousVersionId ? 'Upload new version' : 'Upload document',
          icon: 'document',
          width: 520,
          content: createElement(DocumentUploadForm, {
            prospectId,
            previousVersionId,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success('Document uploaded');
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    captureRequirement: useCallback(
      (prospectId: string, context?: string) => {
        const id = 'cmp-req';
        openWindow({
          id,
          title: 'Capture requirement',
          icon: 'form',
          width: 600,
          content: createElement(RequirementForm, {
            prospectId,
            context,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success('Requirement captured');
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    startSiteVisit: useCallback(
      (prospectId: string) => {
        const id = 'cmp-visit';
        const openRequirement = () => {
          const rid = 'cmp-req';
          openWindow({
            id: rid,
            title: 'Capture site survey requirement',
            icon: 'form',
            width: 600,
            content: createElement(RequirementForm, {
              prospectId,
              context: 'Site Visit',
              onCancel: () => closeWindow(rid),
              onDone: () => {
                closeWindow(rid);
                toast.success('Requirement captured');
              },
            }),
          });
        };
        openWindow({
          id,
          title: 'Site visit',
          icon: 'map-marker',
          width: 620,
          content: createElement(SiteVisitForm, {
            prospectId,
            onCancel: () => closeWindow(id),
            onDone: (opts?: { captureRequirement?: boolean }) => {
              closeWindow(id);
              toast.success('Site visit saved');
              if (opts?.captureRequirement) setTimeout(openRequirement, 150);
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    changeStatus: useCallback(
      (prospectId: string, target: ProspectStatus) => {
        const id = 'cmp-status';
        openWindow({
          id,
          title: `Move to ${STATUS_LABEL[target]}`,
          icon: 'flow-review',
          width: 480,
          content: createElement(ChangeStatusForm, {
            prospectId,
            target,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success(`Status: ${STATUS_LABEL[target]}`);
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),

    convert: useCallback(
      (prospectId: string) => {
        const id = 'cmp-convert';
        openWindow({
          id,
          title: 'Convert to Opportunity',
          icon: 'flow-end',
          width: 520,
          content: createElement(ConvertForm, {
            prospectId,
            onCancel: () => closeWindow(id),
            onDone: () => {
              closeWindow(id);
              toast.success('Converted to Opportunity');
            },
          }),
        });
      },
      [openWindow, closeWindow, toast],
    ),
  };
}
