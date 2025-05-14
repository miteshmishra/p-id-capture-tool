import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.css';

const Header = ({ onSave, onExport, onNew }) => {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        P&ID Capture Tool
      </div>
      
      <nav className={styles.mainNav}>
        <div className={styles.menuItem}>
          <button 
            className={styles.menuButton} 
            onClick={() => toggleDropdown('file')}
          >
            File
          </button>
          {activeDropdown === 'file' && (
            <div className={styles.dropdown}>
              <button onClick={() => { onNew(); closeDropdowns(); }}>New</button>
              <button onClick={() => { onSave(); closeDropdowns(); }}>Save</button>
              <button onClick={() => { onExport(); closeDropdowns(); }}>Export as PNG</button>
              <button onClick={() => { onExport('pdf'); closeDropdowns(); }}>Export as PDF</button>
              <button onClick={() => { onExport('svg'); closeDropdowns(); }}>Export as SVG</button>
            </div>
          )}
        </div>
        
        <div className={styles.menuItem}>
          <button 
            className={styles.menuButton} 
            onClick={() => toggleDropdown('edit')}
          >
            Edit
          </button>
          {activeDropdown === 'edit' && (
            <div className={styles.dropdown}>
              <button>Undo</button>
              <button>Redo</button>
              <button>Cut</button>
              <button>Copy</button>
              <button>Paste</button>
              <button>Delete</button>
              <button>Select All</button>
            </div>
          )}
        </div>
        
        <div className={styles.menuItem}>
          <button 
            className={styles.menuButton} 
            onClick={() => toggleDropdown('view')}
          >
            View
          </button>
          {activeDropdown === 'view' && (
            <div className={styles.dropdown}>
              <button>Zoom In</button>
              <button>Zoom Out</button>
              <button>Fit to Screen</button>
              <button>Grid</button>
              <button>Snap to Grid</button>
            </div>
          )}
        </div>
        
        <div className={styles.menuItem}>
          <button 
            className={styles.menuButton} 
            onClick={() => toggleDropdown('help')}
          >
            Help
          </button>
          {activeDropdown === 'help' && (
            <div className={styles.dropdown}>
              <button>Documentation</button>
              <button>Keyboard Shortcuts</button>
              <button>About</button>
            </div>
          )}
        </div>
      </nav>
      
      <div className={styles.userControls}>
        <div className={styles.themeToggleWrapper}>
          <ThemeToggle />
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;