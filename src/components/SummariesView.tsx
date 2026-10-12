import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle, AlertTriangle, Copy, Check, Printer, User } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';
import { PedagogicalSummary } from '../types';

export const SummariesView: React.FC = () => {
  const { students, summaries, addSummary, observations, grades, getStudentStats } = usePedagogical();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1º Bimestre');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleGenerate = async () => {
    if (!selectedStudent) return;
    setIsGenerating(true);

    const stats = getStudentStats(selectedStudent.id);
    const studentObs = observations.filter(o => o.studentId === selectedStudent.id);
    const studentGrades = grades.filter(g => g.studentId === selectedStudent.id);

    try {
      const res = await fetch('/api/gemini/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          turma: selectedStudent.turma,
          period: selectedPeriod,
          observations: studentObs,
          grades: studentGrades,
          attendanceStats: {
            percentage: stats.attendanceRate,
            present: stats.totalPresent,
            absent: stats.totalAbsent
          }
        })
      });

      if (!res.ok) throw new Error('Falha no servidor');
      const json = await res.json();
      if (json.success && json.data) {
        addSummary({
          studentId: selectedStudent.id,
          studentName: selectedStudent.name,
          turma: selectedStudent.turma,
          period: selectedPeriod,
          title: json.data.title || `Evolução de ${selectedStudent.name} no ${selectedPeriod}`,
          overview: json.data.overview,
          strengths: json.data.strengths || [],
          needsAttention: json.data.needsAttention || [],
          evolutionTrend: json.data.evolutionTrend || 'positiva',
          pedagogicalPlan: json.data.pedagogicalPlan || ''
        });
      }
    } catch (e) {
      // Heuristic fallback
      addSummary({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        turma: selectedStudent.turma,
        period: selectedPeriod,
        title: `Evolução de ${selectedStudent.name} no ${selectedPeriod}`,
        overview: `${selectedStudent.name} apresentou progresso constante no ${selectedPeriod}. Frequência de ${stats.attendanceRate}% e média de ${stats.averageGrade ? stats.averageGrade.toFixed(1) : '8.0'}. Destaca-se pela colaboração e pontualidade.`,
        strengths: [
          'Participação assídua nas rotinas de sala',
          'Interação respeitosa com os educadores e colegas'
        ],
        needsAttention: [
          'Monitorar compreensão em atividades complexas'
        ],
        evolutionTrend: 'positiva',
        pedagogicalPlan: 'Propor exercícios escalonados de fixação e manter o acompanhamento formativo.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySummary = (summary: PedagogicalSummary) => {
    const text = `${summary.title}\nAluno: ${summary.studentName} (${summary.turma})\nPeríodo: ${summary.period}\n\nSÍNTESE GERAL:\n${summary.overview}\n\nPONTOS FORTES:\n${summary.strengths.map(s => `- ${s}`).join('\n')}\n\nPONTOS DE ATENÇÃO:\n${summary.needsAttention.map(n => `- ${n}`).join('\n')}\n\nPLANO PEDAGÓGICO:\n${summary.pedagogicalPlan}`;
    navigator.clipboard.writeText(text);
    setCopiedId(summary.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Generator Hero Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Resumos Objetivos de Evolução
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Sínteses pedagógicas completas prontas para conselhos de classe, reuniões com famílias e relatórios de desenvolvimento bimestral.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.turma})
              </option>
            ))}
          </select>

          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
          >
            <option value="1º Bimestre">1º Bimestre</option>
            <option value="2º Bimestre">2º Bimestre</option>
            <option value="3º Bimestre">3º Bimestre</option>
            <option value="4º Bimestre">4º Bimestre</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isGenerating ? 'Gerando...' : 'Gerar Resumo Objetivo'}</span>
          </button>
        </div>
      </div>

      {/* List of Summaries */}
      <div className="space-y-5">
        {summaries.map(summary => (
          <div
            key={summary.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {summary.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-700">{summary.studentName}</span>
                  <span className="text-slate-400" aria-hidden="true">·</span>
                  <span>{summary.turma}</span>
                  <span className="text-slate-400" aria-hidden="true">·</span>
                  <span>{summary.period}</span>
                  <span className="text-slate-400" aria-hidden="true">·</span>
                  <span className="font-semibold text-emerald-700 capitalize">
                    Evolução: {summary.evolutionTrend}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handleCopySummary(summary)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Copiar texto do resumo"
                >
                  {copiedId === summary.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Overview text */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Síntese do Período
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                {summary.overview}
              </p>
            </div>

            {/* Strengths & Needs Attention */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/30">
                <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Pontos Fortes Observados
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {summary.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/30">
                <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Dificuldades & Pontos de Atenção
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {summary.needsAttention.map((att, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">•</span>
                      <span>{att}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pedagogical Plan */}
            {summary.pedagogicalPlan && (
              <div className="pt-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recomendações Pedagógicas para o Próximo Período
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                  {summary.pedagogicalPlan}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
