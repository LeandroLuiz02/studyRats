export interface User {
  id: string
  name: string
  initials: string
  /** Classe Tailwind de background usada como avatar placeholder. */
  avatarClass: string
  /** Foto de perfil (data URL). Quando ausente, usa o avatar com iniciais. */
  avatarUrl?: string
  /** Texto livre "Sobre" do perfil do usuário. */
  bio?: string
}

export interface Group {
  id: string
  name: string
  description: string
  /** Código de convite usado na tela "Entrar em grupo". */
  inviteCode: string
  memberIds: string[]
}

export interface StudySession {
  id: string
  userId: string
  title: string
  description: string
  durationMinutes: number
  /** Grupos em que essa sessão foi publicada. */
  groupIds: string[]
  /** Data/hora de criação em ISO 8601. */
  createdAt: string
}
