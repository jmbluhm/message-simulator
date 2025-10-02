'use client';

import { motion, Variants } from 'framer-motion';
import { DesignConfig } from '@/lib/types';

interface TypingIndicatorProps {
  sender: 'party1' | 'party2';
  designConfig: DesignConfig;
}

export default function TypingIndicator({ sender, designConfig }: TypingIndicatorProps) {
  const isParty1 = sender === 'party1';
  
  // Get colors based on sender
  const backgroundColor = isParty1 ? designConfig.party1Color : designConfig.party2Color;
  const textColor = isParty1 ? '#FFFFFF' : '#000000'; // White text for party1, black for party2
  
  // Animation variants for the container
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOut cubic-bezier
      },
    },
  };

  // Create individual dot variants with proper stagger timing
  const createDotVariants = (delay: number): Variants => ({
    bounce: {
      y: [-6, 0, -6],
      transition: {
        duration: 0.6,
        delay: delay,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1], // iOS-style easing
      },
    },
  });

  return (
    <motion.div
      className={`flex ${isParty1 ? 'justify-end' : 'justify-start'} mb-2`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="rounded-[18px] px-4 py-3 shadow-sm flex items-center gap-1"
        style={{
          backgroundColor,
          color: textColor,
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Three bouncing dots with iOS-style wave animation */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: textColor }}
            variants={createDotVariants(index * 0.15)}
            animate="bounce"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
