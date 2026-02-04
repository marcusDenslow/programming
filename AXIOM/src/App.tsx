import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { PageTransitionProvider } from './contexts/PageTransitionContext'
import TerminalLock from './components/TerminalLock'
import ThemeToggle from './components/ThemeToggle'
import LiquidTransition from './components/LiquidTransition'
import ShellPreloader from './components/ShellPreloader'
import './components/TerminalLock.css'
import './components/Homepage.css'
import './components/Sidebar.css'
import './components/Experience.css'
import './components/Carousel.css'
import './components/ShellPreloader.css'
import './App.css'

// Lazy load components
const Homepage = lazy(() => import('./components/Homepage'))
const SecretCommands = lazy(() => import('./components/SecretCommands'))

function App() {
	const [isPreloading, setIsPreloading] = useState(true)
	const [isLocked, setIsLocked] = useState(true)
	const [showSecret, setShowSecret] = useState(false)
	const [isTransitioningToSecret, setIsTransitioningToSecret] = useState(false)
	const [, setKonamiSequence] = useState<string[]>([])

	const handleUnlock = useCallback(() => {
		setIsLocked(false)
	}, [])

	const handlePreloadComplete = useCallback(() => {
		setIsPreloading(false)
	}, [])

	// Konami Code: Up Up Down Down Left Right Left Right B A
	const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

	const handleKonamiCode = useCallback((event: KeyboardEvent) => {
		console.log('App Konami handler called for key:', event.key)
		// Don't trigger if in secret page or transitioning
		if (showSecret || isTransitioningToSecret) return

		setKonamiSequence(prev => {
			const newSequence = [...prev, event.key]

			// Keep only the last 10 keys
			if (newSequence.length > 10) {
				newSequence.shift()
			}

			// Check if sequence matches Konami code
			const sequenceMatches = KONAMI_CODE.every((key, index) => {
				return newSequence[index]?.toLowerCase() === key.toLowerCase()
			})

			if (sequenceMatches && newSequence.length === 10) {
				// Start transition
				setIsTransitioningToSecret(true)

				// Show secret page after exit animation
				setTimeout(() => {
					setShowSecret(true)
					setIsTransitioningToSecret(false)
				}, 350) // Match the exit animation duration

				return []
			}

			return newSequence
		})
	}, [showSecret, isTransitioningToSecret])

	useEffect(() => {
		console.log('App: Attaching Konami code listener')
		window.addEventListener('keydown', handleKonamiCode)

		return () => {
			console.log('App: Removing Konami code listener')
			window.removeEventListener('keydown', handleKonamiCode)
		}
	}, [handleKonamiCode])

	// Show preloader first
	if (isPreloading) {
		return (
			<ThemeProvider>
				<ShellPreloader onComplete={handlePreloadComplete} />
			</ThemeProvider>
		)
	}

	if (showSecret) {
		return (
			<ThemeProvider>
				<PageTransitionProvider>
					<ThemeToggle />
					<Suspense fallback={<div />}>
						<SecretCommands onClose={() => setShowSecret(false)} />
					</Suspense>
				</PageTransitionProvider>
			</ThemeProvider>
		)
	}

	return (
		<ThemeProvider>
			<PageTransitionProvider>
				<LiquidTransition />
				{isLocked ? (
					<>
						<ThemeToggle />
						<TerminalLock onUnlock={handleUnlock} />
					</>
				) : (
					<div className={isTransitioningToSecret ? 'transitioning-to-secret' : ''}>
						<ThemeToggle />
						<Suspense fallback={<div />}>
							<Homepage />
						</Suspense>
					</div>
				)}
			</PageTransitionProvider>
		</ThemeProvider>
	)
}

export default App
