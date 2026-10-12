import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  QualitativeObservation,
  Grade,
  AttendanceRecord,
  ScheduledAssessment,
  PedagogicalPendency,
  PedagogicalSummary,
  AttendanceStatus,
  FilterPeriod
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_OBSERVATIONS,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE,
  INITIAL_SCHEDULED_ASSESSMENTS,
  INITIAL_PENDENCIES,
  INITIAL_SUMMARIES
} from '../data/mockData';

interface StudentStats {
  attendanceRate: number;
  totalClasses: number;
  totalPresent: number;
  totalAbsent: number;
  averageGrade: number | null;
  observationsCount: number;
  lastObservationDate: string | null;
}

interface PedagogicalContextType {
  students: Student[];
  observations: QualitativeObservation[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  scheduledAssessments: ScheduledAssessment[];
  pendencies: PedagogicalPendency[];
  summaries: PedagogicalSummary[];

  // Filters
  selectedTurma: string;
  setSelectedTurma: (t: string) => void;
  selectedPeriod: FilterPeriod;
  setSelectedPeriod: (p: FilterPeriod) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Actions
  addObservation: (obs: Omit<QualitativeObservation, 'id'>) => QualitativeObservation;
  deleteObservation: (id: string) => void;
  addGrade: (grade: Omit<Grade, 'id'>) => Grade;
  deleteGrade: (id: string) => void;
  recordAttendance: (studentId: string, date: string, status: AttendanceStatus, notes?: string) => void;
  recordBulkAttendance: (records: Array<{ studentId: string; date: string; status: AttendanceStatus }>) => void;
  addScheduledAssessment: (assessment: Omit<ScheduledAssessment, 'id' | 'completed'>) => void;
  toggleAssessmentCompleted: (id: string) => void;
  resolvePendency: (id: string) => void;
  addSummary: (summary: Omit<PedagogicalSummary, 'id' | 'createdAt'>) => PedagogicalSummary;
  addStudent: (student: Omit<Student, 'id' | 'avatarColor'>) => Student;
  getStudentStats: (studentId: string) => StudentStats;
  getStudentById: (studentId: string) => Student | undefined;
  resetAllData: () => void;
}

const PedagogicalContext = createContext<PedagogicalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'ap_students_v1',
  OBSERVATIONS: 'ap_observations_v1',
  GRADES: 'ap_grades_v1',
  ATTENDANCE: 'ap_attendance_v1',
  ASSESSMENTS: 'ap_assessments_v1',
  PENDENCIES: 'ap_pendencies_v1',
  SUMMARIES: 'ap_summaries_v1',
};

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-blue-600',
  'bg-purple-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-cyan-600'
];

export const PedagogicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [observations, setObservations] = useState<QualitativeObservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
    return saved ? JSON.parse(saved) : INITIAL_OBSERVATIONS;
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [scheduledAssessments, setScheduledAssessments] = useState<ScheduledAssessment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_ASSESSMENTS;
  });

  const [pendencies, setPendencies] = useState<PedagogicalPendency[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENDENCIES);
    return saved ? JSON.parse(saved) : INITIAL_PENDENCIES;
  });

  const [summaries, setSummaries] = useState<PedagogicalSummary[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
    return saved ? JSON.parse(saved) : INITIAL_SUMMARIES;
  });

  const [selectedTurma, setSelectedTurma] = useState<string>('todas');
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(observations));
  }, [observations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(scheduledAssessments));
  }, [scheduledAssessments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENDENCIES, JSON.stringify(pendencies));
  }, [pendencies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
  }, [summaries]);

  const addObservation = (obs: Omit<QualitativeObservation, 'id'>): QualitativeObservation => {
    const newObs: QualitativeObservation = {
      ...obs,
      id: `obs-${Date.now()}`
    };
    setObservations(prev => [newObs, ...prev]);

    // Check if this resolves any "sem_registro_recente" pendency for this student/turma
    setPendencies(prev => prev.map(p => {
      if (p.type === 'sem_registro_recente' && (p.studentId === obs.studentId || p.turma === obs.turma)) {
        return { ...p, resolved: true };
      }
      return p;
    }));

    return newObs;
  };

  const deleteObservation = (id: string) => {
    setObservations(prev => prev.filter(o => o.id !== id));
  };

  const addGrade = (grade: Omit<Grade, 'id'>): Grade => {
    const newGrade: Grade = {
      ...grade,
      id: `grade-${Date.now()}`
    };
    setGrades(prev => [newGrade, ...prev]);

    // If grade is low (< 6.0), proactively add or ensure an intervention pendency
    if (grade.score < 6.0) {
      const student = students.find(s => s.id === grade.studentId);
      const studentName = student ? student.name : 'Aluno';
      setPendencies(prev => [
        {
          id: `pend-grade-${Date.now()}`,
          studentId: grade.studentId,
          studentName,
          turma: grade.turma,
          type: 'nota_baixa',
          title: `Recuperação: ${studentName} (${grade.subject})`,
          description: `Nota ${grade.score.toFixed(1)} registrada em ${grade.assessmentName}. Requer atividade diagnóstica de reforço.`,
          severity: 'alta',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          resolved: false
        },
        ...prev
      ]);
    }

    return newGrade;
  };

  const deleteGrade = (id: string) => {
    setGrades(prev => prev.filter(g => g.id !== id));
  };

  const recordAttendance = (studentId: string, date: string, status: AttendanceStatus, notes?: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setAttendance(prev => {
      const existingIndex = prev.findIndex(r => r.studentId === studentId && r.date === date);
      const record: AttendanceRecord = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `att-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        studentId,
        turma: student.turma,
        date,
        status,
        notes,
        bimester: '1º Bimestre'
      };

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = record;
        return copy;
      }
      return [record, ...prev];
    });
  };

  const recordBulkAttendance = (records: Array<{ studentId: string; date: string; status: AttendanceStatus }>) => {
    records.forEach(r => {
      recordAttendance(r.studentId, r.date, r.status);
    });
  };

  const addScheduledAssessment = (assessment: Omit<ScheduledAssessment, 'id' | 'completed'>) => {
    const newAssessment: ScheduledAssessment = {
      ...assessment,
      id: `test-${Date.now()}`,
      completed: false
    };
    setScheduledAssessments(prev => [...prev, newAssessment]);
  };

  const toggleAssessmentCompleted = (id: string) => {
    setScheduledAssessments(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const resolvePendency = (id: string) => {
    setPendencies(prev => prev.map(p => p.id === id ? { ...p, resolved: true } : p));
  };

  const addSummary = (summary: Omit<PedagogicalSummary, 'id' | 'createdAt'>): PedagogicalSummary => {
    const newSummary: PedagogicalSummary = {
      ...summary,
      id: `sum-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSummaries(prev => [newSummary, ...prev]);
    return newSummary;
  };

  const addStudent = (student: Omit<Student, 'id' | 'avatarColor'>): Student => {
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newStudent: Student = {
      ...student,
      id: `s-${Date.now()}`,
      avatarColor: randomColor
    };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const getStudentStats = (studentId: string): StudentStats => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    const totalClasses = studentAttendance.length;
    const totalPresent = studentAttendance.filter(a => a.status === 'presente' || a.status === 'atraso').length;
    const totalAbsent = studentAttendance.filter(a => a.status === 'falta' || a.status === 'falta_justificada').length;
    const attendanceRate = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 100;

    const studentGrades = grades.filter(g => g.studentId === studentId);
    const averageGrade = studentGrades.length > 0
      ? Number((studentGrades.reduce((acc, curr) => acc + curr.score, 0) / studentGrades.length).toFixed(1))
      : null;

    const studentObs = observations.filter(o => o.studentId === studentId);
    const sortedObs = [...studentObs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastObservationDate = sortedObs.length > 0 ? sortedObs[0].date : null;

    return {
      attendanceRate,
      totalClasses,
      totalPresent,
      totalAbsent,
      averageGrade,
      observationsCount: studentObs.length,
      lastObservationDate
    };
  };

  const getStudentById = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setObservations(INITIAL_OBSERVATIONS);
    setGrades(INITIAL_GRADES);
    setAttendance(INITIAL_ATTENDANCE);
    setScheduledAssessments(INITIAL_SCHEDULED_ASSESSMENTS);
    setPendencies(INITIAL_PENDENCIES);
    setSummaries(INITIAL_SUMMARIES);
    localStorage.clear();
  };

  return (
    <PedagogicalContext.Provider
      value={{
        students,
        observations,
        grades,
        attendance,
        scheduledAssessments,
        pendencies,
        summaries,
        selectedTurma,
        setSelectedTurma,
        selectedPeriod,
        setSelectedPeriod,
        searchQuery,
        setSearchQuery,
        addObservation,
        deleteObservation,
        addGrade,
        deleteGrade,
        recordAttendance,
        recordBulkAttendance,
        addScheduledAssessment,
        toggleAssessmentCompleted,
        resolvePendency,
        addSummary,
        addStudent,
        getStudentStats,
        getStudentById,
        resetAllData
      }}
    >
      {children}
    </PedagogicalContext.Provider>
  );
};

export const usePedagogical = () => {
  const context = useContext(PedagogicalContext);
  if (!context) {
    throw new Error('usePedagogical must be used within a PedagogicalProvider');
  }
  return context;
};
