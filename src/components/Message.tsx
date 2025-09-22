import React from 'react';
import { Message as MessageType } from '../types/chat';
import './Message.css';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message ${isUser ? 'message--user' : 'message--agent'}`}>
      <div className="message__content">
        <div className="message__avatar">
          {isUser ? '👤' : '🤖'}
        </div>
        <div className="message__bubble">
          <div className="message__text">
            {message.isTyping ? (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              message.text
            )}
          </div>
          <div className="message__timestamp">
            {message.timestamp.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

