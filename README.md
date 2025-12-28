
# Configuración de AlexIA con Supabase

## 1. Crear Proyecto en Supabase
1. Ve a [Supabase](https://supabase.com/) y crea un nuevo proyecto.
2. Obtén la `URL` y la `ANON_KEY` desde la sección de **Project Settings > API**.

## 2. Crear Tabla de Usuarios
Ejecuta el siguiente SQL en el **SQL Editor** de Supabase para crear la tabla necesaria:

```sql
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  plan text DEFAULT 'free',
  role text DEFAULT 'user',
  trial_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS (Opcional, para mayor seguridad configurar políticas)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política simple para permitir lectura/escritura (ajustar según necesidad)
CREATE POLICY "Allow all for now" ON users FOR ALL USING (true);
```

## 3. Configurar Variables de Entorno
Añade las siguientes variables en tu entorno local o en Vercel:
- `API_KEY`: Tu clave de Google Gemini API.
- `SUPABASE_URL`: La URL de tu proyecto.
- `SUPABASE_ANON_KEY`: Tu clave anónima.

## 4. Despliegue en Vercel
Simplemente conecta tu repositorio y asegúrate de añadir las variables de entorno mencionadas arriba.
