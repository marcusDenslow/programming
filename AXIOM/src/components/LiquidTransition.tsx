import { useTheme } from '../contexts/ThemeContext';
import './LiquidTransition.css';

export default function LiquidTransition() {
  const { isTransitioning, theme } = useTheme();

  if (!isTransitioning) return null;

  return (
    <div className="liquid-transition">
      <div className={`liquid-overlay ${theme === 'light' ? 'to-light' : 'to-dark'}`} />
    </div>
  );
}