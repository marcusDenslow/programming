import { useState, useEffect, useRef } from 'react';
import Carousel from './Carousel';
import './Experience.css';
import { GitHub, Globe, FileText } from '../components/icons';
import ReportLanguagePopup from './ReportLanguagePopup';

export interface Tag {
  name: string;
  url?: string;
  icon?: React.ReactNode;
}

export interface ExperienceData {
  title: string;
  content: string;
  time: string;
  state?: string;
  tags?: Tag[];
  github?: string;
  report?: string;
  images?: string[];
  website?: string;
}

export function ExperienceAndProjects({ children }: { children: React.ReactNode }) {
  return (
    <div className="experience-and-projects">
      {children}
    </div>
  );
}

export function TimelineStart() {
  return (
    <>
      <div className="timeline-line timeline-start" />
      <div className="timeline-spacer" />
    </>
  );
}

export function TimelineEnd() {
  return (
    <>
      <div className="timeline-line timeline-end" />
      <div className="timeline-spacer" />
    </>
  );
}

export function Experience({ title, content, time, state, tags, github, report, images, website }: ExperienceData) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for mobile scroll-based activation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const timelineElement = timelineRef.current;
          if (timelineElement) {
            if (entry.isIntersecting) {
              // Item is in viewport - light it up
              timelineElement.classList.add('timeline-hovered');
            } else {
              // Item left viewport - dim it
              timelineElement.classList.remove('timeline-hovered');
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of item is visible
        rootMargin: '-20% 0px -20% 0px', // Add margin to trigger earlier/later
      }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  // Autonomous animation for mobile - includes links and tags
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile || !footerRef.current) return;

    let animationTimeouts: NodeJS.Timeout[] = [];
    let isAnimating = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimating) {
            isAnimating = true;

            // Get all animatable elements (links and tags)
            const linkElements = footerRef.current?.querySelectorAll('.yolocat-link');
            const tagElements = footerRef.current?.querySelectorAll('.yolocat-tag');
            const allElements = [...(linkElements || []), ...(tagElements || [])];

            if (allElements.length === 0) {
              isAnimating = false;
              return;
            }

            let currentIndex = 0;
            const animateNextItem = () => {
              // Remove animation from all elements
              allElements.forEach((element) => {
                element.classList.remove('tag-auto-animate');
              });

              // Add animation to current element
              if (currentIndex < allElements.length) {
                allElements[currentIndex].classList.add('tag-auto-animate');
                currentIndex++;

                // Brief pause between items (800ms animation + 400ms pause)
                const timeout = setTimeout(animateNextItem, 1200);
                animationTimeouts.push(timeout);
              } else {
                // Finished all items, wait 1.5s before restarting
                const timeout = setTimeout(() => {
                  currentIndex = 0;
                  animateNextItem();
                }, 1500);
                animationTimeouts.push(timeout);
              }
            };

            // Start the animation cycle after a short delay
            const initialTimeout = setTimeout(animateNextItem, 600);
            animationTimeouts.push(initialTimeout);
          } else if (!entry.isIntersecting) {
            // Clean up animations when out of view
            isAnimating = false;
            animationTimeouts.forEach((timeout) => clearTimeout(timeout));
            animationTimeouts = [];

            // Remove all animations
            const linkElements = footerRef.current?.querySelectorAll('.yolocat-link');
            const tagElements = footerRef.current?.querySelectorAll('.yolocat-tag');
            [...(linkElements || []), ...(tagElements || [])].forEach((element) => {
              element.classList.remove('tag-auto-animate');
            });
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      // Clean up on unmount
      animationTimeouts.forEach((timeout) => clearTimeout(timeout));
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, [tags, github, report, website]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const experienceContent = e.currentTarget;
    const timelineElement = experienceContent.previousElementSibling;
    if (timelineElement && timelineElement.classList.contains('timeline-line')) {
      timelineElement.classList.add('timeline-hovered');
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const experienceContent = e.currentTarget;
    const timelineElement = experienceContent.previousElementSibling;
    if (timelineElement && timelineElement.classList.contains('timeline-line')) {
      timelineElement.classList.remove('timeline-hovered');
    }
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };

  return (
    <>
      <div className="timeline-line experience-line" ref={timelineRef}>
        <div className="timeline-line-hover" />
        <div className="timeline-dot">
          <div className="timeline-dot-inner"></div>
        </div>
        <div className="timeline-dot timeline-dot-hover">
          <div className="timeline-dot-inner"></div>
        </div>
      </div>
      <div
        className="experience-content"
        ref={contentRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="experience-meta">{state ? `${time} * ${state}` : time}</span>
        <h2 className="experience-title">{title}</h2>

        {images && images.length > 0 && (
          <Carousel images={images} title={title} />
        )}

        <p className="experience-description">{content}</p>

        {(github || report || website || (tags && tags.length > 0)) && (
          <div className="experience-footer" ref={footerRef}>
            {github && (
              <a className="yolocat-link" href={github} target="_blank" rel="noopener noreferrer">
                <GitHub size={28} className="yolocat-link-icon" />
                <span className="yolocat-link-text">View on GitHub</span>
              </a>
            )}
            {report && (
              <>
                <a className="yolocat-link" href={report} onClick={handleReportClick}>
                  <FileText size={28} className="yolocat-link-icon" />
                  <span className="yolocat-link-text">View Report</span>
                </a>
                <ReportLanguagePopup
                  isOpen={isPopupOpen}
                  onClose={() => setIsPopupOpen(false)}
                  reportPath={report}
                />
              </>
            )}
            {website && (
              <a className="yolocat-link" href={website} target="_blank" rel="noopener noreferrer">
                <Globe size={28} className="yolocat-link-icon" />
                <span className="yolocat-link-text">Visit Website</span>
              </a>
            )}
            {(github || report || website) && tags && tags.length > 0 && (
              <div className="separator-dot"></div>
            )}
            {tags?.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Tag({ tag }: { tag: Tag }) {
  if (tag.url) {
    return (
      <a
        className="yolocat-tag"
        href={tag.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="yolocat-tag-icon">{tag.icon && tag.icon}</span>
        <span className="yolocat-tag-text">{tag.name}</span>
      </a>
    );
  }

  return (
    <span className="yolocat-tag">
      <span className="yolocat-tag-icon">{tag.icon && tag.icon}</span>
      <span className="yolocat-tag-text">{tag.name}</span>
    </span>
  );
}