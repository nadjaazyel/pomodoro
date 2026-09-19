import React, { useState, useEffect, useCallback } from 'react';
import PomodoroFacade from './components/PomodoroFacade';
import Workspace from './components/Workspace';
import { Smartphone, Monitor } from 'lucide-react';

/**
 * ============================================================================
 * APP PRINCIPAL: ARQUITETURA ANTI-FORENSE DE SEGURANÇA MÁXIMA
 * ============================================================================
 * Protocolos implementados contra extração física (Cellebrite / GrayKey):
 * 1. ZERO DISCO: Nenhum dado salvo em localStorage, sessionStorage ou IndexedDB.
 * 2. MEMÓRIA VOLÁTIL: Todas as mensagens e arquivos existem apenas na RAM.
 * 3. ANTI-SNAPSHOT DO IOS: O menor desfoque (App Switcher/minimizar) reverte
 *    imediatamente para a fachada do Pomodoro antes que o iOS grave o print no disco.
 * 4. PURGA DE EMERGÊNCIA (Wipe): Limpeza total de caches e reinicialização.
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('facade');
  const [authRole, setAuthRole] = useState('standard');
  const [simulateIphoneFrame, setSimulateIphoneFrame] = useState(false);
  const [sessionKey, setSessionKey] = useState(0); // Chave para forçar reconstrução limpa do estado

  /**
   * PURGA TOTAL DE EMERGÊNCIA (Zero Trace Wipe)
   * Destrói qualquer cache temporário do navegador e reseta todo o estado na RAM
   */
  const purgeAllTraces = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
          });
        }
      }
    } catch (e) {
      // Falha silenciosa
    }
    setSessionKey((prev) => prev + 1);
    setCurrentScreen('facade');
  }, []);

  /**
   * Monitoramento contínuo de foco e visibilidade (Anti-Snapshot do iOS)
   * Dispara assim que o usuário desliza para cima no iPhone ou troca de aplicativo
   */
  useEffect(() => {
    const handleLockDown = () => {
      // Bloqueia e camufla no Pomodoro imediatamente
      setCurrentScreen('facade');
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleLockDown();
      }
    };

    // Dispara quando o iOS inicia o gesto do App Switcher
    window.addEventListener('blur', handleLockDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleLockDown);
    window.addEventListener('beforeunload', handleLockDown);

    return () => {
      window.removeEventListener('blur', handleLockDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleLockDown);
      window.removeEventListener('beforeunload', handleLockDown);
    };
  }, []);

  const handleUnlock = (role) => {
    setAuthRole(role || 'standard');
    setCurrentScreen('workspace');
  };

  const handleLock = () => {
    setCurrentScreen('facade');
  };

  return (
    <div className="w-full h-[100dvh] min-h-[100dvh] bg-[#121214] flex items-center justify-center overflow-hidden">
      {/* Botão de preview Desktop */}
      <div className="hidden md:flex fixed top-4 right-4 z-50 items-center space-x-2 bg-[#1c1c21]/90 backdrop-blur-sm border border-neutral-800 px-3 py-1.5 rounded-full text-zinc-400 text-xs shadow-lg">
        <span className="text-[10px] font-mono text-zinc-500">Preview:</span>
        <button
          onClick={() => setSimulateIphoneFrame(!simulateIphoneFrame)}
          className="flex items-center space-x-1.5 hover:text-white transition-colors"
          title="Alternar entre tela cheia e moldura de iPhone"
        >
          {simulateIphoneFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Browser</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Container Principal Mobile com 100dvh */}
      <div
        className={`w-full h-[100dvh] min-h-[100dvh] bg-[#121214] flex flex-col transition-all duration-300 ${
          simulateIphoneFrame
            ? 'max-w-[393px] max-h-[852px] h-[852px] rounded-[52px] border-[10px] border-[#222228] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative'
            : 'max-w-none'
        }`}
      >
        {simulateIphoneFrame && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#121214] rounded-full z-40 flex items-center justify-center pointer-events-none border border-neutral-800">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ml-auto mr-3 border border-neutral-700/60" />
          </div>
        )}

        {currentScreen === 'facade' ? (
          <PomodoroFacade onUnlock={handleUnlock} />
        ) : (
          <Workspace
            key={sessionKey}
            onLock={handleLock}
            onEmergencyPurge={purgeAllTraces}
            authRole={authRole}
          />
        )}
      </div>
    </div>
  );
}
