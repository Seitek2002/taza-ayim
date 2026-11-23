'use client';

import { useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';

type MobileMenuProps = {
  links: { name: string; href: string }[];
  whatsappUrl: string;
  whatsappLabel: string;
};

// Единственная интерактивная часть шапки. Позиционируется относительно <header>
// (fixed), поэтому выпадающая панель встаёт ровно под шапку, как и раньше.
const MobileMenu = ({ links, whatsappUrl, whatsappLabel }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        className='text-primary p-2'
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isOpen}
        aria-controls='mobile-menu'
      >
        {isOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {isOpen && (
        <div
          id='mobile-menu'
          className='md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 h-screen pb-24 overflow-y-auto z-40'
        >
          <div className='flex flex-col p-6 gap-6'>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='text-xl font-bold text-gray-800 border-b border-gray-100 pb-4'
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <a
              href={whatsappUrl}
              className='bg-primary text-white py-4 rounded-xl text-center font-bold flex justify-center items-center gap-2 mt-4'
            >
              <Phone size={20} aria-hidden='true' />
              {whatsappLabel}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
