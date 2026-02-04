import { useState } from 'react';
import './SimpleEmailForm.css';

export default function SimpleEmailForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [isSent, setIsSent] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSending(true);
		setError('');

		const formData = new FormData();
		formData.append('name', name);
		formData.append('email', email);
		formData.append('subject', subject);
		formData.append('message', message);

		try {
			const response = await fetch('https://formspree.io/f/mqaypvbk', {
				method: 'POST',
				body: formData,
				headers: {
					'Accept': 'application/json'
				}
			});

			const data = await response.json();

			if (data.ok) {
				setIsSent(true);
				setTimeout(() => {
					setName('');
					setEmail('');
					setSubject('');
					setMessage('');
					setIsSent(false);
				}, 3000);
			} else {
				setError('Failed to send email. Please try again.');
			}
		} catch (err) {
			setError('Failed to send email. Please try again.');
		} finally {
			setIsSending(false);
		}
	};

	const handleMailto = () => {
		const mailtoLink = `mailto:marcus.allen.denslow@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
		window.location.href = mailtoLink;
	};

	return (
		<div className="simple-email-form">
			<h3 className="simple-form-title">or send email the easy way</h3>
			<p className="simple-form-subtitle">sometimes simple is best</p>

			{isSent ? (
				<div className="success-message">
					<svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
					<p>email sent successfully!</p>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="email-form">
					<div className="form-row">
						<div className="form-group">
							<label htmlFor="name">name</label>
							<input
								type="text"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={isSending}
								placeholder="your name"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email">email</label>
							<input
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isSending}
								placeholder="your@email.com"
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="subject">subject</label>
						<input
							type="text"
							id="subject"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							required
							disabled={isSending}
							placeholder="what's this about?"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="message">message</label>
						<textarea
							id="message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							required
							disabled={isSending}
							rows={6}
							placeholder="write your message here..."
						/>
					</div>

					{error && <div className="error-text">{error}</div>}

					<div className="form-buttons">
						<button
							type="submit"
							className="submit-button"
							disabled={isSending}
						>
							{isSending ? 'sending...' : 'send email'}
						</button>
						<button
							type="button"
							className="mailto-button"
							onClick={handleMailto}
							disabled={isSending}
						>
							open in mail app
						</button>
					</div>
				</form>
			)}
		</div>
	);
}