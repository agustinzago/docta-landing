'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
import Container from './Container';
import { menuItems } from '@/data/menuItems';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    // Divide menu items into two halves
    const half = Math.ceil(menuItems.length / 2);
    const firstHalf = menuItems.slice(0, half);
    const secondHalf = menuItems.slice(half);

    return (
        <header className="bg-transparent md:bg-transparent fixed md:absolute top-0 left-0 right-0 z-50 w-full">
            <Container className="!px-0">
                <nav className="bg-slate-50 md:bg-transparent shadow-md md:shadow-none mx-auto flex items-center py-3 px-5 md:py-6">
                    
                    {/* Menú Desktop (Primera mitad) */}
                    <ul className="hidden md:flex space-x-6 flex-1 justify-end">
                        {firstHalf.map(item => (
                            <li key={item.text}>
                                <Link 
                                href={item.url}
                                className="text-foreground hover:text-foreground-accent transition-colors"
                                >
                                {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile: Container with flex structure */}
                    <div className="md:hidden flex items-center w-full">
                        {/* Left space for balance */}
                        <div className="w-10"></div>
                        
                        {/* Logo centered */}
                        <div className="flex-1 flex justify-center">
                            <Link href="/" className="flex items-center">
                                <Image 
                                    src="/images/antlogo.svg" 
                                    alt="Docta Solutions Logo" 
                                    width={70} 
                                    height={45}
                                />
                            </Link>
                        </div>
                        
                        {/* Menu button on right */}
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

                    {/* Desktop logo */}
                    <div className="hidden md:flex justify-center flex-1">
                        <Link href="/" className="flex items-end gap-3">
                            <Image 
                                src="/images/antlogo.svg" 
                                alt="Docta Solutions Logo" 
                                width={90} 
                                height={58}
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
                <div id="mobile-menu" className="md:hidden bg-slate-50 shadow-lg">
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
            <UserButton />
        </header>
    );
};

export default Header;
