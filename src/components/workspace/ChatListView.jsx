import React, { useState } from 'react';
import { Search, ChevronRight, FileText, Shield } from 'lucide-react';

/**
 * ============================================================================
 * LISTA DE CONVERSAS - DESIGN PROFISSIONAL & EXECUTIVO
 * ============================================================================
 * - Visual limpo, sóbrio e elegante
 * - Botão direto para acessar os Documentos & Acordos
 */
export default function ChatListView({ contacts, onSelectContact, onOpenFiles }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#121214] text-zinc-300">
      {/* Header Corporativo Sóbrio */}
      <div className="px-4 py-3 border-b border-[#24242b] bg-[#161619] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Mensagens
          </h2>
          <p className="text-[11px] text-zinc-400">
            Canais de comunicação direta
          </p>
        </div>

        {/* Botão de Atalho Rápido para Documentos & Acordos */}
        <button
          onClick={onOpenFiles}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#202026] border border-[#2e2e38] text-zinc-300 hover:text-white hover:border-zinc-500 text-xs font-medium transition-all active:scale-95"
          title="Acessar Documentos e Acordos"
        >
          <FileText className="w-3.5 h-3.5 text-zinc-400" />
          <span>Documentos</span>
        </button>
      </div>

      {/* Barra de Pesquisa Discreta */}
      <div className="px-4 py-2.5 border-b border-[#202026] shrink-0">
        <div className="flex items-center space-x-2 bg-[#18181e] border border-[#272732] rounded-xl px-3 py-1.5 focus-within:border-zinc-500 transition-colors">
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar conversas..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* Lista de Contatos */}
      <div className="flex-1 overflow-y-auto px-2 py-2 divide-y divide-[#1e1e26]">
        {filteredContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="w-full p-3 rounded-xl hover:bg-[#18181e] transition-all flex items-center justify-between text-left group active:scale-[0.99]"
          >
            <div className="flex items-center space-x-3 min-w-0">
              {/* Avatar Neutro */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#202028] border border-[#2c2c38] flex items-center justify-center font-mono text-xs font-semibold text-zinc-200">
                  {contact.avatar}
                </div>
                {contact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#121214]" />
                )}
              </div>

              {/* Informações da conversa */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-zinc-100 group-hover:text-white">
                    {contact.name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {contact.lastTime}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate pr-2">
                  {contact.lastMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 ml-2">
              {contact.unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-zinc-200 text-neutral-950 text-[9px] font-semibold flex items-center justify-center font-mono">
                  {contact.unreadCount}
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
            </div>
          </button>
        ))}

        {filteredContacts.length === 0 && (
          <div className="p-8 text-center text-xs text-zinc-500 font-mono">
            Nenhuma conversa encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
