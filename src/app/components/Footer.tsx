import { Phone, MapPin, Instagram } from 'lucide-react';
import Image from 'next/image';

export const Footer = ({ dict }: { dict: any }) => {
  return (
    <footer id='contacts' className='bg-primary text-white pt-16 pb-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-12'>
          {/* Инфо */}
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-white p-1 rounded-full'>
                <Image src={'/logo.svg'} width={50} height={50} alt={'logo'} />
              </div>
              <span className='text-2xl font-bold'>Таза Айым</span>
            </div>
            <p className='text-white/80 mb-6 leading-relaxed'>
              {dict.footer.aboutText}
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h3 className='text-xl font-bold mb-6 border-b border-white/20 pb-2 inline-block'>
              {dict.footer.contacts}
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-center gap-3'>
                <Phone className='text-white' />
                <a
                  href='tel:+996559554225'
                  className='hover:text-secondary transition'
                >
                  +996559554225
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='text-white' />
                <a
                  href='tel:+996509554225'
                  className='hover:text-secondary transition'
                >
                  +996509554225
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <MapPin className='text-white' />
                <span>{dict.footer.address}</span>
              </li>
              <li className='flex items-center gap-3'>
                <Instagram className='text-white' />
                <a
                  href='https://www.instagram.com/taza_aiym'
                  target='_blank'
                  className='hover:text-secondary transition'
                >
                  @taza_aiym
                </a>
              </li>
            </ul>
          </div>

          {/* Навигация */}
          {/* <div>
            <h3 className='text-xl font-bold mb-6 border-b border-white/20 pb-2 inline-block'>
              {dict.footer.menu}
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link href='#about' className='hover:text-secondary transition'>
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href='#services'
                  className='hover:text-secondary transition'
                >
                  {dict.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href='#advantages'
                  className='hover:text-secondary transition'
                >
                  {dict.nav.advantages}
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        <div className='border-t border-white/10 pt-8 text-center text-sm text-white/60'>
          <p>
            &copy; {new Date().getFullYear()} Таза Айым Клининг.{' '}
            {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};
