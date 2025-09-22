import React from 'react';
import ChatContainer from './components/ChatContainer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="App__container">
        <div className="App__header">
          <h1 className="App__title">Nexus Chat</h1>
          <p className="App__subtitle">Interface de chat para agente IA via n8n</p>
        </div>
        <ChatContainer />
      </div>
    </div>
  );
};

export default App;

