import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gloria_Hallelujah } from 'next/font/google';
import clsx from 'clsx';

const gloria = Gloria_Hallelujah({ subsets: ['latin'], weight: '400' });

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background flex-col relative">
      {/* Background Grid - similar to Hero */}
      <div className="absolute inset-0 -z-10 bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] mask-radial">
      </div>

      {/* Gradient Overlay */}
      <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]">
      </div>

      {/* Logo Background */}
      <div className="absolute inset-0 flex justify-center items-center">
        {/* Imagen de fondo para desktop */}
        <Image
          src="/images/LogoBackground.png"
          alt="Logo Background"
          width={1920}
          height={1080}
          className="hidden md:block w-full h-full object-cover opacity-30"
        />

        {/* Imagen de fondo para mobile */}
        <Image
          src="/images/logobackground-mobile.png"
          alt="Logo Background Mobile"
          width={1080}
          height={1920}
          className="block md:hidden w-full h-full object-cover pt-40 opacity-30"
        />
      </div>

      {/* Header with Logo - Visible on all devices */}
      <div className="w-full flex justify-center pt-8 pb-4 relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/images/antlogo.png" 
            alt="Docta Logo" 
            width={60} 
            height={60} 
          />
          <span className={clsx(gloria.className, 'text-primary text-3xl font-bold')}>
            docta
          </span>
        </Link>
      </div>
      
      {/* Centered Auth Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Auth Form Container */}
          <div className="bg-card/90 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-md border border-muted bg-gradient-to-br from-slate-50 to-slate-100">
            {children}
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} docta. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;