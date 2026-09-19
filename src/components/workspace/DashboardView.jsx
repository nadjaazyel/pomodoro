import React from 'react';
import { 
  ShieldCheck, MessageSquare, FileText, Radio, 
  Terminal, Lock, Key, ChevronRight, AlertTriangle 
} from 'lucide-react';

export default function DashboardView({ operatorCode = 'NS', onEmergencyPurge, onNavigateToChats, onNavigateToNotes }) {
  return (
    <div className="flex flex-col h-full w-full bg-[#121214] text-zinc-300 overflow-y-auto px-4 py-4 space-y-4">
      {/* CARD DE IDENTIDADE DO OPERADOR */}
      <div className="relative rounded-3xl bg-[#19191f] border border-[#282832] p-5 shadow-xl overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-950/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                Operador Ativo
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                ● Cifrado
              </span>
            </div>
            
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-4xl font-mono font-bold tracking-tight text-white">
                {operatorCode}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                / Nível Alpha
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-[#23232b] border border-[#343440] flex items-center justify-center text-zinc-200 font-mono text-sm font-semibold">
            {operatorCode}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#262630] grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300">
          <div className="flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-zinc-400" />
            <span>AES-256-GCM</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sessão Efêmera</span>
          </div>
        </div>
      </div>

      {/* MÓDULOS CIFRADOS */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase px-1">
          Módulos Cifrados
        </span>

        {/* BOTÃO CHATS */}
        <button
          onClick={onNavigateToChats}
          className="w-full rounded-2xl bg-[#19191f] hover:bg-[#202027] border border-[#282832] hover:border-[#383846] p-4 transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#23232b] border border-[#343440] flex items-center justify-center text-zinc-200 group-hover:text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-white">
                  Comunicações Cifradas
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-[#282834] text-zinc-300">
                  4 Canais
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                K9, Ghost, Cipher, Raven • Transmissão segura
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
        </button>

        {/* BOTÃO ARQUIVOS */}
        <button
          onClick={onNavigateToNotes}
          className="w-full rounded-2xl bg-[#19191f] hover:bg-[#202027] border border-[#282832] hover:border-[#383846] p-4 transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#23232b] border border-[#343440] flex items-center justify-center text-zinc-200 group-hover:text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-white">
                  Cofre de Arquivos
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-[#282834] text-zinc-300">
                  Documentos
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Acordos, anotações e sugestões protegidas
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
        </button>
      </div>

      {/* LOG DE TELEMETRIA */}
      <div className="rounded-2xl bg-[#19191f] border border-[#282832] p-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
          <div className="flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Logs de Atividade</span>
          </div>
          <span className="text-emerald-400">Normal</span>
        </div>
        <div className="text-[10px] font-mono text-zinc-400 space-y-1 bg-[#141417] p-2.5 rounded-xl border border-[#22222a]">
          <div>[12:30:01] Autenticação confirmada para o nó {operatorCode}</div>
          <div>[12:31:15] Chave de sessão rotacionada com sucesso</div>
          <div>[12:31:40] Auto-bloqueio por minimização armado</div>
        </div>
      </div>

      {/* BOTÃO KILL SWITCH (PURGA DE EMERGÊNCIA) */}
      <div className="pt-1 pb-4">
        <button
          onClick={() => {
            if (confirm('ATENÇÃO: Deseja purgar toda a memória da sessão e retornar imediatamente ao Pomodoro sem deixar nenhum rastro?')) {
              onEmergencyPurge?.();
            }
          }}
          className="w-full py-3 rounded-2xl bg-[#1d1719] hover:bg-rose-950/50 border border-rose-900/40 hover:border-rose-700 text-rose-400 text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Autodestruição de Sessão (Kill Switch)</span>
        </button>
      </div>
    </div>
  );
}
