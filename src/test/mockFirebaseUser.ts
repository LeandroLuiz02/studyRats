/**
 * Usuário do Firebase Auth "de mentira" usado como padrão em todos os testes
 * (ver src/setupTests.ts). Testes específicos de autenticação podem sobrescrever
 * o comportamento mockado de onAuthStateChanged/signInWithPopup para simular
 * outros estados (deslogado, primeiro login, etc.).
 */
export const mockFirebaseUser = {
  uid: 'test-uid-1',
  displayName: 'Usuário de Teste',
  email: 'teste@example.com',
  photoURL: null,
} as const
