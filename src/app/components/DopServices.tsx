import { CheckCircle2 } from 'lucide-react';

const DopServices = ({ t }: { t: any }) => {
  const whatsappLink = 'https://wa.me/996559554225';

  return (
    <section className='py-20 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='bg-primary rounded-4xl p-8 md:p-16 text-white relative overflow-hidden shadow-2xl'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl'></div>

          <div className='grid md:grid-cols-2 gap-12 relative z-10 items-center'>
            <div>
              <h3 className='text-3xl md:text-4xl font-bold mb-6'>
                {t.extra.heading}
              </h3>
              <p className='text-white/90 text-lg mb-8 leading-relaxed'>
                {t.extra.desc}
              </p>
              <a
                href={whatsappLink}
                className='inline-flex items-center gap-2 bg-white text-primary font-bold py-4 px-8 rounded-full hover:bg-secondary hover:text-white transition shadow-lg'
              >
                {t.extra.cta}
              </a>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {(Object.values(t.extra.items) as string[]).map(
                (item: string, idx: number) => (
                  <div
                    key={idx}
                    className='flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition cursor-default'
                  >
                    <CheckCircle2
                      className='text-secondary shrink-0'
                      size={20}
                    />
                    <span className='font-medium'>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DopServices;
