import React, { useState } from 'react';
import { Mic, Search, Trash2, Calendar, User, Sparkles, Filter, Volume2 } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';
import { ObservationCategoryType } from '../types';

interface ObservationsViewProps {
  onOpenVoiceModal: (studentId?: string) => void;
}

export const ObservationsView: React.FC<ObservationsViewProps> = ({ onOpenVoiceModal }) => {
  const { observations, students, deleteObservation } = usePedagogical();

  const [selectedTurma, setSelectedTurma] = useState<string>('todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [search, setSearch] = useState<string>('');

  const turmas = ['todas', ...Array.from(new Set(students.map(s => s.turma)))];

  const filteredObservations = observations.filter(obs => {
    if (selectedTurma !== 'todas' && obs.turma !== selectedTurma) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = obs.studentName.toLowerCase().includes(q);
      const matchText = obs.transcript.toLowerCase().includes(q);
      if (!matchName && !matchText) return false;
    }
    if (selectedCategory !== 'todas') {
      const hasCat = obs.categories.some(c => c.type === selectedCategory);
      if (!hasCat) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Registro de Observações Qualitativas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento individualizado de participação, comportamento, dificuldades e evolução
          </p>
        </div>

        <button
          onClick={() => onOpenVoiceModal()}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Mic className="w-4 h-4 text-rose-400" />
          <span>Gravar Nova Observação por Voz</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome do aluno ou texto da observação..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Turma:</span>
            <select
              value={selectedTurma}
              onChange={e => setSelectedTurma(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              {turmas.map(t => (
                <option key={t} value={t}>
                  {t === 'todas' ? 'Todas' : t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Dimensão:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 capitalize"
            >
              <option value="todas">Todas as Dimensões</option>
              <option value="participação">Participação</option>
              <option value="comportamento">Comportamento</option>
              <option value="dificuldades">Dificuldades</option>
              <option value="evolução">Evolução</option>
            </select>
          </div>
        </div>
      </div>

      {/* Observations Timeline Cards */}
      {filteredObservations.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6 text-slate-400">
          <p className="text-sm font-semibold text-slate-700">Nenhuma observação encontrada</p>
          <p className="text-xs text-slate-500 mt-1">Ajuste os filtros ou grave uma nova observação por voz.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredObservations.map(obs => (
            <div
              key={obs.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {obs.studentName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{obs.studentName}</h3>
                      <span className="text-slate-400" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-600">{obs.turma}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="tabular-nums">{obs.date}</span>
                      <span className="text-slate-400" aria-hidden="true">·</span>
                      <span>{obs.bimester}</span>
                      {obs.audioRecorded && (
                        <>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 text-rose-600 font-medium">
                            <Volume2 className="w-3 h-3" /> Gravado por voz
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteObservation(obs.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Excluir observação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Speech Transcript */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800 italic leading-relaxed">
                "{obs.transcript}"
              </div>

              {/* Qualitative Dimensions (Clean text per Zero-Pill discipline) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {obs.categories.map((c, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg border border-slate-100 bg-white flex flex-col"
                  >
                    <span className="font-semibold text-slate-900 capitalize text-[11px] mb-0.5">
                      {c.type}:
                    </span>
                    <span className="text-slate-600 text-xs leading-normal">
                      {c.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Insight & Pedagogical Action */}
              {(obs.keyInsight || obs.intervention) && (
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  {obs.keyInsight && (
                    <div className="text-slate-700">
                      <span className="font-semibold text-slate-900">Síntese: </span>
                      {obs.keyInsight}
                    </div>
                  )}
                  {obs.intervention && (
                    <div className="text-slate-600 italic">
                      <span className="font-semibold not-italic text-slate-800">Ação: </span>
                      {obs.intervention}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
