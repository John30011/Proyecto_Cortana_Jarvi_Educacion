-- Función para manejar la creación de perfiles de usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar un nuevo perfil cuando se crea un usuario
  INSERT INTO public.profiles (id, email, username, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email,
    -- Crear un nombre de usuario único a partir del email
    COALESCE(
      NULLIF(SPLIT_PART(NEW.email, '@', 1), ''),
      'user_' || REPLACE(NEW.id::text, '-', '')
    ),
    -- Usar el nombre del usuario si está disponible, de lo contrario usar el email
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      SPLIT_PART(NEW.email, '@', 1)
    ),
    -- Establecer el rol (por defecto 'student' si no se especifica)
    COALESCE(
      NULLIF((NEW.raw_user_meta_data->>'role')::text, ''),
      'student'
    )::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Asegurarse de que la función sea ejecutable por el rol de autenticación
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, anon, service_role;

-- Asegurarse de que las políticas RLS permitan la creación de perfiles
CREATE POLICY "Permitir inserción de perfiles para nuevos usuarios"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Habilitar RLS en la tabla de perfiles si no está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
