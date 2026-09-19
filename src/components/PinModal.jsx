import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function PinModal({ isOpen, onClose, onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      // Focar automaticamente no input ao abrir
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      validatePin(nextPin);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const validatePin = (code) => {
    if (code.length === 4) {
      if (code === '1234') {
        // Sucesso: desbloqueia o workspace real
        onUnlock();
      } else {
        // Erro: sutil tremor e limpa o código
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div 
        className={`w-full max-w-xs rounded-2xl bg-zinc-950 border border-zinc-900 p-6 shadow-2xl flex flex-col items-center ${
          error ? 'animate-shake' : ''
        }`}
      >
        <div className="w-full flex justify-end">
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-full transition-colors active:scale-95"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Título minimalista e discreto */}
        <h3 className="text-sm font-medium text-zinc-400 tracking-wider uppercase mb-6">
          PIN
        </h3>

        {/* Indicador visual de 4 pontos (dots) */}
        <div className="flex items-center space-x-4 mb-8">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? error
                      ? 'bg-red-500 scale-110'
                      : 'bg-zinc-200 scale-105'
                    : 'border border-zinc-700 bg-zinc-900/50'
                }`}
              />
            );
          })}
        </div>

        {/* Teclado numérico virtual com pegada iOS */}
        <div className="grid grid-cols-3 gap-3 w-full mb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-14 rounded-full bg-zinc-900/60 hover:bg-zinc-850 active:bg-zinc-800 text-lg font-medium text-zinc-200 border border-zinc-800/40 transition-all flex items-center justify-center select-none active:scale-95"
            >
              {num}
            </button>
          ))}
          <div /> {/* Espaço vazio */}
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-full bg-zinc-900/60 hover:bg-zinc-850 active:bg-zinc-800 text-lg font-medium text-zinc-200 border border-zinc-800/40 transition-all flex items-center justify-center select-none active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-full bg-transparent hover:bg-zinc-900/30 text-xs font-normal text-zinc-500 hover:text-zinc-400 flex items-center justify-center select-none active:scale-95"
          >
            Apagar
          </button>
        </div>

        {/* Input oculto para compatibilidade com teclados físicos/acessibilidade */}
        <input
          ref={inputRef}
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setPin(val);
            validatePin(val);
          }}
          className="opacity-0 pointer-events-none absolute w-1 h-1"
        />
      </div>
    </div>
  );
}
