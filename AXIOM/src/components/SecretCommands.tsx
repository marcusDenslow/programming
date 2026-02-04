import { useState, useEffect, useCallback, useRef } from 'react';
import './SecretCommands.css';

interface SecretCommandsProps {
	onClose: () => void;
}

export default function SecretCommands({ onClose }: SecretCommandsProps) {
	const [isExiting, setIsExiting] = useState(false);
	const gridRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => {
		setIsExiting(true);
		setTimeout(() => {
			onClose();
		}, 500); // Match the animation duration
	}, [onClose]);

	// Calculate row for each card based on grid layout
	useEffect(() => {
		if (!gridRef.current) return;

		const updateRows = () => {
			const cards = gridRef.current?.querySelectorAll('.command-card');
			if (!cards) return;

			const gridComputedStyle = window.getComputedStyle(gridRef.current!);
			const columnCount = gridComputedStyle.getPropertyValue('grid-template-columns').split(' ').length;

			cards.forEach((card, index) => {
				const row = Math.floor(index / columnCount);
				(card as HTMLElement).dataset.row = row.toString();
			});
		};

		updateRows();
		window.addEventListener('resize', updateRows);
		return () => window.removeEventListener('resize', updateRows);
	}, []);

	// Handle ESC key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleClose();
			}
		};

		window.addEventListener('keydown', handleEscape);
		return () => {
			window.removeEventListener('keydown', handleEscape);
		};
	}, [handleClose]);

	const commands = [
		{ command: 'start', description: 'Unlock the terminal and enter the main site' },
		{ command: 'help', description: 'Display available commands' },
		{ command: 'clear', description: 'Clear the terminal (secret - does nothing)' },
		{ command: 'whoami', description: 'Existential crisis mode activated' },
		{ command: 'ls', description: 'List directory contents' },
		{ command: 'passwd', description: 'Attempt to change password (spoiler: it won\'t work)' },
		{ command: 'rmdir', description: 'Try to remove directory (spoiler: also won\'t work)' },
		{ command: 'hello', description: 'Receive a friendly greeting' },
		{ command: 'sudo', description: 'Pretend you have root access' },
		{ command: 'exit', description: 'Try to leave (you can\'t)' },
		{ command: 'logout', description: 'Attempt to logout (also impossible)' },
		{ command: 'matrix', description: 'Follow the white rabbit' },
	];

	return (
		<div className={`secret-page ${isExiting ? 'exiting' : ''}`}>
			<button className="back-button" onClick={handleClose} aria-label="Back to site">
				<svg
					className="back-arrow"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				<span className="back-text">back to site</span>
			</button>
			<div className="secret-container">
				<div className="secret-header">
					<h1 className="secret-title">
						<span className="secret-bracket">[</span>
						<span className="secret-title-text">hidden commands</span>
						<span className="secret-bracket">]</span>
					</h1>
					<p className="secret-subtitle">
						Explorer of secrets, are you? Here are all the terminal commands you can try.
					</p>
					<div className="secret-konami">
						<span className="konami-label">unlocked via:</span>
						<span className="konami-code">↑ ↑ ↓ ↓ ← → ← → B A</span>
					</div>
				</div>

				<div className="commands-grid" ref={gridRef}>
					{commands.map((cmd, index) => (
						<div
							key={index}
							className="command-card"
							style={{ animationDelay: `${index * 0.05}s` }}
						>
							<div className="command-prompt">
								<span className="prompt-symbol">&gt;</span>
								<span className="command-name">{cmd.command}</span>
							</div>
							<p className="command-description">{cmd.description}</p>
						</div>
					))}
				</div>

				<div className="secret-footer">
					<p className="footer-hint">
						discovered the secret? nice.
					</p>
				</div>
			</div>
		</div>
	);
}
