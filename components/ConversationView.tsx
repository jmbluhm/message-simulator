'use client';

import { useRef, useState, useEffect } from 'react';
import { useConversationStore } from '@/lib/store';
import { useConversationPlayer } from '@/hooks/useConversationPlayer';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ConversationViewProps {
  className?: string;
}

export default function ConversationView({ className = '' }: ConversationViewProps) {
  const { script, designConfig, playbackState } = useConversationStore();
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Ensure component is hydrated before rendering to prevent hydration mismatches
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  const { displayedMessages, isTyping, typingSender } = useConversationPlayer({
    script,
    designConfig,
    playbackState
  });

  // Calculate aspect ratio styles
  const getAspectRatioStyle = () => {
    const [width, height] = designConfig.aspectRatio.split(':').map(Number);
    const aspectRatio = width / height;
    return {
      aspectRatio: aspectRatio.toString(),
      maxHeight: '80vh',
    };
  };

  // Render the messages content (shared between frame types)
  const renderMessagesContent = () => (
    <>
      {/* Messages Container */}
      <div className={`${designConfig.frameType === 'mobile' ? 'pt-16 pb-4 px-4' : 'p-4'} h-full overflow-y-auto`}>
        <div className="space-y-2 min-h-full">
          {displayedMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              designConfig={designConfig}
              sender={message.sender}
            />
          ))}
          
          {/* Typing Indicator */}
          {isTyping && typingSender && (
            <TypingIndicator
              sender={typingSender}
              designConfig={designConfig}
            />
          )}
        </div>
      </div>

      {/* Empty State */}
      {displayedMessages.length === 0 && !isTyping && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Ready to start</p>
            <p className="text-sm">Click play to begin the conversation</p>
          </div>
        </div>
      )}
    </>
  );

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {designConfig.frameType === 'mobile' ? (
        /* Mock Phone Container */
        <div 
          className="relative mx-auto bg-black rounded-[2.5rem] p-2 shadow-2xl"
          style={getAspectRatioStyle()}
        >
          {/* Mock Phone Screen */}
          <div 
            className="relative w-full h-full rounded-[2rem] overflow-hidden"
            style={{ backgroundColor: designConfig.backgroundColor }}
          >
            {/* Mock Phone Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-black/5 backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="ml-2 text-xs">{designConfig.carrierName}</span>
                </div>
                <div className="text-sm font-semibold">9:41</div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="w-4 h-2 border border-gray-400 rounded-sm ml-1">
                    <div className="w-3 h-1.5 bg-green-500 rounded-sm m-0.5"></div>
                  </div>
                </div>
              </div>
            </div>

            {renderMessagesContent()}
          </div>
        </div>
      ) : (
        /* No Frame - Direct Content */
        <div 
          className="relative w-full h-full overflow-hidden rounded-lg border border-gray-200"
          style={{ 
            backgroundColor: designConfig.backgroundColor,
            ...getAspectRatioStyle()
          }}
        >
          {renderMessagesContent()}
        </div>
      )}
    </div>
  );
}
