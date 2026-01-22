'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Instagram, Play } from 'lucide-react';

type ReviewItem = {
  type: 'image' | 'video';
  src: string;
  poster?: string; // Опционально, если вдруг захочешь поставить красивую фотку
};

const reviewsList: ReviewItem[] = [
  // ФОТО
  { type: 'image', src: '/reviews/item-1.jpg' },
  { type: 'image', src: '/reviews/item-2.jpg' },

  // ВИДЕО
  { type: 'video', src: '/reviews/video-1.MP4' }, // Без постера (будет первый кадр + иконка)
  { type: 'video', src: '/reviews/video-2.MP4' },
  { type: 'video', src: '/reviews/video-3.MP4' }, // Можно без постера

  { type: 'image', src: '/reviews/item-3.jpg' },
  { type: 'image', src: '/reviews/item-4.jpg' },
];

const Reviews = ({ dict }: { dict: any }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(
    null,
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleVideo = (idx: number, videoElement: HTMLVideoElement) => {
    if (videoElement.paused) {
      // Пауза всех остальных видео (чтобы не было каши из звуков)
      document.querySelectorAll('video').forEach((vid) => {
        if (vid !== videoElement) vid.pause();
      });

      videoElement.play();
      setPlayingVideoIndex(idx);
    } else {
      videoElement.pause();
      setPlayingVideoIndex(null);
    }
  };

  return (
    <section className='py-20 bg-white border-t border-gray-100' id='reviews'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <span className='text-secondary font-bold tracking-widest uppercase text-sm'>
            {dict?.reviews?.tag || 'Отзывы'}
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mt-2'>
            {dict?.reviews?.title || 'Что говорят клиенты'}
          </h2>
        </div>

        <div className='relative max-w-6xl mx-auto group'>
          {/* Кнопки навигации */}
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
            {reviewsList.map((item, idx) => (
              <div
                key={idx}
                className='snap-center shrink-0 w-65 md:w-75 h-125 md:h-150 relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-900'
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={`Отзыв ${idx}`}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='relative w-full h-full group/video cursor-pointer'>
                    <video
                      src={item.src}
                      // Если постера нет, видео просто покажет 1-й кадр.
                      // А наша иконка Play будет сверху.
                      poster={item.poster}
                      className='w-full h-full object-cover'
                      playsInline
                      loop
                      onClick={(e) => toggleVideo(idx, e.currentTarget)}
                      // Когда видео заканчивается или ставится на паузу через нативные контролы (на всякий случай)
                      onPause={() => setPlayingVideoIndex(null)}
                      onPlay={() => setPlayingVideoIndex(idx)}
                    />

                    {/* --- ВОТ ТВОЙ "ПОСТЕР" ИЗ ИКОНКИ --- */}
                    {/* Показываем этот блок, если видео НЕ играет */}
                    {playingVideoIndex !== idx && (
                      <div
                        className='absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover/video:bg-black/40'
                        onClick={(e) => {
                          // Пробрасываем клик на видео, чтобы оно запустилось
                          const video = e.currentTarget
                            .previousElementSibling as HTMLVideoElement;
                          toggleVideo(idx, video);
                        }}
                      >
                        {/* Сама кнопка Play */}
                        <div className='w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl transition-transform transform group-hover/video:scale-110'>
                          <Play
                            fill='white'
                            className='ml-1 w-8 h-8 text-white'
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

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
