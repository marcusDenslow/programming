import { useState, useEffect, useCallback, useRef } from 'react';

interface TerminalLockProps {
	onUnlock: () => void;
}

export default function TerminalLock({ onUnlock }: TerminalLockProps) {
	const [input, setInput] = useState('');
	// @ts-expect-error - Used in JSX below
	const [isLoading, setIsLoading] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [isFlipping, setIsFlipping] = useState(false);
	// @ts-expect-error - Used in JSX below
	const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
	const [typingError, setTypingError] = useState('');
	const [isTypingError, setIsTypingError] = useState(false);
	const [consumedChars, setConsumedChars] = useState(0);
	const typeIntervalRef = useRef<number | null>(null);
	const deleteTimeoutRef = useRef<number | null>(null);
	const deleteIntervalRef = useRef<number | null>(null);

	const targetCommand = 'start';
	const isInputMatchingTarget = targetCommand.startsWith(input);
	const ghostText = isInputMatchingTarget ? targetCommand.slice(input.length) : '';


	const typeOutError = useCallback((message: string) => {
		// Clear any existing animations completely (using refs for immediate cleanup)
		if (typeIntervalRef.current) {
			clearInterval(typeIntervalRef.current);
			typeIntervalRef.current = null;
		}
		if (deleteTimeoutRef.current) {
			clearTimeout(deleteTimeoutRef.current);
			deleteTimeoutRef.current = null;
		}
		if (deleteIntervalRef.current) {
			clearInterval(deleteIntervalRef.current);
			deleteIntervalRef.current = null;
		}

		// Reset state
		setIsTypingError(false);
		setTypingError('');
		setInput('');

		// Start fresh animation
		setIsTypingError(true);

		let currentIndex = 0;
		typeIntervalRef.current = setInterval(() => {
			setTypingError(message.slice(0, currentIndex + 1));
			currentIndex++;

			if (currentIndex >= message.length) {
				if (typeIntervalRef.current) {
					clearInterval(typeIntervalRef.current);
					typeIntervalRef.current = null;
				}

				// After 3 seconds, start deleting
				deleteTimeoutRef.current = setTimeout(() => {
					let deleteIndex = message.length;
					deleteIntervalRef.current = setInterval(() => {
						deleteIndex--;
						setTypingError(message.slice(0, deleteIndex));

						if (deleteIndex <= 0) {
							if (deleteIntervalRef.current) {
								clearInterval(deleteIntervalRef.current);
								deleteIntervalRef.current = null;
							}
							setIsTypingError(false);
							setTypingError('');
						}
					}, 30); // Faster deletion
				}, 3000);
			}
		}, 35); // Faster typing speed (twice as fast)
	}, []);

	const handleCommand = useCallback((command: string) => {
		if (command === targetCommand) {
			// Stage 1: Start transition with character consumption
			setIsTransitioning(true);
			setConsumedChars(0);

			// Stage 2: Consume characters with realistic velocity curve
			// Slow start, fast middle, slow end - matching the cubic-bezier animation
			const intervals = [80, 80, 60, 80, 130]; // Start fading much earlier
			let cumulativeDelay = 0;
			for (let i = 0; i < targetCommand.length; i++) {
				cumulativeDelay += intervals[i];
				setTimeout(() => {
					setConsumedChars(i + 1);
				}, cumulativeDelay);
			}

			// Stage 3: Start flip after all characters consumed
			setTimeout(() => {
				setIsFlipping(true);
			}, 1000 + 100); // Wait for animation to complete + small pause

			// Stage 4: Complete and unlock immediately after flip
			setTimeout(() => {
				onUnlock();
			}, 1000 + 100 + 300); // Shorter timing, go straight to main page
		} else if (command === 'help') {
			typeOutError('Available commands: start');
		} else if (command === 'clear') {
			// Easter egg - do nothing, just accept it
			setInput('');
			return;
		} else if (command === 'whoami') {
			typeOutError("who am i?... i find myself asking that all the time — not just as a command, but as a quiet panic that slips in when the noise fades — am i just a brief flicker of thought in a vast, unfeeling universe that will forget me the moment i’m gone? does anything i build truly matter, or is it all just dust rearranging itself before the next collapse? maybe we invent purpose because we can't bear the weight of insignificance, maybe the stories we tell about meaning are just beautifully crafted lies to survive the silence — and yet, despite knowing all this, i still create, i still reach, i still hope — because maybe the act of searching is its own kind of answer.");
		} else if (command === 'ls') {
			typeOutError('portfolio.exe  README.md  skills/');
		} else if (command === 'passwd') {
			typeOutError('nice try');
		} else if (command === 'rmdir') {
			typeOutError('did you really think that was going to work?');
		} else if (command === 'hello') {
			typeOutError('Hello, stranger ;)');
		} else if (command === 'sudo') {
			typeOutError('User is not in the sudoers file. This incident will be reported');
		} else if (command === 'exit') {
			typeOutError('You can try to exit, but you can never leave.');
		} else if (command === 'logout') {
			typeOutError('And leave me all alone? No way.');
		} else if (command === 'matrix') {
			typeOutError('Follow the white rabbit, Neo.');
		}
		else {
			typeOutError('command not found');
		}
	}, [targetCommand, onUnlock]);

	const handleKeyPress = useCallback((event: KeyboardEvent) => {
		console.log('Key pressed:', event.key, 'isLoading:', isLoading, 'isTransitioning:', isTransitioning, 'isFlipping:', isFlipping);
		if (isLoading || isTransitioning || isFlipping) return;

		const { key } = event;

		// Only allow alphabetic characters and specific control keys
		if (key === 'Enter') {
			event.preventDefault();
			setInput(currentInput => {
				if (currentInput.trim()) {
					handleCommand(currentInput.toLowerCase());
				}
				return currentInput;
			});
		} else if (key === 'Backspace') {
			event.preventDefault();
			setInput(prev => prev.slice(0, -1));
		} else if (/^[a-zA-Z]$/.test(key)) {
			event.preventDefault();
			setInput(prev => {
				if (prev.length < 6) {
					return prev + key.toLowerCase();
				}
				return prev;
			});
		}
		// Ignore all other keys
	}, [handleCommand, isLoading, isTransitioning, isFlipping]);

	useEffect(() => {
		console.log('TerminalLock: Attaching keydown listener');
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			console.log('TerminalLock: Removing keydown listener');
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

	if (isTransitioning || isFlipping || isLoading) {
		return (
			<div className="terminal-lock">
				<div className="terminal-content loading">
					{/* Command animation phases */}
					{(isTransitioning || isFlipping) && !isLoading && (
						<div className={`command-transition ${isTransitioning ? 'consuming' : ''} ${isFlipping ? 'flip-down' : ''}`}>
							<div className="prompt-line">
								<span className={`prompt moving-prompt ${isFlipping ? 'final-position' : ''}`}>&gt;</span>
								<span className="command-chars">
									{targetCommand.split('').map((char, index) => (
										<span
											key={index}
											className={`char ${index < consumedChars ? 'consumed' : ''}`}
											style={{ animationDelay: `${200 + (index * 150)}ms` }}
										>
											{char}
										</span>
									))}
								</span>
							</div>
						</div>
					)}

				</div>
			</div>
		);
	}

	// Add mobile bypass - tap anywhere to unlock
	const handleMobileBypass = () => {
		// Check if on mobile/touch device
		if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
			handleCommand('start');
		}
	};

	return (
		<div className="terminal-lock" onClick={handleMobileBypass}>
			<div className="terminal-content">
				<div className="terminal-lines">
					<div className="prompt-line">
						<span className="prompt">&gt;</span>
						<span className="input">{input}</span>
						<span className="cursor-ghost-container">
							<span className="ghost-text">{ghostText}</span>
							{input.length < 6 && <span className="cursor"></span>}
						</span>
					</div>

					{!isTypingError && (
						<div className="help-text">
							type "start" to begin
							<br />
							<span className="mobile-hint">or tap anywhere on mobile</span>
						</div>
					)}

					{isTypingError && (
						<div className="error-line typing">
							{typingError}<span className="error-cursor">_</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
