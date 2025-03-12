"use client";
import React from 'react';
import Image from 'next/image';
import { Gloria_Hallelujah } from 'next/font/google';
import clsx from 'clsx';
import { motion, Variants } from "framer-motion";
import { teamMembers } from '@/data/team';

const gloria = Gloria_Hallelujah({ subsets: ['latin'], weight: '400' });

// Reutiliza las mismas variantes que en BenefitSection
const containerVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 100
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.9,
      delayChildren: 0.2,
      staggerChildren: 0.1,
    }
  }
};

const childVariants = {
  offscreen: {
    opacity: 0,
    x: -50,
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 1,
    }
  },
};

const imageVariants = {
  offscreen: {
    opacity: 0,
    x: 50,
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 1,
    }
  },
};

const AboutUs: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="relative p-10 flex flex-col items-center justify-center text-center px-5 mb-16">
        <div className="absolute inset-0 -z-10 bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] mask-radial">
        </div>

        {/* Logo Background - Usando la misma lógica que en Hero.tsx */}
        <div className="absolute inset-0 flex justify-center items-center">
          {/* Imagen de fondo para desktop - más ancha */}
          <Image
            src="/images/LogoBackground.png"
            alt="Logo Background"
            width={1920}
            height={1080}
            className="hidden md:block w-full h-full object-cover"
          />

          {/* Imagen de fondo para mobile - más ancha */}
          <Image
            src="/images/logobackground-mobile.png"
            alt="Logo Background Mobile"
            width={1080}
            height={1920}
            className="block md:hidden w-full h-full object-cover pt-40"
          />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About <span className={clsx(gloria.className, "text-primary")}>docta</span></h1>
          <p className="text-xl text-gray-600 mb-8">
            Empowering businesses through intelligent automation solutions that streamline workflows and boost productivity.
          </p>
        </div>
      </section>

      {/* Our Story Section con Animación */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
          
          <motion.div
            className="flex flex-col md:flex-row gap-12 items-center"
            variants={containerVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
          >
            <motion.div className="md:w-1/2" variants={imageVariants}>
              <Image 
                src="/images/our-story.jpg" 
                alt="Docta team working together" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-md"
              />
            </motion.div>
            <motion.div className="md:w-1/2" variants={childVariants}>
              <p className="text-lg text-gray-600 mb-6">
                Docta was founded with a simple yet powerful vision: to make workflow automation accessible to every business, regardless of size or technical expertise.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our journey began when our four co-founders identified a common pain point across industries – businesses were spending countless hours on repetitive tasks that could be automated, but existing solutions were either too complex or too expensive for many organizations.
              </p>
              <p className="text-lg text-gray-600">
                Drawing on our diverse backgrounds in software development, AI, and business operations, we created Docta – an intuitive platform that seamlessly connects different tools and automates workflows without requiring deep technical knowledge.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission Section con Animación */}
      <section className="py-16 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
          
          <motion.div
            className="flex flex-col md:flex-row-reverse gap-12 items-center"
            variants={containerVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
          >
            <motion.div className="md:w-1/2" variants={imageVariants}>
              <Image 
                src="/images/our-mission.jpeg" 
                alt="Docta mission visualization" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-md"
              />
            </motion.div>
            <motion.div className="md:w-1/2" variants={childVariants}>
              <p className="text-lg text-gray-600 mb-6">
                At Docta, our mission is to democratize automation and help businesses of all sizes harness the power of AI to transform their operations.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that when routine tasks are automated, teams can focus on what matters most – creativity, innovation, and strategic decision-making that drives business growth.
              </p>
              <p className="text-lg text-gray-600">
                By providing intuitive tools that connect with over 177 enterprise platforms, we are enabling businesses to build seamless workflows that boost productivity and reduce operational friction.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section con tarjetas animadas y títulos centrados */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4 text-primary text-center">Accessibility</h3>
              <p className="text-gray-600">
                We believe powerful technology should be accessible to everyone, not just tech experts. We design our products to be intuitive and user-friendly.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4 text-primary text-center">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what is possible in workflow automation, adopting new technologies and approaches to solve complex problems.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4 text-primary text-center">Customer Focus</h3>
              <p className="text-gray-600">
                Our customers success is our success. We listen carefully to feedback and evolve our solutions to meet real business needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section id="team" className="py-16 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Imagen */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              </div>

              {/* Nombre y rol */}
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-foreground-accent">{member.role}</p>

              {/* Redes Sociales */}
              <div className="flex justify-center gap-4 mt-3">
                {member.socials.map((social, i) => (
                  <a key={i} href={social.link} target="_blank" rel="noopener noreferrer">
                    <Image src={social.icon} alt={social.name} width={20} height={20} className="opacity-70 hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* Join Our Journey Section con animación */}
      <section className="py-16 px-5">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Join Our Journey</h2>
          <p className="text-xl text-gray-600 mb-8">
            We are on a mission to transform how businesses work through intelligent automation. Whether you are a customer, partner, or future team member, we invite you to be part of our story.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a 
              href="#contact" 
              className="bg-primary hover:bg-primary-accent text-white px-8 py-3 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
            <motion.a 
              href="/careers" 
              className="bg-hero-background hover:bg-gray-200 text-black px-8 py-3 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Careers
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;