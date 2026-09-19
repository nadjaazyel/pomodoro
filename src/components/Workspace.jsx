import React, { useState } from 'react';
import { 
  MessageSquare, FileText, Lock, ShieldCheck, 
  Settings, Users 
} from 'lucide-react';
import MasterAdminView from './workspace/MasterAdminView';
import ChatListView from './workspace/ChatListView';
import ChatConversation from './workspace/ChatConversation';
import FilesView from './workspace/FilesView';

/**
 * ============================================================================
 * DARK WORKSPACE - DESIGN EXECUTIVO & PROFISSIONAL
 * ============================================================================
 * - Entra DIRETAMENTE na tela de CHATS
 * - Estética corporativa sóbria (tons de grafite, chumbo e branco fosco)
 * - Zero estética gamer ou cores berrantes
 */
export default function Workspace({ onLock, onEmergencyPurge, authRole = 'standard' }) {
  const isMaster = authRole === 'master';
  const currentUserCode = isMaster ? 'A1' : 'NS';

  // REGRA DE OURO: Entra SEMPRE direto no CHAT!
  const [currentTab, setCurrentTab] = useState('chats');
  const [selectedContactId, setSelectedContactId] = useState(null);

  // BASE DE USUÁRIOS (Visual Executivo)
  const [users, setUsers] = useState([
    {
      id: 'u1',
      code: 'A1',
      name: 'Diretoria Executiva',
      role: 'Administrador Geral',
      status: 'Ativo',
      permissions: { canSendAgreements: true, canEditFiles: true, canAccessLogs: true },
    },
    {
      id: 'u2',
      code: 'NS',
      name: 'Operador Principal',
      role: 'Operador Padrão',
      status: 'Ativo',
      permissions: { canSendAgreements: true, canEditFiles: true, canAccessLogs: false },
    },
    {
      id: 'u3',
      code: 'K9',
      name: 'Operações K9',
      role: 'Campo & Operações',
      status: 'Ativo',
      permissions: { canSendAgreements: true, canEditFiles: true, canAccessLogs: false },
    },
    {
      id: 'u4',
      code: 'G2',
      name: 'Logística G2',
      role: 'Logística & Suprimentos',
      status: 'Ativo',
      permissions: { canSendAgreements: true, canEditFiles: false, canAccessLogs: false },
    },
    {
      id: 'u5',
      code: 'C4',
      name: 'Financeiro C4',
      role: 'Custódia & Contabilidade',
      status: 'Ativo',
      permissions: { canSendAgreements: true, canEditFiles: true, canAccessLogs: false },
    },
  ]);

  // BASE DE ARQUIVOS E DOCUMENTOS
  const [files, setFiles] = useState([
    {
      id: 'f1',
      title: 'Acordo Operacional Q3',
      type: 'Acordo',
      content: 'Percentual fixado em 18% para o parceiro operacional, com retenção de 5% para mitigação de riscos de custódia. Liberação condicionada à validação de chaves no dia 30.',
      date: '16/09/2026',
      owner: 'Operador NS',
      status: 'Pendente',
      sharedWith: ['K9', 'G2', 'A1'],
      history: [
        { action: 'Criado', user: 'NS', time: '16/09 às 10:00', detail: 'Minuta de acordo registrada.' },
        { action: 'Visualizado', user: 'K9', time: '18/09 às 11:42', detail: 'Documento acessado.' },
      ],
    },
    {
      id: 'f2',
      title: 'Protocolo de Contingência Interno',
      type: 'Acordo',
      content: 'Em caso de 3 tentativas com PIN incorreto na presença de terceiros, disparar wipe silencioso de cache local e desconectar sessões imediatamente.',
      date: '12/09/2026',
      owner: 'Operador K9',
      status: 'Aceito',
      sharedWith: ['NS', 'A1'],
      history: [
        { action: 'Criado', user: 'K9', time: '12/09 às 08:30', detail: 'Diretriz de segurança.' },
        { action: 'Aceito', user: 'A1', time: '12/09 às 09:15', detail: 'Aprovado pela administração.' },
      ],
    },
    {
      id: 'f3',
      title: 'Anotação: Ponto de Encontro Setor Norte',
      type: 'Anotação',
      content: 'Localização de backup no Galpão 04. Horário de silêncio de rádio entre 02:00 e 05:00 da manhã. Não utilizar canais abertos.',
      date: '17/09/2026',
      owner: 'Operador G2',
      status: 'Ativo',
      sharedWith: ['NS', 'K9', 'A1'],
      history: [
        { action: 'Criado', user: 'G2', time: '17/09 às 14:20', detail: 'Registro de campo.' },
      ],
    },
    {
      id: 'f4',
      title: 'Sugestão: Atualização de Infraestrutura Criptográfica',
      type: 'Sugestão',
      content: 'Proposta de atualização de todos os nós para algoritmos pós-quânticos Kyber-768 no próximo ciclo de homologação.',
      date: '18/09/2026',
      owner: 'Operador C4',
      status: 'Ativo',
      sharedWith: ['A1'],
      history: [
        { action: 'Criado', user: 'C4', time: '18/09 às 09:00', detail: 'Sugestão técnica registrada.' },
      ],
    },
  ]);

  // CONTATOS DE CHAT
  const [contacts] = useState([
    {
      id: 'k9',
      name: 'K9 (Operações)',
      role: 'Canal Operacional',
      avatar: 'K9',
      channel: '01',
      online: true,
      lastMessage: 'Acordo Q3 recebido para validação.',
      lastTime: '11:44',
      unreadCount: 1,
    },
    {
      id: 'ghost',
      name: 'G2 (Logística)',
      role: 'Suprimentos & Transporte',
      avatar: 'G2',
      channel: '02',
      online: true,
      lastMessage: 'Novo ponto de encontro definido para amanhã.',
      lastTime: '10:15',
      unreadCount: 0,
    },
    {
      id: 'cipher',
      name: 'C4 (Financeiro)',
      role: 'Custódia & Liquidação',
      avatar: 'C4',
      channel: '03',
      online: false,
      lastMessage: 'Acordo de divisão Q3 atualizado no cofre.',
      lastTime: 'Ontem',
      unreadCount: 0,
    },
    {
      id: 'raven',
      name: 'R8 (Suporte)',
      role: 'Suporte & Comunicação',
      avatar: 'R8',
      channel: '04',
      online: true,
      lastMessage: 'Canal de rádio secundário em escuta.',
      lastTime: '16/09',
      unreadCount: 0,
    },
  ]);

  // HISTÓRICO DE MENSAGENS
  const [messagesByContact, setMessagesByContact] = useState({
    k9: [
      {
        id: 'k1',
        sender: 'K9',
        type: 'text',
        text: 'Posicionamento confirmado no ponto delta. Canal seguro ativo.',
        time: '11:42',
        isMe: false,
      },
      {
        id: 'k2',
        sender: 'Eu',
        type: 'text',
        text: 'Segue a minuta do acordo financeiro Q3 para sua revisão e aceite.',
        time: '11:43',
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
    <div className="flex flex-col h-[100dvh] min-h-[100dvh] w-full bg-[#121214] text-zinc-300 select-none overflow-hidden">
      {/* HEADER EXECUTIVO SÓBRIO */}
      <header className="pt-safe px-4 pb-3 bg-[#17171a] border-b border-[#25252b] flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-medium tracking-wide text-zinc-200">
            {isMaster ? 'Painel Administrativo' : 'Comunicações'}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202026] text-zinc-300 border border-[#2e2e38]">
            {currentUserCode}
          </span>
        </div>

        {/* Botão de Bloqueio / Camuflar */}
        <button
          onClick={onLock}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#202026] border border-[#2e2e38] text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors active:scale-95 text-[11px] font-medium"
          title="Bloquear e voltar ao Pomodoro"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Bloquear</span>
        </button>
      </header>

      {/* ÁREA CENTRAL DE CONTEÚDO */}
      <main className="flex-1 overflow-hidden relative bg-[#121214]">
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
      <nav className="pb-safe bg-[#17171a] border-t border-[#25252b] z-20 shrink-0">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {/* Aba Chats (Principal) */}
          <button
            onClick={() => {
              setCurrentTab('chats');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95 relative ${
              currentTab === 'chats'
                ? 'text-white font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 mb-1 stroke-[1.8]" />
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#272730] border border-[#383844] text-[8px] font-mono text-zinc-300 flex items-center justify-center">
                4
              </span>
            </div>
            <span className="text-[10px] tracking-tight">Conversas</span>
          </button>

          {/* Aba Documentos */}
          <button
            onClick={() => {
              setCurrentTab('files');
              setSelectedContactId(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95 ${
              currentTab === 'files'
                ? 'text-white font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FileText className="w-5 h-5 mb-1 stroke-[1.8]" />
            <span className="text-[10px] tracking-tight">Documentos</span>
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
                  ? 'text-white font-medium'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Users className="w-5 h-5 mb-1 stroke-[1.8]" />
              <span className="text-[10px] tracking-tight">Usuários</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
