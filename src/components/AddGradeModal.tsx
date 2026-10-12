import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';

interface AddGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentId?: string;
}

export const AddGradeModal: React.FC<AddGradeModalProps> = ({
  isOpen,
  onClose,
  defaultStudentId
}) => {
  const { students, addGrade } = usePedagogical();

  const [studentId, setStudentId] = useState(defaultStudentId || '');
  const [subject, setSubject] = useState('Matemática');
  const [assessmentName, setAssessmentName] = useState('');
  const [score, setScore] = useState<number>(8.0);
  const [maxScore, setMaxScore] = useState<number>(10.0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bimester, setBimester] = useState<'1º Bimestre' | '2º Bimestre' | '3º Bimestre' | '4º Bimestre'>('1º Bimestre');

  useEffect(() => {
    if (defaultStudentId) {
      setStudentId(defaultStudentId);
    } else if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [defaultStudentId, students]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === studentId);
    if (!student || !assessmentName.trim()) return;

    addGrade({
      studentId: student.id,
      turma: student.turma,
      subject,
      assessmentName: assessmentName.trim(),
      score: Number(score),
      maxScore: Number(maxScore),
      date,
      bimester
    });

    setAssessmentName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Lançar Nota de Avaliação</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Aluno(a)</label>
            <select
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.turma})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Disciplina</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              >
                <option value="Matemática">Matemática</option>
                <option value="Língua Portuguesa">Língua Portuguesa</option>
                <option value="Ciências">Ciências</option>
                <option value="História">História</option>
                <option value="Geografia">Geografia</option>
                <option value="Arte">Arte</option>
                <option value="Educação Física">Educação Física</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bimestre</label>
              <select
                value={bimester}
                onChange={e => setBimester(e.target.value as any)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              >
                <option value="1º Bimestre">1º Bimestre</option>
                <option value="2º Bimestre">2º Bimestre</option>
                <option value="3º Bimestre">3º Bimestre</option>
                <option value="4º Bimestre">4º Bimestre</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Avaliação</label>
            <input
              type="text"
              required
              placeholder="Ex: Prova de Frações, Trabalho em Grupo, etc."
              value={assessmentName}
              onChange={e => setAssessmentName(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nota Obtida</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={maxScore}
                value={score}
                onChange={e => setScore(Number(e.target.value))}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold tabular-nums focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nota Máxima</label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={maxScore}
                onChange={e => setMaxScore(Number(e.target.value))}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 tabular-nums focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
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
              <span>Salvar Nota</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
