import { Student, QualitativeObservation, Grade, AttendanceRecord, ScheduledAssessment, PedagogicalPendency, PedagogicalSummary } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-alice',
    name: 'Alice Souza',
    turma: '5º Ano A',
    avatarColor: 'bg-emerald-600',
    birthDate: '2014-04-15',
    guardianName: 'Marcos Souza',
    guardianPhone: '(11) 98765-4321',
    specialNeeds: 'Nenhuma. Demonstra facilidade em raciocínio lógico.'
  },
  {
    id: 's-bernardo',
    name: 'Bernardo Lima',
    turma: '5º Ano A',
    avatarColor: 'bg-blue-600',
    birthDate: '2014-08-22',
    guardianName: 'Regina Lima',
    guardianPhone: '(11) 99123-4567',
    specialNeeds: 'Dificuldade de concentração após pausas.'
  },
  {
    id: 's-clara',
    name: 'Clara Duarte',
    turma: '5º Ano A',
    avatarColor: 'bg-purple-600',
    birthDate: '2014-01-30',
    guardianName: 'Juliana Duarte',
    guardianPhone: '(11) 97654-3210'
  },
  {
    id: 's-davi',
    name: 'Davi Mendes',
    turma: '5º Ano A',
    avatarColor: 'bg-amber-600',
    birthDate: '2014-11-10',
    guardianName: 'Carlos Mendes',
    guardianPhone: '(11) 98111-2233'
  },
  {
    id: 's-enzo',
    name: 'Enzo Ribeiro',
    turma: '6º Ano B',
    avatarColor: 'bg-indigo-600',
    birthDate: '2013-05-18',
    guardianName: 'Fernanda Ribeiro',
    guardianPhone: '(11) 97222-3344'
  },
  {
    id: 's-gabriela',
    name: 'Gabriela Santos',
    turma: '6º Ano B',
    avatarColor: 'bg-teal-600',
    birthDate: '2013-09-04',
    guardianName: 'Renato Santos',
    guardianPhone: '(11) 96333-4455'
  }
];

export const INITIAL_OBSERVATIONS: QualitativeObservation[] = [
  {
    id: 'obs-alice-1',
    studentId: 's-alice',
    studentName: 'Alice Souza',
    turma: '5º Ano A',
    date: '2026-03-12',
    transcript: 'Alice participou intensamente da roda de leitura hoje. Trouxe conexões com vivências pessoais e incentivou o Bernardo a compartilhar a opinião dele.',
    categories: [
      { type: 'participação', sentiment: 'positivo', text: 'Participação ativa e estimuladora na roda de leitura.' },
      { type: 'comportamento', sentiment: 'positivo', text: 'Excelente postura colaborativa e escuta atenta.' },
      { type: 'evolução', sentiment: 'positivo', text: 'Maior desenvoltura na expressão oral em público.' }
    ],
    keyInsight: 'Desenvoltura exemplar em expressão verbal e liderança positiva entre os pares.',
    intervention: 'Indicar para conduzir pequenos grupos de mediação literária no próximo projeto.',
    bimester: '1º Bimestre',
    audioRecorded: true
  },
  {
    id: 'obs-alice-2',
    studentId: 's-alice',
    studentName: 'Alice Souza',
    turma: '5º Ano A',
    date: '2026-03-25',
    transcript: 'Na aula de matemática, Alice apresentou facilidade na interpretação de frações, porém teve dúvida momentânea na simplificação. Conseguiu sanar com o material dourado.',
    categories: [
      { type: 'participação', sentiment: 'positivo', text: 'Buscou recursos manipulativos de forma autônoma.' },
      { type: 'dificuldades', sentiment: 'atencao', text: 'Dúvida inicial no algoritmo de simplificação de frações.' },
      { type: 'evolução', sentiment: 'positivo', text: 'Superou a dificuldade rapidamente através de representação visual.' }
    ],
    keyInsight: 'Excelente capacidade de autorregulação e uso eficaz de instrumentos pedagógicos.',
    intervention: 'Apresentar desafios extras com contextualização geométrica.',
    bimester: '1º Bimestre',
    audioRecorded: true
  },
  {
    id: 'obs-alice-3',
    studentId: 's-alice',
    studentName: 'Alice Souza',
    turma: '5º Ano A',
    date: '2026-04-08',
    transcript: 'Alice demonstrou grande evolução na escrita do texto dissertativo. Estruturou introdução, desenvolvimento e conclusão sem desviar do tema.',
    categories: [
      { type: 'evolução', sentiment: 'positivo', text: 'Consolidação da coesão e coerência na produção textual.' },
      { type: 'comportamento', sentiment: 'positivo', text: 'Foco contínuo durante toda a aula de redação.' }
    ],
    keyInsight: 'Salto qualitativo na organização estrutural de textos argumentativos.',
    intervention: 'Incentivar uso de vocabulário mais diversificado.',
    bimester: '1º Bimestre',
    audioRecorded: true
  },
  {
    id: 'obs-bernardo-1',
    studentId: 's-bernardo',
    studentName: 'Bernardo Lima',
    turma: '5º Ano A',
    date: '2026-03-18',
    transcript: 'Bernardo demonstrou dispersão nos primeiros 20 minutos de aula de ciências. Após dividirmos a atividade prática de montagem do terrário em etapas menores, focou e completou com sucesso.',
    categories: [
      { type: 'comportamento', sentiment: 'atencao', text: 'Dificuldade de concentração inicial em instruções longas.' },
      { type: 'dificuldades', sentiment: 'atencao', text: 'Necessita de instruções fracionadas em passos visuais.' },
      { type: 'evolução', sentiment: 'positivo', text: 'Executou com capricho quando orientado passo a passo.' }
    ],
    keyInsight: 'Responde muito bem a metodologias ativas e fracionamento de etapas de trabalho.',
    intervention: 'Manter checklist visual na mesa para tarefas com mais de 3 passos.',
    bimester: '1º Bimestre',
    audioRecorded: true
  },
  {
    id: 'obs-clara-1',
    studentId: 's-clara',
    studentName: 'Clara Duarte',
    turma: '5º Ano A',
    date: '2026-03-22',
    transcript: 'Clara realizou todos os cálculos com precisão, mas ficou insegura ao apresentar o resultado para a sala. Precisa de encorajamento para falar em voz alta.',
    categories: [
      { type: 'participação', sentiment: 'atencao', text: 'Timidez ao expor conclusões em frente à turma.' },
      { type: 'comportamento', sentiment: 'positivo', text: 'Postura respeitosa e capricho impecável nos cadernos.' },
      { type: 'dificuldades', sentiment: 'atencao', text: 'Insegurança na comunicação verbal perante o grupo.' }
    ],
    keyInsight: 'Domínio conceitual elevado, com barreira emocional na oralidade em público.',
    intervention: 'Estimular participação em duplas antes de abrir para toda a sala.',
    bimester: '1º Bimestre',
    audioRecorded: true
  },
  {
    id: 'obs-enzo-1',
    studentId: 's-enzo',
    studentName: 'Enzo Ribeiro',
    turma: '6º Ano B',
    date: '2026-03-29',
    transcript: 'Enzo evoluiu bastante na pontualidade de entrega dos relatórios de história. Mostrou curiosidade genuína no tema do Renascimento.',
    categories: [
      { type: 'evolução', sentiment: 'positivo', text: 'Cumprimento dos prazos de entrega acordados.' },
      { type: 'participação', sentiment: 'positivo', text: 'Perguntas instigantes e reflexões aprofundadas.' }
    ],
    keyInsight: 'Engajamento renovado e amadurecimento no cumprimento de prazos escolares.',
    intervention: 'Parabenizar o empenho para sustentar o hábito.',
    bimester: '1º Bimestre',
    audioRecorded: true
  }
];

export const INITIAL_GRADES: Grade[] = [
  // Alice
  { id: 'g-alice-1', studentId: 's-alice', turma: '5º Ano A', subject: 'Língua Portuguesa', assessmentName: 'Produção Textual', score: 9.5, maxScore: 10.0, date: '2026-03-15', bimester: '1º Bimestre' },
  { id: 'g-alice-2', studentId: 's-alice', turma: '5º Ano A', subject: 'Matemática', assessmentName: 'Avaliação Diagnóstica Frações', score: 9.0, maxScore: 10.0, date: '2026-03-27', bimester: '1º Bimestre' },
  { id: 'g-alice-3', studentId: 's-alice', turma: '5º Ano A', subject: 'Ciências', assessmentName: 'Relatório Ecossistemas', score: 10.0, maxScore: 10.0, date: '2026-04-05', bimester: '1º Bimestre' },
  { id: 'g-alice-4', studentId: 's-alice', turma: '5º Ano A', subject: 'História', assessmentName: 'Seminário Povos Antigos', score: 9.2, maxScore: 10.0, date: '2026-04-10', bimester: '1º Bimestre' },

  // Bernardo
  { id: 'g-bern-1', studentId: 's-bernardo', turma: '5º Ano A', subject: 'Língua Portuguesa', assessmentName: 'Produção Textual', score: 7.0, maxScore: 10.0, date: '2026-03-15', bimester: '1º Bimestre' },
  { id: 'g-bern-2', studentId: 's-bernardo', turma: '5º Ano A', subject: 'Matemática', assessmentName: 'Avaliação Diagnóstica Frações', score: 6.2, maxScore: 10.0, date: '2026-03-27', bimester: '1º Bimestre' },
  { id: 'g-bern-3', studentId: 's-bernardo', turma: '5º Ano A', subject: 'Ciências', assessmentName: 'Relatório Ecossistemas', score: 8.0, maxScore: 10.0, date: '2026-04-05', bimester: '1º Bimestre' },

  // Clara
  { id: 'g-cla-1', studentId: 's-clara', turma: '5º Ano A', subject: 'Língua Portuguesa', assessmentName: 'Produção Textual', score: 8.8, maxScore: 10.0, date: '2026-03-15', bimester: '1º Bimestre' },
  { id: 'g-cla-2', studentId: 's-clara', turma: '5º Ano A', subject: 'Matemática', assessmentName: 'Avaliação Diagnóstica Frações', score: 9.8, maxScore: 10.0, date: '2026-03-27', bimester: '1º Bimestre' },

  // Davi
  { id: 'g-dav-1', studentId: 's-davi', turma: '5º Ano A', subject: 'Língua Portuguesa', assessmentName: 'Produção Textual', score: 6.0, maxScore: 10.0, date: '2026-03-15', bimester: '1º Bimestre' },
  { id: 'g-dav-2', studentId: 's-davi', turma: '5º Ano A', subject: 'Matemática', assessmentName: 'Avaliação Diagnóstica Frações', score: 5.5, maxScore: 10.0, date: '2026-03-27', bimester: '1º Bimestre' },

  // Enzo
  { id: 'g-enz-1', studentId: 's-enzo', turma: '6º Ano B', subject: 'História', assessmentName: 'Ensaio Renascimento', score: 8.5, maxScore: 10.0, date: '2026-04-02', bimester: '1º Bimestre' },
  { id: 'g-enz-2', studentId: 's-enzo', turma: '6º Ano B', subject: 'Matemática', assessmentName: 'Expressões Algébricas', score: 7.8, maxScore: 10.0, date: '2026-04-06', bimester: '1º Bimestre' }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Alice
  { id: 'att-1', studentId: 's-alice', turma: '5º Ano A', date: '2026-04-06', status: 'presente', bimester: '1º Bimestre' },
  { id: 'att-2', studentId: 's-alice', turma: '5º Ano A', date: '2026-04-07', status: 'presente', bimester: '1º Bimestre' },
  { id: 'att-3', studentId: 's-alice', turma: '5º Ano A', date: '2026-04-08', status: 'presente', bimester: '1º Bimestre' },
  { id: 'att-4', studentId: 's-alice', turma: '5º Ano A', date: '2026-04-09', status: 'presente', bimester: '1º Bimestre' },
  { id: 'att-5', studentId: 's-alice', turma: '5º Ano A', date: '2026-04-10', status: 'presente', bimester: '1º Bimestre' },

  // Bernardo
  { id: 'att-6', studentId: 's-bernardo', turma: '5º Ano A', date: '2026-04-06', status: 'presente', bimester: '1º Bimestre' },
  { id: 'att-7', studentId: 's-bernardo', turma: '5º Ano A', date: '2026-04-07', status: 'falta', notes: 'Sem aviso prévio', bimester: '1º Bimestre' },
  { id: 'att-8', studentId: 's-bernardo', turma: '5º Ano A', date: '2026-04-08', status: 'falta', notes: 'Contato telefônico sem resposta', bimester: '1º Bimestre' },
  { id: 'att-9', studentId: 's-bernardo', turma: '5º Ano A', date: '2026-04-09', status: 'atraso', notes: 'Chegou 25 min após o início', bimester: '1º Bimestre' },
  { id: 'att-10', studentId: 's-bernardo', turma: '5º Ano A', date: '2026-04-10', status: 'presente', bimester: '1º Bimestre' },

  // Clara
  { id: 'att-11', studentId: 's-clara', turma: '5º Ano A', date: '2026-04-06', status: 'presente', bimester: '1º Bimestre' },
  { id: 'att-12', studentId: 's-clara', turma: '5º Ano A', date: '2026-04-07', status: 'presente', bimester: '1º Bimestre' },
  { id: 'att-13', studentId: 's-clara', turma: '5º Ano A', date: '2026-04-08', status: 'falta_justificada', notes: 'Consulta odontológica comprovada', bimester: '1º Bimestre' },
  { id: 'att-14', studentId: 's-clara', turma: '5º Ano A', date: '2026-04-09', status: 'presente', bimester: '1º Bimestre' },
  { id: 'att-15', studentId: 's-clara', turma: '5º Ano A', date: '2026-04-10', status: 'presente', bimester: '1º Bimestre' }
];

export const INITIAL_SCHEDULED_ASSESSMENTS: ScheduledAssessment[] = [
  {
    id: 'test-1',
    turma: '5º Ano A',
    subject: 'Matemática',
    title: 'Prova Bimestral 1: Operações e Frações',
    date: '2026-04-16',
    weight: 4.0,
    topics: 'Simplificação de frações, operações fundamentais e resolução de problemas cotidianos.',
    completed: false
  },
  {
    id: 'test-2',
    turma: '5º Ano A',
    subject: 'Língua Portuguesa',
    title: 'Avaliação de Leitura e Gêneros Textuais',
    date: '2026-04-20',
    weight: 3.5,
    topics: 'Interpretação de crônica e artigo de opinião; pontuação e coesão.',
    completed: false
  },
  {
    id: 'test-3',
    turma: '6º Ano B',
    subject: 'História',
    title: 'Seminário em Grupo: Cidades-Estado da Grécia',
    date: '2026-04-17',
    weight: 3.0,
    topics: 'Atenas vs Esparta: estrutura política, cidadania e sociedade.',
    completed: false
  },
  {
    id: 'test-4',
    turma: '5º Ano A',
    subject: 'Ciências',
    title: 'Experimento Prático: Ciclo da Água',
    date: '2026-04-24',
    weight: 2.5,
    topics: 'Evaporação, condensação e preservação de mananciais.',
    completed: false
  }
];

export const INITIAL_PENDENCIES: PedagogicalPendency[] = [
  {
    id: 'pend-1',
    studentId: 's-bernardo',
    studentName: 'Bernardo Lima',
    turma: '5º Ano A',
    type: 'frequencia_critica',
    title: 'Atenção à Frequência: Bernardo Lima',
    description: 'Registrou 2 faltas consecutivas sem justificativa na semana corrente. Contatar coordenação ou responsáveis.',
    severity: 'alta',
    dueDate: '2026-04-13',
    resolved: false
  },
  {
    id: 'pend-2',
    studentId: 's-davi',
    studentName: 'Davi Mendes',
    turma: '5º Ano A',
    type: 'nota_baixa',
    title: 'Recuperação Paralela: Davi Mendes em Matemática',
    description: 'Nota 5.5 na avaliação de frações. Agendar atividade diagnóstica de reforço antes da prova bimestral.',
    severity: 'alta',
    dueDate: '2026-04-15',
    resolved: false
  },
  {
    id: 'pend-3',
    turma: '6º Ano B',
    type: 'sem_registro_recente',
    title: 'Observações Qualitativas Pendentes: 6º Ano B',
    description: 'Gabriela Santos e outros 2 alunos estão sem registro qualitativo há mais de 14 dias.',
    severity: 'media',
    dueDate: '2026-04-14',
    resolved: false
  },
  {
    id: 'pend-4',
    turma: '5º Ano A',
    type: 'avaliacao_pendente',
    title: 'Lançar Notas da Produção de Ciências: 5º Ano A',
    description: '3 alunos ainda não tiveram a pontuação do relatório de ecossistemas computada.',
    severity: 'baixa',
    dueDate: '2026-04-18',
    resolved: false
  }
];

export const INITIAL_SUMMARIES: PedagogicalSummary[] = [
  {
    id: 'sum-alice-1',
    studentId: 's-alice',
    studentName: 'Alice Souza',
    turma: '5º Ano A',
    period: '1º Bimestre',
    title: 'Evolução da Alice no 1º Bimestre',
    overview: 'Alice apresentou desenvolvimento excepcional ao longo deste 1º bimestre. Demonstrou avanço consistente tanto no aspecto cognitivo quanto na interação socioemocional com a turma, destacando-se pela generosidade e curiosidade intelectual.',
    strengths: [
      'Engajamento ativo nas discussões em sala e estímulo positivo aos colegas',
      'Excelente desempenho acadêmico (média 9.4) em Língua Portuguesa e Matemática',
      'Habilidade notável de autorregulação e superação autônoma de dúvidas conceituais'
    ],
    needsAttention: [
      'Incentivar maior aprofundamento em desafios matemáticos avançados para evitar desmotivação por facilidade',
      'Manter acompanhamento na organização de prazos para projetos multidisciplinares'
    ],
    evolutionTrend: 'positiva',
    pedagogicalPlan: 'Apresentar atividades de extensão com raciocínio lógico e designá-la para pequenos grupos de tutoria colaborativa no 2º bimestre.',
    createdAt: '2026-04-11T14:30:00.000Z'
  }
];
