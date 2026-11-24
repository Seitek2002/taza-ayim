import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { ServiceView } from '@/lib/site-content';

// Услуги приходят из админки («Услуги»), см. src/lib/site-content.ts.
// Пока у услуги нет своего фото, показывается временная картинка.
const Services = ({ t, services }: { t: any; services: ServiceView[] }) => {
  const whatsappLink = 'https://wa.me/996709058182';

  if (!services.length) return null;

  return (
    <section id='services' className='py-20 bg-light'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-primary font-bold tracking-widest uppercase mb-2'>
            {t.services.sectionTag}
          </h2>
          <h3 className='text-3xl md:text-4xl font-bold text-gray-900'>
            {t.services.sectionTitle}
          </h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {services.map((service) => (
            <div
              key={service.id}
              className='bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col border border-gray-100 group overflow-hidden'
            >
              {/* Блок с изображением */}
              <div className='relative h-48 w-full bg-light overflow-hidden'>
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    className='object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                )}

                {/* Время поверх картинки */}
                {service.time && (
                  <div className='absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm z-10'>
                    <Clock size={14} aria-hidden='true' /> {service.time}
                  </div>
                )}
              </div>

              <div className='p-8 flex flex-col grow'>
                <h4 className='text-xl font-extrabold text-primary mb-3 group-hover:text-secondary transition-colors uppercase'>
                  {/* Если у услуги есть своя страница — название ведёт на неё */}
                  {service.href ? (
                    <a href={service.href}>{service.title}</a>
                  ) : (
                    service.title
                  )}
                </h4>
                <p className='text-gray-600 text-sm mb-8 grow leading-relaxed'>
                  {service.desc}
                </p>
                <div className='mt-auto flex flex-col gap-2'>
                  {service.href && (
                    <a
                      href={service.href}
                      className='w-full py-3 rounded-xl bg-primary text-white font-bold text-center hover:bg-green-700 transition-all block'
                    >
                      {t.servicePage?.more || 'Подробнее'}
                    </a>
                  )}
                  <a
                    href={whatsappLink}
                    className='w-full py-3 rounded-xl border-2 border-primary text-primary font-bold text-center hover:bg-primary hover:text-white transition-all block'
                  >
                    {t.services.order}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
