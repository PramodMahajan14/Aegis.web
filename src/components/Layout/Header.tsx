import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
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
        <button className="icon-btn" title="Notifications">
          <i className="bi bi-bell" />
          <span className="dot" />
        </button>
      </div>
    </header>
  );
}
