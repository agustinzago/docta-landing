"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { teamMembers } from "@/data/team";

const TeamSection: React.FC = () => {
    return (
        <section className="bg-background max-w-screen-xl mx-auto px-4 pb-20">
            {/* Grid de tarjetas */}
            <motion.div 
                className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {teamMembers.map((member, index) => (
                    <motion.div
                        key={index}
                        className="bg-white shadow-lg rounded-lg p-6 text-center"
                        whileHover={{ scale: 1.05 }}
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
            </motion.div>
        </section>
    );
};

export default TeamSection;
