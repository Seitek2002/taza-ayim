'use client';

import React, { useState, useEffect } from 'react';
import {
  Calculator as CalcIcon,
  Check,
  Truck,
  Sofa,
  Sparkles,
  Building,
} from 'lucide-react';

// --- КОНСТАНТЫ ЦЕН ---
const PRICES = {
  cleaning: {
    wet: 60,
    maintenance: 70,
    general: 90,
    renovation: 100,
    construction: 110,
    emergency: 150,
  },
  dryCleaning: {
    sofa: 650, // Берем среднее/минимальное
    chair: 250,
  },
  facade: {
    base: 100, // Акция с автовышкой
    minArea: 100, // Минимальный объем для цены 100с
  },
  truck: {
    hour: 1500,
    minHours: 2,
  },
};

const Calculator = () => {
  const [activeTab, setActiveTab] = useState<
    'cleaning' | 'dry' | 'facade' | 'truck'
  >('cleaning');
  const [total, setTotal] = useState(0);

  // Состояния для Уборки
  const [area, setArea] = useState(50);
  const [cleaningType, setCleaningType] =
    useState<keyof typeof PRICES.cleaning>('general');

  // Состояния для Химчистки
  const [sofas, setSofas] = useState(1);
  const [chairs, setChairs] = useState(0);

  // Состояния для Фасада
  const [facadeArea, setFacadeArea] = useState(100);

  // Состояния для Автовышки
  const [truckHours, setTruckHours] = useState(2);

  // Логика подсчета
  useEffect(() => {
    let result = 0;

    switch (activeTab) {
      case 'cleaning':
        result = area * PRICES.cleaning[cleaningType];
        break;
      case 'dry':
        result =
          sofas * PRICES.dryCleaning.sofa + chairs * PRICES.dryCleaning.chair;
        break;
      case 'facade':
        // Если объем меньше 100м2, цена может быть выше, но по ТЗ ставим акцент на 100с
        result = facadeArea * PRICES.facade.base;
        break;
      case 'truck':
        result = truckHours * PRICES.truck.hour;
        break;
    }
    setTotal(result);
  }, [activeTab, area, cleaningType, sofas, chairs, facadeArea, truckHours]);

  // Формирование сообщения для WhatsApp
  const getWhatsAppLink = () => {
    let text = `Здравствуйте! Хочу заказать услугу:\n`;
    if (activeTab === 'cleaning')
      text += `🧹 Уборка: ${cleaningTypesNames[cleaningType]}, ${area} м²`;
    if (activeTab === 'dry')
      text += `🛋 Химчистка: Диваны (${sofas}), Стулья (${chairs})`;
    if (activeTab === 'facade')
      text += `🏢 Мойка фасада/окон: ${facadeArea} м²`;
    if (activeTab === 'truck') text += `🚛 Аренда автовышки: ${truckHours} ч`;

    text += `\n💰 Примерный расчет: ${total} сом`;
    return `https://wa.me/996555000000?text=${encodeURIComponent(text)}`; // ЗАМЕНИТЬ НОМЕР
  };

  const cleaningTypesNames = {
    wet: 'Влажная уборка',
    maintenance: 'Поддерживающая',
    general: 'Генеральная',
    renovation: 'После ремонта',
    construction: 'После стройки',
    emergency: 'После ЧП (пожар/потоп)',
  };

  return (
    <section className='py-20 bg-white' id='calculator'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <span className='text-secondary font-bold tracking-widest uppercase text-sm'>
            Цены
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mt-2'>
            Рассчитайте стоимость
          </h2>
          <p className='text-gray-500 mt-4'>
            Выберите тип услуги, чтобы получить предварительный расчет
          </p>
        </div>

        <div className='max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'>
          {/* Табы переключения */}
          <div className='grid grid-cols-2 md:grid-cols-4 border-b'>
            <button
              onClick={() => setActiveTab('cleaning')}
              className={`p-4 md:p-6 flex flex-col items-center gap-2 transition-colors ${activeTab === 'cleaning' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <Sparkles size={24} />
              <span className='font-bold text-sm'>Уборка</span>
            </button>
            <button
              onClick={() => setActiveTab('dry')}
              className={`p-4 md:p-6 flex flex-col items-center gap-2 transition-colors ${activeTab === 'dry' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <Sofa size={24} />
              <span className='font-bold text-sm'>Химчистка</span>
            </button>
            <button
              onClick={() => setActiveTab('facade')}
              className={`p-4 md:p-6 flex flex-col items-center gap-2 transition-colors ${activeTab === 'facade' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <Building size={24} />
              <span className='font-bold text-sm'>Фасады</span>
            </button>
            <button
              onClick={() => setActiveTab('truck')}
              className={`p-4 md:p-6 flex flex-col items-center gap-2 transition-colors ${activeTab === 'truck' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <Truck size={24} />
              <span className='font-bold text-sm'>Автовышка</span>
            </button>
          </div>

          {/* Тело калькулятора */}
          <div className='p-6 md:p-10 bg-light/30'>
            {/* 1. УБОРКА */}
            {activeTab === 'cleaning' && (
              <div className='space-y-8 animate-fadeIn'>
                <div>
                  <label className='block text-gray-700 font-bold mb-3'>
                    Тип уборки
                  </label>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {Object.entries(cleaningTypesNames).map(([key, name]) => (
                      <button
                        key={key}
                        onClick={() => setCleaningType(key as any)}
                        className={`py-3 px-4 rounded-xl text-left text-sm font-medium transition-all border ${
                          cleaningType === key
                            ? 'border-secondary bg-secondary/10 text-primary shadow-sm ring-1 ring-secondary'
                            : 'border-gray-200 bg-white hover:border-secondary/50'
                        }`}
                      >
                        <div className='flex justify-between items-center'>
                          {name}
                          {cleaningType === key && (
                            <Check size={16} className='text-secondary' />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className='flex justify-between mb-2'>
                    <label className='text-gray-700 font-bold'>
                      Площадь помещения
                    </label>
                    <span className='text-primary font-bold text-lg'>
                      {area} м²
                    </span>
                  </div>
                  <input
                    type='range'
                    min='20'
                    max='500'
                    step='5'
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary'
                  />
                  <div className='flex justify-between text-xs text-gray-400 mt-2'>
                    <span>20 м²</span>
                    <span>500 м²</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ХИМЧИСТКА */}
            {activeTab === 'dry' && (
              <div className='space-y-8 animate-fadeIn'>
                <div className='grid md:grid-cols-2 gap-8'>
                  <div className='bg-white p-6 rounded-2xl border border-gray-100'>
                    <label className='block text-gray-700 font-bold mb-4'>
                      Диваны (посадочных мест)
                    </label>
                    <div className='flex items-center justify-between'>
                      <button
                        onClick={() => setSofas(Math.max(0, sofas - 1))}
                        className='w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl text-primary'
                      >
                        -
                      </button>
                      <span className='text-2xl font-bold text-gray-800'>
                        {sofas}
                      </span>
                      <button
                        onClick={() => setSofas(sofas + 1)}
                        className='w-10 h-10 rounded-full bg-primary text-white hover:bg-green-700 font-bold text-xl'
                      >
                        +
                      </button>
                    </div>
                    <p className='text-xs text-gray-400 mt-3 text-center'>
                      ~650 сом/место
                    </p>
                  </div>

                  <div className='bg-white p-6 rounded-2xl border border-gray-100'>
                    <label className='block text-gray-700 font-bold mb-4'>
                      Стулья / Кресла
                    </label>
                    <div className='flex items-center justify-between'>
                      <button
                        onClick={() => setChairs(Math.max(0, chairs - 1))}
                        className='w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl text-primary'
                      >
                        -
                      </button>
                      <span className='text-2xl font-bold text-gray-800'>
                        {chairs}
                      </span>
                      <button
                        onClick={() => setChairs(chairs + 1)}
                        className='w-10 h-10 rounded-full bg-primary text-white hover:bg-green-700 font-bold text-xl'
                      >
                        +
                      </button>
                    </div>
                    <p className='text-xs text-gray-400 mt-3 text-center'>
                      ~250 сом/шт
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ФАСАДЫ */}
            {activeTab === 'facade' && (
              <div className='space-y-6 animate-fadeIn'>
                <div className='bg-secondary/10 border border-secondary p-4 rounded-xl flex gap-3 items-start'>
                  <Truck className='text-secondary shrink-0 mt-1' />
                  <div>
                    <h4 className='font-bold text-secondary'>
                      Специальное предложение!
                    </h4>
                    <p className='text-sm text-gray-600'>
                      При заказе мойки фасадов — автовышка включена в стоимость.
                      Цена всего 100 сом/м².
                    </p>
                  </div>
                </div>

                <div>
                  <div className='flex justify-between mb-2'>
                    <label className='text-gray-700 font-bold'>
                      Площадь фасада/окон
                    </label>
                    <span className='text-primary font-bold text-lg'>
                      {facadeArea} м²
                    </span>
                  </div>
                  <input
                    type='range'
                    min='100' // Минимальный выезд по ТЗ
                    max='1000'
                    step='10'
                    value={facadeArea}
                    onChange={(e) => setFacadeArea(Number(e.target.value))}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary'
                  />
                  <div className='flex justify-between text-xs text-gray-400 mt-2'>
                    <span>100 м² (мин)</span>
                    <span>1000 м²</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. АВТОВЫШКА */}
            {activeTab === 'truck' && (
              <div className='space-y-6 animate-fadeIn'>
                <div className='bg-white p-6 rounded-2xl border border-gray-100 text-center'>
                  <label className='block text-gray-700 font-bold mb-4'>
                    Время аренды (часов)
                  </label>
                  <div className='flex items-center justify-center gap-6'>
                    <button
                      onClick={() => setTruckHours(Math.max(2, truckHours - 1))}
                      className='w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl text-primary'
                    >
                      -
                    </button>
                    <span className='text-4xl font-bold text-gray-800'>
                      {truckHours}
                    </span>
                    <button
                      onClick={() => setTruckHours(truckHours + 1)}
                      className='w-12 h-12 rounded-full bg-primary text-white hover:bg-green-700 font-bold text-xl'
                    >
                      +
                    </button>
                  </div>
                  <p className='text-sm text-gray-500 mt-4'>
                    Минимальный заказ — 2 часа
                  </p>
                </div>
              </div>
            )}

            {/* ИТОГ */}
            <div className='mt-10 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6'>
              <div>
                <p className='text-gray-500 text-sm mb-1'>
                  Примерная стоимость:
                </p>
                <div className='text-4xl font-bold text-primary'>
                  {total.toLocaleString()}{' '}
                  <span className='text-2xl text-gray-400'>сом</span>
                </div>
                <p className='text-xs text-gray-400 mt-2 max-w-xs'>
                  *Окончательная стоимость зависит от степени загрязнения и
                  удаленности объекта. Требуется осмотр специалиста.
                </p>
              </div>

              <a
                href={getWhatsAppLink()}
                target='_blank'
                rel='noreferrer'
                className='bg-primary hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-primary/30 flex items-center gap-2 transition-transform hover:-translate-y-1 w-full md:w-auto justify-center'
              >
                <CalcIcon size={20} />
                <span>Заказать за ~{total} сом</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
