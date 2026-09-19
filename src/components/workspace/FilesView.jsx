import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Eye, Share2 
} from 'lucide-react';
import NewFileModal from './NewFileModal';
import AgreementActionModal from './AgreementActionModal';

export default function FilesView({ 
  files, 
  onSaveFile, 
  onUpdateFile, 
  currentUserCode = 'NS',
  isMaster = false 
}) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeFileForAction, setActiveFileForAction] = useState(null);

  const CATEGORIES = ['Todos', 'Acordo', 'Anotação', 'Sugestão', 'Relatório'];

  const filteredFiles = files.filter((f) => {
    const matchesCategory = selectedCategory === 'Todos' || f.type === selectedCategory;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.owner && f.owner.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const isVisible =
      isMaster ||
      f.owner.includes(currentUserCode) ||
      (f.sharedWith && f.sharedWith.includes(currentUserCode));

    return matchesCategory && matchesSearch && isVisible;
  });

  const handleOpenFile = (file) => {
    const nowStr = () => {
      const d = new Date();
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const hasViewedRecently = file.history?.some(
      (h) => h.user === currentUserCode && h.action === 'Visualizado'
    );

    let updatedFile = file;
    if (!hasViewedRecently) {
      const viewLog = {
        action: 'Visualizado',
        user: currentUserCode,
        timestamp: nowStr(),
        details: 'Arquivo aberto em tela para leitura',
      };
      updatedFile = {
        ...file,
        history: [...(file.history || []), viewLog],
      };
      onUpdateFile(updatedFile);
    }

    setActiveFileForAction(updatedFile);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#202126] text-zinc-300">
      {/* Header Corporativo Sóbrio */}
      <div className="px-5 py-3.5 border-b border-[#353745] bg-[#282a34] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Documentos & Acordos
          </h2>
          <p className="text-xs text-zinc-400">
            Repositório sigiloso em memória volátil
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Documento</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="px-4 py-3 border-b border-[#303340] space-y-2.5 shrink-0">
        <div className="flex items-center space-x-2.5 bg-[#282a34] border border-[#383b4a] rounded-2xl px-3.5 py-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por título, termos ou autor..."
            className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#3c4053] text-white shadow-sm'
                  : 'bg-[#282a34] text-zinc-400 hover:text-zinc-200 border border-[#383b4a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => handleOpenFile(file)}
            className="cursor-pointer rounded-2xl border border-[#383b4a] bg-[#282a34] hover:bg-[#2f3240] p-4 sm:p-5 transition-all hover:border-[#4b5066] group active:scale-[0.99] shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                <h3 className="text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white line-clamp-1">
                  {file.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#343746] border border-[#434759] text-zinc-200">
                  {file.type}
                </span>
                {file.status && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      file.status === 'Aceito'
                        ? 'bg-[#1b2820] text-emerald-400 border-emerald-800/40'
                        : file.status === 'Ajustado'
                        ? 'bg-[#28221c] text-zinc-300 border-[#40342a]'
                        : 'bg-[#333644] text-zinc-300 border-[#414456]'
                    }`}
                  >
                    {file.status}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3 mb-3.5">
              {file.content}
            </p>

            <div className="pt-2.5 border-t border-[#353845] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-200 font-medium">
                  {file.owner || 'Operador'}
                </span>
                <span>•</span>
                <span>{file.date}</span>
              </div>

              <div className="flex items-center space-x-2.5">
                {file.sharedWith && (
                  <div className="flex items-center space-x-1 text-zinc-400">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{file.sharedWith.join(', ')}</span>
                  </div>
                )}
                <span className="text-zinc-200 group-hover:text-white flex items-center space-x-1 font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Abrir</span>
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredFiles.length === 0 && (
          <div className="py-16 text-center text-zinc-500 font-mono text-sm">
            Nenhum arquivo encontrado nesta categoria.
          </div>
        )}
      </div>

      <NewFileModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={onSaveFile}
        currentUserCode={currentUserCode}
      />

      <AgreementActionModal
        isOpen={!!activeFileForAction}
        onClose={() => setActiveFileForAction(null)}
        agreement={activeFileForAction}
        currentUserCode={currentUserCode}
        onUpdateAgreement={(updated) => {
          onUpdateFile(updated);
          setActiveFileForAction(updated);
        }}
      />
    </div>
  );
}
