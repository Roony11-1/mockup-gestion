import { useEffect, useState, type SubmitEvent } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bath,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { DEMO_CREDENTIALS, ROLE_META } from '../../lib/constants';
import { getSession, resolveUser, saveSession } from '../../lib/session';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FormField, Input } from '../ui/Input';

const quickIcons = {
  student: GraduationCap,
  staff: Sparkles,
  teacher: User,
};

export function LoginPage() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) {
      window.location.replace('/dashboard');
      return;
    }

    const reason = new URLSearchParams(window.location.search).get('motivo');
    if (reason === 'sesion') {
      setNotice('Tu sesión no está activa. Ingresa nuevamente para continuar.');
    }

    setChecking(false);
  }, []);

  const doLogin = (rawEmail: string) => {
    setError(null);

    const user = resolveUser(rawEmail);
    if (!user) {
      setError(
        'Credencial no válida. Usa una de las cuentas de demostración que aparecen más abajo.',
      );
      return;
    }

    setLoading(true);

    try {
      saveSession({ email: user.email, role: user.role });
      window.location.href = '/dashboard';
    } catch {
      setLoading(false);
      setError('No se pudo iniciar sesión en este navegador. Revisa la configuración de almacenamiento.');
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('Ingresa tu correo institucional para continuar.');
      return;
    }

    doLogin(email);
  };

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50" role="status" aria-busy="true">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-xs font-extrabold text-white">
            C+
          </span>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Verificando sesión…
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-brand-950 px-10 py-12 text-white lg:flex lg:flex-col xl:px-14">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10 bg-white/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/[0.03]"
          aria-hidden="true"
        />

        <a href="/" className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-extrabold tracking-tight text-brand-900">
            C+
          </span>
          <span>
            <span className="block text-base font-bold leading-tight">CampusConnect+</span>
            <span className="block text-xs leading-tight text-brand-200">Duoc UC · Comunidad</span>
          </span>
        </a>

        <div className="relative my-auto max-w-lg py-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-50 ring-1 ring-inset ring-white/20">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Plataforma para la comunidad estudiantil
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            La comunidad de tu campus, conectada.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-100">
            Consulta la disponibilidad de baños y conoce las experiencias de otros estudiantes sobre
            docentes y trabajo colaborativo.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-100 ring-1 ring-inset ring-white/15">
                <Bath className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Estado de baños</p>
                <p className="text-sm text-brand-200">
                  Disponibilidad, ubicación y horarios de limpieza por sede.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-100 ring-1 ring-inset ring-white/15">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Reseñas de docentes</p>
                <p className="text-sm text-brand-200">
                  Experiencias académicas compartidas por estudiantes.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-100 ring-1 ring-inset ring-white/15">
                <Users className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Reseñas de estudiantes</p>
                <p className="text-sm text-brand-200">
                  Referencias sobre trabajo colaborativo y comunicación.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-brand-300">
          Prototipo académico · Los datos son de demostración y se almacenan en este navegador.
        </p>
      </aside>

      <main className="flex flex-col bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-xs font-extrabold text-white">
              C+
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight text-slate-900">CampusConnect+</span>
              <span className="block text-[11px] leading-tight text-slate-500">Duoc UC</span>
            </span>
          </a>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            Demo
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-6 hidden lg:block">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inicia sesión</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Accede con una cuenta de demostración para explorar CampusConnect+ según tu rol.
              </p>
            </div>

            <Card className="p-6 sm:p-8">
              <div className="lg:hidden">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Inicia sesión</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Accede con una cuenta de demostración para explorar CampusConnect+.
                </p>
              </div>

              {notice && (
                <Alert variant="info" title="Sesión requerida" className="mt-5">
                  {notice}
                </Alert>
              )}

              <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
                <FormField
                  id="email"
                  label="Correo institucional"
                  hint="Usa una de las cuentas de demostración disponibles más abajo."
                  required
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError(null);
                    }}
                    autoComplete="username"
                    placeholder="alumno@duocuc.cl"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'login-error' : 'email-hint'}
                  />
                </FormField>

                <FormField
                  id="password"
                  label="Contraseña"
                  hint="En este prototipo la contraseña no se valida."
                >
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="pr-10"
                      aria-describedby="password-hint"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </FormField>

                {error && (
                  <div
                    id="login-error"
                    role="alert"
                    className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-800"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <p>{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Ingresando…
                    </>
                  ) : (
                    <>
                      Ingresar al dashboard
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Accesos de demostración</h3>
                  <span className="text-[11px] text-slate-500">Ingreso directo</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Selecciona un perfil para entrar sin contraseña.
                </p>

                <div className="mt-3 grid min-w-0 gap-2">
                  {DEMO_CREDENTIALS.map((credential) => {
                    const meta = ROLE_META[credential.role];
                    const Icon = quickIcons[credential.role];
                    return (
                      <button
                        key={credential.email}
                        type="button"
                        onClick={() => doLogin(credential.email)}
                        disabled={loading}
                        title={`${credential.email} · ${meta.interfaceLabel}`}
                        className="group flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-brand-200 hover:bg-brand-50/50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.avatarClass}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 overflow-hidden">
                          <span className="block truncate text-sm font-semibold text-slate-900">
                            {meta.label}
                          </span>
                          <span className="mt-0.5 block break-words text-xs leading-snug text-slate-500">
                            {credential.email} · {meta.interfaceLabel}
                          </span>
                        </span>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand-600"
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">
              CampusConnect+ · Prototipo académico para Duoc UC.
              <br />
              No introduzcas credenciales reales.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
