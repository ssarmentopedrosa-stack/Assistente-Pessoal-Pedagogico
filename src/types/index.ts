export type ObservationCategoryType = 'participação' | 'comportamento' | 'dificuldades' | 'evolução';

export type SentimentType = 'positivo' | 'neutro' | 'atencao';

export interface ObservationCategory {
  type: ObservationCategoryType;
  sentiment: SentimentType;
  text: string;
}

export interface QualitativeObservation {
  id: string;
  studentId: string;
  studentName: string;
  turma: string;
  date: string; // YYYY-MM-DD or ISO
  transcript: string;
  audioRecorded?: boolean;
  categories: ObservationCategory[];
  keyInsight: string;
  intervention?: string;
  bimester: '1º Bimestre' | '2º Bimestre' | '3º Bimestre' | '4º Bimestre';
}

export interface Student {
  id: string;
  name: string;
  turma: string;
  avatarColor: string;
  birthDate?: string;
  guardianName?: string;
  guardianPhone?: string;
  specialNeeds?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  turma: string;
  subject: string;
  assessmentName: string;
  score: number;
  maxScore: number;
  date: string;
  bimester: '1º Bimestre' | '2º Bimestre' | '3º Bimestre' | '4º Bimestre';
}

export type AttendanceStatus = 'presente' | 'falta' | 'falta_justificada' | 'atraso';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  turma: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
  bimester: '1º Bimestre' | '2º Bimestre' | '3º Bimestre' | '4º Bimestre';
}

export interface ScheduledAssessment {
  id: string;
  turma: string;
  subject: string;
  title: string;
  date: string; // YYYY-MM-DD
  weight: number;
  topics: string;
  completed: boolean;
}

export interface PedagogicalPendency {
  id: string;
  studentId?: string;
  studentName?: string;
  turma: string;
  type: 'frequencia_critica' | 'sem_registro_recente' | 'nota_baixa' | 'avaliacao_pendente';
  title: string;
  description: string;
  severity: 'alta' | 'media' | 'baixa';
  dueDate?: string;
  resolved: boolean;
}

export interface PedagogicalSummary {
  id: string;
  studentId: string;
  studentName: string;
  turma: string;
  period: string; // e.g. "1º Bimestre"
  title: string;
  overview: string;
  strengths: string[];
  needsAttention: string[];
  evolutionTrend: 'positiva' | 'estavel' | 'requer_atencao';
  pedagogicalPlan: string;
  createdAt: string;
}

export type FilterPeriod = 'todos' | '1º Bimestre' | '2º Bimestre' | '3º Bimestre' | '4º Bimestre' | 'ultimos_30_dias';
