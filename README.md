# Test de Personalidad MBTI — Arquitectura MVC

Aplicación web para la evaluación de perfil MBTI, reestructurada con el patrón de
diseño **Modelo–Vista–Controlador (MVC)**, con **React + Tailwind CSS** en la
interfaz, **pnpm** como gestor de dependencias (monorepo) y **PostgREST** como
capa de datos para rastrear quién está usando la web.

## Estructura del monorepo (Modelo-Vista-Controlador)

```
Personalidad/
├── apps/
│   ├── web/                     # VISTA (React + Tailwind CSS + Vite)
│   │   └── src/
│   │       ├── components/      #   LoginView, QuizView, ResultView, panel online…
│   │       ├── services/        #   Cliente HTTP hacia el Controlador (API)
│   │       └── App.tsx          #   Orquesta las pantallas
│   └── api/                     # CONTROLADOR + Modelo de datos (Hono + Node)
│       └── src/
│           ├── controllers/     #   Controladores (reciben peticiones HTTP)
│           ├── services/        #   Lógica de negocio (orquesta los modelos)
│           ├── models/          #   Modelos de datos (User, Session vía PostgREST)
│           ├── db/              #   Cliente PostgREST (acceso a datos)
│           ├── routes/          #   Definición de endpoints
│           └── index.ts         #   Punto de montaje / inyección de dependencias
├── packages/
│   └── core/                    # MODELO de dominio (compartido entre web y api)
│       └── src/
│           ├── questions.ts     #   Catálogo de 70 preguntas MBTI
│           ├── personalities.ts #   Descripciones de los 16 tipos
│           └── scoring.ts       #   Lógica de puntuación y cálculo del resultado
└── database/
    └── schema.sql               # Esquema PostgreSQL para seguimiento de uso
```

### Cómo se aplica el patrón MVC

| Capa              | Ubicación                                  | Responsabilidad                                     |
| ----------------- | ------------------------------------------ | --------------------------------------------------- |
| **Modelo (Model)**| `packages/core` + `apps/api/models`        | Datos y reglas de negocio (preguntas, puntuación, filas de PostgREST) |
| **Vista (View)**  | `apps/web`                                 | Interfaz React + Tailwind (sin lógica de negocio)   |
| **Controlador**   | `apps/api/controllers`                     | Recibe peticiones HTTP, valida, delega en servicios |

```
Navegador (View React)
        │  fetch('/api/...')
        ▼
API Hono (Controller) ──► Service ──► Model ──► PostgREST ──► PostgreSQL
```

## Características de seguimiento de uso

Al iniciar el test se crea un usuario y una sesión; mientras se responde, se
envían "latidos" periódicos que mantienen al usuario como *en línea*. Al
finalizar se guarda el código MBTI.

La vista frontal incluye un panel **"En línea ahora"** (esquina superior
izquierda) que consulta a la API y muestra los usuarios activos y estadísticas.
Las vistas que lo alimentan:

- `active_users`: usuarios con actividad en los últimos 5 minutos
- `session_stats`: totales agregados (online, únicos, iniciados, completados)

### Endpoints de la API

| Método | Ruta                          | Descripción                                  |
| ------ | ----------------------------- | -------------------------------------------- |
| GET    | `/health`                     | Estado del servidor                          |
| GET    | `/api/questions`              | Lista de preguntas MBTI                      |
| POST   | `/api/sessions`               | Registra usuario y abre una sesión           |
| PATCH  | `/api/sessions/:id/heartbeat` | Mantiene al usuario en línea                 |
| POST   | `/api/sessions/:id/complete`  | Finaliza y guarda el código MBTI             |
| GET    | `/api/sessions/online`        | Usuarios activos ahora mismo                 |
| GET    | `/api/stats`                  | Estadísticas agregadas de uso                |

## Requisitos

- Node.js 18+
- [pnpm](https://pnpm.io/) 9+
- PostgreSQL + [PostgREST](https://postgrest.org/) corriendo localmente

## Puesta en marcha

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Preparar la base de datos (PostgREST / PostgreSQL)

Ejecuta el esquema incluido:

```bash
psql -d tu_base -f database/schema.sql
```

Configura PostgREST para exponer el esquema `public` (o el que uses). Apunta la
conexión en `.env`.

### 3. Configurar el entorno

Copia y ajusta las variables (hay `.env.example` en `apps/api` y `apps/web`):

```bash
# apps/api/.env
PORT=8787
PGREST_URL=http://localhost:3000
PGREST_APIKEY=tu_clave
PGREST_ACCEPT_PROFILE=public
CORS_ORIGIN=http://localhost:5173
```

```bash
# apps/web/.env (opcional: por defecto usa /api con proxy de Vite)
VITE_API_URL=/api
```

### 4. Ejecutar en desarrollo

```bash
pnpm dev
```

Esto levanta en paralelo:

- Frontend (Vite): http://localhost:5173 (con proxy `/api → :8787`)
- API (Hono/Node): http://localhost:8787

### 5. Compilar para producción

```bash
pnpm build        # compila web y api
pnpm start        # arranca la API desde dist/
```

## Comandos útiles

```bash
pnpm typecheck    # verificación de tipos en todos los paquetes
pnpm --filter @personalidad/web dev      # solo frontend
pnpm --filter @personalidad/api dev      # solo API
```

## Notas de implementación

- La lógica de puntuación MBTI vive **una sola vez** en `packages/core` y es
  reutilizada tanto por la API (para guardar el resultado) como por la vista
  (para mostrarlo). Evita duplicar reglas de negocio.
- La conexión a PostgREST se hace desde el **servidor Node** (nunca en el
  cliente), de modo que las credenciales de la base de datos no se exponen en
  el navegador.
- Cada paquete tiene su propio `tsconfig.json` y compila de forma aislada.