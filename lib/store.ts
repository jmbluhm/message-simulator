import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Script, DesignConfig, PlaybackState, Message } from './types';

interface ConversationStore {
  // State
  script: Script;
  designConfig: DesignConfig;
  playbackState: PlaybackState;
  
  // Actions
  setScript: (script: Script) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  updateMessage: (id: string, message: Partial<Omit<Message, 'id'>>) => void;
  deleteMessage: (id: string) => void;
  moveMessage: (fromIndex: number, toIndex: number) => void;
  clearAllMessages: () => void;
  loadSampleScript: () => void;
  updateDesignConfig: (config: Partial<DesignConfig>) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setCurrentMessageIndex: (index: number) => void;
}

const defaultScript: Script = {
  messages: [],
  title: 'New Conversation'
};

const sampleScript: Script = {
  title: 'Sample Conversation',
  messages: [
    {
      id: '1',
      sender: 'party1',
      text: 'Hey! How are you doing today?',
      delayMs: 1000
    },
    {
      id: '2',
      sender: 'party2',
      text: 'I\'m doing great! Just finished a really interesting project. How about you?',
      delayMs: 2000
    },
    {
      id: '3',
      sender: 'party1',
      text: 'That sounds awesome! What kind of project was it?',
      delayMs: 1500
    },
    {
      id: '4',
      sender: 'party2',
      text: 'It was a conversation simulator app! I built it to help people create realistic message animations. Pretty cool, right?',
      delayMs: 3000
    },
    {
      id: '5',
      sender: 'party1',
      text: 'Wow, that\'s really impressive! I love how the typing animation makes it feel so natural.',
      delayMs: 2500
    },
    {
      id: '6',
      sender: 'party2',
      text: 'Thanks! The timing and visual effects really make a difference. Want to see how it works?',
      delayMs: 2000
    }
  ]
};

const defaultDesignConfig: DesignConfig = {
  party1Color: '#007AFF',
  party2Color: '#E5E5EA',
  backgroundColor: '#FFFFFF',
  showTyping: true,
  fontSize: 16,
  fontFamily: 'system-ui',
  aspectRatio: '9:16',
  carrierName: 'Carrier',
  frameType: 'mobile'
};

const defaultPlaybackState: PlaybackState = {
  isPlaying: false,
  currentMessageIndex: 0,
  speed: 1
};

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      // Initial state
      script: defaultScript,
      designConfig: defaultDesignConfig,
      playbackState: defaultPlaybackState,
      
      // Actions
      setScript: (script: Script) => set({ script }),
      
      addMessage: (message: Omit<Message, 'id'>) => 
        set((state) => ({
          script: {
            ...state.script,
            messages: [
              ...state.script.messages,
              { ...message, id: crypto.randomUUID() }
            ]
          }
        })),
      
      updateMessage: (id: string, messageUpdate: Partial<Omit<Message, 'id'>>) =>
        set((state) => ({
          script: {
            ...state.script,
            messages: state.script.messages.map(msg =>
              msg.id === id ? { ...msg, ...messageUpdate } : msg
            )
          }
        })),
      
      deleteMessage: (id: string) =>
        set((state) => ({
          script: {
            ...state.script,
            messages: state.script.messages.filter(msg => msg.id !== id)
          }
        })),
      
      moveMessage: (fromIndex: number, toIndex: number) =>
        set((state) => {
          const messages = [...state.script.messages];
          const [movedMessage] = messages.splice(fromIndex, 1);
          messages.splice(toIndex, 0, movedMessage);
          
          return {
            script: {
              ...state.script,
              messages
            }
          };
        }),
      
      clearAllMessages: () =>
        set((state) => ({
          script: {
            ...state.script,
            messages: []
          }
        })),
      
      loadSampleScript: () =>
        set({ script: sampleScript }),
      
      updateDesignConfig: (config: Partial<DesignConfig>) => 
        set((state) => ({
          designConfig: { ...state.designConfig, ...config }
        })),
      
      play: () => set((state) => ({
        playbackState: { ...state.playbackState, isPlaying: true }
      })),
      
      pause: () => set((state) => ({
        playbackState: { ...state.playbackState, isPlaying: false }
      })),
      
      reset: () => set({
        playbackState: { ...defaultPlaybackState, currentMessageIndex: 0 }
      }),
      
      setSpeed: (speed: number) => set((state) => ({
        playbackState: { ...state.playbackState, speed }
      })),
      
      setCurrentMessageIndex: (index: number) => set((state) => ({
        playbackState: { ...state.playbackState, currentMessageIndex: index }
      }))
    }),
    {
      name: 'conversation-store',
      partialize: (state) => ({ 
        script: state.script, 
        designConfig: state.designConfig 
      })
    }
  )
);
