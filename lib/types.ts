export interface Message {
  id: string;
  sender: 'party1' | 'party2';
  text: string;
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
}

export interface PlaybackState {
  isPlaying: boolean;
  currentMessageIndex: number;
  speed: number;
}
