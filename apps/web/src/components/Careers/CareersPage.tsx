"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gloria_Hallelujah } from 'next/font/google';
import { motion } from "framer-motion";
import clsx from 'clsx';

const gloria = Gloria_Hallelujah({ subsets: ['latin'], weight: '400' });

const CareersPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="relative p-10 flex flex-col items-center justify-center text-center px-5 mb-16">
        <div className="absolute inset-0 -z-10 bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] mask-radial">
        </div>

        {/* Logo Background */}
        <div className="absolute inset-0 flex justify-center items-center">
          <Image
            src="/images/LogoBackground.png"
            alt="Logo Background"
            width={1920}
            height={1080}
            className="hidden md:block w-full h-full object-cover"
          />
          <Image
            src="/images/logobackground-mobile.png"
            alt="Logo Background Mobile"
            width={1080}
            height={1920}
            className="block md:hidden w-full h-full object-cover pt-40"
          />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join <span className={clsx(gloria.className, "text-primary")}>docta</span></h1>
          <p className="text-xl text-gray-600 mb-8">
            Be part of the team that is revolutionizing workflow automation
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image 
              src="/images/robot-waiting.jpeg" 
              alt="Robot waiting" 
              width={300} 
              height={300} 
              className="mx-auto mb-8"
            />
            
            <h2 className="text-3xl font-bold mb-6">Our Robots Are Still Warming Up!</h2>
            
            <p className="text-xl text-gray-600 mb-6">
              We are busy teaching our robots how to automate workflows, so we do not have any job openings <span className="italic">just yet</span>.
            </p>
            
            <p className="text-xl text-gray-600 mb-8">
              But do not worry! While our AI assistants are learning, we are preparing exciting roles for creative humans like you.
            </p>
            
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Stay in the Loop</h3>
              <p className="text-lg mb-6">
                Have questions or want to express interest in future opportunities?
              </p>
              <p className="text-lg mb-4">
                Drop us a line at:
              </p>
              <motion.a 
                href="mailto:careers@docta.com"
                className="text-xl font-medium text-primary hover:text-primary-accent transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                careers@docta.com
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      
      {/* CTA Section */}
      <section className="py-16 px-5">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Reserve Your Spot?</h2>
          <p className="text-xl text-gray-600 mb-8">
            While our job board is still under construction, you can get on our radar for future opportunities.
          </p>
          
          <motion.a 
            href="mailto:careers@docta.com" 
            className="inline-flex items-center bg-primary hover:bg-primary-accent text-white px-8 py-3 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Our Talent Team
          </motion.a>
          
          <p className="mt-6 text-gray-500">
            Or browse our <Link href="/about" className="text-primary hover:text-primary-accent transition-colors">About Us</Link> page to learn more about who we are.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default CareersPage;