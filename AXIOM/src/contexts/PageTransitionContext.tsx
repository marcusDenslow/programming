import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import PageTransitionOverlay from '../components/PageTransitionOverlay';

interface PageTransitionContextType {
	navigateWithTransition: (url: string, target?: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [targetUrl, setTargetUrl] = useState<string>('');

	const navigateWithTransition = (url: string, target: string = '_blank') => {
		// Detect if mobile/tablet
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		setTargetUrl(url);
		setIsTransitioning(true);

		if (isMobile) {
			// On mobile: navigate in same window after animation delay
			// location.assign works with setTimeout without popup blockers
			setTimeout(() => {
				window.location.assign(url);
			}, 1200);
		} else {
			// On desktop: open in new tab after animation delay
			setTimeout(() => {
				window.open(url, target, 'noopener,noreferrer');
			}, 1200);

			// Close transition overlay
			setTimeout(() => {
				setIsTransitioning(false);
			}, 1600);
		}
	};

	// Intercept all external link clicks
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const link = target.closest('a');

			if (link && link.href && (link.target === '_blank' || link.href.startsWith('http'))) {
				// Don't intercept if it's a report popup or PDF
				if (link.href.endsWith('.pdf') && !link.target) return;

				e.preventDefault();
				navigateWithTransition(link.href, link.target || '_blank');
			}
		};

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, []);

	return (
		<PageTransitionContext.Provider value={{ navigateWithTransition }}>
			<PageTransitionOverlay isTransitioning={isTransitioning} targetUrl={targetUrl} />
			{children}
		</PageTransitionContext.Provider>
	);
}

export function usePageTransition() {
	const context = useContext(PageTransitionContext);
	if (!context) {
		throw new Error('usePageTransition must be used within PageTransitionProvider');
	}
	return context;
}
