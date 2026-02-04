import { CarouselWrapper } from './CarouselClient';

function isVideoFile(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

export default function Carousel({ images, title }: { images: string[]; title: string }) {
  return (
    <CarouselWrapper>
      {images.map((media, index) => (
        <div className="carousel-slide" key={`carousel-${index}`}>
          {isVideoFile(media) ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="auto"
              aria-label={`Video ${index + 1} of ${title}`}
              controls={false}
              onLoadedMetadata={(e) => {
                // Ensure video plays after metadata loads
                const video = e.currentTarget;
                video.play().catch((error) => {
                  console.log('Video autoplay prevented:', error);
                });
              }}
              onError={(e) => {
                console.error('Video failed to load:', media, e);
              }}
              onCanPlay={(e) => {
                // Try to play when video is ready
                const video = e.currentTarget;
                video.play().catch(() => {});
              }}
            >
              <source src={media} type={media.endsWith('.mov') ? 'video/quicktime' : `video/${media.split('.').pop()}`} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={media}
              alt={`Image ${index + 1} of ${title}`}
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', media, e);
              }}
            />
          )}
        </div>
      ))}
    </CarouselWrapper>
  );
}