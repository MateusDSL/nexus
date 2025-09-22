import React, { useState } from 'react';
import './DebugPanel.css';

interface DebugPanelProps {
  n8nConfig: {
    baseUrl: string;
    webhookId: string;
  };
  isN8nEnabled: boolean;
  onTestConnection: () => Promise<boolean>;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ 
  n8nConfig, 
  isN8nEnabled, 
  onTestConnection 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult('');
    
    try {
      const isConnected = await onTestConnection();
      setTestResult(isConnected ? '✅ Conexão bem-sucedida!' : '❌ Falha na conexão');
    } catch (error) {
      setTestResult(`❌ Erro: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  const webhookUrl = `${n8nConfig.baseUrl}/webhook/${n8nConfig.webhookId}`;

  return (
    <div className="debug-panel">
      <button 
        className="debug-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Painel de Debug"
      >
        🔧 Debug
      </button>
      
      {isOpen && (
        <div className="debug-content">
          <h4>Configuração do n8n</h4>
          <div className="debug-info">
            <p><strong>Status:</strong> {isN8nEnabled ? '✅ Ativado' : '❌ Desativado'}</p>
            <p><strong>Base URL:</strong> {n8nConfig.baseUrl}</p>
            <p><strong>Webhook ID:</strong> {n8nConfig.webhookId}</p>
            <p><strong>URL Completa:</strong> <code>{webhookUrl}</code></p>
          </div>
          
          <div className="debug-actions">
            <button 
              onClick={handleTestConnection}
              disabled={isTesting}
              className="test-button"
            >
              {isTesting ? '🔄 Testando...' : '🧪 Testar Conexão'}
            </button>
            
            {testResult && (
              <div className="test-result">
                {testResult}
              </div>
            )}
          </div>
          
          <div className="debug-help">
            <h5>Como configurar:</h5>
            <ol>
              <li>Ative o workflow no n8n</li>
              <li>Verifique se a URL está correta</li>
              <li>Teste a conexão</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;

