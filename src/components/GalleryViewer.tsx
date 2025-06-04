import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const GalleryViewer: React.FC<GalleryViewerProps> = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    // Reset index if images change or initial index is out of bounds
    if (initialIndex < 0 || initialIndex >= images.length) {
        setCurrentIndex(0);
    } else {
        setCurrentIndex(initialIndex);
    }
  }, [images, initialIndex]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextImage();
      } else if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images, currentIndex, onClose]); // Add dependencies

  if (!images || images.length === 0) {
    return null; // Or some fallback UI
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black bg-opacity-75">
      {/* Close Button */}
      <button 
        className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* Image */}
      <img 
        src={images[currentIndex]}
        alt={`Gallery image ${currentIndex + 1}`}
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
      />

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"
            onClick={prevImage}
          >
            <ChevronLeft size={30} />
          </button>
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"
            onClick={nextImage}
          >
            <ChevronRight size={30} />
          </button>
        </>
      )}
    </div>
  );
};

export default GalleryViewer; 