import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, ArrowLeft, ShieldAlert, FileText, 
  Paperclip, CheckCircle2, AlertCircle, Eye, ChevronRight 
} from 'lucide-react';
import AgreementActionModal from './AgreementActionModal';

export default function ChatConversation({ 
  contact, 
  onBack, 
  onSendMessage, 
  messages = [], 
  availableFiles = [], 
  currentUserCode = 'NS',
  onUpdateFile 
}) {
  const [inputText, setInputText] = useState('');
  const [isAgreementPickerOpen, setIsAgreementPickerOpen] = useState(false);
  const [activeAgreementModal, setActiveAgreementModal] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendTextMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(contact.id, {
      text: inputText.trim(),
      type: 'text',
    });
    setInputText('');
  };

  const handleSendAgreement = (file) => {
    onSendMessage(contact.id, {
      type: 'agreement',
      agreement: file,
      text: `[DOCUMENTO ENVIADO] ${file.title}`,
    });
    setIsAgreementPickerOpen(false);
  };

  const handleOpenAgreementFromChat = (agreement) => {
    const currentDoc = availableFiles.find((f) => f.id === agreement.id) || agreement;
    setActiveAgreementModal(currentDoc);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#121214] text-zinc-300">
      {/* Header do Chat */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#24242b] bg-[#161619] z-10 shrink-0">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onBack}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-[#22222a] transition-colors"
            aria-label="Voltar para lista de chats"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-[#22222a] border border-[#32323e] flex items-center justify-center text-xs font-mono font-bold text-zinc-200">
              {contact.avatar}
            </div>
            {contact.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#121214]" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-200 tracking-wide">
              {contact.name}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {contact.role} • E2EE Ativo
            </span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-zinc-400 flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3 text-zinc-500" />
          <span>CANAL {contact.channel || '01'}</span>
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          if (msg.type === 'agreement' && msg.agreement) {
            const currentDoc =
              availableFiles.find((f) => f.id === msg.agreement.id) || msg.agreement;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`w-full max-w-sm rounded-2xl p-4 text-xs space-y-3 ${
                    msg.isMe
                      ? 'bg-[#1c1c24] border border-[#2f2f3d] rounded-br-xs'
                      : 'bg-[#181820] border border-[#282834] rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-[#252530] text-zinc-200">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                          Documento Compartilhado
                        </span>
                        <h4 className="text-xs font-semibold text-white">
                          {currentDoc.title}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border shrink-0 ${
                        currentDoc.status === 'Aceito'
                          ? 'bg-[#1b2820] text-emerald-400 border-emerald-800/40'
                          : currentDoc.status === 'Ajustado'
                          ? 'bg-[#28221c] text-zinc-300 border-[#40342a]'
                          : 'bg-[#202028] text-zinc-400 border-[#2d2d38]'
                      }`}
                    >
                      ● {currentDoc.status || 'Pendente'}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed bg-[#131317] p-2.5 rounded-xl border border-[#22222a]">
                    {currentDoc.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#262630] text-[10px] font-mono">
                    <span className="text-zinc-400">{msg.time}</span>
                    <button
                      onClick={() => handleOpenAgreementFromChat(currentDoc)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-medium active:scale-95 transition-all shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Abrir Acordo</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[84%] sm:max-w-md rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.isMe
                    ? 'bg-[#22222c] text-zinc-100 rounded-br-xs border border-[#323242]'
                    : 'bg-[#181820] text-zinc-200 rounded-bl-xs border border-[#282834]'
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
                    msg.isMe ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Popover Seleção de Acordo */}
      {isAgreementPickerOpen && (
        <div className="p-3 bg-[#16161a] border-t border-[#262630] space-y-2 max-h-48 overflow-y-auto animate-fade-in shrink-0">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>Selecione um Acordo para enviar:</span>
            <button
              onClick={() => setIsAgreementPickerOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              Fechar
            </button>
          </div>

          <div className="space-y-1.5">
            {availableFiles
              .filter((f) => f.type === 'Acordo')
              .map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleSendAgreement(file)}
                  className="w-full p-2.5 rounded-xl bg-[#1e1e24] hover:bg-[#25252e] border border-[#2c2c36] flex items-center justify-between text-left text-xs transition-colors"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate text-white font-medium">{file.title}</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 shrink-0 ml-2">
                    {file.status}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Input de Mensagem */}
      <div className="border-t border-[#24242c] bg-[#161619] p-2.5 shrink-0">
        <form
          onSubmit={handleSendTextMessage}
          className="flex items-center space-x-2 w-full max-w-2xl mx-auto"
        >
          <button
            type="button"
            onClick={() => setIsAgreementPickerOpen(!isAgreementPickerOpen)}
            className="p-2 rounded-full bg-[#202026] border border-[#2e2e38] text-zinc-300 hover:text-white transition-colors active:scale-95 shrink-0"
            title="Enviar Acordo na conversa"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <div className="relative flex-1 flex items-center bg-[#1a1a20] border border-[#2c2c38] rounded-full px-3.5 py-1.5 focus-within:border-zinc-500 transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Mensagem para ${contact.name}...`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none pr-7 py-1"
            />

            <button
              type="button"
              className="absolute right-3 text-zinc-400 opacity-30 hover:opacity-70 transition-opacity p-0.5"
              title="Gravação secreta"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-all flex items-center justify-center shrink-0 ${
              inputText.trim()
                ? 'bg-zinc-100 text-zinc-950 active:scale-95'
                : 'bg-[#22222a] text-zinc-600 cursor-not-allowed'
            }`}
            aria-label="Enviar"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </form>
      </div>

      <AgreementActionModal
        isOpen={!!activeAgreementModal}
        onClose={() => setActiveAgreementModal(null)}
        agreement={activeAgreementModal}
        currentUserCode={currentUserCode}
        onUpdateAgreement={(updated) => {
          onUpdateFile(updated);
          setActiveAgreementModal(updated);
        }}
      />
    </div>
  );
}
