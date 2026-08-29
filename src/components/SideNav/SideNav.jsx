import React, { useEffect, useState } from 'react';

function SideNav({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={`side-nav-toggle${isOpen ? ' side-nav-toggle-open' : ''}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="side-nav-panel"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <span className="side-nav-toggle-bar" aria-hidden="true" />
        <span className="side-nav-toggle-bar" aria-hidden="true" />
        <span className="side-nav-toggle-bar" aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          className="side-nav-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        id="side-nav-panel"
        className={`side-nav${isOpen ? ' side-nav-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="side-nav-header">
          <h2>Menu</h2>
        </div>
        <div className="side-nav-content">
          {children}
        </div>
      </aside>
    </>
  );
}

export default SideNav;
