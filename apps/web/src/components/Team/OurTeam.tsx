"use client";

import React from "react";
import { motion } from "framer-motion";
import { teamMembers } from "@/data/team";
import TeamMemberCard from "./TeamMemberCard";

const TeamSection: React.FC = () => {
    return (
        <section id="team" className="bg-background max-w-screen-xl mx-auto px-4 pb-20">
            {/* Grid de tarjetas */}
            <motion.div 
                className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {teamMembers.map((member, index) => (
                    <TeamMemberCard
                        key={index} 
                        member={member} 
                        index={index} 
                        animation="hover" // Solo animación al pasar el ratón para la página principal
                    />
                ))}
            </motion.div>
        </section>
    );
};

export default TeamSection;