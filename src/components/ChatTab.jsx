import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, ShieldAlert } from 'lucide-react';

/**
 * ============================================================================
 * CHAT CONFIDENCIAL - ABA 1
 * Interface escura inspirada no WhatsApp Dark / iMessage Stealth.
 * ============================================================================
 */
export default function ChatTab() {
  // TODO: REMOVER MOCK DATA AO INTEGRAR SUPABASE
  // TODO: FASE 2 - Implementar criptografia ponta-a-ponta (E2EE) com Web Crypto API (AES-GCM 256-bit)
  // TODO: FASE 2 - Assinar canal do Supabase Realtime: supabase.channel('room_k9').on('broadcast', ...)
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'K9',
      text: 'Posicionamento confirmado no ponto delta. Transmissão segura ativa.',
      time: '11:42',
      isMe: false,
    },
    {
      id: 'm2',
      sender: 'Eu',
      text: 'Entendido. Relatório financeiro e termos operacionais atualizados na aba Acordos.',
      time: '11:43',
      isMe: true,
    },
    {
      id: 'm3',
      sender: 'K9',
      text: 'Aguarde o sinal antes de iniciar qualquer protocolo de exportação.',
      time: '11:44',
      isMe: false,
    },
    {
      id: 'm4',
      sender: 'K9',
      text: 'Canal limpo. Responda apenas por aqui.',
      time: '11:44',
      isMe: false,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Rolagem suave para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'Eu',
      text: inputText.trim(),
      time: timeStr,
      isMe: true,
    };

    // TODO: SUPABASE INTEGRATION - Enviar payload criptografado para o banco de dados
    // await supabase.from('secure_messages').insert({ ... })
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#202126] text-gray-300">
      {/* Sub-header confidencial com o interlocutor K9 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#353846] bg-[#282a34] z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#313442] border border-[#414456] flex items-center justify-center text-xs font-mono font-semibold text-zinc-200">
              K9
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#202126]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-200 tracking-wide">K9</span>
            <span className="text-[10px] text-zinc-400 font-mono">E2EE ativo • Cifrado</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-400 font-mono flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3 text-zinc-400" />
          <span>CANAL 01</span>
        </div>
      </div>

      {/* Lista de Mensagens Rolável */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[82%] sm:max-w-md rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                msg.isMe
                  ? 'bg-[#373a4a] text-gray-100 rounded-br-xs border border-[#484c60]'
                  : 'bg-[#282a34] text-gray-200 rounded-bl-xs border border-[#383b4a]'
              }`}
            >
              {!msg.isMe && (
                <div className="text-[10px] font-mono text-zinc-400 mb-1 font-semibold">
                  {msg.sender}
                </div>
              )}
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              <div
                className={`text-[9px] font-mono mt-1 text-right ${
                  msg.isMe ? 'text-zinc-300' : 'text-zinc-400'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 
        Input Area: Colado na parte inferior, respeitando a visualização mobile
        O Microfone: Ícone minúsculo (w-4 h-4, opacidade 30%) embutido/discreto
      */}
      <div className="border-t border-[#353846] bg-[#282a34] p-2.5">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2 w-full max-w-2xl mx-auto"
        >
          <div className="relative flex-1 flex items-center bg-[#202126] border border-[#383b4a] rounded-full px-3.5 py-1.5 focus-within:border-zinc-400 transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Mensagem..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-200 placeholder-zinc-500 outline-none pr-7 py-1"
            />

            {/* Ícone de Microfone minúsculo e quase invisível */}
            <button
              type="button"
              className="absolute right-3 text-zinc-400 opacity-30 hover:opacity-70 transition-opacity p-0.5"
              title="Gravação de voz secreta"
              onClick={() => {
                // TODO: FASE 2 - Integração de gravação de áudio ultrassecreta / Speech-to-text
              }}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-all flex items-center justify-center ${
              inputText.trim()
                ? 'bg-zinc-100 text-zinc-950 active:scale-95 shadow'
                : 'bg-[#333644] text-zinc-500 cursor-not-allowed'
            }`}
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
}
