import React from 'react';
import './ChatHeader.css';

interface ChatHeaderProps {
  isConnected: boolean;
  agentName?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isConnected, 
  agentName = "Agente IA" 
}) => {
  return (
    <div className="chat-header">
      <div className="chat-header__content">
        <div className="chat-header__avatar">
          🤖
        </div>
        <div className="chat-header__info">
          <h3 className="chat-header__name">{agentName}</h3>
          <div className="chat-header__status">
            <div className={`status-indicator ${isConnected ? 'status-indicator--online' : 'status-indicator--offline'}`}></div>
            <span className="status-text">
              {isConnected ? 'Online' : 'Conectando...'}
            </span>
          </div>
        </div>
      </div>
      <div className="chat-header__actions">
        <button className="chat-header__button" title="Configurações">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

