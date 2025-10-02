'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageContent } from '@/lib/types';
import { 
  Bold, 
  Italic, 
  Link, 
  Image, 
  Type,
  X
} from 'lucide-react';

interface RichTextEditorProps {
  value: MessageContent[];
  onChange: (content: MessageContent[]) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter your message...",
  className = ""
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Convert content array to display text
  const displayText = value.map(item => {
    switch (item.type) {
      case 'text':
        return item.content;
      case 'link':
        return `[${item.content}](${item.url})`;
      case 'image':
        return `![${item.alt || 'image'}](${item.content})`;
      default:
        return item.content;
    }
  }).join('');

  // Parse display text back to content array
  const parseTextToContent = (text: string): MessageContent[] => {
    if (!text.trim()) return [];
    
    // Simple parsing - in a real app you'd want more sophisticated parsing
    const parts = text.split(/(\[.*?\]\(.*?\)|!\[.*?\]\(.*?\))/);
    const content: MessageContent[] = [];
    
    for (const part of parts) {
      if (!part) continue;
      
      // Check for links [text](url)
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        content.push({
          type: 'link',
          content: linkMatch[1],
          url: linkMatch[2]
        });
        continue;
      }
      
      // Check for images ![alt](url)
      const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (imageMatch) {
        content.push({
          type: 'image',
          content: imageMatch[2],
          alt: imageMatch[1]
        });
        continue;
      }
      
      // Regular text
      if (part.trim()) {
        content.push({
          type: 'text',
          content: part
        });
      }
    }
    
    return content;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const content = parseTextToContent(text);
    onChange(content);
  };

  const insertLink = () => {
    if (linkText.trim() && linkUrl.trim()) {
      const newContent: MessageContent = {
        type: 'link',
        content: linkText.trim(),
        url: linkUrl.trim()
      };
      
      const currentText = displayText;
      const linkMarkdown = `[${linkText.trim()}](${linkUrl.trim()})`;
      const newText = currentText + (currentText ? ' ' : '') + linkMarkdown;
      
      onChange(parseTextToContent(newText));
      setLinkText('');
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      const newContent: MessageContent = {
        type: 'image',
        content: imageUrl.trim(),
        alt: imageAlt.trim() || 'image'
      };
      
      const currentText = displayText;
      const imageMarkdown = `![${imageAlt.trim() || 'image'}](${imageUrl.trim()})`;
      const newText = currentText + (currentText ? ' ' : '') + imageMarkdown;
      
      onChange(parseTextToContent(newText));
      setImageUrl('');
      setImageAlt('');
      setShowImageDialog(false);
    }
  };

  const formatText = (format: 'bold' | 'italic') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;
    
    const formattedText = format === 'bold' ? `**${selectedText}**` : `*${selectedText}*`;
    const newText = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    onChange(parseTextToContent(newText));
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + (format === 'bold' ? 2 : 1), end + (format === 'bold' ? 2 : 1));
    }, 0);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => setShowLinkDialog(true)}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Add Link"
        >
          <Link className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageDialog(true)}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Add Image"
        >
          <Image className="w-4 h-4" />
        </button>
      </div>

      {/* Text Editor */}
      <textarea
        ref={textareaRef}
        value={displayText}
        onChange={handleTextChange}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Link className="w-5 h-5" />
                Add Link
              </h3>
              <button
                onClick={() => setShowLinkDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={insertLink}
                disabled={!linkText.trim() || !linkUrl.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Link
              </button>
              <button
                onClick={() => setShowLinkDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Image className="w-5 h-5" />
                Add Image
              </h3>
              <button
                onClick={() => setShowImageDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Description of the image"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={insertImage}
                disabled={!imageUrl.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Image
              </button>
              <button
                onClick={() => setShowImageDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
