-- Esquema para rastrear quién usa la web (Test de Personalidad MBTI)
-- Compatible con PostgreSQL + PostgREST.

-- Activar la extensión gen_random_uuid (pgcrypto) para UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TABLA: users
-- Almacena a las personas que ingresan a la web.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLA: test_sessions
-- Cada visita/uso del test. Registra inicio, avance y finalización,
-- además de un "latido" (last_active_at) para saber quién está online.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.test_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'started'
    CHECK (status IN ('started', 'completed')),
  personality_code text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  ip text
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON public.test_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.test_sessions(user_id);

-- ============================================================
-- VISTA: online_users
-- Usuarios con actividad dentro de los últimos 5 minutos.
-- PostgREST expone las vistas como tabla de solo lectura.
-- ============================================================
CREATE OR REPLACE VIEW public.active_users AS
SELECT DISTINCT
  u.id AS user_id,
  u.name,
  u.email,
  s.id AS session_id,
  s.status,
  s.personality_code,
  s.last_active_at
FROM public.test_sessions s
JOIN public.users u ON u.id = s.user_id
WHERE s.last_active_at > now() - interval '5 minutes';

-- ============================================================
-- VISTA: session_stats
-- Estadísticas agregadas de uso.
-- ============================================================
CREATE OR REPLACE VIEW public.session_stats AS
SELECT
  count(*) FILTER (WHERE status = 'completed') AS completed_count,
  count(*) FILTER (WHERE status = 'started') AS started_count,
  count(DISTINCT user_id) AS unique_users,
  count(*) FILTER (WHERE last_active_at > now() - interval '5 minutes') AS online_count
FROM public.test_sessions;

-- ============================================================
-- TABLA: admins
-- Administradores de la página. Las contraseñas se guardan
-- hasheadas (bcrypt); NUNCA en texto plano.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLA: personalities
-- Descripciones de los 16 tipos MBTI. Editables desde el panel.
-- fortalezas/debilidades se guardan como arreglos JSON.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.personalities (
  code text PRIMARY KEY,      -- p.ej. 'INTJ'
  titulo text NOT NULL,
  descripcion text NOT NULL,
  fortalezas jsonb NOT NULL DEFAULT '[]',
  debilidades jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLA: questions
-- Catálogo de preguntas del test. Editables desde el panel.
-- column: 1..7 (mapeo a la dimensión). dim: 'E/I', 'S/N',...
-- ============================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id integer PRIMARY KEY,
  text text NOT NULL,
  "column" integer NOT NULL CHECK ("column" BETWEEN 1 AND 7),
  dim text NOT NULL CHECK (dim IN ('E/I', 'S/N', 'T/F', 'J/P')),
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
