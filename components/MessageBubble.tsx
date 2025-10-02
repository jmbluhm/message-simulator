'use client';

import { motion, Variants } from 'framer-motion';
import { Message, DesignConfig, MessageContent } from '@/lib/types';

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
  const bubbleVariants: Variants = {
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

  // Render rich content
  const renderContent = () => {
    // If message has rich content, use it; otherwise fall back to text
    const content = message.content && message.content.length > 0 ? message.content : [
      { type: 'text' as const, content: message.text }
    ];

    return content.map((item: MessageContent, index: number) => {
      switch (item.type) {
        case 'text':
          // Handle basic markdown formatting
          const formattedText = item.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
          
          return (
            <span 
              key={index}
              dangerouslySetInnerHTML={{ __html: formattedText }}
              className="whitespace-pre-wrap break-words"
            />
          );
          
        case 'link':
          return (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
              style={{ color: isParty1 ? '#E3F2FD' : '#1976D2' }}
            >
              {item.content}
            </a>
          );
          
        case 'image':
          return (
            <div key={index} className="my-2">
              <img
                src={item.content}
                alt={item.alt || 'Image'}
                className="max-w-full h-auto rounded-lg block"
                style={{ 
                  maxHeight: '200px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center p-4 bg-gray-100 rounded-lg text-gray-500 text-sm">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Image failed to load
                      </div>
                    `;
                  }
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'block';
                }}
              />
            </div>
          );
          
        default:
          return <span key={index}>{item.content}</span>;
      }
    });
  };

  return (
    <motion.div
      className={`flex ${isParty1 ? 'justify-end' : 'justify-start'} mb-2`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-[75%] rounded-[18px] px-4 py-3 shadow-sm"
        style={{
          backgroundColor,
          color: textColor,
          fontSize: `${designConfig.fontSize}px`,
          fontFamily: designConfig.fontFamily,
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="leading-relaxed">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}
