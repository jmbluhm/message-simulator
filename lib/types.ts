export interface MessageContent {
  type: 'text' | 'link' | 'image';
  content: string;
  url?: string; // for links
  alt?: string; // for images
}

export interface Message {
  id: string;
  sender: 'party1' | 'party2';
  text: string; // Keep for backward compatibility
  content?: MessageContent[]; // New rich content
  delayMs: number;
}

export interface Script {
  messages: Message[];
  title: string;
}

export interface DesignConfig {
  party1Color: string;
  party2Color: string;
  backgroundColor: string;
  showTyping: boolean;
  fontSize: number;
  fontFamily: string;
  aspectRatio: string;
  carrierName: string;
  frameType: 'mobile' | 'none';
}

export interface PlaybackState {
  isPlaying: boolean;
  currentMessageIndex: number;
  speed: number;
}
