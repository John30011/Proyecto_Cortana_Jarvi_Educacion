-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla 'profiles'
-- Cualquiera puede ver perfiles públicos
CREATE POLICY "Perfiles visibles para todos"
    ON public.profiles
    FOR SELECT
    USING (true);

-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Políticas para la tabla 'learning_modules'
-- Cualquiera puede ver los módulos de aprendizaje
CREATE POLICY "Módulos visibles para todos"
    ON public.learning_modules
    FOR SELECT
    USING (true);

-- Solo los administradores pueden crear, actualizar o eliminar módulos
CREATE POLICY "Solo administradores pueden gestionar módulos"
    ON public.learning_modules
    FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Políticas para la tabla 'chat_sessions'
-- Los usuarios pueden ver sus propias sesiones
CREATE POLICY "Usuarios pueden ver sus propias sesiones"
    ON public.chat_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Los usuarios pueden crear sus propias sesiones
CREATE POLICY "Usuarios pueden crear sus propias sesiones"
    ON public.chat_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propias sesiones
CREATE POLICY "Usuarios pueden actualizar sus propias sesiones"
    ON public.chat_sessions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Políticas para la tabla 'chat_messages'
-- Los usuarios pueden ver mensajes de sus propias sesiones
CREATE POLICY "Usuarios pueden ver mensajes de sus sesiones"
    ON public.chat_messages
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.chat_sessions
        WHERE chat_sessions.id = chat_messages.session_id
        AND chat_sessions.user_id = auth.uid()
    ));

-- Los usuarios pueden crear mensajes en sus propias sesiones
CREATE POLICY "Usuarios pueden crear mensajes en sus sesiones"
    ON public.chat_messages
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.chat_sessions
        WHERE chat_sessions.id = chat_messages.session_id
        AND chat_sessions.user_id = auth.uid()
    ));

-- Políticas para la tabla 'user_progress'
-- Los usuarios pueden ver su propio progreso
CREATE POLICY "Usuarios pueden ver su propio progreso"
    ON public.user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

-- Los usuarios pueden crear su propio progreso
CREATE POLICY "Usuarios pueden crear su propio progreso"
    ON public.user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar su propio progreso
CREATE POLICY "Usuarios pueden actualizar su propio progreso"
    ON public.user_progress
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Los profesores pueden ver el progreso de sus estudiantes
CREATE POLICY "Profesores pueden ver el progreso de sus estudiantes"
    ON public.user_progress
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    ));

-- Función para verificar si un usuario es administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
