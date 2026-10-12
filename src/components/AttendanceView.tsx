import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Check } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';
import { AttendanceStatus } from '../types';

export const AttendanceView: React.FC = () => {
  const { students, attendance, recordAttendance, recordBulkAttendance } = usePedagogical();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTurma, setSelectedTurma] = useState<string>('5º Ano A');
  const [showToast, setShowToast] = useState<boolean>(false);

  const turmas = Array.from(new Set(students.map(s => s.turma)));
  const turmaStudents = students.filter(s => s.turma === selectedTurma);

  const getStudentStatusForDate = (studentId: string): AttendanceStatus => {
    const record = attendance.find(a => a.studentId === studentId && a.date === selectedDate);
    return record ? record.status : 'presente';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    recordAttendance(studentId, selectedDate, status);
  };

  const handleMarkAllPresent = () => {
    const bulk = turmaStudents.map(s => ({
      studentId: s.id,
      date: selectedDate,
      status: 'presente' as AttendanceStatus
    }));
    recordBulkAttendance(bulk);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Stats for current date & turma
  const currentRecords = attendance.filter(
    a => a.turma === selectedTurma && a.date === selectedDate
  );
  const presentCount = turmaStudents.filter(
    s => getStudentStatusForDate(s.id) === 'presente'
  ).length;
  const absentCount = turmaStudents.filter(
    s => getStudentStatusForDate(s.id) === 'falta'
  ).length;
  const justifiedCount = turmaStudents.filter(
    s => getStudentStatusForDate(s.id) === 'falta_justificada'
  ).length;
  const lateCount = turmaStudents.filter(
    s => getStudentStatusForDate(s.id) === 'atraso'
  ).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Chamada & Frequência Diária
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro diário associado ao aluno e à data da aula
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Turma:</span>
            <select
              value={selectedTurma}
              onChange={e => setSelectedTurma(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              {turmas.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Data:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 tabular-nums"
            />
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Todos Presentes</span>
          </button>
        </div>
      </div>

      {showToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Chamada concluída com sucesso: todos os alunos marcados como presentes na data.</span>
        </div>
      )}

      {/* Stats Summary Strip (Unboxed clean text) */}
      <div className="grid grid-cols-4 gap-2 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
        <div>
          <div className="text-[11px] font-medium text-slate-500">Presentes</div>
          <div className="text-sm font-bold text-emerald-700 tabular-nums">{presentCount}</div>
        </div>
        <div className="border-x border-slate-200/60">
          <div className="text-[11px] font-medium text-slate-500">Faltas</div>
          <div className="text-sm font-bold text-rose-700 tabular-nums">{absentCount}</div>
        </div>
        <div className="border-r border-slate-200/60">
          <div className="text-[11px] font-medium text-slate-500">Justificadas</div>
          <div className="text-sm font-bold text-blue-700 tabular-nums">{justifiedCount}</div>
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Atrasos</div>
          <div className="text-sm font-bold text-amber-700 tabular-nums">{lateCount}</div>
        </div>
      </div>

      {/* Student List with Tactile Roll-Call Buttons */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {turmaStudents.map(student => {
          const currentStatus = getStudentStatusForDate(student.id);

          return (
            <div
              key={student.id}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${student.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                >
                  {student.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{student.name}</div>
                  <div className="text-xs text-slate-400">{student.turma}</div>
                </div>
              </div>

              {/* Status Selector Segment */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.id, 'presente')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentStatus === 'presente'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Presente
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.id, 'falta')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentStatus === 'falta'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Falta
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.id, 'falta_justificada')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentStatus === 'falta_justificada'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Justificada
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.id, 'atraso')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentStatus === 'atraso'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Atraso
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
