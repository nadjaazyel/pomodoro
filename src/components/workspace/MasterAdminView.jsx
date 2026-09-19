import React, { useState } from 'react';
import { 
  Users, FileText, Plus, Eye, ShieldCheck, 
  Settings, CheckCircle2, UserCheck, AlertCircle 
} from 'lucide-react';
import UserManagementModal from './UserManagementModal';
import AgreementActionModal from './AgreementActionModal';

/**
 * ============================================================================
 * PAINEL ADMINISTRATIVO (DIRETORIA / MASTER A1) - DESIGN PROFISSIONAL
 * ============================================================================
 * - Estética corporativa executiva e sóbria (sem visual gamer ou cores berrantes)
 * - Gestão de operadores, permissões e visão global de documentos
 */
export default function MasterAdminView({ 
  users, 
  onSaveUser, 
  onUpdateUserPermissions,
  allFiles, 
  onUpdateFile,
  onEmergencyPurge,
  onNavigateToChats,
  onNavigateToFiles
}) {
  const [activeTab, setActiveTab] = useState('users');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [activeFile, setActiveFile] = useState(null);

  return (
    <div className="flex flex-col h-full w-full bg-[#202126] text-zinc-300 overflow-y-auto px-4 py-4 space-y-4">
      {/* HEADER EXECUTIVO SÓBRIO */}
      <div className="rounded-2xl bg-[#282a34] border border-[#383b4a] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#343746] border border-[#434759] flex items-center justify-center text-white font-mono text-sm font-semibold">
              A1
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-white">
                  Diretoria Executiva
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#343746] text-zinc-200 border border-[#434759]">
                  Administração Geral
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {users.length} usuários cadastrados • {allFiles.length} documentos no cofre
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SELETOR DE SUB-ABAS SÓBRIO */}
      <div className="flex items-center justify-between bg-[#282a34] p-1 rounded-xl border border-[#383b4a] shrink-0">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-1.5 text-center rounded-lg text-xs font-medium transition-all ${
            activeTab === 'users'
              ? 'bg-[#3c4053] text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Usuários ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 py-1.5 text-center rounded-lg text-xs font-medium transition-all ${
            activeTab === 'files'
              ? 'bg-[#3c4053] text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Todos os Arquivos ({allFiles.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-1.5 text-center rounded-lg text-xs font-medium transition-all ${
            activeTab === 'audit'
              ? 'bg-[#3c4053] text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Auditoria
        </button>
      </div>

      {/* ABA 1: GESTÃO DE USUÁRIOS */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
              Operadores do Sistema
            </span>
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-200 hover:bg-white text-zinc-950 font-medium text-xs transition-all active:scale-95 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Usuário</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {users.map((u) => (
              <div
                key={u.id}
                className="rounded-xl bg-[#282a34] border border-[#383b4a] p-3.5 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#343746] border border-[#434759] flex items-center justify-center font-mono text-xs font-semibold text-white">
                      {u.code}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-white">{u.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#343746] border border-[#434759] text-zinc-200">
                          {u.code}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{u.role}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#343746] text-zinc-200 border border-[#434759]">
                    {u.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#353845] flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Emissão de Acordos:</span>
                  <button
                    onClick={() =>
                      onUpdateUserPermissions(u.id, {
                        ...u.permissions,
                        canSendAgreements: !u.permissions?.canSendAgreements,
                      })
                    }
                    className={`px-2.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      u.permissions?.canSendAgreements
                        ? 'bg-[#1e2a22] text-emerald-400 border border-emerald-800/40'
                        : 'bg-[#2b2528] text-zinc-400 border border-[#3d2e33]'
                    }`}
                  >
                    {u.permissions?.canSendAgreements ? 'Autorizado' : 'Bloqueado'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: VISÃO GLOBAL DE ARQUIVOS */}
      {activeTab === 'files' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
              Documentos Registrados por Proprietário
            </span>
          </div>

          <div className="space-y-2.5">
            {allFiles.map((f) => (
              <div
                key={f.id}
                onClick={() => setActiveFile(f)}
                className="cursor-pointer rounded-xl bg-[#282a34] border border-[#383b4a] hover:border-[#4b5066] p-3.5 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
                    <h4 className="text-xs font-semibold text-white">{f.title}</h4>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#343746] border border-[#434759] text-zinc-200">
                    {f.type}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
                  {f.content}
                </p>

                <div className="pt-2 border-t border-[#353845] flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center space-x-1.5 text-zinc-300">
                    <span className="text-zinc-500">Autor:</span>
                    <span className="font-semibold">{f.owner}</span>
                  </div>
                  <span className="text-zinc-400 flex items-center space-x-1 group-hover:text-white">
                    <Eye className="w-3 h-3" />
                    <span>Visualizar</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: AUDITORIA */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
            Registros de Acesso e Auditoria
          </span>
          <div className="rounded-xl bg-[#282a34] border border-[#383b4a] p-3.5 font-mono text-[10px] space-y-2 text-zinc-300">
            <div>[12:28:10] Sessão de administração A1 autenticada</div>
            <div>[12:25:40] Operador NS acessou o documento Acordo Comercial Distribuidora - Tabela OL Q3</div>
            <div>[12:22:15] Minuta comercial enviada no canal de Compras K9</div>
            <div>[12:15:02] Conciliação de taxas de cartões e convênios validada com 0 inconformidades</div>
          </div>
        </div>
      )}

      {/* Modais */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSaveUser={onSaveUser}
      />

      <AgreementActionModal
        isOpen={!!activeFile}
        onClose={() => setActiveFile(null)}
        agreement={activeFile}
        currentUserCode="A1"
        onUpdateAgreement={(updated) => {
          onUpdateFile(updated);
          setActiveFile(updated);
        }}
      />
    </div>
  );
}
