import { useState } from 'react';

export function usePageTransition() {
	const [isTransitioning, setIsTransitioning] = useState(false);

	const navigateWithTransition = (url: string, target: string = '_blank') => {
		// Start transition
		setIsTransitioning(true);

		// Wait for animation, then navigate
		setTimeout(() => {
			window.open(url, target, 'noopener,noreferrer');

			// End transition after navigation
			setTimeout(() => {
				setIsTransitioning(false);
			}, 200);
		}, 600); // Wait for fade in animation
	};

	return { isTransitioning, navigateWithTransition };
}
