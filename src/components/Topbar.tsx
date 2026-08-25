import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="topbar">
      <Button
        icon="pi pi-bars"
        text
        rounded
        className="icon-btn d-lg-none"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      />
      <Link to="/" className="brand text-decoration-none">
        <i className="bi bi-triangle-fill brand-mark" />
        LUCID
      </Link>
      <Button
        icon="pi pi-bars"
        text
        rounded
        className="icon-btn d-none d-lg-inline-flex"
        onClick={onToggleSidebar}
        aria-label="Collapse menu"
      />

      <div className="search-box d-none d-md-block">
        <IconField iconPosition="left" className="w-100">
          <InputIcon className="pi pi-search" />
          <InputText placeholder="Search here..." className="w-100" />
        </IconField>
      </div>

      <div className="ms-auto d-flex align-items-center gap-1">
        <Link to="/file-manager/dashboard" className="icon-btn" title="File Manager">
          <i className="bi bi-folder2-open" />
        </Link>
        <Link to="/app/calendar" className="icon-btn" title="Calendar">
          <i className="bi bi-calendar3" />
        </Link>
        <Link to="/app/chat" className="icon-btn" title="Chat">
          <i className="bi bi-chat-dots" />
          <span className="dot" />
        </Link>
        <Link to="/app/inbox" className="icon-btn" title="Inbox">
          <i className="bi bi-envelope" />
          <span className="dot" />
        </Link>
        <button className="icon-btn" title="Notifications">
          <i className="bi bi-bell" />
          <span className="dot" />
        </button>
        <Link to="/pages/login" className="icon-btn" title="Logout">
          <i className="bi bi-box-arrow-right" />
        </Link>
      </div>
    </header>
  );
}
