import React, { useState } from 'react';
import { X, CheckCircle2, Flame, Clock } from 'lucide-react';

/**
 * ============================================================================
 * MODAL DE HISTÓRICO & CALENDÁRIO COM DUPLA SENHA SECRETA (VERSÃO AMPLIADA)
 * ============================================================================
 * - Aparência 100% legítima de acompanhamento de sessões Pomodoro
 * - Botões maiores e confortáveis para o toque
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
      <div className="w-full max-w-md rounded-3xl bg-[#121216] border border-neutral-800 p-6 shadow-2xl flex flex-col text-neutral-200">
        {/* Header do Calendário */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="text-base font-semibold text-white tracking-wide">
              Setembro 2026
            </span>
          </div>
          <button
            onClick={() => {
              setClickSequence([]);
              onClose();
            }}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo do mês */}
        <div className="grid grid-cols-2 gap-3 my-3.5">
          <div className="flex items-center space-x-3 bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800/80">
            <Flame className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Streak</div>
              <div className="text-sm font-semibold text-white">5 dias seguidos</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800/80">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Total Foco</div>
              <div className="text-sm font-semibold text-white">28h 45min</div>
            </div>
          </div>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono text-neutral-400 py-1.5 font-semibold">
          <span>DOM</span>
          <span>SEG</span>
          <span>TER</span>
          <span>QUA</span>
          <span>QUI</span>
          <span>SEX</span>
          <span>SÁB</span>
        </div>

        {/* Grade do Calendário */}
        <div className="grid grid-cols-7 gap-2 my-2.5">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="h-10 w-10 sm:h-11 sm:w-11" />
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
                className={`h-10 w-10 sm:h-11 sm:w-11 mx-auto rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-neutral-100 text-neutral-950 font-bold shadow-lg ring-2 ring-neutral-300'
                    : 'bg-neutral-900/50 hover:bg-neutral-800 text-neutral-200 font-semibold'
                }`}
              >
                <span className="text-sm">{dayNum}</span>
                {hasCompleted && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-neutral-950' : 'bg-emerald-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Estatísticas do dia selecionado */}
        <div className="mt-3 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white flex items-center space-x-2">
              <span>{selectedDay} de Setembro</span>
              {dayStats.sessions > 0 && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {dayStats.sessions > 0
                ? `${dayStats.sessions} ciclos • ${dayStats.minutes} min de foco produtivo`
                : 'Nenhum registro para este dia'}
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300">
            {dayStats.sessions > 0 ? 'Meta Cumprida' : 'Livre'}
          </span>
        </div>
      </div>
    </div>
  );
}
