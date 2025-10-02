'use client';

import { useState } from 'react';
import { useConversationStore } from '@/lib/store';
import { Message, MessageContent } from '@/lib/types';
import RichTextEditor from './RichTextEditor';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  User, 
  Users,
  Clock,
  MessageSquare,
  RotateCcw
} from 'lucide-react';

export default function ScriptEditor() {
  const { 
    script, 
    addMessage, 
    updateMessage, 
    deleteMessage, 
    moveMessage, 
    clearAllMessages 
  } = useConversationStore();

  const [formData, setFormData] = useState({
    sender: 'party1' as 'party1' | 'party2',
    text: '',
    content: [] as MessageContent[],
    delayMs: 1000
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    sender: 'party1' as 'party1' | 'party2',
    text: '',
    content: [] as MessageContent[],
    delayMs: 1000
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Check if we have either text or rich content
    const hasText = formData.text.trim();
    const hasContent = formData.content.length > 0;
    
    if (!hasText && !hasContent) {
      setError('Message text cannot be empty');
      return;
    }

    // Calculate total text length for validation
    const totalTextLength = formData.content.reduce((acc, item) => acc + item.content.length, 0) + formData.text.length;
    if (totalTextLength > 2000) {
      setError('Message text is too long (max 2000 characters)');
      return;
    }

    if (formData.delayMs < 0) {
      setError('Delay cannot be negative');
      return;
    }

    try {
      addMessage({
        sender: formData.sender,
        text: formData.text.trim(),
        content: formData.content.length > 0 ? formData.content : undefined,
        delayMs: formData.delayMs
      });

      setFormData({
        sender: 'party1',
        text: '',
        content: [],
        delayMs: 1000
      });
    } catch (err) {
      setError('Failed to add message. Please try again.');
    }
  };

  const handleEdit = (message: Message) => {
    setEditingId(message.id);
    setEditData({
      sender: message.sender,
      text: message.text,
      content: message.content || [],
      delayMs: message.delayMs
    });
  };

  const handleSaveEdit = () => {
    const hasText = editData.text.trim();
    const hasContent = editData.content.length > 0;
    
    if ((!hasText && !hasContent) || !editingId) return;

    updateMessage(editingId, {
      sender: editData.sender,
      text: editData.text.trim(),
      content: editData.content.length > 0 ? editData.content : undefined,
      delayMs: editData.delayMs
    });

    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < script.messages.length) {
      moveMessage(index, newIndex);
    }
  };

  const getSenderIcon = (sender: 'party1' | 'party2') => {
    return sender === 'party1' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />;
  };

  const getSenderColor = (sender: 'party1' | 'party2') => {
    return sender === 'party1' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Script Editor</h1>
        <button
          onClick={clearAllMessages}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Add Message Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Message
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender
              </label>
              <select
                value={formData.sender}
                onChange={(e) => setFormData({ ...formData, sender: e.target.value as 'party1' | 'party2' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select message sender"
              >
                <option value="party1">Party 1</option>
                <option value="party2">Party 2</option>
              </select>
            </div>

            {/* Delay Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay (seconds)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.delayMs / 1000}
                  onChange={(e) => setFormData({ ...formData, delayMs: parseFloat(e.target.value) * 1000 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!formData.text.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Message
              </button>
            </div>
          </div>

          {/* Message Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Text
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Enter your message..."
            />
          </div>
        </form>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Messages ({script.messages.length})
          </h2>
        </div>

        {script.messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Add your first message above to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {script.messages.map((message, index) => (
              <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                {editingId === message.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sender
                        </label>
                        <select
                          value={editData.sender}
                          onChange={(e) => setEditData({ ...editData, sender: e.target.value as 'party1' | 'party2' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="party1">Party 1</option>
                          <option value="party2">Party 2</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delay (seconds)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={editData.delayMs / 1000}
                          onChange={(e) => setEditData({ ...editData, delayMs: parseFloat(e.target.value) * 1000 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message Text
                      </label>
                      <RichTextEditor
                        value={editData.content}
                        onChange={(content) => setEditData({ ...editData, content })}
                        placeholder="Enter your message..."
                      />
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start gap-4">
                    {/* Move Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === script.messages.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getSenderColor(message.sender)}`}>
                          {getSenderIcon(message.sender)}
                          {message.sender === 'party1' ? 'Party 1' : 'Party 2'}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {message.delayMs / 1000}s delay
                        </div>
                      </div>
                      <div className="text-gray-900">
                        {message.content && message.content.length > 0 ? (
                          message.content.map((item, index) => {
                            switch (item.type) {
                              case 'text':
                                return (
                                  <span key={index} className="whitespace-pre-wrap">
                                    {item.content}
                                  </span>
                                );
                              case 'link':
                                return (
                                  <span key={index} className="text-blue-600 underline">
                                    [{item.content}]
                                  </span>
                                );
                              case 'image':
                                return (
                                  <span key={index} className="text-gray-500 italic">
                                    [Image: {item.alt || 'image'}]
                                  </span>
                                );
                              default:
                                return <span key={index}>{item.content}</span>;
                            }
                          })
                        ) : (
                          <span className="whitespace-pre-wrap">{message.text}</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(message)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit message"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
