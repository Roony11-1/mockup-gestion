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
import { ThemeProvider } from '../theme/ThemeProvider';
import { ThemeToggle } from '../theme/ThemeToggle';

const quickIcons = {
  student: GraduationCap,
  staff: Sparkles,
  teacher: User,
};

export function LoginPage() {
  return (
    <ThemeProvider>
      <LoginContent />
    </ThemeProvider>
  );
}

function LoginContent() {
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
      <div className="flex min-h-dvh items-center justify-center bg-canvas" role="status" aria-busy="true">
        <div className="flex items-center gap-3 text-sm font-medium text-muted">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-xs font-extrabold text-brand-ink">
            C+
          </span>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Verificando sesión…
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.06fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-sidebar-line bg-sidebar px-10 py-12 text-sidebar-ink lg:flex lg:flex-col xl:px-14">
        <div className="editorial-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-sidebar-line"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full border border-sidebar-line"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute -bottom-14 right-6 select-none font-display text-[13rem] font-extrabold leading-none tracking-tighter text-sidebar-ink/[0.035]"
          aria-hidden="true"
        >
          C+
        </span>

        <a href="/" className="relative flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-sm font-extrabold tracking-tight text-brand-ink">
            C+
            <span
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-sidebar"
              aria-hidden="true"
            />
          </span>
          <span>
            <span className="block font-display text-base font-bold leading-tight">CampusConnect+</span>
            <span className="block text-xs leading-tight text-sidebar-muted">Duoc UC · Comunidad</span>
          </span>
        </a>

        <div className="relative my-auto max-w-xl py-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sidebar-line bg-sidebar-ink/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-ink">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
            Plataforma de la comunidad
          </span>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Tu campus,
            <br />
            <span className="text-brand">más conectado.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-sidebar-muted">
            Consulta la disponibilidad de baños y conoce las experiencias de otros estudiantes sobre
            docentes y trabajo colaborativo.
          </p>

          <div className="mt-9 h-px w-20 bg-brand" aria-hidden="true" />

          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-line bg-sidebar-ink/[0.05] text-brand">
                <Bath className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-sidebar-ink">Estado de baños</p>
                <p className="mt-0.5 text-sm leading-relaxed text-sidebar-muted">
                  Disponibilidad, ubicación y horarios de limpieza por sede.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-line bg-sidebar-ink/[0.05] text-brand">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-sidebar-ink">Reseñas de docentes</p>
                <p className="mt-0.5 text-sm leading-relaxed text-sidebar-muted">
                  Experiencias académicas compartidas por estudiantes.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-line bg-sidebar-ink/[0.05] text-brand">
                <Users className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-sidebar-ink">Reseñas de estudiantes</p>
                <p className="mt-0.5 text-sm leading-relaxed text-sidebar-muted">
                  Referencias sobre trabajo colaborativo y comunicación.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <p className="relative text-xs leading-relaxed text-sidebar-muted">
          Prototipo académico · Los datos son de demostración y se almacenan en este navegador.
        </p>
      </aside>

      <main className="relative flex flex-col bg-canvas">
        <div className="flex items-center justify-between border-b border-line bg-surface/80 px-4 py-3 backdrop-blur lg:hidden">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-xs font-extrabold text-brand-ink">
              C+
            </span>
            <span>
              <span className="block font-display text-sm font-bold leading-tight text-ink">
                CampusConnect+
              </span>
              <span className="block text-[11px] leading-tight text-muted">Duoc UC</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted">
              Demo
            </span>
            <ThemeToggle />
          </div>
        </div>

        <div className="absolute right-6 top-6 hidden lg:block">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
          <div className="page-enter w-full max-w-md">
            <div className="mb-6 hidden lg:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                Acceso institucional
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-ink">
                Inicia sesión
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Accede con una cuenta de demostración para explorar CampusConnect+ según tu rol.
              </p>
            </div>

            <Card className="p-6 sm:p-8">
              <div className="lg:hidden">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                  Acceso institucional
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink">
                  Inicia sesión
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
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
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-ink"
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
                    className="flex gap-2 rounded-lg border border-danger-line bg-danger-soft p-3 text-xs leading-relaxed text-danger-ink"
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

              <div className="mt-6 border-t border-line pt-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-bold text-ink">Accesos de demostración</h3>
                  <span className="text-[11px] text-muted">Ingreso directo</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">
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
                        className="group flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-lg border border-line bg-surface px-3 py-2.5 text-left transition-colors hover:border-brand/40 hover:bg-brand-soft/50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${meta.avatarClass}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 overflow-hidden">
                          <span className="block truncate text-sm font-semibold text-ink">
                            {meta.label}
                          </span>
                          <span className="mt-0.5 block break-words text-xs leading-snug text-muted">
                            {credential.email} · {meta.interfaceLabel}
                          </span>
                        </span>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-line-strong transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            <p className="mt-5 text-center text-xs leading-relaxed text-muted">
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
