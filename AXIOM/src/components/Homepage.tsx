import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import MobileHero from './MobileHero';
import { Experience, ExperienceAndProjects, TimelineEnd, TimelineStart } from './Experience';
import GitEmailSection from './GitEmailSection';
import SimpleEmailForm from './SimpleEmailForm';
import { projectsData } from '../data/projects';
import { experiencesData } from '../data/experiences';
import './Homepage.css';

export default function Homepage() {
	const [activeSection, setActiveSection] = useState('projects');
	const [isTransitioning, setIsTransitioning] = useState(false);

	const handleSectionClick = (section: string) => {
		if (section === activeSection) return;

		// Hide scrollbar during transition
		document.body.classList.add('hide-scrollbar');
		document.body.classList.remove('show-scrollbar');

		setIsTransitioning(true);

		setTimeout(() => {
			setActiveSection(section);
			setIsTransitioning(false);

			// Show scrollbar after transition + animation completes
			setTimeout(() => {
				document.body.classList.remove('hide-scrollbar');
				document.body.classList.add('show-scrollbar');
			}, 450); // Wait for page transition animation
		}, 350); // Wait for exit animation to complete
	};

	// Show scrollbar on initial load after animations
	useEffect(() => {
		const showScrollbarTimer = setTimeout(() => {
			document.body.classList.add('show-scrollbar');
		}, 1200); // Wait for all entrance animations

		return () => clearTimeout(showScrollbarTimer);
	}, []);

	const renderContent = () => {
		const contentClass = `content-section ${isTransitioning ? 'page-transition-out' : 'page-transition-in'}`;

		switch (activeSection) {
			case 'projects':
				return (
					<section className={contentClass} key="projects">
						<div className="section-content">
							<h1 className="section-title">* Projects</h1>
							<ExperienceAndProjects>
								<TimelineStart />
								{projectsData.map((project, index) => (
									<Experience
										key={index}
										title={project.title}
										content={project.content}
										time={project.time}
										state={project.state}
										tags={project.tags}
										github={project.github}
										report={project.report}
										images={project.images}
										website={project.website}
									/>
								))}
								<TimelineEnd />
							</ExperienceAndProjects>
						</div>
					</section>
				);
			case 'experiences':
				return (
					<section className={contentClass} key="experiences">
						<div className="section-content">
							<h1 className="section-title">* Experiences</h1>
							<ExperienceAndProjects>
								<TimelineStart />
								{experiencesData.map((experience, index) => (
									<Experience
										key={index}
										title={experience.title}
										content={experience.content}
										time={experience.time}
										state={experience.state}
										tags={experience.tags}
										github={experience.github}
										images={experience.images}
										website={experience.website}
									/>
								))}
								<TimelineEnd />
							</ExperienceAndProjects>
						</div>
					</section>
				);
			case 'contact':
				return (
					<section className={contentClass} key="contact">
						<div className="section-content">
							<h1 className="section-title">* Contact</h1>
							<div className="contact-content-wrapper">
								<GitEmailSection />

								<SimpleEmailForm />
							</div>
						</div>
					</section>
				);
			default:
				return null;
		}
	};

	return (
		<div className="homepage-layout homepage-entrance">
			<Sidebar onSectionClick={handleSectionClick} activeSection={activeSection} />
			<MobileMenu onSectionClick={handleSectionClick} activeSection={activeSection} />
			{activeSection === 'projects' && <MobileHero />}
			<main className={`main-content ${activeSection === 'projects' ? 'with-hero' : ''}`}>
				{renderContent()}
			</main>
		</div>
	);
}
