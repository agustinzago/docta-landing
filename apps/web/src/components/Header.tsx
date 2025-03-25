'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
import Container from './Container';
import { menuItems } from '@/data/menuItems';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react'; // Importamos iconos de Lucide

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const router = useRouter();
    
    const { user, isAuthenticated, logout } = useAuth();
    
    const half = Math.ceil(menuItems.length / 2);
    const firstHalf = menuItems.slice(0, half);
    const secondHalf = menuItems.slice(half);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const UserButton = () => (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-9 w-9 cursor-pointer border-2 border-white/20 hover:border-white/50 transition-colors">
                    <AvatarImage 
                        src={user?.profileImage || ''} 
                        alt={user?.name || 'User'} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    // Componente para los botones de autenticación en desktop
    const AuthButtons = ({ className = "" }) => (
        <div className={`flex items-center gap-3 ${className}`}>
            <Link 
                href="/sign-in" 
                className="group flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
                <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Sign In</span>
            </Link>
            <Link 
                href="/sign-up" 
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm hover:from-indigo-500 hover:to-indigo-400 transition-colors"
            >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
            </Link>
        </div>
    );

    return (
        <header className="bg-transparent md:bg-transparent fixed md:absolute top-0 left-0 right-0 z-50 w-full">
            <Container className="!px-0">
                <nav className="bg-slate-50 md:bg-transparent shadow-md md:shadow-none mx-auto flex items-center py-3 px-5 md:py-6">
                    
                    {/* Menú Desktop (Primera mitad) */}
                    <ul className="hidden md:flex space-x-6 flex-1 justify-end items-center">
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
                        {/* Left space - UserButton para mobile */}
                        <div className="w-10 flex items-center justify-center">
                            {isAuthenticated && <UserButton />}
                        </div>
                        
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
                    <ul className="hidden md:flex space-x-6 flex-1 justify-start items-center">
                        {secondHalf.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-foreground-accent transition-colors">
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        {/* Añadir UserButton o botones de Iniciar/Registrar */}
                        <li className="ml-4">
                            {isAuthenticated ? (
                                <UserButton />
                            ) : (
                                <AuthButtons />
                            )}
                        </li>
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
                        {/* Añadir botones de inicio de sesión/registro si no está autenticado */}
                        {!isAuthenticated && (
                            <li className="pt-4 flex flex-col space-y-3">
                                <Link 
                                    href="/sign-in" 
                                    className="flex items-center justify-center gap-1.5 w-full py-2 text-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={toggleMenu}
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </Link>
                                <Link 
                                    href="/sign-up" 
                                    className="flex items-center justify-center gap-1.5 w-full py-2 text-center rounded-md bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 transition-colors" 
                                    onClick={toggleMenu}
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Sign Up</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
