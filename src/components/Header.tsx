'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
import Container from './Container';
import { menuItems } from '@/data/menuItems';
import Image from 'next/image';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    // Divide menu items into two halves
    const half = Math.ceil(menuItems.length / 2);
    const firstHalf = menuItems.slice(0, half);
    const secondHalf = menuItems.slice(half);

    return (
        <header className="bg-trasparent md:bg-transparent fixed md:absolute top-0 left-0 right-0 z-50 w-full">
            <Container className="!px-0">
                <nav className="bg-slate-50 md:bg-transparent shadow-md md:shadow-none mx-auto flex items-center justify-between py-3 px-5 md:py-6">
                    
                    {/* Menú Desktop (Primera mitad) */}
                    <ul className="hidden md:flex space-x-6 flex-1 justify-end">
                        {firstHalf.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-foreground-accent transition-colors">
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Logo (Centrado en desktop y mobile) */}
                    <div className="flex justify-center flex-1">
                        <Link href="/" className="flex items-end gap-3">
                            <Image 
                                src="/images/antlogo.svg" 
                                alt="Docta Solutions Logo" 
                                width={90} 
                                height={58}
                                className="hidden md:block"
                            />
                            <Image 
                                src="/images/antlogo.svg" 
                                alt="Docta Solutions Logo" 
                                width={70} 
                                height={45}
                                className="block md:hidden"
                            />
                        </Link>
                    </div>

                    {/* Menú Desktop (Segunda mitad) */}
                    <ul className="hidden md:flex space-x-6 flex-1 justify-start">
                        {secondHalf.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-foreground-accent transition-colors">
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Botón del Menú Mobile */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="text-black focus:outline-none rounded-full w-10 h-10 flex items-center justify-center"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <HiBars3 className="h-6 w-6" aria-hidden="true" />
                            )}
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </nav>
            </Container>

            {/* Menú Mobile con transición */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div id="mobile-menu" className="md:hidden bg-white shadow-lg">
                    <ul className="flex flex-col space-y-4 pt-1 pb-6 px-6">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-primary block" onClick={toggleMenu}>
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
