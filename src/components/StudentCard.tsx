import React from 'react';
import { Mic, Plus, FileText, ChevronRight } from 'lucide-react';
import { Student } from '../types';
import { usePedagogical } from '../context/PedagogicalContext';

interface StudentCardProps {
  student: Student;
  onOpenDetail: (student: Student) => void;
  onRecordVoice: (studentId: string) => void;
  onAddGrade: (studentId: string) => void;
  onOpenSummary: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onOpenDetail,
  onRecordVoice,
  onAddGrade,
  onOpenSummary
}) => {
  const { getStudentStats, observations } = usePedagogical();
  const stats = getStudentStats(student.id);

  // Latest observation
  const studentObs = observations
    .filter(o => o.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestObs = studentObs[0];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      {/* Header with Avatar & Student Info */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl ${student.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}
            >
              {getInitials(student.name)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onOpenDetail(student)}>
                {student.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {student.turma}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDetail(student)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Ver prontuário pedagógico do aluno"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Key Metrics: Attendance & Average Grade (tabular-nums, clean unboxed presentation) */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50/70 rounded-xl border border-slate-100 text-center mb-4">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Frequência</div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              {stats.attendanceRate}%
            </div>
          </div>
          <div className="border-x border-slate-200/60">
            <div className="text-[11px] font-medium text-slate-500">Média Geral</div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              {stats.averageGrade !== null ? stats.averageGrade.toFixed(1) : '-'}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Registros</div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              {stats.observationsCount}
            </div>
          </div>
        </div>

        {/* Latest Observation Snippet */}
        {latestObs ? (
          <div className="text-xs text-slate-600 mb-4 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Última observação</span>
              <span className="tabular-nums">{latestObs.date}</span>
            </div>
            <p className="line-clamp-2 italic text-slate-700">
              "{latestObs.transcript}"
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic mb-4 py-2">
            Nenhuma observação qualitativa registrada ainda.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={() => onOpenSummary(student)}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 py-1 px-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>Resumo de Evolução</span>
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => onAddGrade(student.id)}
            className="p-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Lançar Nota"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onRecordVoice(student.id)}
            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            title="Gravar observação por voz"
          >
            <Mic className="w-3 h-3 text-rose-400" />
            <span>Voz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
