'use client';

import Image from 'next/image';
import { ShieldCheck, Leaf } from 'lucide-react';

const Chemicals = ({ dict }: { dict: any }) => {
  const brands = [
    {
      id: 'buzil',
      name: 'Buzil',
      country: 'Germany',
      logo: '/brands/buzil.png', // Убедись, что нашел и положил картинку сюда
      desc: dict?.chemicals?.buzil?.desc || 'Мировой лидер...',
    },
    {
      id: 'kiehl',
      name: 'Johannes KIEHL',
      country: 'Germany',
      logo: '/brands/kiehl.png', // Убедись, что нашел и положил картинку сюда
      desc: dict?.chemicals?.kiehl?.desc || 'Экологичные средства...',
    },
    {
      id: 'GRASS',
      name: 'GRASS',
      country: 'Russia',
      logo: '/brands/grass.jpg', // Убедись, что нашел и положил картинку сюда
      desc: dict?.chemicals?.kiehl?.desc || 'Экологичные средства...',
    },
  ];

  const renderFlag = (country: string) => {
    if (country === 'Germany') {
      return (
        <svg viewBox='0 0 5 3' className='w-full h-full object-cover'>
          <rect width='5' height='3' y='0' x='0' fill='#000' />
          <rect width='5' height='2' y='1' x='0' fill='#D00' />
          <rect width='5' height='1' y='2' x='0' fill='#FFCE00' />
        </svg>
      );
    }
    if (country === 'Russia') {
      return (
        <svg viewBox='0 0 9 6' className='w-full h-full object-cover'>
          <rect width='9' height='6' fill='#fff' />
          <rect width='9' height='4' y='2' fill='#0039A6' />
          <rect width='9' height='2' y='4' fill='#D52B1E' />
          {/* Тонкая рамка, чтобы белый цвет не сливался с фоном */}
          <rect
            width='9'
            height='6'
            fill='none'
            stroke='#e5e7eb'
            strokeWidth='0.5'
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <section className='py-20 bg-white' id='chemicals'>
      <div className='container mx-auto px-4'>
        {/* Заголовок */}
        <div className='text-center mb-16'>
          <span className='text-secondary font-bold tracking-widest uppercase text-sm'>
            {dict?.chemicals?.tag || 'Безопасность'}
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mt-2 max-w-3xl mx-auto'>
            {dict?.chemicals?.title || 'Профессиональная химия'}
          </h2>
          <p className='text-gray-500 mt-4 max-w-2xl mx-auto text-lg'>
            {dict?.chemicals?.desc}
          </p>
        </div>

        {/* Сетка брендов */}
        <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          {brands.map((brand) => (
            <div
              key={brand.id}
              className='flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group'
            >
              {/* Логотип */}
              {/* Уменьшил mb-6 до mb-4, чтобы название было ближе к лого */}
              <div className='relative w-48 h-24 mb-4'>
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className='object-contain'
                />
              </div>

              {/* [НОВОЕ] Название бренда */}
              <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                {brand.name}
              </h3>

              {/* Флаг и Страна */}
              <div className='flex items-center gap-2 mb-6 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100'>
                {/* Иконка флага Германии (SVG) */}
                <div className='w-5 h-5 rounded-full overflow-hidden relative'>
                  {renderFlag(brand.country)}
                </div>
                <span className='text-sm font-bold text-gray-700'>
                  {brand.country === 'Germany' ? 'Германия' : brand.country === 'Russia' ? 'Россия' : brand.country}
                </span>
              </div>

              <p className='text-gray-600 leading-relaxed'>{brand.desc}</p>
            </div>
          ))}
        </div>

        {/* Дополнительные преимущества (иконки) */}
        <div className='flex flex-wrap justify-center gap-8 mt-12 text-sm font-medium text-gray-500'>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-green-100 text-green-600 rounded-full'>
              <Leaf size={20} />
            </div>
            <span>Эко-сертификаты</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-blue-100 text-blue-600 rounded-full'>
              <ShieldCheck size={20} />
            </div>
            <span>Гипоаллергенно</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chemicals;
