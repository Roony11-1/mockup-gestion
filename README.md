# CampusConnect+

Plataforma web responsive para consultar disponibilidad de baños y compartir reseñas de docentes y estudiantes dentro del campus. Nació como un mockup de teléfono y hoy es una aplicación multipágina construida con Astro, React y Tailwind CSS.

> **Datos de demostración.** El proyecto no tiene backend: la sesión vive en `sessionStorage` y los datos en `localStorage`. No hay operaciones reales contra un servidor ni estadísticas inventadas; todo lo que se muestra se calcula a partir de los registros guardados en el navegador.

## Stack

- **Astro 7** con rutas estáticas multipágina.
- **React 19** mediante `@astrojs/react` para las islas interactivas.
- **Tailwind CSS 4** con tokens propios en `src/styles/global.css`.
- **TypeScript** en la capa de datos, validación y componentes.
- **Lucide React** para iconografía.
- **pnpm** como gestor de paquetes oficial (`packageManager: pnpm@12.18.0`).

## Requisitos

- Node.js >= 22.12.0.
- pnpm. Si no está instalado globalmente, usa Corepack:

```sh
corepack pnpm install
```

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Acción |
| --- | --- |
| `pnpm install` | Instala dependencias y respeta `pnpm-lock.yaml`. |
| `pnpm dev` | Inicia el servidor de desarrollo en `http://localhost:4321`. |
| `pnpm dev:background` | Inicia el servidor en segundo plano. |
| `pnpm dev:status` | Consulta el estado del servidor en segundo plano. |
| `pnpm dev:logs` | Muestra los logs del servidor en segundo plano. |
| `pnpm dev:stop` | Detiene el servidor en segundo plano. |
| `pnpm check` | Ejecuta `astro check` (TypeScript + Astro). |
| `pnpm build` | Genera el sitio estático en `dist/`. |
| `pnpm preview` | Sirve localmente la build de producción. |

Si Corepack no expone `pnpm` directamente en tu equipo, reemplaza cada comando por `corepack pnpm <comando>`.

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio de sesión y accesos de demostración. |
| `/dashboard` | Resumen según el rol, disponibilidad y actividad reciente. |
| `/banos` | Listado de baños con búsqueda, filtros, orden y gestión de estados. |
| `/docentes` | Reseñas de docentes (solo estudiantes). |
| `/estudiantes` | Reseñas de estudiantes (solo estudiantes). |
| `/perfil` | Cuenta, permisos del rol, reinicio de datos y cierre de sesión. |

## Roles y cuentas de demostración

La contraseña se ignora intencionalmente: es un prototipo académico sin autenticación real.

| Correo | Rol | Permisos |
| --- | --- | --- |
| `alumno@duocuc.cl` | Estudiante | Consulta baños, publica y lee reseñas de docentes y estudiantes. |
| `aseo@duoc.cl` | Personal de aseo | Consulta baños y actualiza estado y horario. Sin acceso a reseñas. |
| `profesor@duoc.cl` | Docente | Consulta baños en modo lectura. Sin acceso a reseñas. |

Los permisos se validan tanto en la interfaz como en la capa de datos (`src/lib/mockData.ts`), no solo al ocultar botones.

## Arquitectura

```text
src/
├── components/
│   ├── auth/          # Login y accesos rápidos
│   ├── bathrooms/     # Listado, filtros, tarjetas y estado
│   ├── dashboard/     # Resumen por rol
│   ├── layout/        # Sidebar, header y drawer móvil
│   ├── profile/       # Cuenta y permisos
│   ├── reviews/       # Módulo compartido de reseñas
│   └── ui/            # Botones, cards, modales, toasts, estados
├── hooks/             # Sesión, datos y guardas de rol
├── layouts/           # Layout base y layout autenticado
├── lib/               # Tipos, semilla, migración, validación, formato
├── pages/             # Rutas Astro
└── styles/            # Tailwind y estilos globales
```

Decisiones relevantes:

- **Astro multipágina + islas React.** Cada ruta es HTML estático y monta solo el componente React que necesita interactividad.
- **Capa de datos tipada.** `mockData.ts` concentra carga, migración, persistencia y operaciones; los componentes no escriben `localStorage` directamente.
- **Migración defensiva.** Los datos antiguos se normalizan sin borrar estados ni reseñas existentes. La versión actual del esquema es `2`.
- **Reseñas compartidas.** Docentes y estudiantes usan el mismo módulo (`ReviewsPage`) parametrizado por configuración, evitando duplicar filtros, orden, modal y formulario.
- **UI reutilizable.** Cards, badges, botones, inputs, modales, diálogos de confirmación, toasts y estados vacíos/carga viven en `src/components/ui`.

## Funcionalidades

### Generales

- Layout responsive con sidebar en escritorio, header compacto y drawer móvil accesible.
- Navegación filtrada por rol.
- Toasts de confirmación, estados vacíos, estados de carga y diálogos de confirmación.
- Etiquetas accesibles, foco visible, cierre de modales con `Escape` y soporte de teclado.
- Avisos explícitos de datos de demostración.

### Baños

- Búsqueda por nombre, sede, ubicación o piso.
- Filtros por sede, piso y estado.
- Orden por nombre, sede, piso, estado y última actualización.
- Contador de resultados anunciado con `aria-live`.
- Personal de aseo puede actualizar estado, horario y notas; el cambio persiste en `localStorage`.
- Estudiantes y docentes ven el módulo en modo lectura.

### Reseñas

- Búsqueda por docente o estudiante y por texto del comentario.
- Orden por fecha, calificación o nombre.
- Filtro por cantidad de estrellas.
- Modal con historial de reseñas por materia o persona.
- Formulario validado con nombre, calificación y comentario respetuoso.
- Publicación persistente y toast de confirmación.
- Restricción de acceso para roles distintos de estudiante.

### Perfil

- Datos de la sesión y rol actual.
- Matriz de permisos.
- Confirmación antes de reiniciar los datos de demostración.
- Cierre de sesión con redirección al login.

## Datos y persistencia

- Clave de sesión: `campusconnect_session` (`sessionStorage`).
- Clave de datos: `campusconnect_data` (`localStorage`).
- Versión del esquema: `2`.
- La migración normaliza baños antiguos, descarta registros inválidos y renombra la autora de demostración legada `Javiera Paredes` a `Martina Ortiz`.
- Reiniciar datos desde `/perfil` vuelve a la semilla de demostración.

## Verificación

Comprobaciones realizadas en este entorno:

```sh
corepack pnpm check   # 0 errores, 0 advertencias
corepack pnpm build   # 6 rutas estáticas generadas
```

También se ejecutó una prueba E2E con Edge headless/CDP sobre las rutas principales:

- Login rápido y cierre de sesión.
- Drawer móvil y ausencia de desbordamiento horizontal en 1440, 900 y 390 px.
- Alta de baños, búsqueda, filtros y actualización de estado con persistencia y toast.
- Acceso denegado a reseñas para personal de aseo y docente.
- Modal de reseñas, publicación de reseña de docente con persistencia.
- Página de reseñas de estudiantes.
- Permisos y confirmación de reinicio en `/perfil`.
- Migración automática del nombre legado en `localStorage`.
- Sin errores de consola.

El proyecto no incluye una suite de tests automatizados versionada; la verificación anterior es manual/asistida y no reemplaza pruebas de integración formales.

## Limitaciones

- No hay backend, API ni autenticación real.
- Los datos son locales al navegador y no se sincronizan entre dispositivos.
- Las cuentas y la semilla son de demostración.
- No se inventaron endpoints, métricas ni operaciones que el proyecto no pueda ejecutar.
