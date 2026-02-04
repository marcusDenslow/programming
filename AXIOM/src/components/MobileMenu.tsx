import { useState, useRef, useEffect } from 'react';
import './MobileMenu.css';

interface MobileMenuProps {
	onSectionClick: (section: string) => void;
	activeSection: string;
}

export default function MobileMenu({ onSectionClick }: MobileMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [clickedIndex, setClickedIndex] = useState<number | null>(null);
	const [touchActiveIndex, setTouchActiveIndex] = useState<number | null>(null);
	const [isEntering, setIsEntering] = useState(false);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
	const clickPositionsRef = useRef<{numberRect?: DOMRect, labelRect?: DOMRect, arrowRect?: DOMRect} | null>(null);

	const toggleMenu = () => {
		if (isClosing) return;

		if (isOpen) {
			// Re-enable body scroll
			document.body.style.overflow = '';
			document.body.style.position = '';
			document.body.style.width = '';
			setIsClosing(true);
			setTimeout(() => {
				setIsOpen(false);
				setIsClosing(false);
			}, 300);
		} else {
			// Clear all hover/touch states when opening menu
			setHoveredIndex(null);
			setTouchActiveIndex(null);
			setClickedIndex(null);

			// LOCK body scroll completely
			document.body.style.overflow = 'hidden';
			document.body.style.position = 'fixed';
			document.body.style.width = '100%';
			setIsOpen(true);
		}
	};

	const handleSectionClick = (section: string, index: number) => {
		if (isClosing) return;

		// Wait for expansion animation to complete, then trigger page transition
		setTimeout(() => {
			// Trigger page transition
			onSectionClick(section);

			// Close menu immediately without animation (expansion overlay covers it)
			setTimeout(() => {
				// Re-enable body scroll
				document.body.style.overflow = '';
				document.body.style.position = '';
				document.body.style.width = '';

				// Close menu instantly - no closing animation
				setIsOpen(false);
				setIsClosing(false);
				setClickedIndex(null);
			}, 100); // Close menu quickly while overlay is still covering
		}, 1300);
	};

	const menuItems = [
		{
			id: 1,
			label: 'Projects',
			section: 'projects',
			type: 'nav',
			description: 'Explore my portfolio of creative projects, from web applications to experimental code.'
		},
		{
			id: 2,
			label: 'Experiences',
			section: 'experiences',
			type: 'nav',
			description: 'My professional journey, work experience, and technical skills.'
		},
		{
			id: 3,
			label: 'Contact',
			section: 'contact',
			type: 'nav',
			description: 'Get in touch with me for collaborations, opportunities, or just to say hello.'
		}
	];

	// Touch handlers for mobile preview
	const handleTouchStart = (index: number) => {
		setTouchActiveIndex(index);
	};

	const handleTouchEnd = (item: {section: string, label: string}, index: number, e: React.TouchEvent) => {
		// On touch devices, handle the click here since onClick might not fire properly
		if (touchActiveIndex === index) {
			e.preventDefault(); // Prevent the synthetic click event
			// DON'T clear touchActiveIndex yet - keep it for the hovered state during animation
			handleItemClick(item, index);
		}
	};

	const handleTouchCancel = () => {
		setTouchActiveIndex(null);
	};

	const handleItemClick = (item: {section: string, label: string}, index: number) => {
		// Don't clear touch active state - we need it for the hovered class during animation

		const itemEl = itemRefs.current[index];
		if (!itemEl) return;

		const rect = itemEl.getBoundingClientRect();
		const numberEl = itemEl.querySelector('.item-number') as HTMLElement;
		const labelEl = itemEl.querySelector('.item-label') as HTMLElement;
		const arrowEl = itemEl.querySelector('.item-arrow') as HTMLElement;

		if (!numberEl || !labelEl || !arrowEl) return;

		// Capture positions and styles BEFORE any state changes
		const numberRect = numberEl.getBoundingClientRect();
		const labelRect = labelEl.getBoundingClientRect();

		const centerY = window.innerHeight / 2;
		const centerX = window.innerWidth / 2;

		// Clone the elements to animate independently
		const numberClone = numberEl.cloneNode(true) as HTMLElement;
		const labelClone = labelEl.cloneNode(true) as HTMLElement;

		// Get computed color from original elements
		const numberColor = window.getComputedStyle(numberEl).color;
		const labelColor = window.getComputedStyle(labelEl).color;

		// Style clones
		numberClone.style.position = 'fixed';
		numberClone.style.top = `${numberRect.top}px`;
		numberClone.style.left = `${numberRect.left}px`;
		numberClone.style.zIndex = '10005';
		numberClone.style.margin = '0';
		numberClone.style.pointerEvents = 'none';
		numberClone.style.color = numberColor;

		labelClone.style.position = 'fixed';
		labelClone.style.top = `${labelRect.top}px`;
		labelClone.style.left = `${labelRect.left}px`;
		labelClone.style.zIndex = '10005';
		labelClone.style.margin = '0';
		labelClone.style.pointerEvents = 'none';
		labelClone.style.color = labelColor;

		// Add clones to body
		document.body.appendChild(numberClone);
		document.body.appendChild(labelClone);

		// Hide originals
		numberEl.style.opacity = '0';
		labelEl.style.opacity = '0';
		arrowEl.style.opacity = '0';

		// Animate clones
		const lingerStart = 1300;
		const fadeOutDuration = 400;
		const labelDuration = 900;
		const numberDuration = 250;
		const labelEasing = 'cubic-bezier(0.65, 0, 0.35, 1)';
		const numberEasing = 'ease-out';

		// Responsive positioning based on screen width
		const isMobile = window.innerWidth <= 480;
		const scale = isMobile ? 1.2 : 1.5;

		// Calculate label center position
		const labelWidth = labelEl.offsetWidth;
		const labelCenterX = centerX - (labelWidth * scale / 2);
		const labelCenterY = centerY - (labelEl.offsetHeight * scale / 2);

		// Animate number - just fade out elegantly, no movement
		numberClone.animate([
			{ opacity: '1' },
			{ opacity: '0' }
		], { duration: numberDuration, easing: numberEasing, fill: 'forwards' });

		// Animate label - move to center and stay visible
		labelClone.animate([
			{ top: `${labelRect.top}px`, left: `${labelRect.left}px`, transform: 'scale(1)', opacity: '1' },
			{ top: `${labelCenterY}px`, left: `${labelCenterX}px`, transform: `scale(${scale})`, opacity: '1' }
		], { duration: labelDuration, easing: labelEasing, fill: 'forwards' });

		// Slide out and fade label after linger period
		setTimeout(() => {
			labelClone.animate([
				{ left: `${labelCenterX}px`, opacity: '1' },
				{ left: `${centerX + (isMobile ? 150 : 200)}px`, opacity: '0' }
			], { duration: fadeOutDuration, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' });
		}, lingerStart);

		// Clean up clones after everything
		setTimeout(() => {
			numberClone.remove();
			labelClone.remove();
		}, lingerStart + fadeOutDuration + 100);

		// Check if item is already in hovered state (desktop mouse hover before click)
		// Note: On touch devices, we ALWAYS wait even if touchActiveIndex is set,
		// because the CSS animation needs time to complete
		const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
		const isAlreadyHovered = hoveredIndex === index && !isTouchDevice;

		// Wait for hover fill animation to complete (200ms on touch devices, 300ms on desktop)
		// But skip wait if already hovered (desktop hover before click case only)
		const hoverDuration = isAlreadyHovered ? 0 : (isTouchDevice ? 200 : 300);

		console.log('Item clicked:', {
			index,
			item: item.label,
			waitingMs: hoverDuration,
			isAlreadyHovered,
			hoveredIndex,
			touchActiveIndex
		});

		setTimeout(() => {
			console.log('Starting expansion for:', item.label);

			// Update React state to add 'clicked' class (triggers CSS animation for top/bottom items)
			setClickedIndex(index);

			const viewportHeight = window.innerHeight;

			// For middle item - simplest possible: animate actual height property
			if (index === 1) {
				const duration = 1200;
				const easing = 'cubic-bezier(0.25, 0.8, 0.25, 1)';

				const targetTopHeight = rect.top;
				const targetBottomHeight = viewportHeight - rect.top - rect.height;

				// TOP BLOCK: Grows upward from button top to top edge
				const topBlock = document.createElement('div');
				topBlock.style.position = 'fixed';
				topBlock.style.left = '0';
				topBlock.style.top = `${rect.top}px`;
				topBlock.style.width = '100vw';
				topBlock.style.height = '0px';
				topBlock.style.background = 'var(--bg-color)';
				topBlock.style.zIndex = '10004';
				topBlock.style.overflow = 'hidden';
				document.body.appendChild(topBlock);

				// MIDDLE BLOCK: The button area - always visible
				const middleBlock = document.createElement('div');
				middleBlock.style.position = 'fixed';
				middleBlock.style.left = '0';
				middleBlock.style.top = `${rect.top}px`;
				middleBlock.style.width = '100vw';
				middleBlock.style.height = `${rect.height}px`;
				middleBlock.style.background = 'var(--bg-color)';
				middleBlock.style.zIndex = '10004';
				document.body.appendChild(middleBlock);

				// BOTTOM BLOCK: Grows downward from button bottom to viewport bottom
				const bottomBlock = document.createElement('div');
				bottomBlock.style.position = 'fixed';
				bottomBlock.style.left = '0';
				bottomBlock.style.top = `${rect.top + rect.height}px`;
				bottomBlock.style.width = '100vw';
				bottomBlock.style.height = '0px';
				bottomBlock.style.background = 'var(--bg-color)';
				bottomBlock.style.zIndex = '10004';
				bottomBlock.style.overflow = 'hidden';
				document.body.appendChild(bottomBlock);

				console.log('Middle item expansion with height animation:', {
					topTargetHeight: targetTopHeight,
					middleHeight: rect.height,
					bottomTargetHeight: targetBottomHeight,
					bottomStartTop: rect.top + rect.height
				});

				// Animate top block growing upward (height increases, top decreases)
				topBlock.animate([
					{ height: '0px', top: `${rect.top}px` },
					{ height: `${targetTopHeight}px`, top: '0px' }
				], { duration, easing, fill: 'forwards' });

				const bottomAnim = bottomBlock.animate([
					{ height: '0px' },
					{ height: `${targetBottomHeight}px` }
				], { duration, easing, fill: 'forwards' });

				// Wait for animations, then fade all three blocks
				bottomAnim.finished.then(() => {
					setTimeout(() => {
						const fadePromises = [topBlock, middleBlock, bottomBlock].map(block =>
							block.animate([
								{ opacity: '1', filter: 'blur(0px)' },
								{ opacity: '0', filter: 'blur(8px)' }
							], {
								duration: 500,
								easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
								fill: 'forwards'
							}).finished
						);

						Promise.all(fadePromises).then(() => {
							topBlock.remove();
							middleBlock.remove();
							bottomBlock.remove();
						});
					}, 600);
				});
			} else {
				// Single element for top/bottom items
				const expansionEl = document.createElement('div');
				expansionEl.style.position = 'fixed';
				expansionEl.style.left = '0';
				expansionEl.style.top = '0';
				expansionEl.style.width = '100vw';
				expansionEl.style.height = '100vh';
				expansionEl.style.background = 'var(--bg-color)';
				expansionEl.style.zIndex = '10004';
				document.body.appendChild(expansionEl);

				const bottomInset = viewportHeight - rect.top - rect.height;

				let clipPathStart = '';
				if (index === 0) {
					// Top item - expand down
					clipPathStart = `inset(0px 0px ${bottomInset}px 0px)`;
				} else {
					// Bottom item - expand up
					clipPathStart = `inset(${rect.top}px 0px 0px 0px)`;
				}

				// Phase 1: Expansion animation (0-1200ms)
				const expansion = expansionEl.animate([
					{ clipPath: clipPathStart },
					{ clipPath: 'inset(0px 0px 0px 0px)' }
				], {
					duration: 1200,
					easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
					fill: 'forwards'
				});

				// Phase 2: Hold full screen (1200-1800ms) - let the page transition start behind it
				expansion.finished.then(() => {
					setTimeout(() => {
						// Phase 3: Elegant fade out with subtle scale (1800-2300ms)
						expansionEl.animate([
							{ opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' },
							{ opacity: '0', transform: 'scale(1.02)', filter: 'blur(8px)' }
						], {
							duration: 500,
							easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
							fill: 'forwards'
						}).finished.then(() => {
							expansionEl.remove();
						});
					}, 600);
				});
			}
		}, hoverDuration); // Wait for hover animation to complete

		// Call the navigation handler
		handleSectionClick(item.section, index);
	};

	// Listen for viewport changes and trigger entrance animation when switching to mobile
	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)');
		let isInitialLoad = true;

		const handleViewportChange = (e: MediaQueryListEvent | MediaQueryList) => {
			// Skip animation on initial load
			if (isInitialLoad) {
				isInitialLoad = false;
				return;
			}

			if (e.matches) {
				// Switching to mobile - trigger entrance animation
				setIsEntering(true);
			} else {
				// Switching to desktop - reset entrance state
				setIsEntering(false);
			}
		};

		// Listen for changes only (not initial state)
		mediaQuery.addEventListener('change', handleViewportChange);

		return () => mediaQuery.removeEventListener('change', handleViewportChange);
	}, []);

	return (
		<>
			{/* Hamburger Button */}
			<button
				className={`mobile-menu-button ${isOpen ? 'open menu-open' : ''} ${isEntering ? 'mobile-menu-entering' : ''}`}
				onClick={toggleMenu}
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
			>
				<span className="hamburger-line hamburger-line-1"></span>
				<span className="hamburger-line hamburger-line-2"></span>
				<span className="hamburger-line hamburger-line-3"></span>
			</button>

			{/* Brutalist Full-Screen Menu */}
			{isOpen && (
				<div className={`mobile-menu-overlay ${isClosing ? 'closing' : ''}`}>
					<div className="menu-grid">
						{menuItems.map((item, index) => (
							<div
								key={item.id}
								ref={(el) => (itemRefs.current[index] = el)}
								className={`menu-item ${hoveredIndex === index || touchActiveIndex === index || clickedIndex === index ? 'hovered' : ''} ${clickedIndex === index ? 'clicked' : ''}`}
								onTouchStart={() => handleTouchStart(index)}
								onTouchEnd={(e) => handleTouchEnd(item, index, e)}
								onTouchCancel={handleTouchCancel}
								onClick={() => handleItemClick(item, index)}
								onMouseEnter={() => {
									setHoveredIndex(index);
								}}
								onMouseLeave={() => {
									setHoveredIndex(null);
								}}
							>
								<div className="item-number">0{index + 1}</div>
								<div className="item-label">{item.label}</div>
								<div className="item-arrow">→</div>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
}
