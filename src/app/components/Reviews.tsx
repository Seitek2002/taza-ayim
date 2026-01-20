'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';

// Убедись, что названия файлов совпадают с теми, что ты положил в папку public/reviews
const reviewsList = [
  '/reviews/item-1.jpg',
  '/reviews/item-2.jpg',
  '/reviews/item-3.jpg',
  '/reviews/item-4.jpg',
  // Добавь сюда столько, сколько нужно
];

const Reviews = ({ dict }: { dict: any }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // На сколько пикселей скроллить
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className='py-20 bg-white border-t border-gray-100' id='reviews'>
      <div className='container mx-auto px-4'>
        {/* Заголовок */}
        <div className='text-center mb-12'>
          <span className='text-secondary font-bold tracking-widest uppercase text-sm'>
            {dict?.reviews?.tag || 'Отзывы'}
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mt-2'>
            {dict?.reviews?.title || 'Что говорят клиенты'}
          </h2>
        </div>

        {/* Слайдер */}
        <div className='relative max-w-6xl mx-auto group'>
          {/* Кнопки навигации (видны только на компьютере) */}
          <button
            onClick={() => scroll('left')}
            className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary hover:bg-gray-50 transition opacity-0 group-hover:opacity-100 hidden md:flex'
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary hover:bg-gray-50 transition opacity-0 group-hover:opacity-100 hidden md:flex'
          >
            <ChevronRight size={24} />
          </button>

          {/* Контейнер скролла */}
          <div
            ref={scrollRef}
            className='flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar px-4'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviewsList.map((src, idx) => (
              <div
                key={idx}
                className='snap-center shrink-0 w-65 md:w-75 h-125 md:h-150 relative rounded-2xl overflow-hidden shadow-lg border border-gray-100'
              >
                <Image
                  src={src}
                  alt={`Отзыв клиента ${idx + 1}`}
                  fill
                  className='object-cover'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ссылка на Instagram */}
        <div className='text-center mt-8'>
          <a
            href='https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDg3MTY1OTgyNTAwMDcy?igsh=MTFpb3FmMGlyZzd4ZA%3D%3D'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors border-b-2 border-primary/20 hover:border-secondary pb-1 text-lg'
          >
            <Instagram size={20} />
            {dict?.reviews?.linkText || 'Смотреть все отзывы в Instagram'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
