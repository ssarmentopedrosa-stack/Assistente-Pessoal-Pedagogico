import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';
import { AttendanceView } from './AttendanceView';

interface FrequenciaNotasViewProps {
  onOpenAddGrade: (studentId?: string) => void;
}

export const FrequenciaNotasView: React.FC<FrequenciaNotasViewProps> = ({ onOpenAddGrade }) => {
  const { grades, students, deleteGrade } = usePedagogical();

  const [subTab, setSubTab] = useState<'frequencia' | 'notas'>('frequencia');
  const [selectedTurma, setSelectedTurma] = useState<string>('todas');
  const [selectedSubject, setSelectedSubject] = useState<string>('todas');

  const turmas = ['todas', ...Array.from(new Set(students.map(s => s.turma)))];
  const subjects = ['todas', ...Array.from(new Set(grades.map(g => g.subject)))];

  const filteredGrades = grades.filter(g => {
    if (selectedTurma !== 'todas' && g.turma !== selectedTurma) return false;
    if (selectedSubject !== 'todas' && g.subject !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Sub-tab Switcher (Segmented button control) */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSubTab('frequencia')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              subTab === 'frequencia'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chamada & Frequência
          </button>
          <button
            onClick={() => setSubTab('notas')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              subTab === 'notas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lançamento de Notas ({grades.length})
          </button>
        </div>

        {subTab === 'notas' && (
          <button
            onClick={() => onOpenAddGrade()}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Lançar Nota</span>
          </button>
        )}
      </div>

      {subTab === 'frequencia' ? (
        <AttendanceView />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          {/* Filters for grades */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Histórico de Avaliações e Notas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Notas associadas a cada aluno, turma e data
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Turma:</span>
                <select
                  value={selectedTurma}
                  onChange={e => setSelectedTurma(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                >
                  {turmas.map(t => (
                    <option key={t} value={t}>
                      {t === 'todas' ? 'Todas' : t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Disciplina:</span>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>
                      {s === 'todas' ? 'Todas' : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grades Table */}
          {filteredGrades.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-xs">Nenhuma nota encontrada para os filtros selecionados.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Aluno</th>
                    <th className="py-3 px-3">Turma</th>
                    <th className="py-3 px-3">Disciplina</th>
                    <th className="py-3 px-3">Avaliação</th>
                    <th className="py-3 px-3">Data</th>
                    <th className="py-3 px-3">Bimestre</th>
                    <th className="py-3 px-4 text-right">Nota</th>
                    <th className="py-3 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGrades.map(g => {
                    const student = students.find(s => s.id === g.studentId);
                    return (
                      <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {student?.name || 'Aluno'}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{g.turma}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{g.subject}</td>
                        <td className="py-3 px-3 text-slate-600">{g.assessmentName}</td>
                        <td className="py-3 px-3 text-slate-500 tabular-nums">{g.date}</td>
                        <td className="py-3 px-3 text-slate-500">{g.bimester}</td>
                        <td className="py-3 px-4 text-right font-bold tabular-nums">
                          <span className={g.score < 6 ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                            {g.score.toFixed(1)}
                          </span>
                          <span className="text-slate-400 font-normal"> / {g.maxScore.toFixed(1)}</span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => deleteGrade(g.id)}
                            className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                            title="Remover nota"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
