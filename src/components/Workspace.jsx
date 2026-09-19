import React, { useState } from 'react';
import { 
  MessageSquare, FileText, Users, Lock
} from 'lucide-react';
import ChatListView from './workspace/ChatListView';
import ChatConversation from './workspace/ChatConversation';
import FilesView from './workspace/FilesView';
import MasterAdminView from './workspace/MasterAdminView';

/**
 * ============================================================================
 * WORKSPACE CORPORATIVO & EXECUTIVO (VERSÃO AMPLIADA)
 * ============================================================================
 * - Visual executivo, sóbrio, em tons grafite/carvão (#202126)
 * - Proporções e textos ampliados para excelente legibilidade mobile
 * - Dual-Operator: Master (A1) e Padrão (NS)
 */
export default function Workspace({ role = 'standard', onLock, onEmergencyPurge }) {
  const isMaster = role === 'master';
  const currentUserCode = isMaster ? 'A1' : 'NS';

  // Por padrão, abre direto na aba de Conversas (Chats)
  const [currentTab, setCurrentTab] = useState('chats');
  const [selectedContactId, setSelectedContactId] = useState(null);

  // Lista de Contatos/Canais Operacionais
  const [contacts, setContacts] = useState([
    {
      id: 'kilo',
      name: 'Operador K9',
      role: 'Canal Operacional Alpha',
      avatar: 'K9',
      lastMessage: 'Recebido. Vou analisar as cláusulas e enviar o aceite.',
      lastTime: '11:44',
      unreadCount: 1,
      online: true,
    },
    {
      id: 'ghost',
      name: 'Operador G2',
      role: 'Coordenação Logística',
      avatar: 'G2',
      lastMessage: 'Perímetro checado e rotas liberadas.',
      lastTime: '10:10',
      unreadCount: 0,
      online: true,
    },
    {
      id: 'cipher',
      name: 'Operador C4',
      role: 'Custódia & Liquidação',
      avatar: 'C4',
      lastMessage: 'Relatório financeiro em conformidade. Aguardando finalização.',
      lastTime: 'Ontem',
      unreadCount: 0,
      online: false,
    },
    {
      id: 'raven',
      name: 'Operador R8',
      role: 'Auditoria de Chaves',
      avatar: 'R8',
      lastMessage: 'Canal de comunicação secundário ativo.',
      lastTime: '16/09',
      unreadCount: 0,
      online: false,
    },
  ]);

  // Lista de Usuários (Apenas Master gerencia)
  const [users, setUsers] = useState([
    {
      id: 'u_master',
      code: 'A1',
      name: 'Direção Geral (Master)',
      role: 'Administrador Total',
      status: 'Ativo',
      permissions: ['read', 'write', 'delete', 'export', 'admin', 'audit'],
      lastActive: 'Agora',
    },
    {
      id: 'u_ns',
      code: 'NS',
      name: 'Operador Padrão',
      role: 'Operador Executivo',
      status: 'Ativo',
      permissions: ['read', 'write'],
      lastActive: '10 min atrás',
    },
    {
      id: 'u_k9',
      code: 'K9',
      name: 'Operador K9',
      role: 'Operador de Campo',
      status: 'Ativo',
      permissions: ['read', 'write'],
      lastActive: '11:44',
    },
    {
      id: 'u_g2',
      code: 'G2',
      name: 'Operador G2',
      role: 'Logística Externa',
      status: 'Ativo',
      permissions: ['read'],
      lastActive: 'Ontem',
    },
  ]);

  // Acordos e Documentos em Memória Volátil
  const [files, setFiles] = useState([
    {
      id: 'f1',
      title: 'Acordo Operacional Q3',
      type: 'Acordo',
      status: 'Pendente',
      owner: 'NS',
      sharedWith: ['K9', 'A1'],
      content: 'Percentual fixado em 18% para o parceiro operacional, com retenção de 5% para mitigação de riscos de custódia. Liberação condicionada à validação de chaves no dia 30.',
      date: '18/09/2026',
      adjustments: [],
      signatures: [],
    },
    {
      id: 'f2',
      title: 'Mapeamento de Rotas Seguras',
      type: 'Relatório',
      status: 'Concluído',
      owner: 'G2',
      sharedWith: ['NS', 'A1'],
      content: 'Rotas alternativas via corredor leste validadas sem monitoramento ativo. Horários recomendados para deslocamento entre 04:30 e 06:00.',
      date: '17/09/2026',
      adjustments: [],
      signatures: ['G2', 'NS'],
    },
    {
      id: 'f3',
      title: 'Termo de Custódia e Liquidação',
      type: 'Acordo',
      status: 'Aceito',
      owner: 'A1',
      sharedWith: ['C4', 'NS'],
      content: 'Valores fracionados sob custódia descentralizada. Liberação autorizada mediante co-assinatura digital de dois operadores ativos.',
      date: '15/09/2026',
      adjustments: [],
      signatures: ['A1', 'C4'],
    },
  ]);

  // Mensagens em Memória Volátil
  const [messagesByContact, setMessagesByContact] = useState({
    kilo: [
      {
        id: 'k1',
        sender: 'K9',
        type: 'text',
        text: 'Bom dia. Estamos alinhando o termo de compensação das operações desta semana.',
        time: '11:40',
        isMe: false,
      },
      {
        id: 'k2',
        sender: 'Eu',
        type: 'text',
        text: 'Perfeito. Estou enviando a minuta do acordo aqui na conversa para você revisar.',
        time: '11:42',
        isMe: true,
      },
      {
        id: 'k_doc_1',
        sender: 'Eu',
        type: 'agreement',
        agreement: {
          id: 'f1',
          title: 'Acordo Operacional Q3',
          type: 'Acordo',
          content: 'Percentual fixado em 18% para o parceiro operacional, com retenção de 5% para mitigação de riscos de custódia. Liberação condicionada à validação de chaves no dia 30.',
          status: 'Pendente',
        },
        time: '11:43',
        isMe: true,
      },
      {
        id: 'k3',
        sender: 'K9',
        type: 'text',
        text: 'Recebido. Vou analisar as cláusulas e enviar o aceite ou eventuais ajustes.',
        time: '11:44',
        isMe: false,
      },
    ],
    ghost: [
      {
        id: 'g1',
        sender: 'G2',
        type: 'text',
        text: 'Perímetro checado e rotas liberadas.',
        time: '10:10',
        isMe: false,
      },
    ],
    cipher: [
      {
        id: 'c1',
        sender: 'C4',
        type: 'text',
        text: 'Relatório financeiro em conformidade. Aguardando finalização.',
        time: 'Ontem',
        isMe: false,
      },
    ],
    raven: [
      {
        id: 'r1',
        sender: 'R8',
        type: 'text',
        text: 'Canal de comunicação secundário ativo.',
        time: '16/09',
        isMe: false,
      },
    ],
  });

  const handleSendMessage = (contactId, msgData) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'Eu',
      time: timeStr,
      isMe: true,
      ...msgData,
    };

    setMessagesByContact((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMsg],
    }));
  };

  const handleSaveNewFile = (newFile) => {
    setFiles([newFile, ...files]);
  };

  const handleUpdateFile = (updatedFile) => {
    setFiles((prev) => prev.map((f) => (f.id === updatedFile.id ? updatedFile : f)));
  };

  const handleSaveUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUpdateUserPermissions = (userId, newPerms) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, permissions: newPerms } : u))
    );
  };

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  return (
    <div className="flex flex-col h-[100dvh] min-h-[100dvh] w-full bg-[#202126] text-zinc-300 select-none overflow-hidden">
      {/* HEADER EXECUTIVO SÓBRIO */}
      <header className="pt-safe px-5 pb-3.5 bg-[#282a34] border-b border-[#353745] flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
          <span className="text-sm font-semibold tracking-wide text-zinc-200">
            {isMaster ? 'Painel Administrativo' : 'Comunicações'}
          </span>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-[#333644] text-zinc-100 border border-[#414456] font-bold">
            {currentUserCode}
          </span>
        </div>

        {/* Botão de Bloqueio / Camuflar */}
        <button
          onClick={onLock}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#333644] border border-[#414456] text-zinc-300 hover:text-white hover:border-zinc-400 transition-colors active:scale-95 text-xs sm:text-sm font-medium shadow-sm"
          title="Bloquear e voltar ao Pomodoro"
        >
          <Lock className="w-4 h-4" />
          <span>Bloquear</span>
        </button>
      </header>

      {/* ÁREA CENTRAL DE CONTEÚDO */}
      <main className="flex-1 overflow-hidden relative bg-[#202126]">
        {/* ABA CHATS (ONDE O APP ABRE DIRETAMENTE) */}
        {currentTab === 'chats' && (
          <>
            {selectedContact ? (
              <ChatConversation
                contact={selectedContact}
                onBack={() => setSelectedContactId(null)}
                onSendMessage={handleSendMessage}
                messages={messagesByContact[selectedContact.id] || []}
                availableFiles={files}
                currentUserCode={currentUserCode}
                onUpdateFile={handleUpdateFile}
              />
            ) : (
              <ChatListView
                contacts={contacts}
                onSelectContact={(c) => setSelectedContactId(c.id)}
                onOpenFiles={() => setCurrentTab('files')}
              />
            )}
          </>
        )}

        {/* ABA DOCUMENTOS & ACORDOS */}
        {currentTab === 'files' && (
          <FilesView
            files={files}
            onSaveFile={handleSaveNewFile}
            onUpdateFile={handleUpdateFile}
            currentUserCode={currentUserCode}
            isMaster={isMaster}
          />
        )}

        {/* ABA ADMINISTRAÇÃO (APENAS PARA O MASTER A1) */}
        {currentTab === 'admin' && isMaster && (
          <MasterAdminView
            users={users}
            onSaveUser={handleSaveUser}
            onUpdateUserPermissions={handleUpdateUserPermissions}
            allFiles={files}
            onUpdateFile={handleUpdateFile}
            onEmergencyPurge={onEmergencyPurge}
            onNavigateToChats={() => {
              setSelectedContactId(null);
              setCurrentTab('chats');
            }}
            onNavigateToFiles={() => setCurrentTab('files')}
          />
        )}
      </main>

      {/* TAB BAR NATIVA CORPORATIVA */}
      <nav className="pb-safe bg-[#282a34] border-t border-[#353745] z-20 shrink-0">
        <div className="flex items-center justify-around h-18 sm:h-20 max-w-md mx-auto">
          {/* Aba Chats (Principal) */}
          <button
            onClick={() => {
              setCurrentTab('chats');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95 relative ${
              currentTab === 'chats'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mb-1 stroke-[1.8]" />
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#3a3d4c] border border-[#484c5e] text-[9px] font-mono text-zinc-200 flex items-center justify-center">
                4
              </span>
            </div>
            <span className="text-xs tracking-tight">Conversas</span>
          </button>

          {/* Aba Documentos */}
          <button
            onClick={() => {
              setCurrentTab('files');
              setSelectedContactId(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95 ${
              currentTab === 'files'
                ? 'text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 mb-1 stroke-[1.8]" />
            <span className="text-xs tracking-tight">Documentos</span>
          </button>

          {/* Aba Administração (Exclusivo Master A1) */}
          {isMaster && (
            <button
              onClick={() => {
                setCurrentTab('admin');
                setSelectedContactId(null);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95 ${
                currentTab === 'admin'
                  ? 'text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mb-1 stroke-[1.8]" />
              <span className="text-xs tracking-tight">Usuários</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
