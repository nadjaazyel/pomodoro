import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Send, Paperclip, FileText, 
  Eye, CheckCircle2, Shield, Mic
} from 'lucide-react';
import AgreementActionModal from './AgreementActionModal';

/**
 * ============================================================================
 * TELA DE CONVERSA DIRETA (AMPLIADA)
 * ============================================================================
 * - Mensagens em balões amplos e confortáveis
 * - Envio e inspeção de acordos integrados na timeline
 */
export default function ChatConversation({
  contact,
  onBack,
  onSendMessage,
  messages,
  availableFiles,
  currentUserCode,
  onUpdateFile,
}) {
  const [inputText, setInputText] = useState('');
  const [isAgreementPickerOpen, setIsAgreementPickerOpen] = useState(false);
  const [activeAgreementModal, setActiveAgreementModal] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendTextMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(contact.id, {
      type: 'text',
      text: inputText.trim(),
    });

    setInputText('');
  };

  const handleSendAgreement = (file) => {
    onSendMessage(contact.id, {
      type: 'agreement',
      agreement: file,
    });
    setIsAgreementPickerOpen(false);
  };

  const handleOpenAgreementFromChat = (agreementData) => {
    const freshDoc = availableFiles.find((f) => f.id === agreementData.id) || agreementData;
    setActiveAgreementModal(freshDoc);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#202126] text-zinc-300">
      {/* Header do Chat */}
      <div className="px-4 py-3 border-b border-[#353745] bg-[#282a34] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#333644] text-zinc-300 hover:text-white border border-[#414456] transition-colors active:scale-95"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-[#313442] border border-[#414456] flex items-center justify-center font-mono text-sm font-bold text-zinc-200">
              {contact.avatar}
            </div>
            {contact.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#202126]" />
            )}
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">
              {contact.name}
            </h3>
            <span className="text-xs text-zinc-400">
              {contact.role}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#333644] border border-[#414456] text-xs font-mono text-zinc-200">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>E2EE</span>
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
        {messages.map((msg) => {
          if (msg.type === 'agreement') {
            const currentDoc =
              availableFiles.find((f) => f.id === msg.agreement?.id) || msg.agreement;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`w-full max-w-md rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md ${
                    msg.isMe
                      ? 'bg-[#2f3240] border border-[#3f4356] rounded-br-xs'
                      : 'bg-[#282a34] border border-[#383b4a] rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-[#373a4a] text-zinc-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-zinc-400 uppercase block font-semibold">
                          Documento Compartilhado
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {currentDoc.title}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-md border shrink-0 ${
                        currentDoc.status === 'Aceito'
                          ? 'bg-[#1b2820] text-emerald-400 border-emerald-800/40'
                          : currentDoc.status === 'Ajustado'
                          ? 'bg-[#28221c] text-zinc-300 border-[#40342a]'
                          : 'bg-[#333644] text-zinc-300 border-[#414456]'
                      }`}
                    >
                      ● {currentDoc.status || 'Pendente'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed bg-[#202126] p-3 rounded-xl border border-[#353846]">
                    {currentDoc.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#383b4a] text-xs font-mono">
                    <span className="text-zinc-400">{msg.time}</span>
                    <button
                      onClick={() => handleOpenAgreementFromChat(currentDoc)}
                      className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold active:scale-95 transition-all shadow"
                    >
                      <Eye className="w-4 h-4" />
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
                className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed shadow-sm ${
                  msg.isMe
                    ? 'bg-[#373a4a] text-zinc-100 rounded-br-xs border border-[#484c60]'
                    : 'bg-[#282a34] text-zinc-200 rounded-bl-xs border border-[#383b4a]'
                }`}
              >
                {!msg.isMe && (
                  <div className="text-xs font-mono text-zinc-400 mb-1.5 font-bold">
                    {msg.sender}
                  </div>
                )}
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <div
                  className={`text-[10px] font-mono mt-1.5 text-right ${
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
        <div className="p-3.5 bg-[#282a34] border-t border-[#353745] space-y-2.5 max-h-56 overflow-y-auto animate-fade-in shrink-0">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1 font-semibold">
            <span>Selecione um Acordo para enviar:</span>
            <button
              onClick={() => setIsAgreementPickerOpen(false)}
              className="text-zinc-400 hover:text-white px-2 py-1"
            >
              Fechar
            </button>
          </div>

          <div className="space-y-2">
            {availableFiles
              .filter((f) => f.type === 'Acordo')
              .map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleSendAgreement(file)}
                  className="w-full p-3 rounded-xl bg-[#313442] hover:bg-[#3b3f4f] border border-[#3f4356] flex items-center justify-between text-left text-sm transition-colors shadow-sm"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="truncate text-white font-medium">{file.title}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 shrink-0 ml-2">
                    {file.status}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Input de Mensagem */}
      <div className="border-t border-[#353745] bg-[#282a34] p-3 sm:p-4 shrink-0">
        <form
          onSubmit={handleSendTextMessage}
          className="flex items-center space-x-2.5 w-full max-w-2xl mx-auto"
        >
          <button
            type="button"
            onClick={() => setIsAgreementPickerOpen(!isAgreementPickerOpen)}
            className="p-2.5 rounded-full bg-[#333644] border border-[#414456] text-zinc-300 hover:text-white transition-colors active:scale-95 shrink-0"
            title="Enviar Acordo na conversa"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="relative flex-1 flex items-center bg-[#202126] border border-[#383b4a] rounded-full px-4 py-2 focus-within:border-zinc-400 transition-colors">
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
              className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 outline-none pr-8 py-1"
            />

            <button
              type="button"
              className="absolute right-3.5 text-zinc-400 opacity-30 hover:opacity-70 transition-opacity p-0.5"
              title="Gravação secreta"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 ${
              inputText.trim()
                ? 'bg-zinc-100 text-zinc-950 active:scale-95 shadow'
                : 'bg-[#333644] text-zinc-500 cursor-not-allowed'
            }`}
            aria-label="Enviar"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
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
