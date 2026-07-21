import { useState, useEffect, useCallback } from 'react';
import './Hero.css';
import { slides } from '../../data/heroSlides';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([false, false, false]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 首屏图片加载完成后标记为已加载
  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
    if (index === 0) {
      setLoaded(true);
    }
  };

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // 预加载后续图片
  useEffect(() => {
    slides.slice(1).forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => handleImageLoad(index + 1);
    });
  }, []);

  return (
    <section className="hero" id="home">
      {/* 背景装饰 */}
      <div className="heroBgDecoration"></div>

      <div className="heroSlider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`heroSlide ${index === currentSlide ? 'active' : ''}`}
          >
            <img
              src={index === 0 ? slide.image : slide.thumb}
              alt=""
              className={`heroImage ${imagesLoaded[index] ? 'loaded' : ''}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              onLoad={() => handleImageLoad(index)}
            />
            {/* 低质量图片占位 */}
            {!imagesLoaded[index] && (
              <div className="heroImagePlaceholder"></div>
            )}
          </div>
        ))}
      </div>

      <div className={`heroContent ${loaded ? 'loaded' : ''}`}>
        <span className="heroTagline">
          <span className="heroTaglineIcon">⚽</span>
          SZTU FOOTBALL ASSOCIATION
        </span>
        <h1 className="heroTitle">
          {slides[currentSlide].titlePlain}
          <span>{slides[currentSlide].titleEmphasis}</span>
        </h1>
        <p className="heroDescription">{slides[currentSlide].description}</p>
        <div className="heroButtons">
          <a href="#about" className="heroButton heroButtonPrimary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
            </svg>
            了解更多
          </a>
          <a href="#activities" className="heroButton heroButtonSecondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            活动动态
          </a>
        </div>
      </div>

      {/* 轮播箭头 */}
      <button className="heroArrow heroArrowPrev" onClick={prevSlide} aria-label="上一张">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="heroArrow heroArrowNext" onClick={nextSlide} aria-label="下一张">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* 轮播指示器 */}
      <div className="heroIndicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`heroIndicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>

      {/* 滚动提示 */}
      <div className="scrollIndicator">
        <span>向下滚动</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
