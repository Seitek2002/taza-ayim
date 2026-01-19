'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useCurrentLang } from '../i18n/useLang';
import { dictionaries } from '../i18n/dictionaries';

const partners = [
  {
    name: 'Sun Planet Organic',
    logo: '/partners/sun-planet-organic.png',
    // Я нашел их сайт, но проверьте, тот ли это "Sun Planet"
    link: 'https://sunplanetorganic.com/',
  },
  {
    name: 'Вавилон',
    logo: '/partners/vavilon.jpg',
    // Ссылка на их профиль (Taplink или Instagram)
    link: 'https://www.instagram.com/vavilon_eventhall?igsh=czByNmh0anR1OWpo',
  },
  {
    name: 'Алтын Булак',
    logo: '/partners/алтын-булак-пансионат.jpg',
    // Вставьте сюда ссылку на Instagram или сайт пансионата
    link: 'https://www.instagram.com/altyn.bulak.kg?igsh=aHYxeDFnMm53Z3Zu',
  },
  {
    name: 'Монарх Чайхана',
    logo: '/partners/Монарх-Чайхана.jpg',
    // Вставьте ссылку на Instagram чайханы
    link: 'https://www.instagram.com/monarch_resto?igsh=MWhqZHRwbWllc3A0',
  },
  {
    name: 'Солнечная Планета',
    logo: '/partners/Солнечная-Планета.jpg',
    // Если это тот же Sun Planet, можно продублировать ссылку, или вставить другую
    link: 'https://www.instagram.com/sunplanet63?igsh=YmJlZnVib2U4aGZ2',
  },
];

const Partners = () => {
  const lang = useCurrentLang();
  const t = useMemo(() => dictionaries[lang], [lang]);
  return (
    <section className='py-20 bg-white border-t border-gray-100'>
      <div className='container mx-auto px-4'>
        {/* Заголовок */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            {t.partners.heading}
          </h2>
          <div className='w-20 h-1.5 bg-primary mx-auto rounded-full mb-6'></div>
          <p className='text-gray-500 max-w-2xl mx-auto text-lg'>
            {t.partners.text}
          </p>
        </div>

        {/* Сетка логотипов */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center'>
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.link}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
            >
              {/* Контейнер для логотипа */}
              <div className='relative w-full h-24 mb-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500'>
                <Image
                  src={partner.logo}
                  alt={`Логотип ${partner.name}`}
                  fill
                  className='object-contain' // Логотип всегда будет вписан полностью
                  sizes='(max-width: 768px) 50vw, 20vw'
                />
              </div>

              {/* Название заведения */}
              <span className='text-center text-gray-700 font-bold text-sm md:text-base group-hover:text-primary transition-colors'>
                {partner.name}
              </span>
            </a>
          ))}
        </div>

        {/* Призыв к действию */}
        <div className='text-center mt-12'>
          <a
            href='https://wa.me/996555000000' // ЗАМЕНИТЬ НА НОМЕР КЛИЕНТКИ
            className='inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors border-b-2 border-primary/20 hover:border-secondary pb-1'
          >
            {t.partners.cta}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Partners;
