'use client';

import { useEffect, useState } from 'react';
import ScriptEditor from '@/components/ScriptEditor';
import DesignControls from '@/components/DesignControls';
import ConversationView from '@/components/ConversationView';
import PlaybackControls from '@/components/PlaybackControls';
import { useConversationStore } from '@/lib/store';
import { 
  MessageSquare, 
  Palette, 
  Download, 
  Upload,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { script, loadSampleScript } = useConversationStore();
  const [activeTab, setActiveTab] = useState<'editor' | 'design'>('editor');
  const [isLoading, setIsLoading] = useState(true);

  // Load sample script if no script exists
  useEffect(() => {
    if (script.messages.length === 0) {
      loadSampleScript();
    }
    setIsLoading(false);
  }, [script.messages.length, loadSampleScript]);

  const exportScript = () => {
    const dataStr = JSON.stringify(script, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${script.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importScript = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedScript = JSON.parse(e.target?.result as string);
        useConversationStore.getState().setScript(importedScript);
      } catch (error) {
        alert('Invalid script file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Conversation Simulator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Conversation Simulator</h1>
                <p className="text-sm text-gray-600">Create realistic message animations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={loadSampleScript}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Load sample conversation"
              >
                <Sparkles className="w-4 h-4" />
                Sample
              </button>
              
              <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importScript}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={exportScript}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Export conversation script"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Left Panel - Controls */}
          <div className="xl:w-2/5 w-full flex flex-col overflow-y-auto xl:pr-6 bg-gray-200 rounded-xl p-4">
            {/* Mobile Tabs */}
            <div className="xl:hidden bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'editor'
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Script Editor
                </button>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'design'
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  Design
                </button>
              </div>
            </div>

            {/* Desktop/Active Tab Content */}
            <div className="flex-1 flex flex-col space-y-6">
              {(activeTab === 'editor' || window.innerWidth >= 1280) && (
                <ScriptEditor />
              )}
              {(activeTab === 'design' || window.innerWidth >= 1280) && (
                <DesignControls />
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden xl:block w-0.5 bg-gray-400 mx-6"></div>

          {/* Right Panel - Conversation View */}
          <div className="xl:w-3/5 w-full flex flex-col">
            <div className="flex-1 min-h-0 mb-4">
              <ConversationView className="h-full" />
            </div>
            
            <PlaybackControls />
          </div>
        </div>
      </main>
    </div>
  );
}
