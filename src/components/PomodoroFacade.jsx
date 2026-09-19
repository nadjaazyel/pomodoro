import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Calendar, Volume2, 
  HeartPulse, Flame, CheckCircle2 
} from 'lucide-react';
import FocusCalendarModal from './FocusCalendarModal';

/**
 * ============================================================================
 * FACHADA ULTRA-REALISTA: FOCUS TIME & HEALTH POMODORO
 * ============================================================================
 * - Fundo Cinza Escuro ergonômico (#121214) com cards em #18181c
 * - Respeito à Safe Area inferior para Safari do iPhone
 */
export default function PomodoroFacade({ onUnlock }) {
  const MODES = [
    { id: 'focus_25', label: 'Foco', minutes: 25 },
    { id: 'break_short', label: 'Pausa Curta', minutes: 5 },
    { id: 'break_long', label: 'Pausa Longa', minutes: 15 },
    { id: 'focus_50', label: 'Profundo', minutes: 50 },
  ];

  const [currentMode, setCurrentMode] = useState(MODES[0]);
  const [timeLeft, setTimeLeft] = useState(MODES[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [soundMode, setSoundMode] = useState('Chuva Suave');

  const HEALTH_TIPS = [
    {
      title: 'Regra 20-20-20',
      text: 'A cada 20 minutos de tela, olhe para um objeto a 6 metros por 20 segundos para descansar a visão.',
      tag: 'Saúde Ocular',
    },
    {
      title: 'Hidratação Essencial',
      text: 'Beba 200ml de água durante a pausa. A hidratação previne dores de cabeça e eleva o foco.',
      tag: 'Hidratação',
    },
    {
      title: 'Postura & Ombros',
      text: 'Gire os ombros para trás 5 vezes e mantenha a lombar apoiada na cadeira.',
      tag: 'Ergonomia',
    },
    {
      title: 'Respiração Calmante',
      text: 'Inspire por 4 segundos, segure por 4s e expire lentamente por 6s para renovar a mente.',
      tag: 'Bem-Estar',
    },
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleSelectMode = (mode) => {
    setIsRunning(false);
    setCurrentMode(mode);
    setTimeLeft(mode.minutes * 60);
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentMode.minutes * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalModeSeconds = currentMode.minutes * 60;
  const progressPercent = ((totalModeSeconds - timeLeft) / totalModeSeconds) * 100;

  return (
    <div className="relative flex flex-col justify-between w-full h-[100dvh] min-h-[100dvh] bg-[#121214] text-zinc-100 pt-safe px-5 select-none overflow-y-auto pb-12 sm:pb-8">
      {/* HEADER */}
      <header className="w-full flex items-center justify-between py-3 border-b border-[#24242b] shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-zinc-200 uppercase font-mono">
            FocusFlow
          </span>
        </div>

        <button
          onClick={() => setIsCalendarOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#1e1e24] border border-[#2e2e38] hover:border-zinc-500 text-zinc-300 hover:text-white text-xs transition-all active:scale-95"
          aria-label="Abrir Histórico"
        >
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-medium">Histórico</span>
        </button>
      </header>

      {/* SELEÇÃO DE MODOS */}
      <div className="w-full mt-3 shrink-0">
        <div className="flex items-center justify-between bg-[#19191e] p-1 rounded-2xl border border-[#282832]">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSelectMode(mode)}
              className={`flex-1 py-1.5 px-1 text-center rounded-xl text-xs font-medium transition-all ${
                currentMode.id === mode.id
                  ? 'bg-[#2a2a34] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* MOSTRADOR DE TEMPO */}
      <div className="my-auto flex flex-col items-center justify-center py-4 shrink-0">
        <div className="flex flex-col items-center">
          <div className="text-7xl sm:text-8xl font-light tracking-tight font-mono text-zinc-100 drop-shadow-sm">
            {formatTime(timeLeft)}
          </div>
          <div className="mt-2 flex items-center space-x-2 text-xs font-medium text-zinc-400">
            <span>Sessão {currentMode.label}</span>
            <span>•</span>
            <span className="text-emerald-400">
              {isRunning ? 'Em Andamento' : 'Pausado'}
            </span>
          </div>
        </div>

        <div className="w-56 h-1.5 bg-[#22222a] rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-zinc-300 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-5 flex items-center space-x-2 bg-[#1c1c22] px-3.5 py-1.5 rounded-full border border-[#2a2a34] text-[11px] text-zinc-300">
          <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>Som de Fundo:</span>
          <button
            onClick={() => {
              const sounds = ['Chuva Suave', 'Ruído Branco', 'Mudo', 'Cafeteria'];
              const next = sounds[(sounds.indexOf(soundMode) + 1) % sounds.length];
              setSoundMode(next);
            }}
            className="text-white font-medium hover:underline"
          >
            {soundMode}
          </button>
        </div>
      </div>

      {/* DICAS DE SAÚDE */}
      <div className="w-full mb-3 shrink-0">
        <div 
          onClick={() => setTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length)}
          className="cursor-pointer bg-[#19191f] border border-[#282832] hover:border-[#383845] rounded-2xl p-3.5 transition-all"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>{HEALTH_TIPS[tipIndex].title}</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-300 bg-[#25252e] px-2 py-0.5 rounded-md border border-[#32323e]">
              {HEALTH_TIPS[tipIndex].tag}
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            {HEALTH_TIPS[tipIndex].text}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>Toque para próxima dica</span>
            <span>{tipIndex + 1}/{HEALTH_TIPS.length}</span>
          </div>
        </div>
      </div>

      {/* CONTROLES */}
      <footer className="w-full flex items-center justify-center space-x-4 pb-6 pt-1 shrink-0">
        <button
          onClick={handleResetTimer}
          className="p-3.5 rounded-full bg-[#1c1c22] border border-[#2e2e38] text-zinc-300 hover:text-white hover:border-zinc-500 active:scale-95 transition-all"
          aria-label="Reiniciar Cronômetro"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggleTimer}
          className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-sm shadow-md active:scale-95 transition-all"
          aria-label={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Iniciar Sessão</span>
            </>
          )}
        </button>
      </footer>

      <FocusCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onUnlock={(role) => {
          setIsCalendarOpen(false);
          onUnlock(role);
        }}
      />
    </div>
  );
}
