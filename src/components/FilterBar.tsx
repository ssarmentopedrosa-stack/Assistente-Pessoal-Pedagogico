import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';
import { FilterPeriod } from '../types';

export const FilterBar: React.FC = () => {
  const {
    students,
    selectedTurma,
    setSelectedTurma,
    selectedPeriod,
    setSelectedPeriod,
    searchQuery,
    setSearchQuery
  } = usePedagogical();

  // Extract unique turmas
  const turmas = ['todas', ...Array.from(new Set(students.map(s => s.turma)))];

  const periods: { key: FilterPeriod; label: string }[] = [
    { key: 'todos', label: 'Todos os Períodos' },
    { key: '1º Bimestre', label: '1º Bimestre' },
    { key: '2º Bimestre', label: '2º Bimestre' },
    { key: '3º Bimestre', label: '3º Bimestre' },
    { key: '4º Bimestre', label: '4º Bimestre' },
    { key: 'ultimos_30_dias', label: 'Últimos 30 Dias' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input for students */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome do aluno..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
            Período:
          </label>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value as FilterPeriod)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {periods.map(p => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Turma Segmented Filter Tabs */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Turma:
        </span>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {turmas.map(t => {
            const isActive = selectedTurma === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedTurma(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'todas' ? 'Todas as Turmas' : t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
