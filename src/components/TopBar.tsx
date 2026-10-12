import React from 'react';
import { Mic } from 'lucide-react';

interface TopBarProps {
  currentTab: 'dashboard' | 'observacoes' | 'frequencia_notas' | 'resumos';
  setCurrentTab: (tab: 'dashboard' | 'observacoes' | 'frequencia_notas' | 'resumos') => void;
  onOpenVoiceModal: () => void;
  pendenciesCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenVoiceModal,
  pendenciesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-slate-700 transition-colors flex items-center gap-2 text-left"
            >
              <span className="w-3 h-3 rounded-sm bg-slate-900 inline-block"></span>
              Acompanhamento Pedagógico
            </button>
          </div>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'dashboard'
                  ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-slate-900'
                  : ''
              }`}
            >
              Visão Geral
            </button>

            <button
              onClick={() => setCurrentTab('observacoes')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'observacoes'
                  ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-slate-900'
                  : ''
              }`}
            >
              Observações por Voz
            </button>

            <button
              onClick={() => setCurrentTab('frequencia_notas')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'frequencia_notas'
                  ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-slate-900'
                  : ''
              }`}
            >
              Frequência & Notas
            </button>

            <button
              onClick={() => setCurrentTab('resumos')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'resumos'
                  ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-slate-900'
                  : ''
              }`}
            >
              Resumos de Evolução
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenVoiceModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0"
              title="Gravar observação pedagógica por voz"
            >
              <Mic className="w-3.5 h-3.5 text-rose-400" />
              <span>Gravar por Voz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Tab Bar */}
      <div className="md:hidden border-t border-slate-100 flex overflow-x-auto px-4 py-2 gap-4 text-xs font-medium text-slate-600 no-scrollbar">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`whitespace-nowrap shrink-0 py-1 ${
            currentTab === 'dashboard' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''
          }`}
        >
          Visão Geral {pendenciesCount > 0 ? `(${pendenciesCount})` : ''}
        </button>
        <button
          onClick={() => setCurrentTab('observacoes')}
          className={`whitespace-nowrap shrink-0 py-1 ${
            currentTab === 'observacoes' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''
          }`}
        >
          Observações
        </button>
        <button
          onClick={() => setCurrentTab('frequencia_notas')}
          className={`whitespace-nowrap shrink-0 py-1 ${
            currentTab === 'frequencia_notas' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''
          }`}
        >
          Frequência & Notas
        </button>
        <button
          onClick={() => setCurrentTab('resumos')}
          className={`whitespace-nowrap shrink-0 py-1 ${
            currentTab === 'resumos' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''
          }`}
        >
          Resumos
        </button>
      </div>
    </header>
  );
};
