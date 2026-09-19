import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function NewNoteModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSave({
      title: title.trim() || 'Sem Título',
      content: content.trim(),
    });

    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#272933] border border-[#3a3d4d] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col pb-safe">
        {/* Header do Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-[#353846]">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
            Novo Registro / Acordo
          </span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col mt-4 space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
              Título / Referência
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Acordo Operacional Setor 4"
              className="w-full bg-[#202126] border border-[#383b4a] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-200 placeholder-zinc-500 outline-none focus:border-zinc-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
              Conteúdo Cifrado
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite os termos confidenciais ou notas do acordo..."
              className="w-full bg-[#202126] border border-[#383b4a] rounded-xl p-3.5 text-xs sm:text-sm text-gray-200 placeholder-zinc-500 outline-none focus:border-zinc-400 transition-colors resize-none"
              required
            />
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#353846]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Acordo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
