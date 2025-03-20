"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ITeamMember } from "@/types";

interface TeamMemberCardProps {
  member: ITeamMember;
  index?: number;
  animation?: 'hover' | 'entrance' | 'both' | 'none';
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  index = 0, 
  animation = 'both' 
}) => {
  // Determinar las propiedades de animación según el tipo de animación solicitado
  interface AnimationProps {
    whileHover?: { scale: number };
    initial?: { opacity: number; y: number };
    whileInView?: { opacity: number; y: number };
    transition?: { duration: number; delay: number };
    viewport?: { once: boolean };
  }

  const getAnimationProps = () => {
    const props: AnimationProps = {};
    
    if (animation === 'hover' || animation === 'both') {
      props.whileHover = { scale: 1.05 };
    }
    
    if (animation === 'entrance' || animation === 'both') {
      props.initial = { opacity: 0, y: 30 };
      props.whileInView = { opacity: 1, y: 0 };
      props.transition = { duration: 0.5, delay: index * 0.1 };
      props.viewport = { once: true };
    }
    
    return props;
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 text-center"
      {...getAnimationProps()}
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
            <Image 
              src={social.icon} 
              alt={social.name} 
              width={20} 
              height={20} 
              className="opacity-70 hover:opacity-100 transition-opacity" 
            />
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;