import { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import Modal from './Modal';

interface ImageCropperProps {
  isOpen: boolean;
  image: string; // base64 or URL
  onClose: () => void;
  onCrop: (croppedBase64: string) => void;
  aspectRatio?: number; // width / height
  shape?: 'circle' | 'rect';
}

export default function ImageCropper({ isOpen, image, onClose, onCrop, aspectRatio = 1, shape = 'circle' }: Readonly<ImageCropperProps>) {

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset state when image changes or modal opens (during render to avoid cascading renders)
  const [prevImage, setPrevImage] = useState(image);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (image !== prevImage || (isOpen && !prevIsOpen)) {
    setPrevImage(image);
    setPrevIsOpen(isOpen);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  const containerRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 50 : 10;
    switch (e.key) {
      case 'ArrowLeft':
        setPosition(prev => ({ ...prev, x: prev.x - step }));
        e.preventDefault();
        break;
      case 'ArrowRight':
        setPosition(prev => ({ ...prev, x: prev.x + step }));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setPosition(prev => ({ ...prev, y: prev.y - step }));
        e.preventDefault();
        break;
      case 'ArrowDown':
        setPosition(prev => ({ ...prev, y: prev.y + step }));
        e.preventDefault();
        break;
      case '+':
      case '=':
        if (e.ctrlKey || e.metaKey) {
          setZoom(prev => Math.min(prev + 0.1, 3));
          e.preventDefault();
        }
        break;
      case '-':
      case '_':
        if (e.ctrlKey || e.metaKey) {
          setZoom(prev => Math.max(prev - 0.1, 0.5));
          e.preventDefault();
        }
        break;
    }
  };


  const handleCrop = () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const baseWidth = 400; 
    const baseHeight = baseWidth / aspectRatio;
    
    canvas.width = baseWidth;
    canvas.height = baseHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // The viewport size relative to container
    const viewportWidth = containerRect.width * 0.8;
    const viewportHeight = viewportWidth / aspectRatio;
    
    const viewportX = containerRect.left + (containerRect.width / 2) - (viewportWidth / 2);
    const viewportY = containerRect.top + (containerRect.height / 2) - (viewportHeight / 2);

    // Calculate how much to crop from the natural image
    const relativeX = (viewportX - rect.left) * (img.naturalWidth / rect.width);
    const relativeY = (viewportY - rect.top) * (img.naturalHeight / rect.height);
    const relativeWidth = viewportWidth * (img.naturalWidth / rect.width);
    const relativeHeight = viewportHeight * (img.naturalHeight / rect.height);

    ctx.drawImage(
      img,
      relativeX, relativeY, relativeWidth, relativeHeight,
      0, 0, baseWidth, baseHeight
    );

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.8);
    onCrop(croppedBase64);
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} title={shape === 'circle' ? 'Crop Profile Picture' : 'Crop Thumbnail'}>

      <div className="space-y-6">
        <button 
          type="button"
          ref={containerRef}
          className="relative w-full h-75 bg-charcoal/5 overflow-hidden flex items-center justify-center cursor-move focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 p-0 border-none appearance-none"
          aria-label="Image cropper. Use arrow keys to move the image, or drag with mouse or touch. Hold shift for larger movements. Use Ctrl +/- to zoom."
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onKeyDown={handleKeyDown}
        >
          {/* Image */}
          <img
            ref={imageRef}
            src={image}
            alt="To crop"
            className="max-w-none pointer-events-none select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          />

          {/* Viewport Overlay */}
          <span className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Guideline with huge shadow to create the dim effect */}
            <span 
              className={`border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-20 ${shape === 'circle' ? 'rounded-full' : ''}`}
              style={{
                width: '80%',
                maxWidth: '90%',
                aspectRatio: `${aspectRatio}`,
              }}
            />
          </span>


        </button>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ZoomOut size={16} className="text-warm-grey" />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
              className="flex-1 accent-gold"
            />
            <ZoomIn size={16} className="text-warm-grey" />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCrop}
              className="flex-1 h-11 bg-charcoal text-white text-label flex items-center justify-center gap-2 hover:bg-gold hover:text-charcoal transition-colors duration-300 cursor-pointer"
            >
              <Check size={16} />
              Apply Crop
            </button>
            <button
              onClick={onClose}
              className="flex-1 h-11 border border-charcoal/20 text-label text-warm-grey flex items-center justify-center gap-2 hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
