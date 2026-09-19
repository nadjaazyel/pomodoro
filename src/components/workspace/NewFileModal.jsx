import React, { useState } from 'react';
import { X, Check, FileText, Share2, Tag } from 'lucide-react';

export default function NewFileModal({ isOpen, onClose, onSave, currentUserCode = 'NS' }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Acordo'); // 'Acordo' | 'Anotação' | 'Sugestão' | 'Relatório'
  const [content, setContent] = useState('');
  const [sharedWith, setSharedWith] = useState(['K9']);

  if (!isOpen) return null;

  const AVAILABLE_OPERATORS = [
    { code: 'K9', name: 'K9 (Recon)' },
    { code: 'G2', name: 'Ghost (Logística)' },
    { code: 'C4', name: 'Cipher (Finanças)' },
    { code: 'R8', name: 'Raven (Suporte)' },
  ];

  const toggleShare = (code) => {
    if (sharedWith.includes(code)) {
      setSharedWith(sharedWith.filter((c) => c !== code));
    } else {
      setSharedWith([...sharedWith, code]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const d = new Date();
    const timeStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    const newDoc = {
      id: `doc_${Date.now()}`,
      title: title.trim() || `${type} Sem Título`,
      type,
      content: content.trim(),
      date: dateFormatted,
      owner: `Operador ${currentUserCode}`,
      status: type === 'Acordo' ? 'Pendente' : 'Ativo',
      sharedWith: sharedWith.length > 0 ? sharedWith : [currentUserCode],
      history: [
        {
          action: 'Criado',
          user: currentUserCode,
          time: timeStr,
          detail: `Documento (${type}) registrado no cofre criptografado.`,
        },
      ],
    };

    onSave(newDoc);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#272933] border border-[#3a3d4d] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] text-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#353846]">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Novo Registro no Cofre
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-[#343746] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
          {/* Tipo de Documento */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5">
              Tipo de Documento
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-[#202126] p-1 rounded-2xl border border-[#353846]">
              {['Acordo', 'Anotação', 'Sugestão', 'Relatório'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-1.5 text-center rounded-xl text-xs font-medium transition-all ${
                    type === t
                      ? 'bg-[#3c4053] text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
              Título / Referência
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Acordo Operacional Setor 4"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              className="w-full bg-[#202126] border border-[#383b4a] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-400"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
              Conteúdo Cifrado
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o texto confidencial..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              className="w-full bg-[#202126] border border-[#383b4a] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-400 resize-none font-sans"
              required
            />
          </div>

          {/* Compartilhamento com outros operadores */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5 flex items-center space-x-1">
              <Share2 className="w-3 h-3" />
              <span>Compartilhar Visibilidade Com:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_OPERATORS.map((op) => {
                const isSelected = sharedWith.includes(op.code);
                return (
                  <button
                    type="button"
                    key={op.code}
                    onClick={() => toggleShare(op.code)}
                    className={`flex items-center space-x-2 p-2 rounded-xl text-left border text-xs transition-all ${
                      isSelected
                        ? 'bg-[#3c4053] border-[#4b5066] text-white'
                        : 'bg-[#202126] border-[#383b4a] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#292b36] border border-[#434759] flex items-center justify-center text-[9px] font-mono font-bold">
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="truncate">{op.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rodapé */}
          <div className="pt-2 border-t border-[#353846] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-white text-neutral-950 font-medium text-xs active:scale-95 transition-all disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Documento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
