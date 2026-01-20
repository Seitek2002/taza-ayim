'use client';

import { useState } from 'react';
import { Check, Clock, Sparkles, Shirt, LayoutGrid, Info } from 'lucide-react';

const Subscription = ({ dict }: { dict: any }) => {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'organization'>(
    'maintenance',
  );

  // Массив для планов абонемента
  const plans = [
    {
      time: dict?.subscription?.maintenance?.plan1?.time || '4 часа',
      price: dict?.subscription?.maintenance?.plan1?.price || '10 000',
      label: dict?.subscription?.maintenance?.plan1?.label || 'Минимум',
    },
    {
      time: dict?.subscription?.maintenance?.plan2?.time || '6 часов',
      price: dict?.subscription?.maintenance?.plan2?.price || '15 000',
      label: dict?.subscription?.maintenance?.plan2?.label || 'Популярное',
    },
    {
      time: dict?.subscription?.maintenance?.plan3?.time || '8 часов',
      price: dict?.subscription?.maintenance?.plan3?.price || '20 000',
      label: dict?.subscription?.maintenance?.plan3?.label || 'Максимум',
    },
  ];

  // Массив для комнат
  const rooms = [
    {
      room: dict?.subscription?.organization?.room1 || '1 комната',
      price: '16 000',
    },
    {
      room: dict?.subscription?.organization?.room2 || '2 комнаты',
      price: '28 000',
    },
    {
      room: dict?.subscription?.organization?.room3 || '3 комнаты',
      price: '42 000',
    },
    {
      room: dict?.subscription?.organization?.room4 || '4 комнаты',
      price: '55 000',
    },
  ];

  return (
    <section className='py-20 bg-white' id='subscription'>
      <div className='container mx-auto px-4'>
        {/* Заголовок */}
        <div className='text-center mb-12'>
          <span className='text-secondary font-bold tracking-widest uppercase text-sm'>
            {dict?.calculator?.tag}
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mt-2'>
            {dict?.subscription?.heading}
          </h2>
          <p className='text-gray-500 mt-4 max-w-2xl mx-auto'>
            {dict?.subscription?.desc}
          </p>
        </div>

        {/* Переключатель табов */}
        <div className='flex justify-center mb-12'>
          <div className='bg-gray-100 p-1 rounded-xl inline-flex'>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-6 py-3 rounded-lg text-sm md:text-base font-bold transition-all ${
                activeTab === 'maintenance'
                  ? 'bg-white text-primary shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🫧 {dict?.subscription?.tab1}
            </button>
            <button
              onClick={() => setActiveTab('organization')}
              className={`px-6 py-3 rounded-lg text-sm md:text-base font-bold transition-all ${
                activeTab === 'organization'
                  ? 'bg-white text-primary shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📦 {dict?.subscription?.tab2}
            </button>
          </div>
        </div>

        {/* Контент: Поддерживающая уборка */}
        {activeTab === 'maintenance' && (
          <div className='animate-fadeIn'>
            {/* Описание что входит */}
            <div className='grid md:grid-cols-2 gap-8 mb-12'>
              <div className='bg-light/50 p-8 rounded-3xl border border-gray-100'>
                <h3 className='text-xl font-bold text-primary mb-4 flex items-center gap-2'>
                  <Sparkles className='text-secondary' />
                  {dict?.subscription?.maintenance?.list_heading}
                </h3>
                <ul className='space-y-3'>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <li
                      key={num}
                      className='flex items-start gap-3 text-gray-700 text-sm'
                    >
                      <Check
                        size={18}
                        className='text-primary mt-0.5 shrink-0'
                      />
                      {dict?.subscription?.maintenance?.[`list_item${num}`]}
                    </li>
                  ))}
                </ul>
              </div>

              <div className='bg-light/50 p-8 rounded-3xl border border-gray-100'>
                <h3 className='text-xl font-bold text-primary mb-4 flex items-center gap-2'>
                  <Shirt className='text-secondary' />
                  {dict?.subscription?.maintenance?.textiles_heading}
                </h3>
                <ul className='space-y-3'>
                  {[1, 2, 3].map((num) => (
                    <li
                      key={num}
                      className='flex items-start gap-3 text-gray-700 text-sm'
                    >
                      <Check
                        size={18}
                        className='text-primary mt-0.5 shrink-0'
                      />
                      {dict?.subscription?.maintenance?.[`textiles_item${num}`]}
                    </li>
                  ))}
                </ul>
                <div className='mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-xs text-yellow-800 flex gap-2'>
                  <Info size={16} className='shrink-0' />
                  <p>{dict?.subscription?.maintenance?.important}</p>
                </div>
              </div>
            </div>

            {/* Цены (Абонемент) */}
            <h3 className='text-2xl font-bold text-center mb-8'>
              {dict?.subscription?.maintenance?.price_heading}
            </h3>
            <div className='grid md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white p-8 rounded-3xl border-2 transition-all hover:-translate-y-2 ${
                    idx === 1
                      ? 'border-primary shadow-xl'
                      : 'border-gray-100 shadow-lg'
                  }`}
                >
                  {idx === 1 && (
                    <span className='absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider'>
                      {plan.label}
                    </span>
                  )}
                  <div className='text-center'>
                    <div className='w-16 h-16 bg-light rounded-full flex items-center justify-center mx-auto mb-4 text-primary'>
                      <Clock size={32} />
                    </div>
                    <h4 className='text-xl font-bold text-gray-800 mb-2'>
                      {plan.time}
                    </h4>
                    <div className='text-3xl font-bold text-primary mb-6'>
                      {plan.price}{' '}
                      <span className='text-lg text-gray-400 font-normal'>
                        {dict?.calculator?.total?.currency}
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/996555000000?text=Здравствуйте, интересует абонемент на ${plan.time}`}
                      target='_blank'
                      className={`block w-full py-3 rounded-xl font-bold transition-colors ${
                        idx === 1
                          ? 'bg-primary text-white hover:bg-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {dict?.calculator?.cta?.split('~')[0]} {/* "Заказать" */}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p className='text-center text-xs text-gray-400 mt-6 max-w-2xl mx-auto'>
              {dict?.subscription?.maintenance?.footer_note}
            </p>
          </div>
        )}

        {/* Контент: Организация пространства */}
        {activeTab === 'organization' && (
          <div className='animate-fadeIn'>
            <div className='max-w-4xl mx-auto text-center mb-10'>
              <p className='text-lg text-gray-600'>
                {dict?.subscription?.organization?.desc}
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
              {rooms.map((item, idx) => (
                <div
                  key={idx}
                  className='bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all hover:-translate-y-1'
                >
                  <div className='flex items-center justify-between mb-4'>
                    <div className='bg-secondary/10 p-3 rounded-lg text-secondary'>
                      <LayoutGrid size={24} />
                    </div>
                  </div>
                  <h4 className='text-lg font-bold text-gray-800 mb-2'>
                    {item.room}
                  </h4>
                  <p className='text-2xl font-bold text-primary mb-4'>
                    {item.price} {dict?.calculator?.total?.currency}
                  </p>
                  <a
                    href={`https://wa.me/996555000000?text=Здравствуйте, интересует организация пространства: ${item.room}`}
                    target='_blank'
                    className='block w-full py-2 border-2 border-primary text-primary font-bold rounded-lg text-center hover:bg-primary hover:text-white transition-colors'
                  >
                    Выбрать
                  </a>
                </div>
              ))}
            </div>

            <div className='mt-12 bg-gray-50 p-6 md:p-8 rounded-3xl max-w-4xl mx-auto'>
              <h4 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <Info className='text-secondary' />
                {dict?.subscription?.organization?.important_heading}
              </h4>
              <ul className='grid md:grid-cols-2 gap-4 text-sm text-gray-600'>
                {[1, 2, 3, 4].map((num) => (
                  <li key={num} className='flex gap-2'>
                    <div className='w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0'></div>
                    <span>
                      {dict?.subscription?.organization?.[`condition${num}`]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Subscription;
