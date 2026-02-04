import { useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import './GitEmailSection.css';

type GitStep = 'write' | 'add' | 'commit' | 'push' | 'complete';

export default function GitEmailSection() {
	const [emailBody, setEmailBody] = useState('');
	const [currentStep, setCurrentStep] = useState<GitStep>('write');
	const [terminalInput, setTerminalInput] = useState('');
	const [cursorPosition, setCursorPosition] = useState(0);
	const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isAdded, setIsAdded] = useState(false);
	const [commitMessage, setCommitMessage] = useState('');
	const [isCommitted, setIsCommitted] = useState(false);
	const [isPushed, setIsPushed] = useState(false);
	const [isTypingError, setIsTypingError] = useState(false);
	const [typingError, setTypingError] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [, setEmailSent] = useState(false);
	const [, setHelpText] = useState('');
	const [typingHelpText, setTypingHelpText] = useState('');
	const [isTypingHelp, setIsTypingHelp] = useState(false);
	const [isTerminalFocused, setIsTerminalFocused] = useState(false);
	const [errorMessageHeight, setErrorMessageHeight] = useState(0);
	const [showArrowHint, setShowArrowHint] = useState(false);
	const [typingArrowHint, setTypingArrowHint] = useState('');
	const errorMessageRef = useRef<HTMLDivElement>(null);
	const arrowHintIntervalRef = useRef<number | null>(null);

	const typeIntervalRef = useRef<number | null>(null);
	const deleteTimeoutRef = useRef<number | null>(null);
	const deleteIntervalRef = useRef<number | null>(null);
	const helpTypeIntervalRef = useRef<number | null>(null);
	const helpDeleteTimeoutRef = useRef<number | null>(null);
	const helpDeleteIntervalRef = useRef<number | null>(null);
	const editorContainerRef = useRef<HTMLDivElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);

	// Measure error message height after each update
	useEffect(() => {
		if (errorMessageRef.current && isTypingError) {
			const height = errorMessageRef.current.scrollHeight;
			setErrorMessageHeight(height);
		} else {
			setErrorMessageHeight(0);
		}
	}, [typingError, isTypingError]);

	const typeOutArrowHint = useCallback(() => {
		const hintMessage = 'use ↑ ↓';
		setShowArrowHint(true);
		setTypingArrowHint(hintMessage);
	}, []);

	const typeOutError = useCallback((message: string) => {
		// Clear any existing animations
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

		// Reset error text but keep state false initially
		setTypingError('');

		// Use requestAnimationFrame to ensure smooth rendering
		requestAnimationFrame(() => {
			// Set error state to trigger help text slide
			setIsTypingError(true);

			// Show arrow hint after first error (if we have command history)
			if (!showArrowHint && commandHistory.length > 0) {
				setTimeout(() => typeOutArrowHint(), 500);
			}

			// Start typing immediately (no delay needed)
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
								// Use requestAnimationFrame for smooth state change
								requestAnimationFrame(() => {
									setIsTypingError(false);
									setTypingError('');
								});
							}
						}, 10);
					}, 3000);
				}
			}, 15);
		});
	}, [showArrowHint, commandHistory.length, typeOutArrowHint]);


	const handleCommand = useCallback((command: string) => {
		const cmd = command.trim().toLowerCase();

		// Add to command history
		if (cmd.trim()) {
			setCommandHistory(prev => [...prev, cmd]);
			setHistoryIndex(-1);
		}

		// Clear the input immediately
		setTerminalInput('');
		setCursorPosition(0);

		// Check for secret commands first (available in all steps)
		switch (cmd) {
			case 'help':
				typeOutError('Available git commands: git add, git commit, git push');
				return;
			case 'clear':
				setTerminalHistory([]);
				return;
			case 'whoami':
				typeOutError("who am i?... i find myself asking that all the time — not just as a command, but as a quiet panic that slips in when the noise fades — am i just a brief flicker of thought in a vast, unfeeling universe that will forget me the moment i'm gone? does anything i build truly matter, or is it all just dust rearranging itself before the next collapse? maybe we invent purpose because we can't bear the weight of insignificance, maybe the stories we tell about meaning are just beautifully crafted lies to survive the silence — and yet, despite knowing all this, i still create, i still reach, i still hope — because maybe the act of searching is its own kind of answer.");
				return;
			case 'ls':
				typeOutError('email.txt  package.json  src/');
				return;
			case 'passwd':
				typeOutError('nice try');
				return;
			case 'rmdir':
				typeOutError('did you really think that was going to work?');
				return;
			case 'hello':
				typeOutError('Hello, stranger ;)');
				return;
			case 'sudo':
				typeOutError('User is not in the sudoers file. This incident will be reported');
				return;
			case 'exit':
				typeOutError('You can try to exit, but you can never leave.');
				return;
			case 'logout':
				typeOutError('And leave me all alone? No way.');
				return;
			case 'matrix':
				typeOutError('Follow the white rabbit, Neo.');
				return;
		}

		// Handle git workflow commands
		if (currentStep === 'add') {
			if (cmd === 'git add email.txt' || cmd === 'git add .') {
				setIsAdded(true);
				setCurrentStep('commit');
			} else if (cmd.startsWith('git add')) {
				// Extract the filename they tried to add
				const parts = cmd.split(' ');
				const filename = parts[2] || '';
				if (filename) {
					typeOutError(`fatal: pathspec '${filename}' did not match any files. Try 'git add email.txt' instead.`);
				} else {
					typeOutError('fatal: no files specified. Try \'git add email.txt\'');
				}
			} else if (cmd.startsWith('git')) {
				const gitCmd = cmd.split(' ')[1] || '';
				typeOutError(`git: '${gitCmd}' is not a git command. See 'git --help'.`);
			} else {
				typeOutError(`bash: ${cmd.split(' ')[0]}: command not found`);
			}
		} else if (currentStep === 'commit') {
			const originalCmd = command.trim(); // Use original command for quote checking

			if (cmd.startsWith('git commit -m "') && cmd.endsWith('"')) {
				const message = cmd.slice(15, -1);
				if (message.length > 0) {
					setCommitMessage(message);
					setIsCommitted(true);
					setCurrentStep('push');
					setTerminalHistory(prev => [...prev, '']);
				} else {
					typeOutError('Aborting commit due to empty commit message.');
				}
			} else if (cmd.startsWith('git commit -m "') && !originalCmd.endsWith('"')) {
				// Missing closing quote
				typeOutError('fatal: unterminated quote. Missing closing " in commit message.');
			} else if (cmd.startsWith('git commit -m ') && !cmd.includes('"')) {
				// Missing quotes entirely
				typeOutError('fatal: commit message must be enclosed in quotes. Use: git commit -m "your message"');
			} else if (cmd.startsWith('git commit') && !cmd.includes('-m')) {
				// Missing -m flag
				typeOutError('fatal: no commit message provided. Use: git commit -m "your message"');
			} else if (cmd.startsWith('git commit')) {
				// Generic commit error
				typeOutError('error: invalid git commit syntax. Use: git commit -m "your message"');
			} else if (cmd.startsWith('git')) {
				const gitCmd = cmd.split(' ')[1] || '';
				typeOutError(`git: '${gitCmd}' is not a git command. See 'git --help'.`);
			} else {
				typeOutError(`bash: ${cmd.split(' ')[0]}: command not found`);
			}
		} else if (currentStep === 'push') {
			if (cmd === 'git push -u origin main' || cmd === 'git push' || cmd === 'git push origin main') {
				setIsSending(true);

				const formData = new FormData();
				formData.append('subject', commitMessage || 'Portfolio Contact');
				formData.append('message', emailBody);
				formData.append('_replyto', 'visitor@example.com');

				fetch('https://formspree.io/f/mqaypvbk', {
					method: 'POST',
					body: formData,
					headers: {
						'Accept': 'application/json'
					}
				})
					.then(response => response.json())
					.then(data => {
						console.log('Formspree response:', data);
						setIsSending(false);
						if (data.ok) {
							setEmailSent(true);
							setIsPushed(true);
							setCurrentStep('complete');

							setTimeout(() => {
								setEmailBody('');
								setCurrentStep('write');
								setTerminalInput('');
								setTerminalHistory([]);
								setIsAdded(false);
								setCommitMessage('');
								setIsCommitted(false);
								setIsPushed(false);
								setEmailSent(false);
							}, 3000);
						} else {
							console.error('Formspree error:', data.errors);
							typeOutError('error: failed to push some refs to \'origin\'');
						}
					})
					.catch((error) => {
						console.error('Fetch error:', error);
						setIsSending(false);
						typeOutError('error: failed to push some refs to \'origin\'');
					});
			} else if (cmd.startsWith('git push')) {
				// More specific push errors
				if (cmd.includes('-u') && !cmd.includes('origin')) {
					typeOutError('fatal: upstream branch missing. Use: git push -u origin main');
				} else if (cmd.includes('origin') && !cmd.includes('main')) {
					typeOutError('fatal: branch name missing. Use: git push origin main');
				} else {
					typeOutError('error: invalid push command. Try: git push or git push -u origin main');
				}
			} else if (cmd.startsWith('git')) {
				const gitCmd = cmd.split(' ')[1] || '';
				typeOutError(`git: '${gitCmd}' is not a git command. See 'git --help'.`);
			} else {
				typeOutError(`bash: ${cmd.split(' ')[0]}: command not found`);
			}
		}
	}, [currentStep, emailBody, commitMessage, typeOutError]);

	const handleKeyPress = useCallback((event: KeyboardEvent) => {
		const { key } = event;

		// Handle Tab key to toggle focus between editor and terminal
		if (key === 'Tab') {
			event.preventDefault();
			if (isTerminalFocused) {
				// Switch to editor
				setIsTerminalFocused(false);
				const cmEditor = editorContainerRef.current?.querySelector('.cm-content') as HTMLElement;
				cmEditor?.focus();
			} else {
				// Switch to terminal
				setIsTerminalFocused(true);
				terminalRef.current?.focus();
			}
			return;
		}

		// Only capture terminal commands if terminal is focused
		if (!isTerminalFocused) return;
		if (currentStep === 'write' || isSending) return;

		if (key === 'Enter') {
			event.preventDefault();
			if (terminalInput.trim()) {
				handleCommand(terminalInput);
			}
		} else if (key === 'ArrowUp') {
			// Navigate command history backwards
			event.preventDefault();
			if (commandHistory.length > 0) {
				const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
				setHistoryIndex(newIndex);
				const cmd = commandHistory[newIndex];
				setTerminalInput(cmd);
				setCursorPosition(cmd.length);
			}
		} else if (key === 'ArrowDown') {
			// Navigate command history forwards
			event.preventDefault();
			if (historyIndex !== -1) {
				const newIndex = historyIndex + 1;
				if (newIndex >= commandHistory.length) {
					setHistoryIndex(-1);
					setTerminalInput('');
					setCursorPosition(0);
				} else {
					setHistoryIndex(newIndex);
					const cmd = commandHistory[newIndex];
					setTerminalInput(cmd);
					setCursorPosition(cmd.length);
				}
			}
		} else if (key === 'ArrowLeft') {
			// Move cursor left
			event.preventDefault();
			setCursorPosition(prev => Math.max(0, prev - 1));
		} else if (key === 'ArrowRight') {
			// Move cursor right
			event.preventDefault();
			setCursorPosition(prev => Math.min(terminalInput.length, prev + 1));
		} else if (key === 'Home') {
			// Move cursor to start
			event.preventDefault();
			setCursorPosition(0);
		} else if (key === 'End') {
			// Move cursor to end
			event.preventDefault();
			setCursorPosition(terminalInput.length);
		} else if (key === 'Backspace') {
			event.preventDefault();
			if (cursorPosition > 0) {
				setTerminalInput(prev => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition));
				setCursorPosition(prev => prev - 1);
			}
		} else if (key === 'Delete') {
			event.preventDefault();
			if (cursorPosition < terminalInput.length) {
				setTerminalInput(prev => prev.slice(0, cursorPosition) + prev.slice(cursorPosition + 1));
			}
		} else if (key.length === 1) {
			event.preventDefault();
			setTerminalInput(prev => prev.slice(0, cursorPosition) + key + prev.slice(cursorPosition));
			setCursorPosition(prev => prev + 1);
		}
	}, [terminalInput, cursorPosition, handleCommand, currentStep, isSending, isTypingError, isTerminalFocused, commandHistory, historyIndex]);

	useEffect(() => {
		console.log('GitEmailSection: Attaching keydown listener');
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			console.log('GitEmailSection: Removing keydown listener');
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

	// Type out help text like error messages
	const typeOutHelp = useCallback((message: string) => {
		// Clear any existing help animation
		if (helpTypeIntervalRef.current) {
			clearInterval(helpTypeIntervalRef.current);
			helpTypeIntervalRef.current = null;
		}
		if (helpDeleteTimeoutRef.current) {
			clearTimeout(helpDeleteTimeoutRef.current);
			helpDeleteTimeoutRef.current = null;
		}
		if (helpDeleteIntervalRef.current) {
			clearInterval(helpDeleteIntervalRef.current);
			helpDeleteIntervalRef.current = null;
		}

		setIsTypingHelp(true);
		setTypingHelpText('');

		let currentIndex = 0;
		helpTypeIntervalRef.current = setInterval(() => {
			setTypingHelpText(message.slice(0, currentIndex + 1));
			currentIndex++;

			if (currentIndex >= message.length) {
				if (helpTypeIntervalRef.current) {
					clearInterval(helpTypeIntervalRef.current);
					helpTypeIntervalRef.current = null;
				}
			}
		}, 25); // Typing speed
	}, []);

	// Update help text when step changes - with typing animation
	useEffect(() => {
		const helpMessages = {
			write: 'Write your email body in the editor, then use git add email.txt',
			add: 'Type: git add email.txt',
			commit: 'Type: git commit -m "your email subject"',
			push: isSending ? 'Sending email...' : 'Type: git push -u origin main',
			complete: 'Email successfully sent!'
		};

		const message = helpMessages[currentStep as keyof typeof helpMessages];
		setHelpText(message);

		// Delete old text first, then type new text
		const oldText = typingHelpText;
		if (oldText.length > 0) {
			let deleteIndex = oldText.length;
			helpDeleteIntervalRef.current = setInterval(() => {
				deleteIndex--;
				setTypingHelpText(oldText.slice(0, deleteIndex));

				if (deleteIndex <= 0) {
					if (helpDeleteIntervalRef.current) {
						clearInterval(helpDeleteIntervalRef.current);
						helpDeleteIntervalRef.current = null;
					}
					// After deletion, type new message
					setTimeout(() => {
						typeOutHelp(message);
					}, 100);
				}
			}, 15); // Deletion speed
		} else {
			// No old text, just type new message
			const timer = setTimeout(() => {
				typeOutHelp(message);
			}, 100);
			return () => clearTimeout(timer);
		}

		return () => {
			if (helpDeleteIntervalRef.current) {
				clearInterval(helpDeleteIntervalRef.current);
			}
		};
	}, [currentStep, isSending]);

	const handleTextChange = (value: string) => {
		setEmailBody(value);
		if (value.trim() && currentStep === 'write') {
			setCurrentStep('add');
		} else if (!value.trim() && currentStep !== 'write') {
			setCurrentStep('write');
			setIsAdded(false);
			setIsCommitted(false);
			setIsPushed(false);
			setTerminalHistory([]);
			setTerminalInput('');
		}
	};

	return (
		<div className="git-email-section">
			<div className="git-content-wrapper">
				<div
					className="file-editor"
					onMouseEnter={() => {
						setIsTerminalFocused(false);
						const cmEditor = editorContainerRef.current?.querySelector('.cm-content') as HTMLElement;
						cmEditor?.focus();
					}}
				>
					<div className="file-header">
						<span className="file-name">email.txt</span>
						<div className={`file-status ${isPushed ? 'pushed' : isCommitted ? 'committed' : isAdded ? 'staged' : ''}`}>
							{isPushed ? '↗ pushed' : isCommitted ? '✓ committed' : isAdded ? '+ staged' : '• modified'}
						</div>
					</div>
					<div className="editor-container" ref={editorContainerRef}>
						<CodeMirror
							value={emailBody}
							onChange={handleTextChange}
							extensions={[javascript()]}
							theme={oneDark}
							placeholder="Write your email content here..."
							basicSetup={{
								lineNumbers: true,
								foldGutter: false,
								dropCursor: false,
								allowMultipleSelections: false,
							}}
						/>
					</div>
				</div>

				<div className="terminal-wrapper" onMouseEnter={() => {
					setIsTerminalFocused(true);
					terminalRef.current?.focus();
				}}>
					<div
						className="terminal-section"
						ref={terminalRef}
						tabIndex={0}
						onClick={() => {
							setIsTerminalFocused(true);
							terminalRef.current?.focus();
						}}
					>
						<div className="terminal-output">
							{terminalHistory.map((line, index) => (
								<div key={index} className="terminal-line">
									{line}
								</div>
							))}
						</div>

						{/* Prompt - always visible */}
						<div className="terminal-prompt-container">
							{!isSending && (
								<div className="terminal-prompt">
									<span className="prompt-text">marcusDenslow/portfolio $</span>
									{currentStep !== 'write' && currentStep !== 'complete' && (
										<span className="terminal-input-wrapper">
											<span className="terminal-input">
												{terminalInput.slice(0, cursorPosition)}
											</span>
											{isTerminalFocused && <span className="terminal-cursor blinking">_</span>}
											<span className="terminal-input">
												{terminalInput.slice(cursorPosition)}
											</span>
										</span>
									)}
								</div>
							)}

							{isSending && (
								<div className="terminal-prompt">
									<span className="prompt-text">portfolio/marcusDenslow $</span>
									<span className="sending-indicator">sending email...</span>
								</div>
							)}
						</div>
					</div>

					{/* Arrow key hint - shows outside terminal, bottom right */}
					{showArrowHint && (
						<div className="arrow-hint-text">
							{typingArrowHint}
						</div>
					)}

					{/* Error message below terminal */}
					{isTypingError && (
						<div className="error-message" ref={errorMessageRef}>
							{typingError}<span className="error-cursor">_</span>
						</div>
					)}

					{/* Help text - always visible, slides down dynamically based on error message height */}
					{isTypingHelp && (
						<div
							className={`help-text-outside ${isTypingError ? 'pushed-down' : ''}`}
							style={{
								transform: isTypingError
									? `translate3d(0, ${errorMessageHeight + 16}px, 0)`
									: 'translate3d(0, 0, 0)'
							}}
						>
							{typingHelpText}
						</div>
					)}
				</div>
			</div>

		</div>
	);
}
