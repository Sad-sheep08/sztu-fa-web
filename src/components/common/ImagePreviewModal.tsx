import React from 'react';

interface ImagePreviewModalProps {
  src: string | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="imagePreviewOverlay" onClick={onClose}>
      <div className="imagePreviewContainer" onClick={(event) => event.stopPropagation()}>
        <img src={src} alt="大图预览" className="previewLargeImage" />
        <button className="previewCloseButton" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};
