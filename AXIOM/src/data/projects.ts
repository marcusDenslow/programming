import type { ExperienceData } from '../components/Experience';
import { tags } from './tags.tsx';

// Placeholder images - replace these with your actual project images
const placeholderImages = {
	FERRUM: [
		'/videos/shell.mp4',
	],
	n_body_problem: [
		'/videos/n_body.mp4',
		'/videos/Explanation.mp4',
	],
	bog_project: [
		'/images/box.png',
		'/videos/working.mp4',
	],
	rust: [
		'/images/rust.png',
		'/images/rustNvim.png',
	],
	gameEngine: [
		'https://via.placeholder.com/800x450/000000/ff0000?text=Game+Engine+Demo',
		'https://via.placeholder.com/800x450/000000/ff0000?text=3D+Graphics+Output'
	]
};

export const projectsData: ExperienceData[] = [
	{
		title: "FERRUM",
		content: "FERRUM is a shell written for Linux. Built from scratch with productivity enhancements like fzf and ripgrep built in. FERRUM also has a strong emphasis on git and github integration, and features a tui for git related worklows.",
		time: "Apr 28 - Present",
		state: "In Progress",
		tags: [tags.c, tags.ncurses],
		github: "https://github.com/marcusDenslow/FERRUM",
		images: placeholderImages.FERRUM,
	},
	{
		title: "Bog monitoring system",
		content: "As part of a school project in collaboration with the local Norwegian government, my team was tasked with assessing whether a degraded bog could naturally restore itself. We designed and deployed a monitoring station equipped with custom-built sensors and Arduino circuits to track hydrological conditions, including ultrasonic sensors for precise water level monitoring. The system implemented 4G data transmission for remote access and local storage for redundancy. This project gave us hands-on experience with environmental monitoring systems and demonstrated how engineering solutions can directly inform land-use decisions. Note: The detailed technical report is available in Norwegian.",
		time: "Oct 2024 - June 2025",
		state: "Completed",
		tags: [tags.c, tags.arduino],
		report: "/reports/bog-monitoring-report.pdf",
		images: placeholderImages.bog_project
	},
	{
		title: "NBodyProblem-solver",
		content: "N-body gravitational simulation written in Python that models planetary motion and celestial mechanics. Implements numerical integration algorithms to solve gravitational interactions between multiple celestial bodies.",
		time: "Sep 3, 2024 - May 21, 2025",
		state: "Completed",
		tags: [tags.python],
		github: "https://github.com/marcusDenslow/N-BODY-PROBLEM-SOLUTION",
		images: placeholderImages.n_body_problem,
	},
	{
		title: "Rust Compiller contributer",
		content: "In my free time I contribute to the Rust ecosystem, which includes working on the rustc compiler.",
		time: "Sep 2025 - Present",
		state: "Ongoing",
		tags: [tags.rust],
		github: "https://github.com/rust-lang/rust",
		images: placeholderImages.rust
	},
];
