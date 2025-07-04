// Constantes
const API_BASE_URL = 'http://localhost:8000/api';
const AGE_GROUPS = ['3-5', '6-8', '9-12'];

// Elementos del DOM
const navLinks = document.querySelectorAll('.nav-link');
const ageGroupSelect = document.getElementById('age-group');
const mainContent = document.getElementById('main-content');
const loadingSpinner = document.getElementById('loading-spinner');

// Estado de la aplicación
let currentPage = 'inicio';
let currentAgeGroup = '6-8';
let userData = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar manejadores de eventos
    setupEventListeners();
    
    // Cargar datos iniciales
    loadInitialData();
    
    // Mostrar la página de inicio
    showPage('inicio');
});

// Configurar manejadores de eventos
function setupEventListeners() {
    // Navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                showPage(page);
            }
        });
    });

    // Selector de grupo de edad
    if (ageGroupSelect) {
        ageGroupSelect.addEventListener('change', (e) => {
            currentAgeGroup = e.target.value;
            updateContentForAgeGroup();
        });
    }
}

// Cargar datos iniciales
async function loadInitialData() {
    try {
        showLoading(true);
        
        // Cargar datos del usuario si está autenticado
        const token = localStorage.getItem('token');
        if (token) {
            userData = await fetchWithAuth('/user/me');
            updateUIForUser(userData);
        }
        
        // Cargar contenido inicial basado en el grupo de edad
        await updateContentForAgeGroup();
        
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        showError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.');
    } finally {
        showLoading(false);
    }
}

// Mostrar página específica
function showPage(page) {
    // Actualizar navegación
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Actualizar contenido
    currentPage = page;
    
    // Aquí iría la lógica para cargar el contenido específico de la página
    // Por ahora, solo actualizamos la clase activa
    document.querySelectorAll('.page-section').forEach(section => {
        if (section.id === `${page}-page`) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

// Actualizar contenido según el grupo de edad
async function updateContentForAgeGroup() {
    try {
        showLoading(true);
        
        // Aquí iría la lógica para cargar contenido específico por edad
        // Por ejemplo, podríamos cargar módulos recomendados para el grupo de edad
        const modules = await fetchWithAuth(`/modules/recommended?ageGroup=${currentAgeGroup}`);
        renderModules(modules);
        
    } catch (error) {
        console.error('Error al actualizar contenido:', error);
        showError('No se pudo cargar el contenido para este grupo de edad.');
    } finally {
        showLoading(false);
    }
}

// Renderizar módulos
function renderModules(modules) {
    const container = document.getElementById('modules-container');
    if (!container) return;
    
    if (!modules || modules.length === 0) {
        container.innerHTML = '<p>No hay módulos disponibles en este momento.</p>';
        return;
    }
    
    container.innerHTML = modules.map(module => `
        <div class="card">
            <img src="${module.imageUrl || '/placeholder-module.jpg'}" alt="${module.name}" class="card-img">
            <div class="card-body">
                <h3 class="card-title">${module.name}</h3>
                <p class="card-text">${module.description}</p>
                <div class="mt-4">
                    <button class="btn btn-primary w-full" onclick="startModule('${module.id}')">
                        Comenzar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Función para iniciar un módulo
function startModule(moduleId) {
    // Aquí iría la lógica para iniciar un módulo específico
    console.log(`Iniciando módulo ${moduleId} para grupo de edad ${currentAgeGroup}`);
    // Por ahora, solo mostramos un mensaje
    alert(`¡Módulo ${moduleId} iniciado para el grupo de edad ${currentAgeGroup}!`);
}

// Utilidad para hacer peticiones autenticadas
async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la solicitud');
    }
    
    return response.json();
}

// Mostrar/ocultar carga
function showLoading(show) {
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }
}

// Mostrar mensaje de error
function showError(message) {
    // Aquí podríamos implementar un sistema de notificaciones
    console.error(message);
    alert(message);
}

// Actualizar UI según el estado del usuario
function updateUIForUser(userData) {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (userData) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName) userName.textContent = userData.name || 'Usuario';
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Funciones globales necesarias
window.startModule = startModule;
