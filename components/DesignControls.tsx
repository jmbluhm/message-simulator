'use client';

import { useState } from 'react';
import { useConversationStore } from '@/lib/store';
import { 
  Palette, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Type,
  Smartphone,
  Eye,
  Wifi,
  Monitor
} from 'lucide-react';

export default function DesignControls() {
  const { designConfig, updateDesignConfig } = useConversationStore();
  const [isOpen, setIsOpen] = useState(false);

  const fontFamilies = [
    { value: 'system-ui', label: 'System' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: 'Comic Sans MS, cursive', label: 'Comic Sans' },
  ];

  const aspectRatios = [
    { value: '16:9', label: '16:9 (Landscape)' },
    { value: '9:16', label: '9:16 (Portrait)' },
    { value: '1:1', label: '1:1 (Square)' },
    { value: '4:5', label: '4:5 (Instagram)' },
  ];

  const frameTypes = [
    { value: 'mobile', label: 'Mobile Phone' },
    { value: 'none', label: 'No Frame' },
  ];

  const resetToDefaults = () => {
    updateDesignConfig({
      party1Color: '#007AFF',
      party2Color: '#E5E5EA',
      backgroundColor: '#FFFFFF',
      showTyping: true,
      fontSize: 16,
      fontFamily: 'system-ui',
      aspectRatio: '9:16',
      carrierName: 'Carrier',
      frameType: 'none'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Design Controls</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-6">
          {/* Colors Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Colors
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Party 1 Color */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Party 1 Bubble Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={designConfig.party1Color}
                    onChange={(e) => updateDesignConfig({ party1Color: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designConfig.party1Color}
                    onChange={(e) => updateDesignConfig({ party1Color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder="#007AFF"
                  />
                </div>
              </div>

              {/* Party 2 Color */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Party 2 Bubble Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={designConfig.party2Color}
                    onChange={(e) => updateDesignConfig({ party2Color: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designConfig.party2Color}
                    onChange={(e) => updateDesignConfig({ party2Color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder="#E5E5EA"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={designConfig.backgroundColor}
                    onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designConfig.backgroundColor}
                    onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Typography
            </h3>
            
            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Font Size: {designConfig.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={designConfig.fontSize}
                  onChange={(e) => updateDesignConfig({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>12px</span>
                  <span>24px</span>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Font Family
                </label>
                <select
                  value={designConfig.fontFamily}
                  onChange={(e) => updateDesignConfig({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Layout Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Layout
            </h3>
            
            <div className="space-y-4">
              {/* Frame Type */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Display Frame
                  </div>
                </label>
                <select
                  value={designConfig.frameType}
                  onChange={(e) => updateDesignConfig({ frameType: e.target.value as 'mobile' | 'none' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {frameTypes.map((frame) => (
                    <option key={frame.value} value={frame.value}>
                      {frame.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Carrier Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    Carrier Name
                  </div>
                </label>
                <input
                  type="text"
                  value={designConfig.carrierName}
                  onChange={(e) => updateDesignConfig({ carrierName: e.target.value })}
                  placeholder="Carrier"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Aspect Ratio
                </label>
                <select
                  value={designConfig.aspectRatio}
                  onChange={(e) => updateDesignConfig({ aspectRatio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {aspectRatios.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Typing Animation */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Eye className="w-4 h-4" />
                  Show Typing Animation
                </label>
                <input
                  type="checkbox"
                  checked={designConfig.showTyping}
                  onChange={(e) => updateDesignConfig({ showTyping: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={resetToDefaults}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
