'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { ReactCompareSlider } from 'react-compare-slider';
import { CheckCircle2 } from 'lucide-react';
import poolBefore from '@/assets/portfolio/pool-before.jpg';
import poolAfter from '@/assets/portfolio/pool-after.jpg';
import officeBefore from '@/assets/portfolio/office-before.jpg';
import officeAfter from '@/assets/portfolio/office-after.jpg';
import flatBefore from '@/assets/portfolio/flat-before.jpg';
import flatAfter from '@/assets/portfolio/flat-after.jpg';

// Слайдер: на мобилке на всю ширину, на десктопе ⅔ от max-w-6xl (~770px)
const SLIDER_SIZES = '(max-width: 1024px) 100vw, 770px';

const SliderImage = ({ src, alt }: { src: StaticImageData; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    fill
    sizes={SLIDER_SIZES}
    placeholder='blur'
    draggable={false}
    className='object-cover select-none'
  />
);

const PortfolioGallery = ({ dict }: { dict: any }) => {
  // Собираем данные из словаря
  // Используем ?. (опциональную цепочку) на случай, если ключей пока нет в базе
  const cases = [
    {
      id: 1,
      title: dict?.portfolio?.cases?.[1]?.title || 'Чистка бассейна',
      desc: dict?.portfolio?.cases?.[1]?.desc || 'Удаление налета...',
      before: poolBefore,
      after: poolAfter,
    },
    {
      id: 2,
      title: dict?.portfolio?.cases?.[2]?.title || 'Уборка квартиры',
      desc: dict?.portfolio?.cases?.[2]?.desc || 'Глубокая чистка...',
      before: officeBefore,
      after: officeAfter,
    },
    {
      id: 3,
      title: dict?.portfolio?.cases?.[3]?.title || 'Уборка офиса',
      desc: dict?.portfolio?.cases?.[3]?.desc || 'Глубокая чистка...',
      before: flatBefore,
      after: flatAfter,
    },
  ];

  const [activeCase, setActiveCase] = useState(cases[0]);

  return (
    <section className='py-20 bg-light' id='portfolio'>
      <div className='container mx-auto px-4'>
        {/* Заголовок */}
        <div className='text-center mb-12'>
          <span className='text-secondary-dark font-bold tracking-widest uppercase text-sm'>
            {dict?.portfolio?.tag || 'Наши работы'}
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mt-2'>
            {dict?.portfolio?.title || 'До и После'}
          </h2>
          <p className='text-gray-500 mt-4 max-w-2xl mx-auto'>
            {dict?.portfolio?.desc}
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto'>
          {/* ЛЕВАЯ ЧАСТЬ: Навигация (Список работ) */}
          <div className='w-full lg:w-1/3 flex flex-col gap-4 order-2 lg:order-1'>
            {cases.map((item) => (
              <button
                key={item.id}
                type='button'
                aria-pressed={activeCase.id === item.id}
                onClick={() => setActiveCase(item)}
                className={`text-left p-4 rounded-xl transition-all duration-300 border-2 flex items-start gap-4 ${
                  activeCase.id === item.id
                    ? 'border-primary bg-white shadow-lg scale-105 z-10'
                    : 'border-transparent bg-white/50 hover:bg-white text-gray-500'
                }`}
              >
                {/* Мини-превью */}
                <div className='relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200'>
                  <Image
                    src={item.after}
                    alt=''
                    fill
                    sizes='64px'
                    className='object-cover'
                  />
                </div>

                <div>
                  <h3
                    className={`font-bold text-lg ${
                      activeCase.id === item.id
                        ? 'text-primary'
                        : 'text-gray-700'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                    {item.desc}
                  </p>
                  {activeCase.id === item.id && (
                    <div className='flex items-center gap-1 text-xs font-bold text-secondary-dark mt-2 animate-fadeIn'>
                      <CheckCircle2 size={14} />{' '}
                      {dict?.portfolio?.current || 'Сейчас на экране'}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Активный Слайдер */}
          <div className='w-full lg:w-2/3 order-1 lg:order-2'>
            <div className='relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white h-100 md:h-125'>
              <ReactCompareSlider
                key={activeCase.id}
                itemOne={
                  <SliderImage
                    src={activeCase.before}
                    alt={dict?.portfolio?.labelBefore || 'До'}
                  />
                }
                itemTwo={
                  <SliderImage
                    src={activeCase.after}
                    alt={dict?.portfolio?.labelAfter || 'После'}
                  />
                }
                position={50}
                style={{ width: '100%', height: '100%' }}
                handle={
                  <div className='w-1 h-full bg-white/80 backdrop-blur-sm relative shadow-[0_0_15px_rgba(0,0,0,0.3)]'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={2.5}
                        stroke='currentColor'
                        className='w-5 h-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
                        />
                      </svg>
                    </div>
                  </div>
                }
              />

              {/* Лейблы поверх картинки */}
              <div className='absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider'>
                {dict?.portfolio?.labelBefore || 'До'}
              </div>
              <div className='absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider'>
                {dict?.portfolio?.labelAfter || 'После'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallery;
