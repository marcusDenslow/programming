import { useState, useEffect } from 'react';
import './ShellPreloader.css';

interface ShellPreloaderProps {
	onComplete: () => void;
}

export default function ShellPreloader({ onComplete }: ShellPreloaderProps) {
	const [loadingStage, setLoadingStage] = useState(0);
	const [, setDots] = useState('');
	const [isExiting, setIsExiting] = useState(false);
	const [, setAssetsLoaded] = useState(false);
	const [loadStartTime] = useState(Date.now());

	const stages = [
		'Initializing shell environment',
		'Loading system modules',
		'Mounting file system'
	];

	useEffect(() => {
		let dotsInterval: number;
		let stageInterval: number;

		// Preload critical assets
		const preloadAssets = async () => {
			try {
				// Dynamically import Homepage and related components
				const [, projectsModule, experiencesModule] = await Promise.all([
					import('./Homepage'),
					import('../data/projects'),
					import('../data/experiences')
				]);

				// Preload images and videos from projects
				const mediaPromises: Promise<void>[] = [];
				const projectsData = projectsModule.projectsData;
				const experiencesData = experiencesModule.experiencesData;

				// Collect all media URLs
				const allMedia = [
					...projectsData.flatMap(p => p.images || []),
					...experiencesData.flatMap(e => e.images || [])
				].filter(url => url && !url.startsWith('http')); // Only preload local assets

				// Preload media
				allMedia.forEach(url => {
					if (url.match(/\.(mp4|mov|webm)$/i)) {
						// Video preloading
						const video = document.createElement('video');
						video.preload = 'metadata';
						video.src = url;
						mediaPromises.push(
							new Promise((resolve) => {
								video.onloadedmetadata = () => resolve();
								video.onerror = () => resolve(); // Continue on error
							})
						);
					} else if (url.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
						// Image preloading
						const img = new Image();
						img.src = url;
						mediaPromises.push(
							new Promise((resolve) => {
								img.onload = () => resolve();
								img.onerror = () => resolve(); // Continue on error
							})
						);
					}
				});

				// Wait for all media to load or timeout after 3 seconds
				await Promise.race([
					Promise.all(mediaPromises),
					new Promise(resolve => setTimeout(resolve, 3000))
				]);

				const loadTime = Date.now() - loadStartTime;

				// If loading was very fast (< 200ms), skip animation entirely
				if (loadTime < 200) {
					onComplete();
					return;
				}

				setAssetsLoaded(true);

				// For any load that shows the preloader, always show all stages completed
				// This ensures consistent behavior on reload/cached assets

				// Wait a tiny bit to ensure first stage is visible
				setTimeout(() => {
					// Immediately show all stages with OK
					setLoadingStage(stages.length); // Mark all as complete

					// Hold the "all complete" state briefly, then exit
					setTimeout(() => {
						setIsExiting(true);
						setTimeout(() => {
							onComplete();
						}, 800);
					}, 600); // Hold for 600ms before exit animation
				}, 100);

			} catch (error) {
				console.error('Asset preload error:', error);
				setAssetsLoaded(true);

				setTimeout(() => {
					setIsExiting(true);
					setTimeout(() => {
						onComplete();
					}, 800);
				}, 500);
			}
		};

		preloadAssets();

		// Animated dots
		dotsInterval = setInterval(() => {
			setDots(prev => prev.length >= 3 ? '' : prev + '.');
		}, 400);

		// Progress through loading stages
		stageInterval = setInterval(() => {
			setLoadingStage(prev => {
				if (prev < stages.length - 1) {
					return prev + 1;
				}
				return prev;
			});
		}, 600);

		return () => {
			clearInterval(dotsInterval);
			clearInterval(stageInterval);
		};
	}, [onComplete, loadStartTime]);

	return (
		<div className={`shell-preloader ${isExiting ? 'exiting' : ''}`}>
			<div className="preloader-content">
				<div className="boot-sequence">
					{stages.map((stage, index) => (
						<div
							key={index}
							className={`boot-line ${index <= loadingStage || loadingStage >= stages.length ? 'visible' : ''}`}
						>
							<span className="bracket">[</span>
							<span className={`status ${index < loadingStage || loadingStage >= stages.length ? 'ok' : 'loading'}`}>
								{index < loadingStage || loadingStage >= stages.length ? 'OK' : '..'}
							</span>
							<span className="bracket">]</span>
							<span className="stage-text">{stage}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}