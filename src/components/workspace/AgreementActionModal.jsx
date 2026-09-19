import React, { useState } from 'react';
import { X, Check, Edit3, ShieldCheck, History, Clock, FileText } from 'lucide-react';

/**
 * ============================================================================
 * MODAL DE AÇÃO EM ACORDOS & DOCUMENTOS
 * ============================================================================
 * Permite:
 * - Visualizar o documento completo
 * - "Aceitar Acordo" (carimba como Aceito e registra histórico)
 * - "Fazer Ajustes" (edita o texto e registra quem ajustou)
 * - Exibe o histórico de visualizações e auditoria
 */
export default function AgreementActionModal({ 
  isOpen, 
  onClose, 
  agreement, 
  currentUserCode = 'NS',
  onUpdateAgreement 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  if (!isOpen || !agreement) return null;

  const nowStr = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleStartEdit = () => {
    setEditedContent(agreement.content);
    setIsEditing(true);
  };

  const handleSaveAdjustments = () => {
    if (!editedContent.trim()) return;

    const newHistoryEntry = {
      action: 'Ajustado',
      user: currentUserCode,
      time: nowStr(),
      detail: 'Termos e cláusulas modificados.',
    };

    onUpdateAgreement({
      ...agreement,
      content: editedContent.trim(),
      status: 'Ajustado',
      history: [...(agreement.history || []), newHistoryEntry],
    });

    setIsEditing(false);
  };

  const handleAcceptAgreement = () => {
    const newHistoryEntry = {
      action: 'Aceito',
      user: currentUserCode,
      time: nowStr(),
      detail: 'Acordo formalizado e assinado digitalmente.',
    };

    onUpdateAgreement({
      ...agreement,
      status: 'Aceito',
      history: [...(agreement.history || []), newHistoryEntry],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-zinc-950 border border-neutral-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] text-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900 shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Protocolo Confidencial
            </span>
          </div>
          <button
            onClick={() => {
              setIsEditing(false);
              onClose();
            }}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informações do Acordo */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {agreement.title}
              </h3>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                Proprietário: {agreement.owner || 'Operador X7'} • Tipo: {agreement.type || 'Acordo'}
              </div>
            </div>

            <span
              className={`text-[10px] font-mono px-2.5 py-1 rounded-md border shrink-0 ${
                agreement.status === 'Aceito'
                  ? 'bg-[#1b2820] text-emerald-400 border-emerald-800/40'
                  : agreement.status === 'Ajustado'
                  ? 'bg-[#28221c] text-zinc-300 border-[#40342a]'
                  : 'bg-[#202028] text-zinc-400 border-[#2d2d38]'
              }`}
            >
              ● {agreement.status || 'Pendente'}
            </span>
          </div>

          {/* Conteúdo do Documento */}
          <div className="bg-black/70 border border-neutral-900 rounded-2xl p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
              Termos e Cláusulas
            </div>
            {isEditing ? (
              <textarea
                rows={6}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 outline-none focus:border-neutral-600 resize-none font-sans"
              />
            ) : (
              <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {agreement.content}
              </p>
            )}
          </div>

          {/* Histórico de Auditoria & Visualizações */}
          <div className="bg-zinc-900/40 border border-neutral-900 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-neutral-400">
              <History className="w-3.5 h-3.5 text-neutral-500" />
              <span>Histórico de Auditoria & Acessos</span>
            </div>

            <div className="space-y-1.5 text-[10px] font-mono divide-y divide-neutral-900/50">
              {agreement.history && agreement.history.length > 0 ? (
                agreement.history.map((h, i) => (
                  <div key={i} className="pt-1.5 flex items-start justify-between">
                    <div>
                      <span className="text-neutral-300 font-semibold">{h.action}</span> por{' '}
                      <span className="text-white">{h.user}</span>
                      {h.detail && <span className="text-neutral-500 block">{h.detail}</span>}
                    </div>
                    <span className="text-neutral-500 shrink-0 ml-2">{h.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-neutral-500">Sem registros anteriores de modificação.</div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé com Botões de Ação */}
        <div className="pt-3 border-t border-neutral-900 flex items-center justify-between gap-2 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancelar Edição
              </button>
              <button
                onClick={handleSaveAdjustments}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-white text-neutral-950 font-medium text-xs active:scale-95 transition-all shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Ajustes</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleStartEdit}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs transition-colors active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                <span>Fazer Ajustes</span>
              </button>

              <button
                onClick={handleAcceptAgreement}
                disabled={agreement.status === 'Aceito'}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-xs transition-all active:scale-95 ${
                  agreement.status === 'Aceito'
                    ? 'bg-[#1b2820] text-emerald-400 border border-emerald-800/40 cursor-default'
                    : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{agreement.status === 'Aceito' ? 'Acordo Formalizado' : 'Formalizar Acordo'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
