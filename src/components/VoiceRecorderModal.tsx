import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Sparkles, Check, X, AlertCircle, Volume2, User, Calendar, BookOpen } from 'lucide-react';
import { usePedagogical } from '../context/PedagogicalContext';
import { ObservationCategory, ObservationCategoryType, SentimentType } from '../types';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentId?: string;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  defaultStudentId
}) => {
  const { students, addObservation } = usePedagogical();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bimester, setBimester] = useState<'1º Bimestre' | '2º Bimestre' | '3º Bimestre' | '4º Bimestre'>('1º Bimestre');
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Structured categories
  const [categories, setCategories] = useState<ObservationCategory[]>([
    { type: 'participação', sentiment: 'positivo', text: '' },
    { type: 'comportamento', sentiment: 'positivo', text: '' },
    { type: 'dificuldades', sentiment: 'neutro', text: '' },
    { type: 'evolução', sentiment: 'positivo', text: '' }
  ]);
  const [activeCategoryTypes, setActiveCategoryTypes] = useState<ObservationCategoryType[]>([
    'participação',
    'evolução'
  ]);
  const [keyInsight, setKeyInsight] = useState<string>('');
  const [intervention, setIntervention] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (defaultStudentId) {
      setSelectedStudentId(defaultStudentId);
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [defaultStudentId, students]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Web Speech API initialization
  const startRecording = () => {
    setErrorMsg(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('O navegador não suporta reconhecimento de voz nativo. Você pode digitar ou usar um exemplo.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Permissão do microfone negada. Conceda acesso nas configurações do navegador.');
        } else if (event.error !== 'no-speech') {
          setErrorMsg(`Aviso de áudio: ${event.error}`);
        }
        stopRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setErrorMsg('Não foi possível iniciar a gravação: ' + (err.message || 'Erro desconhecido'));
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleUsePromptExample = (text: string, studentId?: string) => {
    stopRecording();
    setTranscript(text);
    if (studentId) setSelectedStudentId(studentId);
  };

  const handleAnalyzeWithAI = async () => {
    if (!transcript.trim()) {
      setErrorMsg('Por favor, grave ou digite a observação antes de analisar.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/analyze-observation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          studentName: currentStudent?.name || 'Aluno'
        })
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const json = await res.json();
      if (json.success && json.data) {
        const { categories: returnedCats, keyInsight: insight, recommendedIntervention } = json.data;
        if (Array.isArray(returnedCats) && returnedCats.length > 0) {
          const types = returnedCats.map((c: any) => c.type as ObservationCategoryType);
          setActiveCategoryTypes(Array.from(new Set(types)));
          setCategories(returnedCats);
        }
        if (insight) setKeyInsight(insight);
        if (recommendedIntervention) setIntervention(recommendedIntervention);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      // Fallback local heuristic
      const lower = transcript.toLowerCase();
      const detected: ObservationCategory[] = [];
      const detectedTypes: ObservationCategoryType[] = [];

      if (lower.includes('particip') || lower.includes('falou') || lower.includes('aula') || lower.includes('respondeu')) {
        detectedTypes.push('participação');
        detected.push({
          type: 'participação',
          sentiment: 'positivo',
          text: 'Participação ativa nas discussões e atividades em sala.'
        });
      }
      if (lower.includes('comport') || lower.includes('foco') || lower.includes('atento') || lower.includes('disperso')) {
        detectedTypes.push('comportamento');
        detected.push({
          type: 'comportamento',
          sentiment: lower.includes('dispers') ? 'atencao' : 'positivo',
          text: 'Postura e atenção durante a aula.'
        });
      }
      if (lower.includes('dificuldade') || lower.includes('dúvida') || lower.includes('insegur') || lower.includes('errou')) {
        detectedTypes.push('dificuldades');
        detected.push({
          type: 'dificuldades',
          sentiment: 'atencao',
          text: 'Dificuldade observada em tópicos específicos.'
        });
      }
      if (lower.includes('evolu') || lower.includes('melhor') || lower.includes('avanço') || lower.includes('progred')) {
        detectedTypes.push('evolução');
        detected.push({
          type: 'evolução',
          sentiment: 'positivo',
          text: 'Evolução perceptível comparada às semanas anteriores.'
        });
      }

      if (detected.length > 0) {
        setActiveCategoryTypes(detectedTypes);
        setCategories(detected);
      }
      setKeyInsight(transcript.slice(0, 80) + '...');
      setIntervention('Realizar acompanhamento na próxima aula e registrar continuidade.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCategoryType = (type: ObservationCategoryType) => {
    setActiveCategoryTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSave = () => {
    if (!selectedStudentId) {
      setErrorMsg('Selecione um aluno para vincular a observação.');
      return;
    }
    if (!transcript.trim()) {
      setErrorMsg('O relato de voz ou texto não pode estar vazio.');
      return;
    }

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    // Filter categories to active ones
    const finalCategories = categories.filter(c => activeCategoryTypes.includes(c.type));
    if (finalCategories.length === 0) {
      finalCategories.push({
        type: 'participação',
        sentiment: 'positivo',
        text: transcript.slice(0, 100)
      });
    }

    addObservation({
      studentId: student.id,
      studentName: student.name,
      turma: student.turma,
      date,
      transcript: transcript.trim(),
      audioRecorded: true,
      categories: finalCategories,
      keyInsight: keyInsight || transcript.slice(0, 90) + '...',
      intervention: intervention || 'Acompanhar na rotina semanal.',
      bimester
    });

    stopRecording();
    onClose();
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              Registro por Voz de Observação Qualitativa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fale livremente sobre participação, comportamento, dificuldades ou evolução do aluno
            </p>
          </div>
          <button
            onClick={() => {
              stopRecording();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student, Turma & Date Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Aluno(a)
              </label>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.turma})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Data da Observação
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                Bimestre / Período
              </label>
              <select
                value={bimester}
                onChange={e => setBimester(e.target.value as any)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              >
                <option value="1º Bimestre">1º Bimestre</option>
                <option value="2º Bimestre">2º Bimestre</option>
                <option value="3º Bimestre">3º Bimestre</option>
                <option value="4º Bimestre">4º Bimestre</option>
              </select>
            </div>
          </div>

          {/* BIG VOICE RECORDING BUTTON AREA */}
          <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {isRecording ? 'Gravando áudio do professor...' : 'Pressione para iniciar a fala'}
              </span>
            </div>

            {/* THE BIG BUTTON */}
            <div className="relative my-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all shadow-lg select-none cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-record-pulse shadow-rose-500/30 ring-4 ring-rose-300'
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-slate-900/20'
                }`}
                title={isRecording ? 'Parar gravação' : 'Gravar por voz'}
              >
                {isRecording ? (
                  <>
                    <Square className="w-8 h-8 fill-current mb-1" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Parar</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-9 h-9 mb-1" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Gravar Voz</span>
                  </>
                )}
              </button>
            </div>

            {/* Timer & Live Indicator */}
            {isRecording ? (
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                <span className="font-mono text-sm font-semibold text-rose-700 tabular-nums">
                  {formatTimer(recordingSeconds)}
                </span>
                <span className="text-xs text-slate-500">· Ouvindo em Português...</span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500 max-w-sm">
                Toque no botão e fale naturalmente. O áudio é transcrito em tempo real e você pode editar a qualquer momento.
              </p>
            )}

            {/* Quick Simulation Prompts for Testing */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 w-full">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-2">
                Simulações de voz prontas para teste rápido:
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button
                  type="button"
                  onClick={() =>
                    handleUsePromptExample(
                      'Alice participou com muito entusiasmo na resolução de frações e ajudou o colega Bernardo a entender o cálculo.',
                      's-alice'
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 transition-colors"
                >
                  "Alice: participativa em frações"
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUsePromptExample(
                      'Bernardo apresentou dispersão no início da aula, mas recuperou o foco ao fracionar a atividade em pequenas etapas e concluiu.',
                      's-bernardo'
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 transition-colors"
                >
                  "Bernardo: foco e etapas"
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUsePromptExample(
                      'Clara dominou todos os conceitos matemáticos, realizou os exercícios sem erros, mas demonstrou timidez ao falar em público.',
                      's-clara'
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 transition-colors"
                >
                  "Clara: raciocínio e timidez"
                </button>
              </div>
            </div>
          </div>

          {/* Transcript Live Text Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                Transcrição / Relato do Professor
              </label>
              <button
                type="button"
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing || !transcript.trim()}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                {isAnalyzing ? 'Estruturando com IA...' : 'Classificar com IA'}
              </button>
            </div>
            <textarea
              rows={3}
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="O que você observou sobre a participação, comportamento, dificuldades ou evolução do aluno? O texto falado aparecerá aqui..."
              className="w-full text-sm bg-white border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none leading-relaxed"
            />
          </div>

          {/* Aspect Badges / Tag Selector (Participação, Comportamento, Dificuldades, Evolução) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Dimensões Qualitativas Destacadas:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['participação', 'comportamento', 'dificuldades', 'evolução'] as ObservationCategoryType[]).map(type => {
                const isActive = activeCategoryTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleCategoryType(type)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="capitalize">{type}</span>
                    {isActive ? <Check className="w-3.5 h-3.5" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Insight & Pedagogical Intervention */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Síntese / Insight Principal
              </label>
              <input
                type="text"
                value={keyInsight}
                onChange={e => setKeyInsight(e.target.value)}
                placeholder="Ex: Excelente autonomia na resolução de problemas."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intervenção / Próxima Ação Pedagógica
              </label>
              <input
                type="text"
                value={intervention}
                onChange={e => setIntervention(e.target.value)}
                placeholder="Ex: Propor desafios graduais e manter reforço positivo."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={() => {
              stopRecording();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!transcript.trim()}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Salvar Observação
          </button>
        </div>
      </div>
    </div>
  );
};
