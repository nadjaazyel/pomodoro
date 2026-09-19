import React, { useState } from 'react';
import { X, CheckCircle2, Flame, Clock } from 'lucide-react';

/**
 * ============================================================================
 * MODAL DE HISTÓRICO & CALENDÁRIO COM DUPLA SENHA SECRETA
 * ============================================================================
 * - Aparência 100% legítima de acompanhamento de sessões Pomodoro
 * - DUAS SENHAS SECRETAS:
 *   1) 01 -> 02 -> 03 -> 04 : Desbloqueia OPERADOR PADRÃO ('standard')
 *   2) 01 -> 01 -> 02 -> 02 : Desbloqueia PAINEL MASTER ('master')
 */
export default function FocusCalendarModal({ isOpen, onClose, onUnlock }) {
  const [selectedDay, setSelectedDay] = useState(18);
  const [clickSequence, setClickSequence] = useState([]);

  // Senhas configuradas
  const SEQ_STANDARD = [1, 2, 3, 4]; // 1234
  const SEQ_MASTER = [1, 1, 2, 2];   // 1122

  const getDayStats = (day) => {
    if (day > 18) {
      return { sessions: 0, minutes: 0, status: 'Pendente' };
    }
    const sessionMap = {
      1: { sessions: 4, minutes: 100 },
      2: { sessions: 6, minutes: 150 },
      3: { sessions: 5, minutes: 125 },
      4: { sessions: 7, minutes: 175 },
      5: { sessions: 3, minutes: 75 },
      8: { sessions: 4, minutes: 100 },
      9: { sessions: 5, minutes: 125 },
      10: { sessions: 6, minutes: 150 },
      11: { sessions: 4, minutes: 100 },
      12: { sessions: 8, minutes: 200 },
      15: { sessions: 5, minutes: 125 },
      16: { sessions: 6, minutes: 150 },
      17: { sessions: 4, minutes: 100 },
      18: { sessions: 3, minutes: 75 },
    };
    return sessionMap[day] || { sessions: 2, minutes: 50 };
  };

  const handleDayClick = (dayNumber) => {
    setSelectedDay(dayNumber);

    // Buffer com os últimos 4 cliques
    const newSeq = [...clickSequence, dayNumber].slice(-4);
    setClickSequence(newSeq);

    // Checagem de Senha Master: 1, 1, 2, 2
    if (
      newSeq.length === 4 &&
      newSeq[0] === SEQ_MASTER[0] &&
      newSeq[1] === SEQ_MASTER[1] &&
      newSeq[2] === SEQ_MASTER[2] &&
      newSeq[3] === SEQ_MASTER[3]
    ) {
      setClickSequence([]);
      onClose();
      onUnlock('master');
      return;
    }

    // Checagem de Senha Operador Padrão: 1, 2, 3, 4
    if (
      newSeq.length === 4 &&
      newSeq[0] === SEQ_STANDARD[0] &&
      newSeq[1] === SEQ_STANDARD[1] &&
      newSeq[2] === SEQ_STANDARD[2] &&
      newSeq[3] === SEQ_STANDARD[3]
    ) {
      setClickSequence([]);
      onClose();
      onUnlock('standard');
      return;
    }
  };

  if (!isOpen) return null;

  const daysInMonth = 30;
  const startOffset = 2; // Início na Terça-feira
  const dayStats = getDayStats(selectedDay);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#121216] border border-neutral-800 p-5 shadow-2xl flex flex-col text-neutral-200">
        {/* Header do Calendário */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white tracking-wide">
              Setembro 2026
            </span>
          </div>
          <button
            onClick={() => {
              setClickSequence([]);
              onClose();
            }}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resumo do mês */}
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="flex items-center space-x-2 bg-neutral-900/70 p-2.5 rounded-xl border border-neutral-800/60">
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">Streak</div>
              <div className="text-xs font-semibold text-white">5 dias seguidos</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-neutral-900/70 p-2.5 rounded-xl border border-neutral-800/60">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">Total Foco</div>
              <div className="text-xs font-semibold text-white">28h 45min</div>
            </div>
          </div>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-neutral-500 py-1">
          <span>DOM</span>
          <span>SEG</span>
          <span>TER</span>
          <span>QUA</span>
          <span>QUI</span>
          <span>SEX</span>
          <span>SÁB</span>
        </div>

        {/* Grade do Calendário */}
        <div className="grid grid-cols-7 gap-1.5 my-2">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="h-8 w-8" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const dayNum = index + 1;
            const stats = getDayStats(dayNum);
            const isSelected = selectedDay === dayNum;
            const hasCompleted = stats.sessions > 0;

            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`h-9 w-9 rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-neutral-200 text-neutral-950 font-bold shadow-md ring-2 ring-neutral-400'
                    : 'bg-neutral-900/40 hover:bg-neutral-800 text-neutral-300 font-medium'
                }`}
              >
                <span className="text-xs">{dayNum}</span>
                {hasCompleted && (
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? 'bg-neutral-950' : 'bg-emerald-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Estatísticas do dia selecionado */}
        <div className="mt-2 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-white flex items-center space-x-1.5">
              <span>{selectedDay} de Setembro</span>
              {dayStats.sessions > 0 && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {dayStats.sessions > 0
                ? `${dayStats.sessions} ciclos • ${dayStats.minutes} min de foco produtivo`
                : 'Nenhum registro para este dia'}
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
            {dayStats.sessions > 0 ? 'Meta Cumprida' : 'Livre'}
          </span>
        </div>
      </div>
    </div>
  );
}
