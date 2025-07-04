import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '../utils/supabase';

export function DebugAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      } else {
        setProfile(null);
      }
    }

    loadProfile();
  }, [user]);

  if (!isVisible) return null;

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span>Auth Debug - Cargando...</span>
          <button onClick={() => setIsVisible(false)} style={styles.closeButton}>×</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>Auth Debug</span>
        <div>
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            style={styles.minimizeButton}
            title={isMinimized ? 'Maximizar' : 'Minimizar'}
          >
            {isMinimized ? '+' : '-'}
          </button>
          <button 
            onClick={() => setIsVisible(false)} 
            style={styles.closeButton}
            title="Cerrar"
          >
            ×
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div style={styles.content}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>Estado de Autenticación</div>
            <pre style={styles.pre}>
              {JSON.stringify({
                isAuthenticated,
                isLoaded: !isLoading,
                lastUpdated: new Date().toLocaleTimeString()
              }, null, 2)}
            </pre>
          </div>

          {user && (
            <>
              <div style={styles.section}>
                <div style={styles.sectionHeader}>Datos del Usuario (Auth)</div>
                <pre style={styles.pre}>
                  {JSON.stringify({
                    id: user.id,
                    email: user.email,
                    emailConfirmed: user.email_confirmed_at ? '✅' : '❌',
                    lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Nunca',
                    createdAt: user.created_at ? new Date(user.created_at).toLocaleString() : 'Desconocido'
                  }, null, 2)}
                </pre>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionHeader}>Perfil del Usuario (DB)</div>
                {profile ? (
                  <pre style={styles.pre}>
                    {JSON.stringify({
                      fullName: profile.full_name,
                      role: profile.role,
                      ageGroup: profile.age_group || 'No especificado',
                      avatar: profile.avatar_url ? '✅' : '❌',
                      lastUpdated: profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Desconocido'
                    }, null, 2)}
                  </pre>
                ) : (
                  <div style={styles.error}>No se pudo cargar el perfil</div>
                )}
              </div>
            </>
          )}

          <div style={styles.section}>
            <div style={styles.sectionHeader}>Acciones Rápidas</div>
            <div style={styles.actions}>
              <button 
                onClick={() => window.location.reload()}
                style={styles.actionButton}
              >
                🔄 Recargar
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                style={{...styles.actionButton, background: '#f44336'}}
                title="Elimina todos los datos locales"
              >
                🗑️ Limpiar Storage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    width: '350px',
    background: '#1e1e1e',
    color: '#e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    fontFamily: 'monospace',
    zIndex: 9999,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    fontSize: '13px',
  },
  header: {
    padding: '8px 12px',
    background: '#2d2d2d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #444',
    cursor: 'move',
    userSelect: 'none' as const,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0 5px',
    borderRadius: '3px',
    lineHeight: 1,
    marginLeft: '5px',
  },
  minimizeButton: {
    background: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '0 5px',
    borderRadius: '3px',
    lineHeight: 1,
  },
  content: {
    padding: '12px',
    overflowY: 'auto' as const,
    maxHeight: 'calc(80vh - 40px)',
  },
  section: {
    marginBottom: '12px',
    borderBottom: '1px solid #333',
    paddingBottom: '12px',
  },
  sectionHeader: {
    fontWeight: 'bold' as const,
    marginBottom: '6px',
    color: '#64b5f6',
    fontSize: '13px',
  },
  pre: {
    margin: '0',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    fontSize: '12px',
    lineHeight: 1.4,
    fontFamily: 'monospace',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '12px',
    fontStyle: 'italic' as const,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  actionButton: {
    background: '#3a3a3a',
    border: '1px solid #555',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'background 0.2s',
  },
};
