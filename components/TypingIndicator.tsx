'use client';

import { motion } from 'framer-motion';
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
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  // Animation variants for individual dots
  const dotVariants = {
    bounce: {
      y: [-8, 0, -8],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className={`flex ${isParty1 ? 'justify-end' : 'justify-start'} mb-3`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="rounded-[18px] px-4 py-3 shadow-lg flex items-center gap-1"
        style={{
          backgroundColor,
          color: textColor,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Three bouncing dots */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: textColor }}
            variants={dotVariants}
            animate="bounce"
            transition={{
              delay: index * 0.15, // 150ms stagger between dots
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
