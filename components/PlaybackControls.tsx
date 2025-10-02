'use client';

import { useEffect } from 'react';
import { useConversationStore } from '@/lib/store';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge,
  MessageSquare
} from 'lucide-react';

export default function PlaybackControls() {
  const { 
    script, 
    playbackState, 
    play, 
    pause, 
    reset, 
    setSpeed 
  } = useConversationStore();

  const speeds = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' },
  ];

  const isScriptEmpty = script.messages.length === 0;
  const currentMessage = playbackState.currentMessageIndex + 1;
  const totalMessages = script.messages.length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (playbackState.isPlaying) {
            pause();
          } else if (!isScriptEmpty) {
            play();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playbackState.isPlaying, isScriptEmpty, play, pause]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={playbackState.isPlaying ? pause : play}
          disabled={isScriptEmpty}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
            ${playbackState.isPlaying 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
            }
            ${isScriptEmpty 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-105 active:scale-95'
            }
          `}
          aria-label={playbackState.isPlaying ? 'Pause conversation' : 'Play conversation'}
        >
          {playbackState.isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {playbackState.isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Reset conversation to beginning"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-gray-500" />
          <select
            value={playbackState.speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            aria-label="Playback speed"
          >
            {speeds.map((speed) => (
              <option key={speed.value} value={speed.value}>
                {speed.label}
              </option>
            ))}
          </select>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageSquare className="w-4 h-4" />
          <span>
            {totalMessages > 0 ? `${currentMessage} of ${totalMessages}` : 'No messages'}
          </span>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Space</kbd>
            Play/Pause
          </span>
        </div>
      </div>
    </div>
  );
}
