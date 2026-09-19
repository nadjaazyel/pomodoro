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
        time: nowStr(),
        detail: 'Documento acessado no cofre.',
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
    <div className="flex flex-col h-full w-full bg-[#121214] text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#24242b] bg-[#161619] z-10 shrink-0">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
            <span>Documentos ({filteredFiles.length})</span>
            {isMaster && (
              <span className="text-[10px] bg-[#22222c] text-zinc-300 border border-[#30303e] px-2 py-0.5 rounded font-medium">
                Visão Geral
              </span>
            )}
          </h2>
          <p className="text-[10px] text-zinc-400">Acordos, anotações e termos em custódia</p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#202026] border border-[#2e2e38] hover:border-zinc-500 text-zinc-200 hover:text-white text-xs transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Arquivo</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="px-3 py-2 border-b border-[#202026] space-y-2 shrink-0">
        <div className="flex items-center space-x-2 bg-[#1a1a20] border border-[#2b2b36] rounded-xl px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por título, termos ou autor..."
            className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#2a2a34] text-white shadow-sm'
                  : 'bg-[#18181e] text-zinc-400 hover:text-zinc-200 border border-[#262630]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => handleOpenFile(file)}
            className="cursor-pointer rounded-2xl border border-[#282832] bg-[#19191f] hover:bg-[#202028] p-4 transition-all hover:border-[#383846] group active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-white line-clamp-1">
                  {file.title}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#24242e] border border-[#343440] text-zinc-300">
                  {file.type}
                </span>
                {file.status && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      file.status === 'Aceito'
                        ? 'bg-[#1b2820] text-emerald-400 border-emerald-800/40'
                        : file.status === 'Ajustado'
                        ? 'bg-[#28221c] text-zinc-300 border-[#40342a]'
                        : 'bg-[#202028] text-zinc-400 border-[#2d2d38]'
                    }`}
                  >
                    {file.status}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3 mb-3">
              {file.content}
            </p>

            <div className="pt-2 border-t border-[#262630] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-300 font-medium">
                  {file.owner || 'Operador X7'}
                </span>
                <span>•</span>
                <span>{file.date}</span>
              </div>

              <div className="flex items-center space-x-2">
                {file.sharedWith && (
                  <div className="flex items-center space-x-1 text-zinc-400">
                    <Share2 className="w-3 h-3" />
                    <span>{file.sharedWith.join(', ')}</span>
                  </div>
                )}
                <span className="text-zinc-300 group-hover:text-white flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>Abrir</span>
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredFiles.length === 0 && (
          <div className="py-16 text-center text-zinc-500 font-mono text-xs">
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
