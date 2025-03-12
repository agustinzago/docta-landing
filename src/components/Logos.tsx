"use client";

import React from "react";
import Image from "next/image";
import { logos } from "@/data/logos";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Importa los estilos de Swiper
import "swiper/css";
import "swiper/css/autoplay";

const Logos: React.FC = () => {
    return (
        <section id="logos" className="py-20 bg-background max-w-screen-xl mx-auto px-4">
            <p className="text-lg font-medium text-center mb-6">
                Providing automation for <span className="text-primary">150+ enterprise tools</span>, including <span className="text-primary">Jira, Google, Teams</span>, and more, enabling seamless workflows.
            </p>

            {/* Carrusel de logos */}
            <Swiper
                slidesPerView={4}
                spaceBetween={10}
                loop={true}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                }}
                centeredSlides={true}
                speed={1000}
                modules={[Autoplay]}
                breakpoints={{
                    480: { slidesPerView: 3, spaceBetween: 20 },
                    640: { slidesPerView: 4, spaceBetween: 30 },
                    768: { slidesPerView: 5, spaceBetween: 40 },
                    1024: { slidesPerView: 6, spaceBetween: 50 },
                }}
                className="w-full flex items-center opacity-50"
            >
                {logos.map((logo) => (
                    <SwiperSlide key={logo.name} className="flex items-center justify-center">
                        <Image
                            src={logo.svg}
                            alt={logo.name}
                            width={logo.width}
                            height={logo.height}
                            className="w-auto h-12 sm:h-16"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Logos;
