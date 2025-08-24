import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInView } from '../../hooks/useIntersectionObserver';
import './styles.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  preload?: boolean; // 是否预加载
  fadeIn?: boolean; // 是否渐进式显示
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMiAyOEMyOC42ODYzIDI4IDI2IDMwLjY4NjMgMjYgMzRDMjYgMzcuMzEzNyAyOC42ODYzIDQwIDMyIDQwQzM1LjMxMzcgNDAgMzggMzcuMzEzNyAzOCAzNEMzOCAzMC42ODYzIDM1LjMxMzcgMjggMzIgMjhaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIHN0cm9rZT0iI0NDQ0NDQyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=',
  onLoad,
  onError,
  preload = false,
  fadeIn = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // 使用IntersectionObserver检测图片是否进入视口
  const [containerRef, inView] = useInView({ 
    threshold: 0.1,
    rootMargin: preload ? '200px' : '50px' // 预加载时提前200px开始加载
  });

  const loadImage = useCallback(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      setIsError(true);
      onError?.();
    };
    
    img.src = src;
  }, [src, onLoad, onError]);

  useEffect(() => {
    if (inView && !isLoaded && !isError) {
      loadImage();
    }
  }, [inView, isLoaded, isError, loadImage]);

  return (
    <div 
      ref={containerRef} 
      className={`lazy-image-container ${className}`}
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`lazy-image ${isLoaded && fadeIn ? 'fade-in' : ''} ${isError ? 'error' : ''}`}
        onLoad={() => {
          if (imgRef.current?.src === src) {
            setIsLoaded(true);
          }
        }}
      />
      {!isLoaded && !isError && (
        <div className="lazy-image-loading">
          <div className="loading-skeleton"></div>
        </div>
      )}
      {isError && (
        <div className="lazy-image-error">
          <span>加载失败</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
