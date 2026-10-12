import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent } = usePedagogical();

  const [name, setName] = useState('');
  const [turma, setTurma] = useState('5º Ano A');
  const [birthDate, setBirthDate] = useState('2014-05-10');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addStudent({
      name: name.trim(),
      turma,
      birthDate,
      guardianName: guardianName.trim() || undefined,
      guardianPhone: guardianPhone.trim() || undefined,
      specialNeeds: specialNeeds.trim() || undefined
    });

    setName('');
    setGuardianName('');
    setGuardianPhone('');
    setSpecialNeeds('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Aluno</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Aluno</label>
            <input
              type="text"
              required
              placeholder="Ex: Lucas Ferreira Silva"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Turma</label>
              <select
                value={turma}
                onChange={e => setTurma(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              >
                <option value="5º Ano A">5º Ano A</option>
                <option value="6º Ano B">6º Ano B</option>
                <option value="7º Ano A">7º Ano A</option>
                <option value="9º Ano A">9º Ano A</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Nascimento</label>
              <input
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Responsável</label>
            <input
              type="text"
              placeholder="Ex: Mariana Silva"
              value={guardianName}
              onChange={e => setGuardianName(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone de Contato</label>
            <input
              type="text"
              placeholder="Ex: (11) 98765-4321"
              value={guardianPhone}
              onChange={e => setGuardianPhone(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Observações ou Necessidades Específicas</label>
            <input
              type="text"
              placeholder="Ex: Requer incentivo na leitura, usa óculos..."
              value={specialNeeds}
              onChange={e => setSpecialNeeds(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cadastrar Aluno</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
