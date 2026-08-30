import { Link } from 'react-router-dom';
import { Button, InputGroup } from '@blueprintjs/core';
import { useTheme } from '../../theme/ThemeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <Button
        icon="menu"
        variant="minimal"
        className="icon-btn d-lg-none"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      />
      <Link to="/" className="brand text-decoration-none">
        <i className="bi bi-triangle-fill brand-mark" />
        Aegis
      </Link>
      <Button
        icon="menu"
        variant="minimal"
        className="icon-btn d-none d-lg-inline-flex"
        onClick={onToggleSidebar}
        aria-label="Collapse menu"
      />

      <div className=" d-none d-md-flex align-items-center border-0">
        <InputGroup
          leftIcon="search"
          placeholder="Search here..."
          className="w-100 border-0 from-controller"
        />
      </div>

      <div className="ms-auto d-flex align-items-center gap-1">
        <button
          className="icon-btn"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
        >
          <i className={theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars'} />
        </button>
        <button className="icon-btn" title="Notifications">
          <i className="bi bi-bell" />
          <span className="dot" />
        </button>
      </div>
    </header>
  );
}
