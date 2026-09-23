import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * Configuração do app Web do Firebase, lida das variáveis de ambiente
 * VITE_FIREBASE_* (ver .env.example e docs/decisoes/0002-integracao-firebase.md).
 *
 * Nenhum desses valores é um segredo tradicional: eles vão embutidos no bundle
 * JS do cliente por natureza. A segurança de verdade vem das regras do
 * Firestore (firestore.rules), não de escondê-los.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

// Storage foi adiado (ver Decisão 2 revisada na ADR 0002): o Firebase Storage
// passou a exigir o plano pago Blaze, e decidimos não ativá-lo por enquanto.
// Quando essa decisão for retomada, basta adicionar aqui:
//   import { getStorage } from 'firebase/storage'
//   export const storage = getStorage(firebaseApp)
