import React, { useState } from 'react';
import { Search, ChevronRight, FileText } from 'lucide-react';

/**
 * ============================================================================
 * LISTA DE CONVERSAS - DESIGN PROFISSIONAL & EXECUTIVO (AMPLIADO)
 * ============================================================================
 * - Visual limpo, sóbrio e proporcional para leitura mobile
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
      <div className="px-5 py-3.5 border-b border-[#24242b] bg-[#161619] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Mensagens
          </h2>
          <p className="text-xs text-zinc-400">
            Canais de comunicação direta
          </p>
        </div>

        {/* Botão de Atalho Rápido para Documentos & Acordos */}
        <button
          onClick={onOpenFiles}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#202026] border border-[#2e2e38] text-zinc-200 hover:text-white hover:border-zinc-500 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm"
          title="Acessar Documentos e Acordos"
        >
          <FileText className="w-4 h-4 text-zinc-400" />
          <span>Documentos</span>
        </button>
      </div>

      {/* Barra de Pesquisa Discreta */}
      <div className="px-4 py-3 border-b border-[#202026] shrink-0">
        <div className="flex items-center space-x-2.5 bg-[#18181e] border border-[#272732] rounded-2xl px-3.5 py-2 focus-within:border-zinc-500 transition-colors">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar conversas..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* Lista de Contatos */}
      <div className="flex-1 overflow-y-auto px-3 py-2 divide-y divide-[#1e1e26]">
        {filteredContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="w-full p-3.5 sm:p-4 rounded-2xl hover:bg-[#18181e] transition-all flex items-center justify-between text-left group active:scale-[0.99]"
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              {/* Avatar Neutro */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-[#202028] border border-[#2c2c38] flex items-center justify-center font-mono text-sm font-bold text-zinc-200 shadow-sm">
                  {contact.avatar}
                </div>
                {contact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#121214]" />
                )}
              </div>

              {/* Informações da conversa */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-zinc-100 group-hover:text-white">
                    {contact.name}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 shrink-0 ml-2">
                    {contact.lastTime}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 truncate pr-2">
                  {contact.lastMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 ml-2">
              {contact.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-zinc-200 text-neutral-950 text-xs font-bold flex items-center justify-center font-mono shadow">
                  {contact.unreadCount}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
            </div>
          </button>
        ))}

        {filteredContacts.length === 0 && (
          <div className="p-8 text-center text-sm text-zinc-500 font-mono">
            Nenhuma conversa encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
