import React from 'react';
import Image from 'next/image';
import { Gloria_Hallelujah } from 'next/font/google';
import clsx from 'clsx';
import { heroDetails } from '@/data/hero';
import CTAButton from './CTAButton';
import { siteDetails } from '@/data/siteDetails';
import { useAuth } from '@/hooks/useAuth';

const gloria = Gloria_Hallelujah({ subsets: ['latin'], weight: '400' });

const Hero: React.FC = async () => {
  const { user }  = await useAuth();
  return (
    <section className="relative flex flex-col items-center justify-center text-center pt-28 md:pt-40 pb-40 md:pb-60 px-5">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] mask-radial">
      </div>

      {/* Gradient Overlay */}
      <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]">
      </div>

      {/* Logo Background */}
      <div className="absolute inset-0 flex justify-center items-center">
      <div className="absolute inset-0 flex justify-center items-center">
   {/* Imagen de fondo para desktop */}
   <Image
     src="/images/LogoBackground.png"
     alt="Logo Background"
     width={1920}
     height={1080}
     className="hidden md:block w-full h-full object-cover"
   />

   {/* Imagen de fondo para mobile */}
   <Image
     src="/images/logobackground-mobile.png"
     alt="Logo Background Mobile"
     width={1080}
     height={1920}
     className="block md:hidden w-full h-full object-cover pt-40"
   />
</div>

      </div>

      {/* Hero Content */}
      <div className="max-w-2xl mx-auto">
        <h1 className="manrope text-4xl md:text-5xl text-foreground leading-tight relative font-light">
          Automate with{' '}
          <span className={clsx(gloria.className, 'text-black text-4xl md:text-6xl font-bold relative')}>
            {siteDetails.siteName}
            <span className="dot-container">
              <span className="dot dot1"></span>
              <span className="dot dot2"></span>
              <span className="dot dot3"></span>
            </span>
          </span>
        </h1>
        <p className="mt-4 text-foreground text-2xl text-gray-500">{heroDetails.subheading}</p>

        {/* Call To Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center sm:gap-4 w-fit mx-auto mb-6">
          <CTAButton text={ user ? 'Dashboard' : 'Get started'} url="/dashboard" variant="primary" />
          <CTAButton text="How AI can help" url="/about" variant="secondary" />
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative mx-auto z-10">
  {/* Imagen para dispositivos móviles */}
  <Image
    src="/images/ItemFlowmobile.png"
    alt="app mockup"
    width={400}
    height={105}
    quality={100}
    priority
    className="block md:hidden"
  />

  {/* Imagen para pantallas más grandes */}
  <Image
    src="/images/ItemFlow.png"
    alt="app mockup"
    width={900}
    height={237}
    quality={100}
    priority
    className="hidden md:block"
  />
</div>
    </section>
  );
};

export default Hero;
