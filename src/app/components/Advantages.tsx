import { Building2, ShieldCheck, Truck } from 'lucide-react';

const Advantages = ({ t }: { t: any }) => {
  return (
    <section id='advantages' className='py-20 bg-light'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16'>
          {t.advantages.heading}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition'>
            <div className='w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary'>
              <Truck size={40} />
            </div>
            <h3 className='text-xl font-bold mb-3 text-gray-900'>
              {t.advantages.cards[0].title}
            </h3>
            <p className='text-gray-600'>{t.advantages.cards[0].desc}</p>
          </div>

          <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition'>
            <div className='w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary'>
              <Building2 size={40} />
            </div>
            <h3 className='text-xl font-bold mb-3 text-gray-900'>
              {t.advantages.cards[1].title}
            </h3>
            <p className='text-gray-600'>{t.advantages.cards[1].desc}</p>
          </div>

          <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition'>
            <div className='w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary'>
              <ShieldCheck size={40} />
            </div>
            <h3 className='text-xl font-bold mb-3 text-gray-900'>
              {t.advantages.cards[2].title}
            </h3>
            <p className='text-gray-600'>{t.advantages.cards[2].desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
