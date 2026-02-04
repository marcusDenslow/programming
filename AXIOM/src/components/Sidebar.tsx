import { useState } from 'react';
import { usePageTransition } from '../contexts/PageTransitionContext';
import './Sidebar.css';

interface SidebarProps {
	onSectionClick: (section: string) => void;
	activeSection: string;
}

export default function Sidebar({ onSectionClick, activeSection }: SidebarProps) {
	const [hintHoverCount, setHintHoverCount] = useState(0);
	const { navigateWithTransition } = usePageTransition();

	const handleSectionClick = (sectionId: string) => {
		onSectionClick(sectionId);
	};

	const openGitHub = () => {
		navigateWithTransition('https://github.com/marcusDenslow', '_blank');
	};

	const handleHintHover = () => {
		setHintHoverCount(prev => prev + 1);
	};

	const getHintTitle = () => {
		if (hintHoverCount >= 3) {
			return "↑ ↑ ↓ ↓ ← → ← → B A";
		}
		return "the konami code";
	};

	return (
		<div className="sidebar">
			<div className="sidebar-content">
				{/* Secret hint */}
				<span
					className="secret-hint"
					title={getHintTitle()}
					onMouseEnter={handleHintHover}
				>
					?
				</span>

				{/* Name and Info Section */}
				<div className="sidebar-section sidebar-name">
					<h1 className="sidebar-title sidebar-animate-left">Marcus</h1>
					<h2 className="sidebar-subtitle sidebar-animate-right">Systems Developer</h2>
					<h2 className="sidebar-subtitle secondary sidebar-animate-left">Norway * 19</h2>
				</div>

				{/* Navigation Section */}
				<div className="sidebar-section sidebar-navigation">
					<button
						className={`nav-link sidebar-animate-bottom ${activeSection === 'projects' ? 'active' : ''}`}
						onClick={() => handleSectionClick('projects')}
					>
						* Projects
					</button>
					<button
						className={`nav-link sidebar-animate-bottom ${activeSection === 'experiences' ? 'active' : ''}`}
						onClick={() => handleSectionClick('experiences')}
					>
						* Experiences
					</button>
					<button
						className={`nav-link sidebar-animate-bottom ${activeSection === 'contact' ? 'active' : ''}`}
						onClick={() => handleSectionClick('contact')}
					>
						* Contact
					</button>
				</div>

				{/* External Links Section */}
				<div className="sidebar-section sidebar-external">
					<button
						className="external-link sidebar-animate-top"
						onClick={openGitHub}
					>
						<div className="github-link">
							<svg
								className="github-icon"
								viewBox="0 0 24 24"
								fill="currentColor"
								width="24"
								height="24"
							>
								<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
							</svg>
							<span>marcusDenslow</span>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
