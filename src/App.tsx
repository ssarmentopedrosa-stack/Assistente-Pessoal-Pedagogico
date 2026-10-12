import React, { useState } from 'react';
import {
  Mic,
  Plus,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Volume2
} from 'lucide-react';
import { PedagogicalProvider, usePedagogical } from './context/PedagogicalContext';
import { Student } from './types';
import { TopBar } from './components/TopBar';
import { PendenciesAndUpcomingSection } from './components/PendenciesAndUpcomingSection';
import { FilterBar } from './components/FilterBar';
import { StudentCard } from './components/StudentCard';
import { StudentDetailModal } from './components/StudentDetailModal';
import { VoiceRecorderModal } from './components/VoiceRecorderModal';
import { AddGradeModal } from './components/AddGradeModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ObservationsView } from './components/ObservationsView';
import { FrequenciaNotasView } from './components/FrequenciaNotasView';
import { SummariesView } from './components/SummariesView';

function PedagogicalAppContent() {
  const {
    students,
    selectedTurma,
    selectedPeriod,
    searchQuery,
    pendencies,
    observations,
    grades,
    resetAllData
  } = usePedagogical();

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'observacoes' | 'frequencia_notas' | 'resumos'>('dashboard');

  // Modals state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceTargetStudentId, setVoiceTargetStudentId] = useState<string | undefined>(undefined);

  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isAddGradeModalOpen, setIsAddGradeModalOpen] = useState(false);
  const [gradeTargetStudentId, setGradeTargetStudentId] = useState<string | undefined>(undefined);

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  // Active pendencies count
  const activePendenciesCount = pendencies.filter(p => !p.resolved).length;

  // Filter students
  const filteredStudents = students.filter(student => {
    if (selectedTurma !== 'todas' && student.turma !== selectedTurma) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!student.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleOpenVoice = (studentId?: string) => {
    setVoiceTargetStudentId(studentId);
    setIsVoiceModalOpen(true);
  };

  const handleOpenGrade = (studentId?: string) => {
    setGradeTargetStudentId(studentId);
    setIsAddGradeModalOpen(true);
  };

  const handleOpenStudentDetail = (student: Student) => {
    setSelectedStudentForDetail(student);
    setIsDetailModalOpen(true);
  };

  const handleOpenStudentSummary = (student: Student) => {
    setSelectedStudentForDetail(student);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-slate-900 selection:text-white">
      {/* Universal TopBar */}
      <TopBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenVoiceModal={() => handleOpenVoice()}
        pendenciesCount={activePendenciesCount}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: VISÃO GERAL (DASHBOARD) */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Hero Banner with Voice Action Button */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Painel de Acompanhamento Pedagógico
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Registre por voz anotações qualitativas dos alunos sobre participação, comportamento, dificuldades e evolução. Consulte médias, faltas e gere resumos objetivos para reuniões escolares.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
                  <span>{students.length} alunos cadastrados</span>
                  <span aria-hidden="true">·</span>
                  <span>{observations.length} observações registradas</span>
                  <span aria-hidden="true">·</span>
                  <span>{grades.length} notas lançadas</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Aluno</span>
                </button>

                <button
                  onClick={() => handleOpenVoice()}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Mic className="w-4 h-4 text-rose-400" />
                  <span>Gravar por Voz</span>
                </button>
              </div>
            </div>

            {/* Pendências e Próximos Testes em Destaque */}
            <PendenciesAndUpcomingSection />

            {/* Consultas por Turma, Aluno e Período */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Alunos & Prontuários Pedagógicos
                </h2>
                <div className="text-xs text-slate-500">
                  Mostrando <span className="font-semibold text-slate-800">{filteredStudents.length}</span> alunos
                </div>
              </div>

              <FilterBar />

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6 text-slate-400">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-700">Nenhum aluno encontrado</p>
                  <p className="text-xs text-slate-500 mt-1">Tente ajustar a busca ou a turma selecionada.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredStudents.map(student => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onOpenDetail={handleOpenStudentDetail}
                      onRecordVoice={handleOpenVoice}
                      onAddGrade={handleOpenGrade}
                      onOpenSummary={handleOpenStudentSummary}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: OBSERVAÇÕES POR VOZ */}
        {currentTab === 'observacoes' && (
          <ObservationsView onOpenVoiceModal={handleOpenVoice} />
        )}

        {/* TAB 3: FREQUÊNCIA & NOTAS */}
        {currentTab === 'frequencia_notas' && (
          <FrequenciaNotasView onOpenAddGrade={handleOpenGrade} />
        )}

        {/* TAB 4: RESUMOS OBJETIVOS */}
        {currentTab === 'resumos' && (
          <SummariesView />
        )}
      </main>

      {/* Floating Action Button (Mobile-friendly big button) */}
      <aside aria-label="Ação rápida de gravação" className="fixed bottom-6 right-6 z-30 md:hidden">
        <button
          onClick={() => handleOpenVoice()}
          className="w-16 h-16 rounded-full bg-slate-900 text-white shadow-2xl flex flex-col items-center justify-center border-2 border-white hover:scale-105 active:scale-95 transition-all"
          title="Gravar observação por voz"
        >
          <Mic className="w-6 h-6 text-rose-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Voz</span>
        </button>
      </aside>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">Acompanhamento Pedagógico</span> · Sistema de registro qualitativo docente
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={resetAllData}
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
              title="Restaurar dados de exemplo iniciais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Dados Iniciais</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => {
          setIsVoiceModalOpen(false);
          setVoiceTargetStudentId(undefined);
        }}
        defaultStudentId={voiceTargetStudentId}
      />

      <StudentDetailModal
        student={selectedStudentForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudentForDetail(null);
        }}
        onRecordVoice={handleOpenVoice}
        onAddGrade={handleOpenGrade}
      />

      <AddGradeModal
        isOpen={isAddGradeModalOpen}
        onClose={() => {
          setIsAddGradeModalOpen(false);
          setGradeTargetStudentId(undefined);
        }}
        defaultStudentId={gradeTargetStudentId}
      />

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PedagogicalProvider>
      <PedagogicalAppContent />
    </PedagogicalProvider>
  );
}
