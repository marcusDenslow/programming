import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const checkMenuOpen = () => {
      const menuOverlay = document.querySelector('.mobile-menu-overlay');
      setIsMenuOpen(!!menuOverlay);
    };

    checkMenuOpen();
    const interval = setInterval(checkMenuOpen, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    // Only apply hover effect on non-touch devices (desktop)
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;

    const firstItem = document.querySelector('.menu-item') as HTMLElement;
    if (firstItem && isMenuOpen) {
      firstItem.classList.add('hovered');
      firstItem.dataset.hoverLocked = 'true';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Only apply hover effect on non-touch devices (desktop)
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;

    const firstItem = document.querySelector('.menu-item') as HTMLElement;
    if (firstItem && isMenuOpen) {
      // Only unlock if not moving to the first menu item
      const rect = firstItem.getBoundingClientRect();
      const { clientX, clientY } = e;
      const isOverFirstItem =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!isOverFirstItem) {
        firstItem.dataset.hoverLocked = 'false';
      }
    }
  };

  return (
    <button
      className={`theme-toggle ${isMenuOpen ? 'menu-open' : ''}`}
      id="theme-toggle"
      title="Toggles light & dark"
      aria-label={theme}
      aria-live="polite"
      onClick={toggleTheme}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
        <mask className="moon" id="moon-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle className="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
        <g className="sun-beams" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
         </g>
      </svg>
    </button>
  );
}