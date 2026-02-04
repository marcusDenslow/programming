import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ReportLanguagePopup.css';

interface ReportLanguagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  reportPath: string;
}

export default function ReportLanguagePopup({ isOpen, onClose, reportPath }: ReportLanguagePopupProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleLanguageSelect = (language: 'no' | 'en') => {
    const path = language === 'no'
      ? reportPath
      : reportPath.replace('.pdf', '-en.pdf');

    window.open(path, '_blank');
    handleClose();
  };

  if (!isOpen && !isAnimating) return null;

  return createPortal(
    <div
      className={`report-popup-overlay ${isAnimating && isOpen ? 'popup-fade-in' : 'popup-fade-out'}`}
      onClick={handleOverlayClick}
    >
      <div className={`report-popup ${isAnimating && isOpen ? 'popup-slide-in' : 'popup-slide-out'}`}>
        <button className="popup-close-btn" onClick={handleClose} aria-label="Close">
          ✕
        </button>

        <h2 className="popup-title">Select Report Language</h2>
        <p className="popup-subtitle">Choose your preferred version</p>

        <div className="popup-language-options">
          <button
            className="language-option"
            onClick={() => handleLanguageSelect('no')}
          >
            <div className="language-icon">🇳🇴</div>
            <div className="language-details">
              <h3>Norwegian version</h3>
              <span className="language-label">(Original)</span>
            </div>
            <svg className="language-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>

          <button
            className="language-option"
            onClick={() => handleLanguageSelect('en')}
          >
            <div className="language-icon">🇬🇧</div>
            <div className="language-details">
              <h3>English version</h3>
              <span className="language-label">(Auto-translated)</span>
            </div>
            <svg className="language-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
