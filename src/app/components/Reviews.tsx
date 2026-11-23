'use client';

import { useRef, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Play,
  Loader2,
} from 'lucide-react';
import poster1 from '@/assets/posters/review-1.jpg';
import poster2 from '@/assets/posters/review-2.jpg';
import poster3 from '@/assets/posters/review-3.jpg';

type ReviewItem =
  | { type: 'image'; src: string }
  // Видео: 960p H.264 + AAC, faststart (moov в начале — старт без докачки хвоста файла)
  | { type: 'video'; src: string; poster: StaticImageData };

const reviewsList: ReviewItem[] = [
  // ФОТО
  { type: 'image', src: '/reviews/item-1.jpg' },
  { type: 'image', src: '/reviews/item-2.jpg' },

  // ВИДЕО
  { type: 'video', src: '/reviews/review-1.mp4', poster: poster1 },
  { type: 'video', src: '/reviews/review-2.mp4', poster: poster2 },
  { type: 'video', src: '/reviews/review-3.mp4', poster: poster3 },

  { type: 'image', src: '/reviews/item-3.jpg' },
  { type: 'image', src: '/reviews/item-4.jpg' },
];

// Карточка: w-65 (260px) на мобилке, w-75 (300px) с md
const CARD_SIZES = '(max-width: 768px) 260px, 300px';

const Reviews = ({ dict }: { dict: any }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // ID видео, которое ДОЛЖНО играть
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(
    null,
  );

  // ID видео, которое сейчас ГРУЗИТСЯ (буферизация)
  const [bufferingVideoIndex, setBufferingVideoIndex] = useState<number | null>(
    null,
  );

  // Видео, которые уже запускали: у них постер больше не нужен
  const [startedVideos, setStartedVideos] = useState<number[]>([]);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  const toggleVideo = (idx: number) => {
    const videoElement = videoRefs.current[idx];
    if (!videoElement) return;

    if (videoElement.paused) {
      // 1. Пауза всех остальных
      videoRefs.current.forEach((vid) => {
        if (vid && vid !== videoElement) vid.pause();
      });

      // 2. Сразу показываем лоадер, пока видео стартует
      setPlayingVideoIndex(idx);
      setBufferingVideoIndex(idx);
      setStartedVideos((prev) => (prev.includes(idx) ? prev : [...prev, idx]));

      // 3. Запуск текущего (ошибка — например, браузер запретил воспроизведение)
      videoElement.play().catch((error) => {
        console.error('Ошибка воспроизведения:', error);
        setPlayingVideoIndex(null);
        setBufferingVideoIndex(null);
      });
    } else {
      videoElement.pause();
      setPlayingVideoIndex(null);
      setBufferingVideoIndex(null);
    }
  };

  return (
    <section className='py-20 bg-white border-t border-gray-100' id='reviews'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <span className='text-secondary-dark font-bold tracking-widest uppercase text-sm'>
            {dict?.reviews?.tag || 'Отзывы'}
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mt-2'>
            {dict?.reviews?.title || 'Что говорят клиенты'}
          </h2>
        </div>

        <div className='relative max-w-6xl mx-auto group'>
          {/* Кнопки навигации */}
          <button
            type='button'
            onClick={() => scroll('left')}
            aria-label='Предыдущие отзывы'
            className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary hover:bg-gray-50 transition opacity-0 group-hover:opacity-100 hidden md:flex'
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type='button'
            onClick={() => scroll('right')}
            aria-label='Следующие отзывы'
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
                key={item.src}
                className='snap-center shrink-0 w-65 md:w-75 h-125 md:h-150 relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-900'
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={`Отзыв клиента ${idx + 1}`}
                    fill
                    sizes={CARD_SIZES}
                    className='object-cover'
                  />
                ) : (
                  <div className='relative w-full h-full group/video cursor-pointer'>
                    <video
                      ref={(el) => {
                        videoRefs.current[idx] = el;
                      }}
                      preload='none'
                      src={item.src}
                      className='w-full h-full object-cover'
                      playsInline
                      loop
                      aria-label={`Видеоотзыв клиента ${idx + 1}`}
                      // 1. Когда данных мало и видео тупит -> Показываем лоадер
                      onWaiting={() => setBufferingVideoIndex(idx)}
                      // 2. Когда данные есть и видео пошло -> Скрываем лоадер
                      onPlaying={() => setBufferingVideoIndex(null)}
                      // 3. Если поставили на паузу -> Скрываем всё
                      onPause={() => {
                        setPlayingVideoIndex(null);
                        setBufferingVideoIndex(null);
                      }}
                      onClick={() => toggleVideo(idx)}
                    />

                    {/* Постер — lazy next/image, пока видео ни разу не запускали */}
                    {!startedVideos.includes(idx) && (
                      <Image
                        src={item.poster}
                        alt=''
                        fill
                        sizes={CARD_SIZES}
                        placeholder='blur'
                        className='object-cover pointer-events-none'
                      />
                    )}

                    {/* ЛОАДЕР: видео должно играть, но буферизуется */}
                    {playingVideoIndex === idx &&
                      bufferingVideoIndex === idx && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-20'>
                          <Loader2 className='w-12 h-12 text-white animate-spin' />
                        </div>
                      )}

                    {/* КНОПКА PLAY: только если видео НЕ играет */}
                    {playingVideoIndex !== idx && (
                      <button
                        type='button'
                        aria-label={`Смотреть видеоотзыв ${idx + 1}`}
                        className='absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover/video:bg-black/40 z-10'
                        onClick={() => toggleVideo(idx)}
                      >
                        <span className='w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl transition-transform transform group-hover/video:scale-110'>
                          <Play
                            fill='white'
                            className='ml-1 w-8 h-8 text-white'
                          />
                        </span>
                      </button>
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
            <Instagram size={20} aria-hidden='true' />
            {dict?.reviews?.linkText || 'Смотреть все отзывы в Instagram'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
