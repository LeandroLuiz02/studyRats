import { useAuth } from '../state/AuthContext'

export function LoginScreen() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">StudyRats</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Entre com sua conta Google para ver e publicar sessões de estudo com seu grupo.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          void signInWithGoogle()
        }}
        className="rounded-full bg-indigo-600 px-6 py-3 font-medium text-white shadow-md hover:bg-indigo-700"
      >
        Entrar com Google
      </button>
    </div>
  )
}
