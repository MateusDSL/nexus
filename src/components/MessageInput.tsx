import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Digite sua mensagem..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="message-input__container">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="message-input__textarea"
          rows={1}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="message-input__button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;

