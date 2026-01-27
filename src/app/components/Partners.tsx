import Image from 'next/image';

// Принимаем словарь как пропс
const Partners = ({ dict }: { dict: any }) => {
  const partners = [
    {
      name: 'Sun Planet Organic',
      logo: '/partners/sun-planet-organic.png',
      link: 'https://sunplanetorganic.com/',
    },
    {
      name: 'Вавилон',
      logo: '/partners/vavilon.jpg',
      link: 'https://www.instagram.com/vavilon_eventhall?igsh=czByNmh0anR1OWpo',
    },
    {
      name: 'Алтын Булак',
      logo: '/partners/алтын-булак-пансионат.jpg',
      link: 'https://www.instagram.com/altyn.bulak.kg?igsh=aHYxeDFnMm53Z3Zu',
    },
    {
      name: 'Монарх Чайхана',
      logo: '/partners/Монарх-Чайхана.jpg',
      link: 'https://www.instagram.com/monarch_resto?igsh=MWhqZHRwbWllc3A0',
    },
    {
      name: 'Armada',
      logo: '/partners/armada.jpg',
      link: 'https://www.instagram.com/armada.kg312?igsh=bnFhMmVvcnh2anZq',
    },
  ];

  return (
    <section className='py-20 bg-white border-t border-gray-100'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            {dict.partners.heading}
          </h2>
          <div className='w-20 h-1.5 bg-primary mx-auto rounded-full mb-6'></div>
          <p className='text-gray-500 max-w-2xl mx-auto text-lg'>
            {dict.partners.text}
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center'>
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.link}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
            >
              <div className='relative w-full h-24 mb-4'>
                <Image
                  src={partner.logo}
                  alt={`Логотип ${partner.name}`}
                  fill
                  className='object-contain'
                  sizes='(max-width: 768px) 50vw, 20vw'
                />
              </div>
              <span className='text-center text-gray-700 font-bold text-sm md:text-base group-hover:text-primary transition-colors'>
                {partner.name}
              </span>
            </a>
          ))}
        </div>

        <div className='text-center mt-12'>
          <a
            href='https://wa.me/996559554225'
            className='inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors border-b-2 border-primary/20 hover:border-secondary pb-1'
          >
            {dict.partners.cta}
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
