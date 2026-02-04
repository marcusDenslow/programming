import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import './Carousel.css';

export function CarouselWrapper({ children }: { children: React.ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const updateScroll = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    updateScroll();

    emblaApi.on("select", updateScroll);

    return () => {
      emblaApi.off("select", updateScroll);
    };
  }, [emblaApi]);

  return (
    <div className="carousel-container">
      <div className="carousel-viewport" ref={emblaRef}>
        <div className="carousel-container-inner">
          {children}
        </div>
      </div>

      {/* Left gradient overlay */}
      <div className={`carousel-gradient carousel-gradient-left ${canScrollPrev ? 'carousel-gradient-visible' : ''}`}></div>

      {/* Right gradient overlay */}
      <div className={`carousel-gradient carousel-gradient-right ${canScrollNext ? 'carousel-gradient-visible' : ''}`}></div>

      {/* Navigation buttons */}
      <button
        aria-label="View Previous Image"
        className={`carousel-btn carousel-btn-prev ${canScrollPrev ? 'carousel-btn-visible' : ''}`}
        onClick={scrollPrev}
      >
        <ChevronLeft />
      </button>

      <button
        aria-label="View Next Image"
        className={`carousel-btn carousel-btn-next ${canScrollNext ? 'carousel-btn-visible' : ''}`}
        onClick={scrollNext}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  );
}