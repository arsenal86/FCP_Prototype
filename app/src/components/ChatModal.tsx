import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { Update } from '../types';
import { continueChat } from '../geminiService';

interface ChatModalProps {
  update: Update;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ update, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const aiResponse = await continueChat(update.summary, history, input);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-1/2 h-2/3 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Ask AI about: {update.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}`} style={{ maxWidth: '80%' }}>
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
          {isLoading && <div className="my-2 p-3 rounded-lg bg-gray-100 mr-auto" style={{ maxWidth: '80%' }}><p className="text-sm">Thinking...</p></div>}
        </div>
        <div className="p-4 border-t flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button onClick={handleSend} className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-300" disabled={isLoading}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
