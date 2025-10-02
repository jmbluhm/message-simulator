'use client';

import { motion } from 'framer-motion';
import { Message, DesignConfig } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  designConfig: DesignConfig;
  sender: 'party1' | 'party2';
}

export default function MessageBubble({ message, designConfig, sender }: MessageBubbleProps) {
  const isParty1 = sender === 'party1';
  
  // Get colors based on sender
  const backgroundColor = isParty1 ? designConfig.party1Color : designConfig.party2Color;
  const textColor = isParty1 ? '#FFFFFF' : '#000000'; // White text for party1, black for party2
  
  // Animation variants
  const bubbleVariants = {
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

  return (
    <motion.div
      className={`flex ${isParty1 ? 'justify-end' : 'justify-start'} mb-3`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-[70%] rounded-[18px] px-4 py-3 shadow-lg"
        style={{
          backgroundColor,
          color: textColor,
          fontSize: `${designConfig.fontSize}px`,
          fontFamily: designConfig.fontFamily,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {message.text}
        </p>
      </motion.div>
    </motion.div>
  );
}
