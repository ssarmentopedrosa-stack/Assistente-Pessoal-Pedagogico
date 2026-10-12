import React, { useState } from 'react';
import { AlertCircle, Calendar, Check, Plus, Clock, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';

export const PendenciesAndUpcomingSection: React.FC = () => {
  const {
    pendencies,
    resolvePendency,
    scheduledAssessments,
    toggleAssessmentCompleted,
    addScheduledAssessment,
    students
  } = usePedagogical();

  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [newTestTurma, setNewTestTurma] = useState('5º Ano A');
  const [newTestSubject, setNewTestSubject] = useState('Matemática');
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestDate, setNewTestDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newTestWeight, setNewTestWeight] = useState(3.0);
  const [newTestTopics, setNewTestTopics] = useState('');

  const activePendencies = pendencies.filter(p => !p.resolved);
  const upcomingTests = scheduledAssessments
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim()) return;

    addScheduledAssessment({
      turma: newTestTurma,
      subject: newTestSubject,
      title: newTestTitle.trim(),
      date: newTestDate,
      weight: Number(newTestWeight),
      topics: newTestTopics.trim() || 'Conteúdo bimestral'
    });

    setNewTestTitle('');
    setNewTestTopics('');
    setIsAddTestOpen(false);
  };

  const getDaysDiff = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Pendências Pedagógicas em Destaque */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <h2 className="text-base font-bold text-slate-900">
                Pendências Pedagógicas
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="tabular-nums font-semibold text-slate-900">{activePendencies.length}</span> ativas
            </div>
          </div>

          {activePendencies.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="text-sm font-medium text-slate-700">Tudo em dia!</p>
              <p className="text-xs text-slate-500 mt-0.5">Nenhuma pendência ou aluno em risco no momento.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1">
              {activePendencies.map(pend => (
                <div
                  key={pend.id}
                  className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-900">{pend.title}</span>
                      <span className="text-slate-400" aria-hidden="true">·</span>
                      <span className="text-slate-600">{pend.turma}</span>
                      {pend.dueDate && (
                        <>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="text-slate-500 tabular-nums">Prazo: {pend.dueDate}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pend.description}
                    </p>
                  </div>

                  <button
                    onClick={() => resolvePendency(pend.id)}
                    className="shrink-0 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1"
                    title="Marcar pendência como concluída"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Concluir</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Próximos Testes & Avaliações */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <h2 className="text-base font-bold text-slate-900">
                Próximos Testes & Avaliações
              </h2>
            </div>
            <button
              onClick={() => setIsAddTestOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agendar Teste</span>
            </button>
          </div>

          {upcomingTests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
              <Calendar className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-700">Nenhum teste agendado</p>
              <p className="text-xs text-slate-500 mt-0.5">Use o botão acima para registrar a próxima prova.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1">
              {upcomingTests.map(test => {
                const daysDiff = getDaysDiff(test.date);
                let timeLabel = '';
                if (daysDiff < 0) timeLabel = 'Data passada';
                else if (daysDiff === 0) timeLabel = 'Hoje';
                else if (daysDiff === 1) timeLabel = 'Amanhã';
                else timeLabel = `Em ${daysDiff} dias`;

                return (
                  <div
                    key={test.id}
                    className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <span className="font-semibold text-slate-900">{test.title}</span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="text-slate-600">{test.turma}</span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="text-slate-600">{test.subject}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {test.topics}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-700">{timeLabel}</span>
                        <span>({test.date})</span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="tabular-nums">Peso {test.weight.toFixed(1)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAssessmentCompleted(test.id)}
                      className="shrink-0 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1"
                      title="Marcar teste como aplicado"
                    >
                      <Check className="w-3.5 h-3.5 text-slate-500" />
                      <span>Aplicado</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Agendar Novo Teste */}
      {isAddTestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Agendar Próxima Avaliação</h3>
              <button
                onClick={() => setIsAddTestOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Teste / Prova</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prova Bimestral 2: Operações e Frações"
                  value={newTestTitle}
                  onChange={e => setNewTestTitle(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Turma</label>
                  <select
                    value={newTestTurma}
                    onChange={e => setNewTestTurma(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="5º Ano A">5º Ano A</option>
                    <option value="6º Ano B">6º Ano B</option>
                    <option value="7º Ano A">7º Ano A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Disciplina</label>
                  <select
                    value={newTestSubject}
                    onChange={e => setNewTestSubject(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Matemática">Matemática</option>
                    <option value="Língua Portuguesa">Língua Portuguesa</option>
                    <option value="Ciências">Ciências</option>
                    <option value="História">História</option>
                    <option value="Geografia">Geografia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data da Aplicação</label>
                  <input
                    type="date"
                    required
                    value={newTestDate}
                    onChange={e => setNewTestDate(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Peso da Nota</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={newTestWeight}
                    onChange={e => setNewTestWeight(Number(e.target.value))}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tópicos e Conteúdos Avaliados</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Capítulos 3 e 4 do livro didático, resolução de equações..."
                  value={newTestTopics}
                  onChange={e => setNewTestTopics(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTestOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                >
                  Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
