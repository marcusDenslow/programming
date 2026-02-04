import { useEffect, useState } from 'react';
import './PageTransitionOverlay.css';

interface PageTransitionOverlayProps {
	isTransitioning: boolean;
	targetUrl?: string;
}

export default function PageTransitionOverlay({ isTransitioning, targetUrl }: PageTransitionOverlayProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [showLogs, setShowLogs] = useState(false);

	useEffect(() => {
		if (isTransitioning) {
			setIsVisible(true);
			// Show logs after brief delay
			setTimeout(() => setShowLogs(true), 100);
		} else {
			setShowLogs(false);
			// Keep visible for exit animation
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 800);
			return () => clearTimeout(timer);
		}
	}, [isTransitioning]);

	if (!isVisible) return null;

	// Extract domain from URL
	const getDomain = (url?: string) => {
		if (!url) return 'external site';
		try {
			const domain = new URL(url).hostname;
			return domain.replace('www.', '');
		} catch {
			return 'external site';
		}
	};

	return (
		<div className={`page-transition-overlay ${isTransitioning ? 'transitioning-in' : 'transitioning-out'}`}>
			<div className="transition-terminal">
				<div className="terminal-header">
					<span className="terminal-dot"></span>
					<span className="terminal-dot"></span>
					<span className="terminal-dot"></span>
				</div>
				<div className="terminal-content">
					{showLogs && (
						<>
							<div className="terminal-log fade-in-1">
								<span className="log-timestamp">[{new Date().toLocaleTimeString()}]</span>
								<span className="log-level info">INFO</span>
								<span className="log-message">Initiating request...</span>
							</div>
							<div className="terminal-log fade-in-2">
								<span className="log-timestamp">[{new Date().toLocaleTimeString()}]</span>
								<span className="log-level request">GET</span>
								<span className="log-url">{getDomain(targetUrl)}</span>
							</div>
							<div className="terminal-log fade-in-3">
								<span className="log-timestamp">[{new Date().toLocaleTimeString()}]</span>
								<span className="log-level success">200</span>
								<span className="log-message">Opening link...</span>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
