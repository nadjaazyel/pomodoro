import React, { useState } from 'react';
import { Plus, FileText, Calendar, Lock } from 'lucide-react';
import NewNoteModal from './NewNoteModal';

/**
 * ============================================================================
 * ACORDOS & NOTAS - ABA 2
 * Visual ultra dark, bordas discretas border-gray-900, cards minimalistas.
 * ============================================================================
 */
export default function NotesTab() {
  // TODO: REMOVER MOCK DATA AO INTEGRAR SUPABASE
  // TODO: FASE 2 - Sincronização segura de notas e acordos com Supabase (Row Level Security + Client-Side Decryption)
  const [notes, setNotes] = useState([
    {
      id: 'note-1',
      title: 'Acordo Confidencial de Divisão de Lucros - Q3',
      content: 'Percentual acordado fixado em 18% para o parceiro operacional, com retenção de 5% para cobertura de riscos de custódia. Liberação condicionada à validação de chaves no dia 30 de cada mês.',
      date: '16/09/2026',
      status: 'Ativo',
    },
    {
      id: 'note-2',
      title: 'Protocolo de Contingência e Destruição',
      content: 'Em caso de 3 tentativas com PIN incorreto na presença de terceiros, disparar wipe silencioso de cache local e desconectar sessões do Supabase imediatamente.',
      date: '12/09/2026',
      status: 'Restrito',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNote = (newNoteData) => {
    const today = new Date();
    const dateFormatted = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newEntry = {
      id: `note-${Date.now()}`,
      title: newNoteData.title,
      content: newNoteData.content,
      date: dateFormatted,
      status: 'Local',
    };

    // Atualiza estado local fictício para o teste de UI
    // TODO: SUPABASE INTEGRATION - Salvar via supabase.from('confidential_notes').insert(...)
    setNotes([newEntry, ...notes]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#202126] text-gray-300">
      {/* Subheader da aba de Acordos */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#353846] bg-[#282a34] z-10">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-gray-200">
            Acordos Registrados ({notes.length})
          </h2>
          <p className="text-[10px] text-zinc-400">Documentos salvos e notas cifradas</p>
        </div>

        {/* Botão Novo Acordo no Topo */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#333644] border border-[#414456] hover:border-zinc-400 text-zinc-200 hover:text-white text-xs transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Acordo</span>
        </button>
      </div>

      {/* Lista de Cards Minimalistas */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-xl border border-[#383b4a] bg-[#282a34] p-4 transition-all hover:border-[#4b5066]"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-medium text-gray-200 line-clamp-1">
                  {note.title}
                </h3>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#343746] border border-[#434759] text-zinc-200 shrink-0">
                {note.status}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
              {note.content}
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#353845] flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{note.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Protegido</span>
              </div>
            </div>
          </div>
        ))}

        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Lock className="w-8 h-8 text-zinc-700 mb-2 stroke-[1.5]" />
            <p className="text-xs text-zinc-500">Nenhum acordo cadastrado ainda.</p>
          </div>
        )}
      </div>

      {/* Modal de Criação */}
      <NewNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddNote}
      />
    </div>
  );
}
