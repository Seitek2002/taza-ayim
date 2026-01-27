'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const VideoShowcase = ({ dict }: { dict: any }) => {
  const [isLoading, setIsLoading] = useState(true);

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

            <div className='relative z-10 w-70 sm:w-[320px] md:w-87.5 aspect-9/16 bg-black rounded-[2.5rem] shadow-2xl border-8 border-white overflow-hidden ring-1 ring-gray-200 transform md:rotate-3 transition-transform hover:rotate-0 duration-500'>
              <video
                className='w-full h-full object-cover'
                src='/video/process.mp4'
                poster='/video/process-poster.jpg'
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                // --- ЛОГИКА ЛОАДЕРА ---
                // Когда видео буферизируется (интернет медленный)
                onWaiting={() => setIsLoading(true)}
                // Когда видео реально начало играть
                onPlaying={() => setIsLoading(false)}
                // Когда данные первого кадра загружены (подстраховка)
                onLoadedData={() => setIsLoading(false)}
              />

              {/* САМ ЛОАДЕР */}
              {isLoading && (
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
