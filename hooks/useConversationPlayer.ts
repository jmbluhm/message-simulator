'use client';

import { useState, useEffect, useRef } from 'react';
import { Script, DesignConfig, PlaybackState, Message } from '@/lib/types';

interface UseConversationPlayerProps {
  script: Script;
  designConfig: DesignConfig;
  playbackState: PlaybackState;
}

interface UseConversationPlayerReturn {
  displayedMessages: Message[];
  isTyping: boolean;
  typingSender: 'party1' | 'party2' | null;
}

export function useConversationPlayer({
  script,
  designConfig,
  playbackState
}: UseConversationPlayerProps): UseConversationPlayerReturn {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState<'party1' | 'party2' | null>(null);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const currentMessageIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  // Calculate typing duration based on message content
  const calculateTypingDuration = (message: Message): number => {
    let textLength = 0;
    
    // If message has rich content, calculate length from content
    if (message.content && message.content.length > 0) {
      textLength = message.content
        .filter(item => item.type === 'text')
        .reduce((total, item) => total + (item.content?.length || 0), 0);
    } else if (message.text) {
      // Fall back to text property
      textLength = message.text.length;
    }
    
    // For images or other non-text content, use a fixed duration
    if (textLength === 0) {
      return 1000; // 1 second for images/other content
    }
    
    return Math.max(textLength * 50, 500); // Minimum 500ms, 50ms per character
  };

  // Process a single message with delay and typing
  const processMessage = (messageIndex: number) => {
    if (messageIndex >= script.messages.length) {
      // End of script
      isPlayingRef.current = false;
      return;
    }

    const message = script.messages[messageIndex];
    const adjustedDelay = message.delayMs / playbackState.speed;

    // Wait for the delay before showing the message
    const delayTimeout = setTimeout(() => {
      if (!isPlayingRef.current) return;

      // Show typing indicator if enabled
      if (designConfig.showTyping) {
        const typingDuration = calculateTypingDuration(message) / playbackState.speed;
        
        setIsTyping(true);
        setTypingSender(message.sender);

        // Show typing indicator
        const typingTimeout = setTimeout(() => {
          if (!isPlayingRef.current) return;

          // Hide typing indicator and show message
          setIsTyping(false);
          setTypingSender(null);
          
          setDisplayedMessages(prev => [...prev, message]);
          currentMessageIndexRef.current = messageIndex + 1;
          
          // Process next message
          processMessage(messageIndex + 1);
        }, typingDuration);

        timeoutsRef.current.push(typingTimeout);
      } else {
        // No typing indicator, show message immediately
        setDisplayedMessages(prev => [...prev, message]);
        currentMessageIndexRef.current = messageIndex + 1;
        
        // Process next message
        processMessage(messageIndex + 1);
      }
    }, adjustedDelay);

    timeoutsRef.current.push(delayTimeout);
  };

  // Start playback from current position
  const startPlayback = () => {
    if (isPlayingRef.current) return;
    
    isPlayingRef.current = true;
    const startIndex = currentMessageIndexRef.current;
    
    if (startIndex < script.messages.length) {
      processMessage(startIndex);
    }
  };

  // Stop playback
  const stopPlayback = () => {
    isPlayingRef.current = false;
    clearAllTimeouts();
    setIsTyping(false);
    setTypingSender(null);
  };

  // Reset playback
  const resetPlayback = () => {
    stopPlayback();
    setDisplayedMessages([]);
    currentMessageIndexRef.current = 0;
  };

  // Single effect to handle all state changes
  useEffect(() => {
    // Handle play/pause state changes
    if (playbackState.isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
  }, [playbackState.isPlaying]);

  // Handle current message index changes (for seeking)
  useEffect(() => {
    if (playbackState.currentMessageIndex !== currentMessageIndexRef.current) {
      stopPlayback();
      currentMessageIndexRef.current = playbackState.currentMessageIndex;
      
      // If reset to 0, clear all displayed messages
      if (playbackState.currentMessageIndex === 0) {
        setDisplayedMessages([]);
      } else {
        setDisplayedMessages(script.messages.slice(0, playbackState.currentMessageIndex));
      }
    }
  }, [playbackState.currentMessageIndex, script.messages]);

  // Handle speed changes - restart current message with new timing
  useEffect(() => {
    if (isPlayingRef.current && currentMessageIndexRef.current > 0) {
      // Restart from current position with new speed
      const currentIndex = currentMessageIndexRef.current;
      stopPlayback();
      setDisplayedMessages(script.messages.slice(0, currentIndex));
      currentMessageIndexRef.current = currentIndex;
      
      if (playbackState.isPlaying) {
        startPlayback();
      }
    }
  }, [playbackState.speed, playbackState.isPlaying, script.messages]);

  // Reset when script changes
  useEffect(() => {
    resetPlayback();
  }, [script.messages.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  return {
    displayedMessages,
    isTyping,
    typingSender
  };
}