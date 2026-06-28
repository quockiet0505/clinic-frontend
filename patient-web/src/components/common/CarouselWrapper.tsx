import React, { useRef, useState, useEffect, Children } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselWrapperProps {
  children: React.ReactNode;
}

export const CarouselWrapper: React.FC<CarouselWrapperProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);

  // Không cần cardWidth nữa vì ta sẽ set grid 4 cột chuẩn bằng CSS và cuộn theo clientWidth

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 20);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  useEffect(() => {
    handleScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (current) current.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const childrenArray = Children.toArray(children);

  return (
    <div className="relative">
      {/* Nút trái */}
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-primary-500 hover:shadow-xl transition-all cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Carousel container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-5 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pt-6 pb-10 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {childrenArray.map((child, index) => (
          <div key={index} className="snap-start shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.33px)] xl:w-[calc(25%-15px)] h-full">
            {child}
          </div>
        ))}
      </div>

      {/* Nút phải */}
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-primary-500 hover:shadow-xl transition-all cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};