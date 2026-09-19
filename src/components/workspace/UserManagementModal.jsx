import React, { useState } from 'react';
import { X, Check, UserPlus, Shield } from 'lucide-react';

export default function UserManagementModal({ isOpen, onClose, onSaveUser }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Operador Standard');
  const [permissions, setPermissions] = useState({
    canSendAgreements: true,
    canEditFiles: true,
    canAccessLogs: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    // Normalizar código para 2 dígitos (1 letra + 1 número)
    const formattedCode = code.trim().toUpperCase().slice(0, 2);

    const newUser = {
      id: `usr_${Date.now()}`,
      code: formattedCode,
      name: name.trim(),
      role,
      status: 'Ativo',
      permissions,
      createdAt: 'Hoje',
    };

    onSaveUser(newUser);
    setCode('');
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-zinc-950 border border-neutral-800 rounded-3xl p-5 shadow-2xl flex flex-col text-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#25252e]">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-zinc-300" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Cadastrar Novo Operador
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-3 space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Código do Operador (2 dígitos: 1 letra + 1 número)
            </label>
            <input
              type="text"
              maxLength={2}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: Z3, A4, B8"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm font-mono text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Codinome / Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Spectre, Falcão, Alex"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Nível de Acesso
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-neutral-600"
            >
              <option value="Operador Standard">Operador Standard</option>
              <option value="Supervisor Tático">Supervisor Tático</option>
              <option value="Apenas Leitura">Apenas Leitura / Auditor</option>
            </select>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-900">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">
              Permissões Autorizadas
            </span>
            <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.canSendAgreements}
                onChange={(e) =>
                  setPermissions({ ...permissions, canSendAgreements: e.target.checked })
                }
                className="rounded bg-neutral-900 border-neutral-800"
              />
              <span>Pode emitir e enviar acordos</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.canEditFiles}
                onChange={(e) =>
                  setPermissions({ ...permissions, canEditFiles: e.target.checked })
                }
                className="rounded bg-neutral-900 border-neutral-800"
              />
              <span>Pode editar arquivos do cofre</span>
            </label>
          </div>

          <div className="pt-3 border-t border-neutral-900 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!code.trim() || !name.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs active:scale-95 transition-all shadow disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cadastrar Operador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
