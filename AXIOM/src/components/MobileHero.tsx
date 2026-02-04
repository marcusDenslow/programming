import { useState, useEffect } from 'react';
import { usePageTransition } from '../contexts/PageTransitionContext';
import './MobileHero.css';

export default function MobileHero() {
	const [isVisible, setIsVisible] = useState(true);
	const [scrollProgress, setScrollProgress] = useState(0);
	const [showGithubHint, setShowGithubHint] = useState(false);
	const [isAnimatingScroll, setIsAnimatingScroll] = useState(false);
	const { navigateWithTransition } = usePageTransition();

	useEffect(() => {
		const handleScroll = () => {
			// Skip updates during animated scroll to prevent choppiness
			if (isAnimatingScroll) return;

			const scrollY = window.scrollY;
			const heroHeight = window.innerHeight;

			// Calculate scroll progress (0 to 1)
			const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
			setScrollProgress(progress);

			// Hide hero when scrolled past 50% of viewport height
			setIsVisible(progress < 0.8);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isAnimatingScroll]);

	// Autonomous GitHub link animation
	useEffect(() => {
		const triggerAnimation = () => {
			setShowGithubHint(true);
			setTimeout(() => {
				setShowGithubHint(false);
			}, 1600); // Hold hovered state for 1 second (600ms anim in + 1000ms hold)
		};

		// Initial delay before first animation
		const initialDelay = setTimeout(() => {
			triggerAnimation();

			// Set up interval for repeated animations
			const interval = setInterval(() => {
				triggerAnimation();
			}, 7000); // Every 7 seconds (1.6s active + 5.4s rest)

			return () => clearInterval(interval);
		}, 3000); // Wait 3 seconds before first animation

		return () => clearTimeout(initialDelay);
	}, []);

	const openGitHub = () => {
		navigateWithTransition('https://github.com/marcusDenslow', '_blank');
	};

	const handleScrollDown = () => {
		// Scroll so the projects title appears at the top
		const targetScroll = window.innerHeight * 0.85;
		const startScroll = window.scrollY;
		const distance = targetScroll - startScroll;
		const duration = 1200; // 1.2 seconds
		let startTime: number | null = null;

		setIsAnimatingScroll(true);

		// Easing function: ease-in-out cubic
		const easeInOutCubic = (t: number): number => {
			return t < 0.5
				? 4 * t * t * t
				: 1 - Math.pow(-2 * t + 2, 3) / 2;
		};

		const animateScroll = (currentTime: number) => {
			if (startTime === null) startTime = currentTime;
			const timeElapsed = currentTime - startTime;
			const progress = Math.min(timeElapsed / duration, 1);
			const easedProgress = easeInOutCubic(progress);

			window.scrollTo(0, startScroll + distance * easedProgress);

			if (progress < 1) {
				requestAnimationFrame(animateScroll);
			} else {
				setIsAnimatingScroll(false);
			}
		};

		requestAnimationFrame(animateScroll);
	};

	return (
		<div
			className={`mobile-hero ${isVisible ? 'mobile-hero-visible' : 'mobile-hero-hidden'}`}
			style={{
				opacity: 1 - scrollProgress * 1.2,
				transform: `translateY(${-scrollProgress * 50}px) scale(${1 - scrollProgress * 0.1})`
			}}
		>
			<div className="mobile-hero-content">
				{/* Name Section */}
				<div className="mobile-hero-section">
					<h1 className="mobile-hero-name mobile-hero-animate-left">Marcus</h1>
					<h2 className="mobile-hero-title mobile-hero-animate-right">Systems Developer</h2>
					<h2 className="mobile-hero-location mobile-hero-animate-left">Norway * 19</h2>
				</div>

				{/* GitHub Link */}
				<div className="mobile-hero-section mobile-hero-github-section">
					<button
						className={`mobile-hero-github mobile-hero-animate-bottom ${showGithubHint ? 'hint-active' : ''}`}
						onClick={openGitHub}
					>
						<div className="mobile-github-link">
							<svg
								className="mobile-github-icon"
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

				{/* Scroll indicator */}
				<div className="mobile-hero-scroll mobile-hero-animate-bottom" onClick={handleScrollDown}>
					<span className="scroll-text">Scroll to explore</span>
					<span className="scroll-arrow">↓</span>
				</div>
			</div>
		</div>
	);
}
