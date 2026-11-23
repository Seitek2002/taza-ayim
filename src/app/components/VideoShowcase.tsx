'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import posterImage from '@/assets/posters/process.jpg';

// 720p H.264, без звука, faststart (~4.8 МБ вместо 39.7 МБ у исходника)
const VIDEO_SRC = '/video/process-720p.mp4';

const VideoShowcase = ({ dict }: { dict: any }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Пока блок не появился на экране, <video> не рендерится вовсе:
  // autoPlay игнорирует preload="none", поэтому раньше видео качалось сразу при загрузке страницы.
  const [shouldLoad, setShouldLoad] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          if (!video) {
            setReduceMotion(
              window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            );
            setShouldLoad(true);
          }
          // Вернулись к блоку — продолжаем (первый запуск делает autoPlay)
          if (video && video.paused && video.autoplay) {
            video.play().catch(() => {});
          }
        } else if (video && !video.paused) {
          // Ушли с экрана — не тратим батарею и трафик
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <section className='py-20 bg-gray-50 overflow-hidden'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto'>
          {/* Текстовая часть */}
          <div className='w-full md:w-1/2 text-center md:text-left z-10'>
            <span className='inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4'>
              Backstage
            </span>
            <h2 className='text-3xl md:text-5xl font-bold text-gray-900 mb-6'>
              {dict?.video?.title || 'Как мы работаем'}
            </h2>
            <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
              {dict?.video?.desc ||
                'Взгляните на процесс уборки изнутри. Внимание к деталям — наш главный приоритет.'}
            </p>

            {/* Стрелочка */}
            <div className='hidden md:block text-gray-400'>
              <svg
                width='100'
                height='50'
                viewBox='0 0 100 50'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path
                  d='M10 10 C 30 10, 50 40, 90 40'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeDasharray='5 5'
                />
                <path
                  d='M85 35 L 90 40 L 85 45'
                  stroke='currentColor'
                  strokeWidth='2'
                />
              </svg>
            </div>
          </div>

          {/* Видео часть */}
          <div className='w-full md:w-1/2 flex justify-center md:justify-end relative'>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-secondary/20 rounded-full blur-3xl z-0'></div>

            <div
              ref={frameRef}
              className='relative z-10 w-70 sm:w-[320px] md:w-87.5 aspect-9/16 bg-black rounded-[2.5rem] shadow-2xl border-8 border-white overflow-hidden ring-1 ring-gray-200 transform md:rotate-3 transition-transform hover:rotate-0 duration-500'
            >
              {/* Постер: обычная lazy-картинка через next/image (AVIF/WebP) */}
              <Image
                src={posterImage}
                alt={dict?.video?.title || 'Как мы работаем'}
                fill
                sizes='(max-width: 640px) 280px, 350px'
                placeholder='blur'
                className='object-cover'
              />

              {shouldLoad && (
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                  src={VIDEO_SRC}
                  autoPlay={!reduceMotion}
                  controls={reduceMotion}
                  muted
                  loop
                  playsInline
                  preload='auto'
                  aria-label={dict?.video?.title || 'Как мы работаем'}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => {
                    setIsPlaying(true);
                    setIsBuffering(false);
                  }}
                  onLoadedData={() => setIsPlaying(true)}
                  onPause={() => setIsBuffering(false)}
                />
              )}

              {isBuffering && (
                <div className='absolute inset-0 z-20 flex items-center justify-center bg-black/20 pointer-events-none'>
                  <Loader2 className='w-12 h-12 text-white animate-spin' />
                </div>
              )}

              {/* Блик поверх всего */}
              <div className='absolute top-0 right-0 w-full h-full bg-linear-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-30'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
