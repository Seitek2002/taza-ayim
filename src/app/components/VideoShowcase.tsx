'use client';

const VideoShowcase = ({ dict }: { dict: any }) => {
  return (
    <section className='py-20 bg-gray-50 overflow-hidden'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto'>
          {/* Текстовая часть (Слева на ПК, Сверху на мобильном) */}
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

            {/* Декоративный элемент (стрелочка) */}
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

          {/* Видео часть (Справа на ПК) */}
          <div className='w-full md:w-1/2 flex justify-center md:justify-end relative'>
            {/* Декоративные круги на фоне */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl -z-0'></div>

            {/* Контейнер для вертикального видео (Эффект телефона) */}
            <div className='relative z-10 w-[280px] sm:w-[320px] md:w-[350px] aspect-[9/16] bg-black rounded-[2.5rem] shadow-2xl border-8 border-white overflow-hidden ring-1 ring-gray-200 transform md:rotate-3 transition-transform hover:rotate-0 duration-500'>
              <video
                className='w-full h-full object-cover'
                src='/video/process.mp4' // Убедись, что путь правильный
                poster='/video/process-poster.jpg' // Заставка
                autoPlay
                muted
                loop
                playsInline // <--- КРИТИЧЕСКИ ВАЖНО ДЛЯ IPHONE
                controls={false}
              />

              {/* Блик на экране (для красоты) */}
              <div className='absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
