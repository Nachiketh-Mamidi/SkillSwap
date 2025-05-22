import React, { useState } from 'react';

export const ProgressiveImage = ({ src, alt, className, placeholderSrc }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || src);

  const handleLoad = () => {
    if (placeholderSrc) {
      setCurrentSrc(src);
    }
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleLoad}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
}; 