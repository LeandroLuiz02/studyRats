import type { Group, StudySession, User } from '../types'

export const CURRENT_USER_ID = 'u1'

export const users: User[] = [
  {
    id: 'u1',
    name: 'Leandro Luiz',
    initials: 'LL',
    avatarClass: 'bg-indigo-500',
    bio: 'Estudando para o TRT e treinando inglês todos os dias.',
  },
  { id: 'u2', name: 'Ana Souza', initials: 'AS', avatarClass: 'bg-rose-500' },
  { id: 'u3', name: 'Bruno Lima', initials: 'BL', avatarClass: 'bg-amber-500' },
  { id: 'u4', name: 'Carla Nunes', initials: 'CN', avatarClass: 'bg-emerald-500' },
  { id: 'u5', name: 'Diego Alves', initials: 'DA', avatarClass: 'bg-sky-500' },
  { id: 'u6', name: 'Elisa Martins', initials: 'EM', avatarClass: 'bg-fuchsia-500' },
]

export const initialGroups: Group[] = [
  {
    id: 'g1',
    name: 'Concurso TRT 2027',
    description: 'Grupo de estudos para o concurso do Tribunal Regional do Trabalho',
    inviteCode: 'TRT2027',
    memberIds: ['u1', 'u2', 'u3', 'u4'],
  },
  {
    id: 'g2',
    name: 'Inglês Fluente',
    description: 'Prática diária de inglês para provas e conversação',
    inviteCode: 'INGLES01',
    memberIds: ['u1', 'u4', 'u5', 'u6'],
  },
  {
    id: 'g3',
    name: 'Vestibular ITA',
    description: 'Reta final para o vestibular do ITA',
    inviteCode: 'ITA2027',
    memberIds: ['u2', 'u3', 'u5', 'u6'],
  },
]

function isoDaysAgo(days: number, hour = 9, minute = 0): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

/** Sessões de exemplo espalhadas pelos últimos ~3 meses, sempre relativas a "hoje". */
export const initialSessions: StudySession[] = [
  { id: 's1', userId: 'u1', title: 'Direito Constitucional - Controle de Constitucionalidade', description: 'Revisão de jurisprudência do STF', durationMinutes: 90, groupIds: ['g1'], createdAt: isoDaysAgo(0, 8) },
  { id: 's2', userId: 'u2', title: 'Redação - Dissertação argumentativa', description: 'Treino de redação cronometrada', durationMinutes: 60, groupIds: ['g1'], createdAt: isoDaysAgo(0, 14) },
  { id: 's3', userId: 'u4', title: 'Inglês - Listening avançado', description: 'Podcast + exercícios de compreensão', durationMinutes: 40, groupIds: ['g2'], createdAt: isoDaysAgo(0, 19) },
  { id: 's4', userId: 'u1', title: 'Inglês - Phrasal verbs', description: 'Lista dos phrasal verbs mais cobrados em prova', durationMinutes: 30, groupIds: ['g2'], createdAt: isoDaysAgo(1, 7) },
  { id: 's5', userId: 'u3', title: 'Direito Administrativo - Atos administrativos', description: 'Resumo em mapa mental', durationMinutes: 75, groupIds: ['g1'], createdAt: isoDaysAgo(1, 20) },
  { id: 's6', userId: 'u6', title: 'Física - Cinemática', description: 'Resolução de exercícios de provas anteriores do ITA', durationMinutes: 100, groupIds: ['g3'], createdAt: isoDaysAgo(1, 21) },
  { id: 's7', userId: 'u1', title: 'Direito Constitucional - Direitos Fundamentais', description: 'Leitura da doutrina + questões comentadas', durationMinutes: 50, groupIds: ['g1'], createdAt: isoDaysAgo(3, 9) },
  { id: 's8', userId: 'u5', title: 'Inglês - Writing', description: 'Redigi dois e-mails formais', durationMinutes: 35, groupIds: ['g2'], createdAt: isoDaysAgo(3, 18) },
  { id: 's9', userId: 'u2', title: 'Matemática Financeira', description: 'Juros compostos e séries uniformes', durationMinutes: 45, groupIds: ['g1'], createdAt: isoDaysAgo(4, 10) },
  { id: 's10', userId: 'u4', title: 'Português - Concordância verbal', description: 'Bateria de questões da FCC', durationMinutes: 55, groupIds: ['g1'], createdAt: isoDaysAgo(4, 16) },
  { id: 's11', userId: 'u6', title: 'Química - Estequiometria', description: 'Lista de exercícios comentada', durationMinutes: 80, groupIds: ['g3'], createdAt: isoDaysAgo(5, 11) },
  { id: 's12', userId: 'u3', title: 'Redação ITA', description: 'Treino de tema livre com correção', durationMinutes: 60, groupIds: ['g3'], createdAt: isoDaysAgo(6, 9) },
  { id: 's13', userId: 'u1', title: 'Inglês - Gramática', description: 'Present perfect x past simple', durationMinutes: 25, groupIds: ['g2'], createdAt: isoDaysAgo(8, 7) },
  { id: 's14', userId: 'u5', title: 'Física - Termodinâmica', description: 'Resumo das leis da termodinâmica', durationMinutes: 70, groupIds: ['g3'], createdAt: isoDaysAgo(9, 20) },
  { id: 's15', userId: 'u1', title: 'Direito Constitucional - Controle de Constitucionalidade II', description: 'Bateria de questões CESPE', durationMinutes: 65, groupIds: ['g1'], createdAt: isoDaysAgo(12, 8) },
  { id: 's16', userId: 'u4', title: 'Inglês - Speaking', description: 'Simulado de conversação', durationMinutes: 30, groupIds: ['g2'], createdAt: isoDaysAgo(14, 19) },
  { id: 's17', userId: 'u2', title: 'Português - Interpretação de texto', description: 'Três textos com questões', durationMinutes: 40, groupIds: ['g1'], createdAt: isoDaysAgo(16, 13) },
  { id: 's18', userId: 'u1', title: 'Direito Administrativo', description: 'Licitações e contratos administrativos', durationMinutes: 55, groupIds: ['g1'], createdAt: isoDaysAgo(20, 9) },
  { id: 's19', userId: 'u1', title: 'Inglês - Vocabulário', description: '200 palavras mais usadas em provas', durationMinutes: 30, groupIds: ['g2'], createdAt: isoDaysAgo(35, 7) },
  { id: 's20', userId: 'u1', title: 'Direito Constitucional - Organização do Estado', description: 'Resumo em áudio para revisar no trajeto', durationMinutes: 45, groupIds: ['g1'], createdAt: isoDaysAgo(40, 21) },
  { id: 's21', userId: 'u6', title: 'Matemática - Geometria analítica', description: 'Lista de exercícios do ITA', durationMinutes: 90, groupIds: ['g3'], createdAt: isoDaysAgo(38, 15) },
  { id: 's22', userId: 'u1', title: 'Inglês - Reading', description: 'Texto sobre tecnologia + questões', durationMinutes: 40, groupIds: ['g2'], createdAt: isoDaysAgo(62, 8) },
  { id: 's23', userId: 'u3', title: 'Direito Constitucional - Processo Legislativo', description: 'Fluxograma do processo legislativo', durationMinutes: 50, groupIds: ['g1'], createdAt: isoDaysAgo(65, 10) },
  { id: 's24', userId: 'u1', title: 'Inglês - Gramática avançada', description: 'Orações condicionais', durationMinutes: 35, groupIds: ['g2'], createdAt: isoDaysAgo(70, 7) },
]
