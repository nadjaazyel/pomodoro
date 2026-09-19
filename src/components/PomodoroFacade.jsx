import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Calendar, 
  Volume2, HeartPulse
} from 'lucide-react';
import FocusCalendarModal from './FocusCalendarModal';

/**
 * ============================================================================
 * FACHADA CAMUFLADA - FOCUSFLOW POMODORO TIMER (VERSÃO AMPLIADA)
 * ============================================================================
 * - Visual elegante, proporções confortáveis para visualização mobile
 * - Modo escuro grafite/charcoal premium (#202126)
 * - Atalho secreto no botão de Histórico (Calendário)
 */
export default function PomodoroFacade({ onUnlock }) {
  const MODES = [
    { id: 'pomodoro', label: 'Foco (25m)', minutes: 25 },
    { id: 'shortBreak', label: 'Curto (5m)', minutes: 5 },
    { id: 'longBreak', label: 'Longo (15m)', minutes: 15 },
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
    <div className="relative flex flex-col justify-between w-full h-[100dvh] min-h-[100dvh] bg-[#202126] text-zinc-100 pt-safe px-5 sm:px-8 select-none overflow-y-auto pb-12 sm:pb-8">
      {/* HEADER */}
      <header className="w-full flex items-center justify-between py-3.5 border-b border-[#353846] shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm sm:text-base font-semibold tracking-wider text-zinc-200 uppercase font-mono">
            FocusFlow
          </span>
        </div>

        <button
          onClick={() => setIsCalendarOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-[#2b2d39] border border-[#3d4154] hover:border-zinc-400 text-zinc-200 hover:text-white text-xs sm:text-sm font-medium transition-all active:scale-95 shadow-sm"
          aria-label="Abrir Histórico"
        >
          <Calendar className="w-4 h-4 text-zinc-400" />
          <span>Histórico</span>
        </button>
      </header>

      {/* SELEÇÃO DE MODOS */}
      <div className="w-full mt-3.5 shrink-0 max-w-md mx-auto">
        <div className="flex items-center justify-between bg-[#282a35] p-1.5 rounded-2xl border border-[#383c4e]">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSelectMode(mode)}
              className={`flex-1 py-2 px-2 text-center rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentMode.id === mode.id
                  ? 'bg-[#3c4053] text-white shadow'
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
          <div className="text-8xl sm:text-9xl font-extralight tracking-tight font-mono text-zinc-100 drop-shadow">
            {formatTime(timeLeft)}
          </div>
          <div className="mt-3 flex items-center space-x-2.5 text-xs sm:text-sm font-medium text-zinc-400">
            <span>Sessão {currentMode.label}</span>
            <span>•</span>
            <span className={isRunning ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
              {isRunning ? 'Em Andamento' : 'Pausado'}
            </span>
          </div>
        </div>

        <div className="w-64 sm:w-80 h-2 bg-[#333646] rounded-full overflow-hidden mt-7">
          <div
            className="h-full bg-zinc-300 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-6 flex items-center space-x-2 bg-[#2b2d39] px-4 py-2 rounded-full border border-[#3d4154] text-xs text-zinc-300">
          <Volume2 className="w-4 h-4 text-zinc-400" />
          <span>Som de Fundo:</span>
          <button
            onClick={() => {
              const sounds = ['Chuva Suave', 'Ruído Branco', 'Mudo', 'Cafeteria'];
              const next = sounds[(sounds.indexOf(soundMode) + 1) % sounds.length];
              setSoundMode(next);
            }}
            className="text-white font-medium hover:underline ml-1"
          >
            {soundMode}
          </button>
        </div>
      </div>

      {/* DICAS DE SAÚDE */}
      <div className="w-full mb-3.5 shrink-0 max-w-md mx-auto">
        <div 
          onClick={() => setTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length)}
          className="cursor-pointer bg-[#282a35] border border-[#383c4e] hover:border-[#4b5066] rounded-2xl p-4 sm:p-5 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5 text-xs sm:text-sm font-semibold text-zinc-200">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>{HEALTH_TIPS[tipIndex].title}</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-200 bg-[#343746] px-2.5 py-1 rounded-md border border-[#434759]">
              {HEALTH_TIPS[tipIndex].tag}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {HEALTH_TIPS[tipIndex].text}
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>Toque para próxima dica</span>
            <span>{tipIndex + 1}/{HEALTH_TIPS.length}</span>
          </div>
        </div>
      </div>

      {/* CONTROLES */}
      <footer className="w-full flex items-center justify-center space-x-4 pb-6 pt-1 shrink-0 max-w-md mx-auto">
        <button
          onClick={handleResetTimer}
          className="p-4 rounded-full bg-[#2b2d39] border border-[#3d4154] text-zinc-300 hover:text-white hover:border-zinc-400 active:scale-95 transition-all"
          aria-label="Reiniciar Cronômetro"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleToggleTimer}
          className="flex-1 flex items-center justify-center space-x-2 py-4 px-8 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm sm:text-base shadow-lg active:scale-95 transition-all"
          aria-label={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current ml-0.5" />
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
