import Image, { type StaticImageData } from 'next/image';
import { Clock } from 'lucide-react';
import maintenanceImage from '@/assets/services/maintenance.jpg';

const Services = ({ t }: { t: any }) => {
  const whatsappLink = 'https://wa.me/996709058182';

  // TODO: три фото ниже взяты с чужих сайтов (хотлинк) — лучше заменить своими.
  // Пока они проходят через next/image: ресайз, AVIF/WebP, lazy-loading.
  const services: {
    id: number;
    title: string;
    time: string;
    desc: string;
    image: string | StaticImageData;
  }[] = [
    {
      id: 1,
      title: t?.services?.items?.[1]?.title || 'БАЗОВАЯ УБОРКА',
      time: t?.services?.items?.[1]?.time || '1.5-2 часа',
      desc: t?.services?.items?.[1]?.desc || 'Утренняя или вечерняя...',
      image:
        'https://service-cleaning.ru/wp-content/uploads/2021/01/general-ub-600.jpg',
    },
    {
      id: 2,
      title: t?.services?.items?.[2]?.title || 'ПОДДЕРЖИВАЮЩАЯ',
      time: t?.services?.items?.[2]?.time || '6-8 часов',
      desc: t?.services?.items?.[2]?.desc || 'Специалисты в течение...',
      // Было фото с avatars.mds.yandex.net, которое отдавало 404 (битая картинка).
      image: maintenanceImage,
    },
    {
      id: 3,
      title: t?.services?.items?.[3]?.title || 'ГЕНЕРАЛЬНАЯ УБОРКА',
      time: t?.services?.items?.[3]?.time || '12-24 часов',
      desc: t?.services?.items?.[3]?.desc || 'Тщательная чистка...',
      image:
        'https://cleaning54.ru/wp-content/uploads/2021/12/myte-okon-akciya-cleaning54.jpg',
    },
    {
      id: 4,
      title: t?.services?.items?.[4]?.title || 'ПОСЛЕСТРОИТЕЛЬНАЯ',
      time: t?.services?.items?.[4]?.time || '12-24 часов',
      desc: t?.services?.items?.[4]?.desc || 'Удаление пятен...',
      image:
        'https://expert-cleaning.com/wp-content/uploads/2023/04/posle-remonta.jpg',
    },
  ];

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
              <div className='relative h-48 w-full bg-gray-200 overflow-hidden'>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-110'
                />

                {/* Время поверх картинки */}
                <div className='absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm z-10'>
                  <Clock size={14} aria-hidden='true' /> {service.time}
                </div>
              </div>

              <div className='p-8 flex flex-col grow'>
                <h4 className='text-xl font-extrabold text-primary mb-3 group-hover:text-secondary transition-colors uppercase'>
                  {service.title}
                </h4>
                <p className='text-gray-600 text-sm mb-8 grow leading-relaxed'>
                  {service.desc}
                </p>
                <a
                  href={whatsappLink}
                  className='w-full py-3 rounded-xl border-2 border-primary text-primary font-bold text-center hover:bg-primary hover:text-white transition-all mt-auto block'
                >
                  {t.services.order}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
