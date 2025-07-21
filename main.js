// main.js - Espacio Cocrearte

// Verificar qué objetos de FullCalendar están disponibles
console.log('=== DEBUG FULLCALENDAR ===');
console.log('window.FullCalendar:', window.FullCalendar);
console.log('FullCalendar:', typeof FullCalendar);
console.log('window.FullCalendarResourceTimeGrid:', window.FullCalendarResourceTimeGrid);
console.log('window.FullCalendarResourceCommon:', window.FullCalendarResourceCommon);
console.log('window.FullCalendarTimeGrid:', window.FullCalendarTimeGrid);
console.log('window.FullCalendarDayGrid:', window.FullCalendarDayGrid);
console.log('window.FullCalendarInteraction:', window.FullCalendarInteraction);
console.log('========================');

// Función de debug para probar el filtro de profesionales
window.debugFiltro = async function() {
    console.log('🔍 === DEBUG FILTRO DE PROFESIONALES ===');
    console.log('🔍 Firebase DB:', !!window.firebaseDB);
    console.log('🔍 Firebase Auth:', !!window.firebaseAuth);
    console.log('🔍 Usuario actual:', window.firebaseAuth.currentUser?.email);
    
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    const checkboxesContainer = document.getElementById('profesionalesCheckboxes');
    
    console.log('🔍 Filtro encontrado:', !!profesionalesFilter);
    console.log('🔍 Container encontrado:', !!checkboxesContainer);
    
    if (profesionalesFilter) {
        console.log('🔍 Clases del filtro:', profesionalesFilter.classList.toString());
        console.log('🔍 Estilos del filtro:', profesionalesFilter.style.cssText);
    }
    
    try {
        const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
        console.log('🔍 Usuarios en Firebase:', usuariosSnap.size);
        usuariosSnap.docs.forEach(doc => {
            console.log('🔍 Usuario:', doc.id, doc.data());
        });
    } catch (error) {
        console.error('🔍 Error al consultar Firebase:', error);
    }
    
    console.log('🔍 profesionalesDisponibles:', profesionalesDisponibles);
    console.log('🔍 profesionalesSeleccionados:', profesionalesSeleccionados);
};

// Función para forzar la carga del filtro (para debug)
window.forzarFiltro = async function() {
    console.log('🚀 FORZANDO CARGA DEL FILTRO...');
    await mostrarAgendaMultiple();
};

// Función de debug completa para probar todo el flujo
window.testCompleto = async function() {
    console.log('🧪 === TEST COMPLETO DEL FILTRO ===');
    
    // 1. Verificar elementos HTML
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    const checkboxesContainer = document.getElementById('profesionalesCheckboxes');
    console.log('1️⃣ Elementos HTML:', { 
        filtro: !!profesionalesFilter, 
        container: !!checkboxesContainer 
    });
    
    // 2. Activar agenda múltiple
    console.log('2️⃣ Activando agenda múltiple...');
    const tabMultiple = document.getElementById('tabAgendaMultiple');
    if (tabMultiple) {
        tabMultiple.click();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
    }
    
    // 3. Verificar visibilidad después de activar
    console.log('3️⃣ Verificando visibilidad...');
    window.verificarFiltro();
    
    // 4. Intentar cargar desde Firebase
    console.log('4️⃣ Intentando cargar desde Firebase...');
    const profesionales = await window.cargarProfesionalesFirebase();
    
    // 5. Si no funcionó Firebase, crear select de prueba
    if (!profesionales || profesionales.length === 0) {
        console.log('5️⃣ Firebase falló, creando select de prueba...');
        window.crearSelectPrueba();
    }
    
    console.log('🎉 TEST COMPLETO FINALIZADO');
};

// Función para forzar la creación inmediata del filtro
window.forzarFiltroInmediato = function() {
    console.log('⚡ === FORZANDO FILTRO INMEDIATO ===');
    
    // 1. Asegurar que el filtro sea visible
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    if (profesionalesFilter) {
        profesionalesFilter.classList.remove('hidden');
        profesionalesFilter.style.display = 'flex';
        profesionalesFilter.style.visibility = 'visible';
        profesionalesFilter.style.opacity = '1';
        console.log('✅ Filtro forzado a ser visible');
    }
    
    // 2. Crear select inmediatamente
    window.crearSelectPrueba();
    
    // 3. Verificar resultado
    const profesionalesSelect = document.getElementById('profesionalesSelect');
    if (profesionalesSelect) {
        console.log('📊 Resultado final:');
        console.log('  - Número de opciones:', profesionalesSelect.options.length);
        console.log('  - Valor seleccionado:', profesionalesSelect.value);
        console.log('  - Opciones disponibles:', Array.from(profesionalesSelect.options).map(opt => opt.text));
    }
    
    console.log('⚡ FILTRO INMEDIATO COMPLETADO');
};

// Función de debug para verificar el filtrado
window.debugFiltrado = async function() {
    console.log('🔍 === DEBUG FILTRADO DE PROFESIONALES ===');
    
    // 1. Estado de las variables globales
    console.log('📋 profesionalesDisponibles:', profesionalesDisponibles.map(p => ({ id: p.id, title: p.title })));
    console.log('📋 profesionalesSeleccionados:', profesionalesSeleccionados);
    
    // 2. Estado del select
    const select = document.getElementById('profesionalesSelect');
    if (select) {
        console.log('🎯 Valor actual del select:', select.value);
        console.log('🎯 Opciones disponibles:', Array.from(select.options).map(opt => ({ value: opt.value, text: opt.text })));
        
        // 3. Verificar coincidencia
        const valorSeleccionado = select.value;
        const profesionalEncontrado = profesionalesDisponibles.find(p => p.id === valorSeleccionado);
        console.log('🔍 Profesional encontrado para valor seleccionado:', profesionalEncontrado);
        
        // 4. Verificar filtrado
        const deberiaEstarSeleccionado = valorSeleccionado === 'todos' 
            ? profesionalesDisponibles.map(p => p.id)
            : [valorSeleccionado];
        console.log('🎯 Debería estar seleccionado:', deberiaEstarSeleccionado);
        console.log('🎯 Actualmente seleccionado:', profesionalesSeleccionados);
        console.log('🎯 ¿Coincide?:', JSON.stringify(deberiaEstarSeleccionado.sort()) === JSON.stringify(profesionalesSeleccionados.sort()));
    }
    
    // 5. Estado del calendario
    const calendar = calendarMultipleInstance;
    if (calendar) {
        const events = calendar.getEvents();
        console.log('📅 Eventos en el calendario:', events.length);
        console.log('📅 Vista actual:', calendar.view.type);
        
        if (events.length > 0) {
            console.log('📌 Eventos detallados:');
            events.forEach((event, index) => {
                console.log(`  ${index + 1}. "${event.title}" - Profesional ID: "${event.extendedProps.profesionalId}" - Profesional: "${event.extendedProps.profesionalName}"`);
            });
            
            // 6. Verificar si los eventos mostrados coinciden con la selección
            const eventosProfesionalIds = [...new Set(events.map(e => e.extendedProps.profesionalId))];
            console.log('🎯 IDs de profesionales en eventos:', eventosProfesionalIds);
            console.log('🎯 IDs seleccionados:', profesionalesSeleccionados);
            
            const eventosCorrectos = eventosProfesionalIds.every(id => profesionalesSeleccionados.includes(id));
            console.log('🎯 ¿Eventos correctos?:', eventosCorrectos);
            
            if (!eventosCorrectos) {
                console.error('❌ HAY EVENTOS DE PROFESIONALES NO SELECCIONADOS!');
                eventosProfesionalIds.forEach(id => {
                    if (!profesionalesSeleccionados.includes(id)) {
                        const prof = profesionalesDisponibles.find(p => p.id === id);
                        console.error(`❌ Evento incorrecto de: ${prof?.title || 'Desconocido'} (${id})`);
                    }
                });
            }
        }
    }
    
    // 7. Probar la nueva función de carga filtrada
    console.log('🧪 === PROBANDO NUEVA FUNCIÓN DE CARGA FILTRADA ===');
    try {
        const eventosFiltrados = await cargarEventosFiltrados();
        console.log('🧪 Eventos que debería cargar la función:', eventosFiltrados.length);
        
        if (eventosFiltrados.length > 0) {
            console.log('🧪 Eventos de la función filtrada:');
            eventosFiltrados.forEach((evento, index) => {
                console.log(`  ${index + 1}. "${evento.title}" - Profesional ID: "${evento.extendedProps.profesionalId}"`);
            });
            
            // Comparar con los eventos actuales del calendario
            if (calendar && calendar.getEvents().length > 0) {
                const eventosCalendario = calendar.getEvents();
                const idsCalendario = eventosCalendario.map(e => e.extendedProps.profesionalId).sort();
                const idsFuncion = eventosFiltrados.map(e => e.extendedProps.profesionalId).sort();
                
                console.log('🧪 Comparación:');
                console.log('  - IDs en calendario actual:', idsCalendario);
                console.log('  - IDs en función filtrada:', idsFuncion);
                console.log('  - ¿Son iguales?:', JSON.stringify(idsCalendario) === JSON.stringify(idsFuncion));
            }
        }
    } catch (error) {
        console.error('🧪 Error al probar función filtrada:', error);
    }
    
    console.log('🔍 === FIN DEBUG FILTRADO ===');
};

// Función para probar el filtrado paso a paso
window.probarFiltrado = async function(profesionalId = null) {
    console.log('🧪 === INICIANDO PRUEBA DE FILTRADO ===');
    
    // Si no se especifica profesional, usar el seleccionado en el select
    if (!profesionalId) {
        const select = document.getElementById('profesionalesSelect');
        if (select) {
            profesionalId = select.value;
        }
    }
    
    console.log('🎯 Probando filtrado para:', profesionalId);
    
    // Simular cambio de selección
    if (profesionalId === 'todos') {
        profesionalesSeleccionados = profesionalesDisponibles.map(p => p.id);
        console.log('📋 Seleccionando todos los profesionales:', profesionalesSeleccionados);
    } else {
        profesionalesSeleccionados = [profesionalId];
        console.log('📋 Seleccionando solo:', profesionalId);
        
        // Encontrar el nombre del profesional
        const profesional = profesionalesDisponibles.find(p => p.id === profesionalId);
        if (profesional) {
            console.log('👤 Profesional seleccionado:', profesional.title);
        } else {
            console.error('❌ Profesional no encontrado en profesionalesDisponibles');
            return;
        }
    }
    
    // Probar la función de carga filtrada
    console.log('🔄 Probando carga filtrada...');
    const eventosFiltrados = await cargarEventosFiltrados();
    
    console.log('📊 Resultado de la prueba:');
    console.log('  - Eventos cargados:', eventosFiltrados.length);
    console.log('  - Profesionales en eventos:', [...new Set(eventosFiltrados.map(e => e.extendedProps.profesionalId))]);
    console.log('  - Profesionales seleccionados:', profesionalesSeleccionados);
    
    // Verificar que el filtrado sea correcto
    const eventsProfessionalIds = [...new Set(eventosFiltrados.map(e => e.extendedProps.profesionalId))];
    const filtradoCorrecto = eventsProfessionalIds.every(id => profesionalesSeleccionados.includes(id));
    
    if (filtradoCorrecto) {
        console.log('✅ FILTRADO CORRECTO: Todos los eventos pertenecen a profesionales seleccionados');
    } else {
        console.error('❌ FILTRADO INCORRECTO: Hay eventos de profesionales no seleccionados');
        eventsProfessionalIds.forEach(id => {
            if (!profesionalesSeleccionados.includes(id)) {
                const prof = profesionalesDisponibles.find(p => p.id === id);
                console.error(`❌ Evento incorrecto de: ${prof?.title || 'Desconocido'} (${id})`);
            }
        });
    }
    
    console.log('🧪 === FIN PRUEBA DE FILTRADO ===');
    return eventosFiltrados;
};

// Función para cargar profesionales desde Firebase directamente
window.cargarProfesionalesFirebase = async function() {
    console.log('🔥 === CARGANDO PROFESIONALES DESDE FIREBASE ===');
    
    try {
        if (!window.firebaseDB) {
            console.error('❌ Firebase DB no está disponible');
            return;
        }
        
        console.log('📡 Consultando colección usuarios...');
        const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
        console.log('📊 Usuarios encontrados:', usuariosSnap.size);
        
        if (usuariosSnap.empty) {
            console.warn('⚠️ No hay usuarios en Firebase');
            return;
        }
        
        // Procesar usuarios
        const profesionales = [];
        usuariosSnap.forEach(doc => {
            const data = doc.data();
            console.log('👤 Usuario:', { id: doc.id, data: data });
            profesionales.push({
                id: doc.id,
                title: data.displayName || data.email || 'Usuario sin nombre'
            });
        });
        
        // Actualizar variables globales
        profesionalesDisponibles = profesionales;
        profesionalesSeleccionados = profesionales.map(p => p.id);
        
        console.log('✅ Profesionales cargados:', profesionales);
        
        // Cargar en el select
        cargarFiltrosProfesionales();
        
        console.log('🔥 CARGA COMPLETA DESDE FIREBASE');
        return profesionales;
        
    } catch (error) {
        console.error('❌ Error al cargar desde Firebase:', error);
        return null;
    }
};

// Función para crear select de prueba
window.crearSelectPrueba = function() {
    console.log('🧪 CREANDO SELECT DE PRUEBA...');
    const profesionalesSelect = document.getElementById('profesionalesSelect');
    
    if (!profesionalesSelect) {
        console.error('❌ No se encontró el select profesionalesSelect');
        return;
    }
    
    console.log('✅ Select encontrado:', profesionalesSelect);
    
    // Usar profesionalesDisponibles si existen, sino crear de prueba
    let profesionalesParaSelect = profesionalesDisponibles;
    if (!profesionalesParaSelect || profesionalesParaSelect.length === 0) {
        profesionalesParaSelect = [
            { id: 'test1', title: 'Dr. Juan Pérez' },
            { id: 'test2', title: 'Dra. María García' },
            { id: 'test3', title: 'Lic. Carlos López' }
        ];
        // Actualizar variables globales
        profesionalesDisponibles = profesionalesParaSelect;
        profesionalesSeleccionados = profesionalesParaSelect.map(p => p.id);
    }
    
    console.log('📋 Creando opciones para:', profesionalesParaSelect);
    
    // Limpiar y recrear opciones
    profesionalesSelect.innerHTML = '<option value="todos">Todos los profesionales</option>';
    
    profesionalesParaSelect.forEach((prof, index) => {
        const option = document.createElement('option');
        option.value = prof.id;
        option.textContent = prof.title;
        profesionalesSelect.appendChild(option);
        console.log(`✅ Opción ${index + 1}/${profesionalesParaSelect.length} creada para:`, prof.title);
    });
    
    // Seleccionar "Todos" por defecto
    profesionalesSelect.value = 'todos';
    
    console.log('🎉 Select de prueba creado exitosamente');
    console.log('📊 Total de opciones:', profesionalesParaSelect.length + 1); // +1 por "Todos"
    console.log('📊 Valor seleccionado:', profesionalesSelect.value);
};

// Mantener la función anterior para compatibilidad
window.crearCheckboxesPrueba = window.crearSelectPrueba;

// Función para verificar visibilidad del filtro
window.verificarFiltro = function() {
    console.log('🔍 === VERIFICANDO VISIBILIDAD DEL FILTRO ===');
    
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    const checkboxesContainer = document.getElementById('profesionalesCheckboxes');
    
    if (profesionalesFilter) {
        console.log('✅ profesionalesFilter encontrado');
        console.log('📊 Clases:', profesionalesFilter.classList.toString());
        console.log('📊 Display:', getComputedStyle(profesionalesFilter).display);
        console.log('📊 Visibility:', getComputedStyle(profesionalesFilter).visibility);
        console.log('📊 Opacity:', getComputedStyle(profesionalesFilter).opacity);
        console.log('📊 Estilos inline:', profesionalesFilter.style.cssText);
        
        // Forzar que sea visible
        profesionalesFilter.classList.remove('hidden');
        profesionalesFilter.style.display = 'flex';
        profesionalesFilter.style.visibility = 'visible';
        profesionalesFilter.style.opacity = '1';
        
        console.log('🔧 Filtro forzado a ser visible');
        console.log('🔧 Estado después del forzado:', {
            display: getComputedStyle(profesionalesFilter).display,
            visibility: getComputedStyle(profesionalesFilter).visibility,
            opacity: getComputedStyle(profesionalesFilter).opacity
        });
    } else {
        console.error('❌ profesionalesFilter NO encontrado');
    }
    
    const profesionalesSelect = document.getElementById('profesionalesSelect');
    if (profesionalesSelect) {
        console.log('✅ profesionalesSelect encontrado');
        console.log('📊 Número de opciones:', profesionalesSelect.options.length);
        console.log('📊 Valor seleccionado:', profesionalesSelect.value);
        if (profesionalesSelect.options.length > 0) {
            console.log('📊 Primera opción:', profesionalesSelect.options[0].text);
            console.log('📊 Última opción:', profesionalesSelect.options[profesionalesSelect.options.length - 1].text);
        }
    } else {
        console.error('❌ profesionalesSelect NO encontrado');
    }
    
    // Verificar estado global
    console.log('📊 Estado global:', {
        profesionalesDisponibles: profesionalesDisponibles.length,
        profesionalesSeleccionados: profesionalesSeleccionados.length,
        calendarVisible: calendarVisible,
        activeTab: activeTab
    });
};

// Referencias a elementos de la landing page
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const ctaRegisterBtn = document.getElementById('ctaRegisterBtn');
const ctaRegisterBtn2 = document.getElementById('ctaRegisterBtn2');
const demoBtn = document.getElementById('demoBtn');
const demoBtn2 = document.getElementById('demoBtn2');
const contactBtn = document.getElementById('contactBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const showRegisterFormBtn = document.getElementById('showRegisterForm');
const showLoginFormBtn = document.getElementById('showLoginForm');
const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');

// Referencias a elementos del dashboard
const welcomeBlock = document.getElementById('welcomeBlock');
const welcomeUser = document.getElementById('welcomeUser');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const showAddPatientBtn = document.getElementById('showAddPatientBtn');
const addPatientModal = document.getElementById('addPatientModal');
const addPatientForm = document.getElementById('addPatientForm');
const patientsList = document.getElementById('patientsList');
const noPatientsMsg = document.getElementById('noPatientsMsg');

// FICHA CLÍNICA PACIENTE
const fichaPacienteModal = document.getElementById('fichaPacienteModal');
const fichaPacienteDatos = document.getElementById('fichaPacienteDatos');
const sesionesList = document.getElementById('sesionesList');
const noSesionesMsg = document.getElementById('noSesionesMsg');
const addSesionForm = document.getElementById('addSesionForm');
let fichaPacienteId = null;
let fichaPacienteRef = null;

// Toggle modo oscuro
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeToggleDashboard = document.getElementById('themeToggleDashboard');
const themeIconDashboard = document.getElementById('themeIconDashboard');

// Modal de confirmación personalizado
const customConfirmModal = document.getElementById('customConfirmModal');
const customConfirmMessage = document.getElementById('customConfirmMessage');
const customConfirmOk = document.getElementById('customConfirmOk');
const customConfirmCancel = document.getElementById('customConfirmCancel');

// Panel admin
let isAdmin = false;
let adminPanel = null;

// Panel admin: muestra lista de profesionales y permite ver pacientes/sesiones de cada uno
let adminPanelState = { selectedUser: null, profesionales: [], pacientes: [], sesiones: {} };

// Referencias al modal de nueva sesión
const modalNuevaSesion = document.getElementById('modalNuevaSesion');
const formNuevaSesion = document.getElementById('formNuevaSesion');
const selectPaciente = document.getElementById('selectPaciente');
const inputFechaSesion = document.getElementById('inputFechaSesion');
const inputPresentismoSesion = document.getElementById('inputPresentismoSesion');
const inputNotasSesion = document.getElementById('inputNotasSesion');
const cancelNuevaSesion = document.getElementById('cancelNuevaSesion');

// Referencias al modal de solo lectura para agenda múltiple
const modalDetalleSesionMultiple = document.getElementById('modalDetalleSesionMultiple');
const cerrarDetalleSesionMultiple = document.getElementById('cerrarDetalleSesionMultiple');
const detalleSesionMultipleContent = document.getElementById('detalleSesionMultipleContent');

// Referencias al modal de información de un hermano
const modalInfoHermano = document.getElementById('modalInfoHermano');
const formInfoHermano = document.getElementById('formInfoHermano');
const btnCerrarModalInfoHermano = document.querySelector('#modalInfoHermano button[onclick="cerrarModalInfoHermano()"]');

// Configuración del tema
function setTheme(dark) {
    if (dark) {
        document.documentElement.classList.add('dark');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeIconDashboard) themeIconDashboard.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeIconDashboard) themeIconDashboard.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Detectar preferencia inicial
(function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme(true);
    } else {
        setTheme(false);
    }
})();

// Event listeners para el tema
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(!isDark);
    });
}

if (themeToggleDashboard) {
    themeToggleDashboard.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(!isDark);
    });
}

// Funciones para el modal de autenticación
function showAuthModal() {
    authModal.classList.remove('hidden');
    showLoginForm();
}

function hideAuthModal() {
    authModal.classList.add('hidden');
    loginFormContainer.classList.remove('hidden');
    registerFormContainer.classList.add('hidden');
}

function showLoginForm() {
    loginFormContainer.classList.remove('hidden');
    registerFormContainer.classList.add('hidden');
}

function showRegisterForm() {
    registerFormContainer.classList.remove('hidden');
    loginFormContainer.classList.add('hidden');
}

// Función para sincronizar el estado del tema en el dashboard
function sincronizarTemaDashboard() {
    const isDark = document.documentElement.classList.contains('dark');
    if (themeIconDashboard) {
        themeIconDashboard.textContent = isDark ? '☀️' : '🌙';
    }
}

// Event listeners para botones de la landing page
loginBtn.addEventListener('click', showAuthModal);
registerBtn.addEventListener('click', () => {
    showAuthModal();
    showRegisterForm();
});
ctaRegisterBtn.addEventListener('click', () => {
    showAuthModal();
    showRegisterForm();
});
ctaRegisterBtn2.addEventListener('click', () => {
    showAuthModal();
    showRegisterForm();
});
closeAuthModal.addEventListener('click', hideAuthModal);
showRegisterFormBtn.addEventListener('click', showRegisterForm);
showLoginFormBtn.addEventListener('click', showLoginForm);

// Botones de demo y contacto (placeholder)
demoBtn.addEventListener('click', () => {
    alert('Demo en desarrollo. ¡Regístrate para probar la plataforma!');
});
demoBtn2.addEventListener('click', () => {
    alert('Demo en desarrollo. ¡Regístrate para probar la plataforma!');
});
contactBtn.addEventListener('click', () => {
    alert('Contacto: cristiansan@gmail.com');
});

// Event listeners para el modal de información de un hermano
if (formInfoHermano) {
    formInfoHermano.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('hermanoIndex').value, 10);
        const hermano = {
            nombre: document.getElementById('hermanoNombre').value,
            edad: document.getElementById('hermanoEdad').value,
            ocupacion: document.getElementById('hermanoOcupacion').value,
            observaciones: document.getElementById('hermanoObservaciones').value
        };

        if (index > -1) {
            // Editar
            hermanosData[index] = hermano;
        } else {
            // Agregar
            hermanosData.push(hermano);
        }

        renderizarHermanos();
        cerrarModalInfoHermano();
    });
}

if (btnCerrarModalInfoHermano) {
    btnCerrarModalInfoHermano.addEventListener('click', cerrarModalInfoHermano);
}

// Mostrar mensajes
function showMessage(msg, type = 'error') {
    if (type === 'success') {
        // Crear un toast de éxito temporal
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300';
        toast.textContent = msg;
        document.body.appendChild(toast);
        
        // Remover el toast después de 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    } else {
        alert(msg);
    }
}

let calendarInstance = null;
let calendarMultipleInstance = null; // Nueva instancia para agenda múltiple

// Función para abrir el modal y prellenar datos
function abrirModalNuevaSesion(info) {
    console.log('ABRIR MODAL');
    if (!modalNuevaSesion) return;
    // Prellenar fecha/hora en formato datetime-local
    const date = info.date || (info.dateStr ? new Date(info.dateStr) : new Date());
    const pad = n => n.toString().padStart(2, '0');
    const local = date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
    inputFechaSesion.value = local;
    inputPresentismoSesion.value = '';
    inputNotasSesion.value = '';
    cargarPacientesParaSelect();
    // Mostrar select de profesional solo si es admin
    if (isAdmin && profesionalSelectContainer && selectProfesional) {
        profesionalSelectContainer.style.display = '';
        // Llenar select de profesionales
        selectProfesional.innerHTML = '<option value="">Selecciona un profesional</option>';
        (adminPanelState.profesionales || []).forEach(prof => {
            selectProfesional.innerHTML += `<option value="${prof.uid}">${prof.displayName || prof.email}</option>`;
        });
    } else if (profesionalSelectContainer) {
        profesionalSelectContainer.style.display = 'none';
    }
    modalNuevaSesion.classList.remove('hidden');
    modalNuevaSesion.dataset.start = local;
    sesionEditando = null;
    if (btnEliminarSesion) btnEliminarSesion.classList.add('hidden');
}

// Cargar pacientes del profesional en el select
async function cargarPacientesParaSelect() {
    selectPaciente.innerHTML = '<option value="">Selecciona un paciente</option>';
    const user = window.firebaseAuth.currentUser;
    if (!user) return;
    const snapshot = await window.firebaseDB.collection('pacientes').where('owner', '==', user.uid).get();
    snapshot.forEach(doc => {
        const p = doc.data();
        selectPaciente.innerHTML += `<option value="${doc.id}">${p.nombre || p.email}</option>`;
    });
}

async function showDashboard(user) {
    welcomeUser.textContent = `Bienvenido${user.displayName ? ', ' + user.displayName : ''}`;
    userEmail.textContent = user.email;
    welcomeBlock.classList.remove('hidden');
    document.getElementById('calendarToggleBlock').classList.remove('hidden');
    document.getElementById('landingPage').classList.add('hidden');
    hideAuthModal();
    // Detectar admin
    const userDoc = await window.firebaseDB.collection('usuarios').doc(user.uid).get();
    isAdmin = userDoc.exists && userDoc.data().isAdmin === true;
    window.isAdmin = isAdmin;
    // Mostrar foto de perfil si existe
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
      const photoURL = userDoc.exists && userDoc.data().photoURL;
      if (photoURL) {
        profileAvatar.src = photoURL;
      } else {
        // Avatar por defecto
        profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=8b5cf6&color=fff&size=96`;
      }
    }
    const dashboardSection = document.getElementById('dashboardPacientesSection');
    if (isAdmin) {
        // Ocultar la grilla de pacientes propia para evitar duplicación, pero mostrar el botón '+ Agregar Paciente'
        if (dashboardSection) {
            dashboardSection.classList.add('hidden');
        }
        // Seleccionar por defecto el propio usuario en el panel admin
        adminPanelState.selectedUser = user.uid;
        await showAdminPanel();
        // Cargar pacientes propios (como profesional, para poder agregarlos)
        loadPatients(user.uid);
    } else {
        if (adminPanel) {
            adminPanel.remove();
            adminPanel = null;
        }
        if (dashboardSection) {
            dashboardSection.classList.remove('hidden');
        }
        // Restaurar la lista de pacientes si se vuelve a modo profesional
        const patientsList = document.getElementById('patientsList');
        const noPatientsMsg = document.getElementById('noPatientsMsg');
        if (patientsList) patientsList.style.display = '';
        if (noPatientsMsg) noPatientsMsg.style.display = '';
    }
    if (!isAdmin) loadPatients(user.uid);
    
    // Configurar estado inicial: mostrar Pacientes por defecto
    const calendarTabs = document.getElementById('calendarTabs');
    if (calendarTabs) calendarTabs.classList.add('hidden');
    
    // Asegurar que la sección de pacientes esté visible por defecto
    const dashboardPacientesSection = document.getElementById('dashboardPacientesSection');
    if (dashboardPacientesSection && !isAdmin) {
        dashboardPacientesSection.classList.remove('hidden');
    }
    
    // Para administradores, asegurar que el panel de administración esté visible por defecto
    if (isAdmin && adminPanel) {
        adminPanel.classList.remove('hidden');
        adminPanel.style.display = 'block';
    }
    
    // Asegurar que el botón "Pacientes" esté activo por defecto
    const tabPacientes = document.getElementById('tabPacientes');
    const tabAgendaIndividual = document.getElementById('tabAgendaIndividual');
    const tabAgendaMultiple = document.getElementById('tabAgendaMultiple');
    
    if (tabPacientes && tabAgendaIndividual && tabAgendaMultiple) {
        // Activar botón Pacientes
        tabPacientes.classList.add('bg-primary-700', 'text-white');
        tabPacientes.classList.remove('bg-gray-200', 'text-gray-800');
        
        // Desactivar botones de agenda
        tabAgendaIndividual.classList.remove('bg-primary-700', 'text-white');
        tabAgendaIndividual.classList.add('bg-gray-200', 'text-gray-800');
        tabAgendaMultiple.classList.remove('bg-primary-700', 'text-white');
        tabAgendaMultiple.classList.add('bg-gray-200', 'text-gray-800');
    }
    
    // Inicializar funcionalidad de versión para administradores
    // Usar setTimeout para asegurar que el DOM esté completamente cargado
    setTimeout(async () => {
        await inicializarVersion(user);
    }, 100);
    // Mostrar el botón Backup solo para admin
    const btnBackup = document.getElementById('btnBackupPacientes');
    if (btnBackup) {
        if (isAdmin) {
            btnBackup.classList.remove('hidden');
        } else {
            btnBackup.classList.add('hidden');
        }
    }
    
    // Mostrar el botón Estadísticas solo para admin y configurar event listener
    const btnEstadisticas = document.getElementById('btnEstadisticas');
    if (btnEstadisticas) {
        if (isAdmin) {
            btnEstadisticas.classList.remove('hidden');
        } else {
            btnEstadisticas.classList.add('hidden');
        }
        
        // Configurar event listener para redirigir a estadísticas
        btnEstadisticas.addEventListener('click', () => {
            window.location.href = 'estadisticas.html';
        });
    }
    
    // Sincronizar el estado del tema en el dashboard
    sincronizarTemaDashboard();
    
    // Inicializar funcionalidad de foto de perfil
    setTimeout(() => {
        inicializarFotoPerfil();
    }, 200);
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;
    try {
        const cred = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        showMessage('Error al iniciar sesión: ' + error.message);
    }
});

// Registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.registerName.value;
    const email = e.target.registerEmail.value;
    const password = e.target.registerPassword.value;
    try {
        const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        await saveUserToFirestore(userCredential.user, name);
    } catch (error) {
        showMessage('Error al registrarse: ' + error.message);
    }
});

// Mantener sesión iniciada
window.firebaseAuth.onAuthStateChanged(user => {
    if (user) {
        showDashboard(user);
    } else {
        // Ocultar todos los elementos del dashboard
        welcomeBlock.classList.add('hidden');
        document.getElementById('calendarToggleBlock').classList.add('hidden');
        document.getElementById('dashboardPacientesSection').classList.add('hidden');
        
        // Ocultar todos los modales
        const modals = [
            'addPatientModal', 'editPatientModal', 'fichaPacienteModal',
            'customConfirmModal', 'modalNuevaSesion', 'modalDetalleSesionMultiple',
            'modalNomencladorCIE10', 'authModal'
        ];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('hidden');
        });
        
        // Remover panel de administración si existe
        if (adminPanel) {
            adminPanel.remove();
            adminPanel = null;
        }
        
        // Resetear estado de admin
        isAdmin = false;
        adminPanelState = { selectedUser: null, profesionales: [], pacientes: [], sesiones: {} };
        
        // Ocultar botón de versión
        actualizarVisibilidadVersion(false);
        
        // Mostrar landing page
        document.getElementById('landingPage').classList.remove('hidden');
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    await window.firebaseAuth.signOut();
    // Ocultar todos los elementos del dashboard
    welcomeBlock.classList.add('hidden');
    document.getElementById('calendarToggleBlock').classList.add('hidden');
    document.getElementById('dashboardPacientesSection').classList.add('hidden');
    
    // Ocultar todos los modales
    const modals = [
        'addPatientModal', 'editPatientModal', 'fichaPacienteModal',
        'customConfirmModal', 'modalNuevaSesion', 'modalDetalleSesionMultiple',
        'modalNomencladorCIE10', 'authModal'
    ];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    });
    
    // Remover panel de administración si existe
    if (adminPanel) {
        adminPanel.remove();
        adminPanel = null;
    }
    
    // Resetear estado de admin
    isAdmin = false;
    adminPanelState = { selectedUser: null, profesionales: [], pacientes: [], sesiones: {} };
    
    // Ocultar botón de versión
    actualizarVisibilidadVersion(false);
    
    // Limpiar Quill
    if (quillSesionComentario) quillSesionComentario.setContents([]);
    
    // Mostrar landing page
    document.getElementById('landingPage').classList.remove('hidden');
    location.hash = '';
});

// Mostrar/Ocultar modal de paciente
window.hideAddPatientModal = function() {
    addPatientModal.classList.add('hidden');
    addPatientForm.reset();
    
    // Limpiar datos del nomenclador
    datosNomencladorSeleccionados.agregar = null;
    const spanAgregar = document.getElementById('nomencladorSeleccionadoAgregar');
    if (spanAgregar) {
        spanAgregar.textContent = '';
        spanAgregar.classList.add('hidden');
        spanAgregar.title = '';
    }
};

showAddPatientBtn.addEventListener('click', () => {
    addPatientModal.classList.remove('hidden');
    addPatientForm.reset();
    limpiarDatosFamilia('agregar');
    // Configurar botones de hermanos después de mostrar el modal
    setTimeout(() => configurarBotonesHermanos(), 100);
});

// Cargar pacientes desde Firestore
async function loadPatients(uid) {
    pacientesLoader.classList.remove('hidden');
    patientsList.innerHTML = '';
    noPatientsMsg.classList.add('hidden');
    const snapshot = await window.firebaseDB.collection('pacientes').where('owner', '==', uid).get();
    pacientesLoader.classList.add('hidden');
    if (snapshot.empty) {
        noPatientsMsg.classList.remove('hidden');
        return;
    }
    
    // Convertir los documentos en un array y ordenar alfabéticamente por nombre
    const pacientes = [];
    snapshot.forEach(doc => {
        const p = doc.data();
        pacientes.push({
            id: doc.id,
            data: p
        });
    });
    
    // Ordenar alfabéticamente por nombre (case-insensitive)
    pacientes.sort((a, b) => {
        const nombreA = (a.data.nombre || '').toLowerCase();
        const nombreB = (b.data.nombre || '').toLowerCase();
        return nombreA.localeCompare(nombreB);
    });
    
    // Renderizar los pacientes ordenados
    pacientes.forEach(({ id, data: p }) => {
        const div = document.createElement('div');
        div.className = 'border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-darkborder transition';
        div.setAttribute('data-paciente-id', id);
        div.innerHTML = `
            <div>
                <div class="font-bold text-[#2d3748] dark:text-gray-100">${p.nombre || ''}</div>
            </div>
        `;
        patientsList.appendChild(div);
    });
}

// Agregar paciente
addPatientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = window.firebaseAuth.currentUser;
    if (!user) return;
    
    // Obtener todos los valores del formulario
    const nombre = addPatientForm.patientName.value;
    const dni = addPatientForm.patientDni.value;
    const fechaNacimiento = addPatientForm.patientFechaNacimiento.value;
    const sexo = addPatientForm.patientSexo.value;
    const lugarNacimiento = addPatientForm.patientLugarNacimiento.value;
    const email = addPatientForm.patientEmail.value;
    const telefono = addPatientForm.patientTelefono.value;
    const contacto = addPatientForm.patientContacto.value;
    const educacion = addPatientForm.patientEducacion.value;
    const instituto = addPatientForm.patientInstituto.value;
    const motivo = addPatientForm.patientMotivo.value;

    // Obtener datos de familia
    const infoPadre = {
        nombre: addPatientForm.patientPadreNombre.value,
        edad: addPatientForm.patientPadreEdad.value,
        ocupacion: addPatientForm.patientPadreOcupacion.value,
        estadoCivil: addPatientForm.patientPadreEstadoCivil.value,
        salud: addPatientForm.patientPadreSalud.value
    };

    const infoMadre = {
        nombre: addPatientForm.patientMadreNombre.value,
        edad: addPatientForm.patientMadreEdad.value,
        ocupacion: addPatientForm.patientMadreOcupacion.value,
        estadoCivil: addPatientForm.patientMadreEstadoCivil.value,
        salud: addPatientForm.patientMadreSalud.value
    };

    // Obtener datos de hermanos
    const hermanos = obtenerDatosHermanos('agregar');

    // Obtener datos del nomenclador CIE-10 si fueron seleccionados
    const datosCIE10 = obtenerDatosCIE10('agregar');

    // Si eres admin y tienes seleccionado un profesional, asigna el paciente a ese profesional
    let ownerUid = user.uid;
    if (isAdmin && adminPanelState.selectedUser) {
        ownerUid = adminPanelState.selectedUser;
    }

    try {
        const pacienteData = {
            owner: ownerUid,
            // Información personal
            nombre,
            dni,
            fechaNacimiento,
            sexo,
            lugarNacimiento,
            // Información de contacto
            email,
            telefono,
            contacto,
            // Información educativa
            educacion,
            instituto,
            // Motivo de consulta
            motivo,
            // Información de familia
            infoPadre,
            infoMadre,
            infoHermanos: hermanos,
            // Metadatos
            creado: new Date(),
            actualizado: new Date()
        };

        // Agregar datos del nomenclador CIE-10 si están disponibles
        if (datosCIE10) {
            pacienteData.nomencladorCIE10 = datosCIE10;
        }

        await window.firebaseDB.collection('pacientes').add(pacienteData);
        hideAddPatientModal();
        // Limpiar datos del nomenclador después de guardar
        datosNomencladorSeleccionados.agregar = null;
        const spanAgregar = document.getElementById('nomencladorSeleccionadoAgregar');
        if (spanAgregar) {
            spanAgregar.textContent = '';
            spanAgregar.classList.add('hidden');
        }
        loadPatients(ownerUid); // Recarga la lista del profesional correcto
        showMessage('Paciente agregado exitosamente', 'success');
    } catch (error) {
        showMessage('Error al agregar paciente: ' + error.message);
    }
});

// Mostrar/Ocultar modal ficha clínica
window.hideFichaPacienteModal = function() {
    fichaPacienteModal.classList.add('hidden');
    fichaPacienteDatos.innerHTML = '';
    sesionesList.innerHTML = '';
    noSesionesMsg.classList.add('hidden');
    addSesionForm.reset();
    
    // Limpiar archivos seleccionados
    if (typeof limpiarArchivos === 'function') {
        limpiarArchivos();
    }
    
    // Limpiar Quill
    if (quillSesionComentario) quillSesionComentario.setContents([]);
    
    fichaPacienteId = null;
    fichaPacienteRef = null;
};

// Mostrar ficha clínica al hacer clic en paciente
patientsList.addEventListener('click', async (e) => {
    const div = e.target.closest('[data-paciente-id]');
    if (!div) return;
    fichaPacienteId = div.getAttribute('data-paciente-id');
    fichaPacienteRef = window.firebaseDB.collection('pacientes').doc(fichaPacienteId);
    fichaLoader.classList.remove('hidden');
    fichaPacienteDatos.innerHTML = '';
    sesionesList.innerHTML = '';
    fichaPacienteModal.classList.remove('hidden');
    
    // Limpiar archivos seleccionados al abrir modal
    if (typeof limpiarArchivos === 'function') {
        limpiarArchivos();
    }
    
    // Cargar datos paciente
    const doc = await fichaPacienteRef.get();
    if (!doc.exists) {
        fichaLoader.classList.add('hidden');
        return;
    }
    const p = doc.data();
    
    // Calcular edad si hay fecha de nacimiento
    let edadTexto = '';
    if (p.fechaNacimiento) {
        const hoy = new Date();
        const fechaNac = new Date(p.fechaNacimiento);
        const edad = Math.floor((hoy - fechaNac) / (365.25 * 24 * 60 * 60 * 1000));
        edadTexto = ` (${edad} años)`;
    }
    
    fichaPacienteDatos.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
                <div class="font-bold text-[#2d3748] dark:text-gray-100 text-lg mb-2">${p.nombre || ''}${edadTexto}</div>
                
                <!-- Información Personal -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    ${p.dni ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">DNI:</span> ${p.dni}</div>` : ''}
                    ${p.fechaNacimiento ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Fecha Nac.:</span> ${new Date(p.fechaNacimiento).toLocaleDateString('es-AR')}</div>` : ''}
                    ${p.sexo ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Sexo:</span> ${p.sexo.charAt(0).toUpperCase() + p.sexo.slice(1)}</div>` : ''}
                    ${p.lugarNacimiento ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Lugar Nac.:</span> ${p.lugarNacimiento}</div>` : ''}
                </div>
                
                <!-- Información de Contacto -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    ${p.email ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Email:</span> ${p.email}</div>` : ''}
                    ${p.telefono ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Teléfono:</span> ${p.telefono}</div>` : ''}
                    ${p.contacto ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm md:col-span-2"><span class="font-semibold">Contacto Emerg.:</span> ${p.contacto}</div>` : ''}
                </div>
                
                <!-- Información Educativa -->
                ${p.educacion || p.instituto ? `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    ${p.educacion ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Educación:</span> ${p.educacion.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>` : ''}
                    ${p.instituto ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Instituto:</span> ${p.instituto}</div>` : ''}
                </div>
                ` : ''}
                
                <!-- Información Familiar -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 border-t pt-3">
                    <button onclick="abrirModalInfoPadre('${fichaPacienteId}')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                        👨 Info. Padre ${p.infoPadre && p.infoPadre.nombre ? '✓' : ''}
                    </button>
                    <button onclick="abrirModalInfoMadre('${fichaPacienteId}')" class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                        👩 Info. Madre ${p.infoMadre && p.infoMadre.nombre ? '✓' : ''}
                    </button>
                    <button onclick="abrirModalInfoHermanos('${fichaPacienteId}')" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                        👫 Info. Hermanos ${p.infoHermanos && p.infoHermanos.length > 0 ? '✓' : ''}
                    </button>
                </div>
                
                <!-- Motivo de Consulta -->
                ${p.motivo ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><span class="font-semibold">Motivo:</span> ${p.motivo}</div>` : ''}
                
                <!-- Clasificación CIE-10 -->
                ${p.nomencladorCIE10 ? `
                <div class="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">
                    <div class="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">📋 Clasificación CIE-10</div>
                    <div class="text-xs text-green-600 dark:text-green-400">
                        <div><strong>Código:</strong> ${p.nomencladorCIE10.codigo}</div>
                        <div><strong>Categoría:</strong> ${p.nomencladorCIE10.categoriaNombre}</div>
                        <div class="mt-1 text-green-500 dark:text-green-300">${p.nomencladorCIE10.descripcion}</div>
                    </div>
                </div>
                ` : ''}
            </div>
            <button onclick="showEditPatientModal('${fichaPacienteId}', ${JSON.stringify(p).replace(/"/g, '&quot;')})" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1">
                ✏️ Editar
            </button>
        </div>
    `;
    await loadSesiones();
    fichaLoader.classList.add('hidden');
});

// Cargar sesiones de paciente
async function loadSesiones() {
    sesionesList.innerHTML = '';
    noSesionesMsg.classList.add('hidden');
    if (!fichaPacienteRef) return;
    
    console.log(`📋 Cargando sesiones del paciente...`);
    const snapshot = await fichaPacienteRef.collection('sesiones').orderBy('fecha', 'desc').get();
    if (snapshot.empty) {
        noSesionesMsg.classList.remove('hidden');
        console.log(`ℹ️ No hay sesiones registradas para este paciente`);
        return;
    }
    
    console.log(`📄 Encontradas ${snapshot.size} sesión(es)`);
    
    // Convertir sesiones a array para poder identificar la primera
    const sesionesArray = [];
    snapshot.forEach(doc => {
        const s = doc.data();
        sesionesArray.push({
            id: doc.id,
            data: s,
            fecha: new Date(s.fecha).getTime()
        });
    });
    
    // Filtrar solo sesiones que tienen comentarios (no solo notas)
    const sesionesConComentarios = sesionesArray.filter(sesion => {
        return tieneComentariosValidos(sesion.data.comentario);
    });
    
    // Ordenar por fecha ascendente para identificar la primera sesión con comentarios
    sesionesConComentarios.sort((a, b) => a.fecha - b.fecha);
    
    // Reordenar por fecha descendente para mostrar (más reciente primero)
    const sesionesParaMostrar = [...sesionesArray].sort((a, b) => b.fecha - a.fecha);
    
    // Identificar la primera sesión con comentarios (la más antigua que tenga comentarios)
    const primeraSesionConComentariosId = sesionesConComentarios.length > 0 ? sesionesConComentarios[0].id : null;
    
    sesionesParaMostrar.forEach(sesionInfo => {
        const s = sesionInfo.data;
        const esPrimera = sesionInfo.id === primeraSesionConComentariosId;
        
        const div = document.createElement('div');
        
        // Aplicar estilo diferente si es la primera sesión
        if (esPrimera) {
            div.className = 'border-2 border-green-400 rounded p-3 bg-green-50 dark:bg-green-900/20 shadow-lg';
        } else {
            div.className = 'border rounded p-3 bg-gray-50 dark:bg-darkbg';
        }
        
        // Construir HTML básico con indicador de primera sesión
        let htmlContent = '';
        
        if (esPrimera) {
            htmlContent += `
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-lg">🌟</span>
                    <span class="text-sm font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800 px-2 py-1 rounded-full">
                        Primera Sesión
                    </span>
                </div>
            `;
        }
        
        htmlContent += `
            <div class="text-sm font-bold text-[#2d3748] dark:text-gray-100"><span class="font-semibold">Fecha:</span> ${s.fecha || ''}</div>
            ${s.presentismo ? `<div class="text-xs mt-1"><span class="font-semibold">Presentismo:</span> ${obtenerTextoPresentismo(s.presentismo)}</div>` : ''}
            <div class="text-gray-900 dark:text-gray-200">${s.comentario || ''}</div>
            ${s.notas ? `<div class="text-xs mt-2 text-[#4b5563] dark:text-gray-400"><span class="font-semibold">Notas:</span> ${s.notas}</div>` : ''}
        `;
        
        // Agregar información del nomenclador CIE-10 si existe
        if (s.nomencladorCIE10) {
            const cie10 = s.nomencladorCIE10;
            htmlContent += `
                <div class="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
                    <div class="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">📋 Clasificación CIE-10</div>
                    <div class="text-xs text-blue-600 dark:text-blue-400">
                        <div><strong>Código:</strong> ${cie10.codigo}</div>
                        <div><strong>Categoría:</strong> ${cie10.categoriaNombre}</div>
                        <div class="mt-1 text-blue-500 dark:text-blue-300">${cie10.descripcion}</div>
                    </div>
                </div>
            `;
            console.log(`📋 Sesión del ${s.fecha} tiene clasificación CIE-10: ${cie10.codigo} - ${cie10.descripcion}${esPrimera ? ' (PRIMERA SESIÓN)' : ''}`);
        }
        
        // Agregar archivos adjuntos
        if (s.archivosUrls && s.archivosUrls.length) {
            htmlContent += `<div class="mt-2 flex flex-col gap-1">${s.archivosUrls.map(url => `<a href="${url}" target="_blank" class="text-primary-700 underline dark:text-primary-600">Ver archivo adjunto</a>`).join('')}</div>`;
        }
        
        div.innerHTML = htmlContent;
        sesionesList.appendChild(div);
        
        if (s.archivosUrls && s.archivosUrls.length > 0) {
            console.log(`📎 Sesión del ${s.fecha} tiene ${s.archivosUrls.length} archivo(s) adjunto(s)${esPrimera ? ' (PRIMERA SESIÓN)' : ''}`);
        }
        
        // Log para identificar primera sesión
        if (esPrimera) {
            console.log(`🌟 PRIMERA SESIÓN identificada: ${s.fecha} - ${s.comentario}`);
        }
    });
}

// Modal de confirmación personalizado
function customConfirm(message) {
    return new Promise((resolve) => {
        customConfirmMessage.textContent = message;
        customConfirmModal.classList.remove('hidden');
        function cleanup(result) {
            customConfirmModal.classList.add('hidden');
            customConfirmOk.removeEventListener('click', okHandler);
            customConfirmCancel.removeEventListener('click', cancelHandler);
            resolve(result);
        }
        function okHandler() { cleanup(true); }
        function cancelHandler() { cleanup(false); }
        customConfirmOk.addEventListener('click', okHandler);
        customConfirmCancel.addEventListener('click', cancelHandler);
    });
}

// Modificar submit de sesión para usar el modal
addSesionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!fichaPacienteRef) return;
    const ok = await customConfirm('¿Está seguro de guardar esta sesión? No podrá editarla después.');
    if (!ok) return;
    const fecha = addSesionForm.sesionFecha.value;
    const presentismo = addSesionForm.sesionPresentismo.value;
    // const comentario = addSesionForm.sesionComentario.value; // Eliminar esto
    const comentario = quillSesionComentario ? quillSesionComentario.root.innerHTML : '';
    const notas = addSesionForm.sesionNotas.value;
    // Obtener archivos desde la nueva funcionalidad de cámara
    let archivosUrls = [];
    const archivosParaSubir = typeof obtenerArchivosSeleccionados === 'function' ? obtenerArchivosSeleccionados() : [];
    
    if (archivosParaSubir.length > 0) {
        if (archivosParaSubir.length > 5) {
            showMessage('Solo puedes adjuntar hasta 5 archivos por sesión.');
            return;
        }
        console.log(`🔄 Iniciando subida de ${archivosParaSubir.length} archivo(s)...`);
        
        // Verificar tamaño de archivos
        for (let i = 0; i < archivosParaSubir.length; i++) {
            const archivo = archivosParaSubir[i];
            if (archivo.size > 5 * 1024 * 1024) { // 5MB
                showMessage('El archivo "' + archivo.name + '" supera el tamaño máximo de 5MB.');
                return;
            }
        }
        
        const storageRef = window.firebaseStorage.ref();
        const sesionId = window.firebaseDB.collection('tmp').doc().id; // id único
        
        for (let i = 0; i < archivosParaSubir.length; i++) {
            const archivo = archivosParaSubir[i];
            try {
                console.log(`📤 Subiendo archivo ${i + 1}/${archivosParaSubir.length}: ${archivo.name} (${(archivo.size / 1024 / 1024).toFixed(2)} MB)`);
                const fileRef = storageRef.child(`sesiones_adjuntos/${fichaPacienteId}/${sesionId}_${i}_${archivo.name}`);
                await fileRef.put(archivo);
                const url = await fileRef.getDownloadURL();
                archivosUrls.push(url);
                console.log(`✅ Archivo subido exitosamente: ${archivo.name}`);
            } catch (storageError) {
                console.error('❌ Error al subir archivo:', storageError);
                
                // Detectar errores específicos de CORS
                if (storageError.code === 'storage/unauthorized' || 
                    storageError.message.includes('CORS') || 
                    storageError.message.includes('preflight')) {
                    showMessage(`Error de CORS: No se puede subir archivos desde localhost. 
                    
Para solucionarlo:
1. Instala Google Cloud CLI
2. Ejecuta: gcloud auth login
3. Ejecuta: gcloud config set project monitor-entrenamiento-1fc15
4. Ejecuta: gsutil cors set cors.json gs://monitor-entrenamiento-1fc15.firebasestorage.app

O usa un servidor local diferente como Live Server en VS Code.`);
                } else {
                    showMessage(`Error al subir el archivo "${archivo.name}": ${storageError.message}`);
                }
                return;
            }
        }
        console.log(`🎉 Todos los archivos subidos exitosamente! URLs:`, archivosUrls);
    }
    try {
        console.log(`💾 Guardando sesión en Firestore...`);
        
        // Obtener datos del nomenclador CIE-10
        const datosCIE10 = obtenerDatosCIE10('ficha');
        console.log('📋 Datos CIE-10 para guardar:', datosCIE10);
        
        const datosSession = {
            fecha,
            comentario,
            notas,
            presentismo,
            archivosUrls,
            creado: new Date()
        };
        
        // Agregar datos CIE-10 si están disponibles
        if (datosCIE10) {
            datosSession.nomencladorCIE10 = datosCIE10;
            console.log('✅ Datos CIE-10 incluidos en la sesión');
        }
        
        await fichaPacienteRef.collection('sesiones').add(datosSession);
        console.log(`✅ Sesión guardada exitosamente con ${archivosUrls.length} archivo(s) adjunto(s)`);
        
        addSesionForm.reset();
        limpiarCamposCIE10(); // Limpiar campos del nomenclador
        
        // Limpiar archivos seleccionados
        if (typeof limpiarArchivos === 'function') {
            limpiarArchivos();
        }
        
        loadSesiones();
        disableFileInput();
    } catch (error) {
        console.error('❌ Error al guardar sesión:', error);
        showMessage('Error al agregar sesión: ' + error.message);
    }
});

// Funciones para habilitar/deshabilitar input de archivos
function disableFileInput() {
    const archivoInput = document.getElementById('sesionArchivo');
    if (archivoInput) archivoInput.disabled = true;
}

function enableFileInput() {
    const archivoInput = document.getElementById('sesionArchivo');
    if (archivoInput) archivoInput.disabled = false;
}

// Al abrir el modal de agregar sesión, habilitar input de archivos
if (addSesionForm) {
    addSesionForm.addEventListener('reset', function() {
        enableFileInput();
        // Limpiar archivos seleccionados al resetear formulario
        if (typeof limpiarArchivos === 'function') {
            limpiarArchivos();
        }
    });
}

// Al registrar usuario, guardar en Firestore
async function saveUserToFirestore(user, name) {
    await window.firebaseDB.collection('usuarios').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: name || user.displayName || '',
        isAdmin: false // Cambia manualmente a true en Firestore para el admin
    }, { merge: true });
}

// Panel admin: muestra lista de profesionales y permite ver pacientes/sesiones de cada uno
async function showAdminPanel() {
    // Elimino cualquier panel admin existente antes de crear uno nuevo
    const oldPanel = document.getElementById('adminPanel');
    if (oldPanel) oldPanel.remove();
    adminPanel = document.createElement('div');
    adminPanel.id = 'adminPanel';
    adminPanel.className = 'w-full max-w-7xl mx-auto mb-8 bg-white dark:bg-darkcard rounded-lg shadow p-6 border dark:border-darkborder';
    // Elimino el botón de tema propio del panel admin, solo muestro el themeToggle global
    adminPanel.innerHTML = `
      <div class='flex justify-between items-center mb-6'>
        <h3 class="text-xl font-bold text-primary-700">Panel de Administración</h3>
      </div>
    `;
    // Layout responsive: grid-cols-1 en móvil, grid-cols-2 en md+
    let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div id="adminProList">
        <h4 class="font-semibold mb-2 text-gray-700 dark:text-gray-200">Profesionales registrados</h4>
        <ul class="space-y-2">`;
    if (!adminPanelState.profesionales.length) {
      const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
      adminPanelState.profesionales = usuariosSnap.docs.map(doc => doc.data());
    }
    adminPanelState.profesionales.forEach(u => {
      const avatarUrl = u.photoURL ? u.photoURL : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName || u.email || 'U')}&background=8b5cf6&color=fff&size=80`;
      html += `<li>
        <button class="w-full text-left flex items-center gap-2 px-3 py-2 rounded transition font-medium
          ${adminPanelState.selectedUser === u.uid ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'hover:bg-primary-50 dark:hover:bg-darkborder text-gray-700 dark:text-gray-200'}"
          data-uid="${u.uid}">
          <img src="${avatarUrl}" alt="avatar" class="w-10 h-10 rounded-full object-cover border border-primary-200 dark:border-primary-700 bg-gray-100 dark:bg-gray-800" />
          <span>${u.displayName || u.email}</span>
          ${u.isAdmin ? '<span class=\"text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2\">admin</span>' : ''}
        </button>
      </li>`;
    });
    html += `</ul></div>`;
    // Columna de pacientes/sesiones
    html += `<div id="adminPacientesCol">`;
    if (!adminPanelState.selectedUser) {
      html += `<div class="text-gray-500 mt-8 md:mt-0">Selecciona un profesional para ver sus pacientes.</div>`;
    } else {
      const u = adminPanelState.profesionales.find(u => u.uid === adminPanelState.selectedUser);
      // Mostrar título y botón '+ Agregar Paciente' SIEMPRE que el admin esté viendo cualquier profesional
      if (isAdmin && u) {
        html += `<div class='flex justify-between items-center mb-4'>
          <h3 class='text-xl font-semibold text-[#2d3748] dark:text-gray-100'>Pacientes</h3>
          <button id='showAddPatientBtnAdmin' class='bg-primary-700 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded border-2 border-primary-600 shadow-sm dark:bg-primary-600 dark:hover:bg-primary-700 dark:text-darkbg'>+ Agregar Paciente</button>
        </div>`;
      }
      html += `<div class="mb-4 font-bold text-lg flex items-center gap-2">
         <span class="text-white">${u.displayName || u.email}</span>
        ${u.isAdmin ? '<span class=\"text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2\">admin</span>' : ''}
      </div>`;
      // Loader de pacientes
      html += `<div id="adminPacientesLoader" class="flex flex-col justify-center items-center py-8">
        <svg class="animate-spin h-8 w-8 text-primary-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span class="text-primary-600 font-semibold">Cargando pacientes...</span>
      </div>`;
      // Renderizo el loader primero, luego lo reemplazo por la grilla de pacientes tras la consulta
      adminPanel.innerHTML += html + '</div></div>';
      const calendarToggleBlock = document.getElementById('calendarToggleBlock');
      if (calendarToggleBlock) {
        calendarToggleBlock.parentNode.insertBefore(adminPanel, calendarToggleBlock.nextSibling);
      } else {
        welcomeBlock.parentNode.insertBefore(adminPanel, welcomeBlock.nextSibling);
      }
      // Listeners para seleccionar profesional (no duplicar)
      adminPanel.querySelectorAll('button[data-uid]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          adminPanelState.selectedUser = btn.getAttribute('data-uid');
          await showAdminPanel();
        });
      });
      // Ahora cargo los pacientes y reemplazo el loader
      const adminPacCol = adminPanel.querySelector('#adminPacientesCol');
      let headerHtml = '';
      if (isAdmin && u) {
        headerHtml += `<div class='flex justify-between items-center mb-4'>
          <h3 class='text-xl font-semibold text-[#2d3748] dark:text-gray-100'>Pacientes</h3>
          <button id='showAddPatientBtnAdmin' class='bg-primary-700 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded border-2 border-primary-600 shadow-sm dark:bg-primary-600 dark:hover:bg-primary-700 dark:text-darkbg'>+ Agregar Paciente</button>
        </div>`;
      }
      headerHtml += `<div class="mb-4 font-bold text-lg flex items-center gap-2">👤 ${u.displayName || u.email} ${u.isAdmin ? '<span class=\"text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2\">admin</span>' : ''}</div>`;
      adminPacCol.innerHTML = `
        <div id="adminPacHeader">${headerHtml}</div>
        <div id="adminPacContent"></div>
      `;
      // Primero muestra el loader
      adminPacCol.querySelector('#adminPacContent').innerHTML = `<div id="adminPacientesLoader" class="flex flex-col justify-center items-center py-8">
        <svg class="animate-spin h-8 w-8 text-primary-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span class="text-primary-600 font-semibold">Cargando pacientes...</span>
      </div>`;
      // Luego, cuando termines de cargar los pacientes, reemplaza SOLO el contenido de #adminPacContent
      let pacientesHtml = '';
      const pacientesSnap = await window.firebaseDB.collection('pacientes').where('owner', '==', adminPanelState.selectedUser).get();
      if (pacientesSnap.empty) {
        pacientesHtml = '<div class="text-gray-500">No hay pacientes registrados para este profesional.</div>';
      } else {
        // Convertir los documentos en un array y ordenar alfabéticamente por nombre
        const pacientes = [];
        pacientesSnap.forEach(doc => {
          const p = doc.data();
          pacientes.push({
            id: doc.id,
            data: p
          });
        });
        
        // Ordenar alfabéticamente por nombre (case-insensitive)
        pacientes.sort((a, b) => {
          const nombreA = (a.data.nombre || '').toLowerCase();
          const nombreB = (b.data.nombre || '').toLowerCase();
          return nombreA.localeCompare(nombreB);
        });
        
        pacientesHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        for (const { id, data: p } of pacientes) {
          pacientesHtml += `<div class=\"border rounded p-3 bg-gray-50 dark:bg-darkbg cursor-pointer hover:bg-primary-50 dark:hover:bg-darkborder transition\" data-paciente-id=\"${id}\">\n` +
            `<div class=\"font-bold text-[#2d3748] dark:text-gray-100\">${p.nombre || '(sin nombre)'}</div>\n`;
          // Eliminado: email, teléfono, motivo, sesiones
          pacientesHtml += '</div>';
        }
        pacientesHtml += '</div>';
      }
      // Reemplaza solo el contenido dinámico
      adminPacCol.querySelector('#adminPacContent').innerHTML = pacientesHtml;
      // Listeners para abrir ficha clínica
      adminPacCol.querySelectorAll('[data-paciente-id]').forEach(div => {
        div.addEventListener('click', async (e) => {
          const pacienteId = div.getAttribute('data-paciente-id');
          fichaPacienteId = pacienteId;
          fichaPacienteRef = window.firebaseDB.collection('pacientes').doc(pacienteId);
          // Cargar datos paciente
          const doc = await fichaPacienteRef.get();
          if (!doc.exists) return;
          const p = doc.data();
                            // Calcular edad si hay fecha de nacimiento
                  let edadTexto = '';
                  if (p.fechaNacimiento) {
                      const hoy = new Date();
                      const fechaNac = new Date(p.fechaNacimiento);
                      const edad = Math.floor((hoy - fechaNac) / (365.25 * 24 * 60 * 60 * 1000));
                      edadTexto = ` (${edad} años)`;
                  }
                  
                  fichaPacienteDatos.innerHTML = `
              <div class="flex justify-between items-start mb-2">
                  <div class="flex-1">
                      <div class="font-bold text-[#2d3748] dark:text-gray-100 text-lg mb-2">${p.nombre || ''}${edadTexto}</div>
                      
                      <!-- Información Personal -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          ${p.dni ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">DNI:</span> ${p.dni}</div>` : ''}
                          ${p.fechaNacimiento ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Fecha Nac.:</span> ${new Date(p.fechaNacimiento).toLocaleDateString('es-AR')}</div>` : ''}
                          ${p.sexo ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Sexo:</span> ${p.sexo.charAt(0).toUpperCase() + p.sexo.slice(1)}</div>` : ''}
                          ${p.lugarNacimiento ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Lugar Nac.:</span> ${p.lugarNacimiento}</div>` : ''}
                      </div>
                      
                      <!-- Información de Contacto -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          ${p.email ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Email:</span> ${p.email}</div>` : ''}
                          ${p.telefono ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Teléfono:</span> ${p.telefono}</div>` : ''}
                          ${p.contacto ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm md:col-span-2"><span class="font-semibold">Contacto Emerg.:</span> ${p.contacto}</div>` : ''}
                      </div>
                      
                      <!-- Información Educativa -->
                      ${p.educacion || p.instituto ? `
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          ${p.educacion ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Educación:</span> ${p.educacion.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>` : ''}
                          ${p.instituto ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Instituto:</span> ${p.instituto}</div>` : ''}
                      </div>
                      ` : ''}
                      
                      <!-- Información Familiar -->
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 border-t pt-3">
                          <button onclick="abrirModalInfoPadre('${fichaPacienteId}')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                              👨 Info. Padre ${p.infoPadre && p.infoPadre.nombre ? '✓' : ''}
                          </button>
                          <button onclick="abrirModalInfoMadre('${fichaPacienteId}')" class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                              👩 Info. Madre ${p.infoMadre && p.infoMadre.nombre ? '✓' : ''}
                          </button>
                          <button onclick="abrirModalInfoHermanos('${fichaPacienteId}')" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                              👫 Info. Hermanos ${p.infoHermanos && p.infoHermanos.length > 0 ? '✓' : ''}
                          </button>
                      </div>
                      
                      <!-- Motivo de Consulta -->
                      ${p.motivo ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><span class="font-semibold">Motivo:</span> ${p.motivo}</div>` : ''}
                      
                      <!-- Clasificación CIE-10 -->
                      ${p.nomencladorCIE10 ? `
                      <div class="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">
                          <div class="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">📋 Clasificación CIE-10</div>
                          <div class="text-xs text-green-600 dark:text-green-400">
                              <div><strong>Código:</strong> ${p.nomencladorCIE10.codigo}</div>
                              <div><strong>Categoría:</strong> ${p.nomencladorCIE10.categoriaNombre}</div>
                              <div class="mt-1 text-green-500 dark:text-green-300">${p.nomencladorCIE10.descripcion}</div>
                          </div>
                      </div>
                      ` : ''}
                  </div>
                  <button onclick="showEditPatientModal('${fichaPacienteId}', ${JSON.stringify(p).replace(/"/g, '&quot;')})" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1">
                      ✏️ Editar
                  </button>
              </div>
          `;
          fichaPacienteModal.classList.remove('hidden');
          loadSesiones();
        });
      });
      // Después de insertar el HTML, si existe el botón showAddPatientBtnAdmin, agregarle el mismo listener que al botón original
      setTimeout(() => {
        const btnAdmin = document.getElementById('showAddPatientBtnAdmin');
        if (btnAdmin) {
          btnAdmin.addEventListener('click', () => {
            addPatientModal.classList.remove('hidden');
          });
        }
      }, 0);
      return;
    }
    html += `</div></div>`;
    adminPanel.innerHTML += html;
    const calendarToggleBlock = document.getElementById('calendarToggleBlock');
    if (calendarToggleBlock) {
        calendarToggleBlock.parentNode.insertBefore(adminPanel, calendarToggleBlock.nextSibling);
    } else {
        welcomeBlock.parentNode.insertBefore(adminPanel, welcomeBlock.nextSibling);
    }
    // Listeners para seleccionar profesional
    adminPanel.querySelectorAll('button[data-uid]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        adminPanelState.selectedUser = btn.getAttribute('data-uid');
        await showAdminPanel();
      });
    });
}

// === BOTONES DE CAMBIO DE VISTA (DÍA/SEMANA/MES) ===
function actualizarLabelCalendario() {
    const label = document.getElementById('calendarCurrentLabel');
    let calendar = calendarInstance || calendarMultipleInstance;
    if (!label || !calendar) return;
    const view = calendar.view;
    if (view.type === 'timeGridDay') {
        label.textContent = view.currentStart.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' });
    } else if (view.type === 'timeGridWeek') {
        const start = view.currentStart;
        const end = new Date(view.currentEnd.getTime() - 1);
        label.textContent = `${start.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`;
    } else if (view.type === 'dayGridMonth') {
        label.textContent = view.currentStart.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    }
}

function agregarListenersVistaCalendario() {
    console.log('=== AGREGANDO LISTENERS VISTA CALENDARIO ===');
    const btnDia = document.getElementById('btnVistaDia');
    const btnSemana = document.getElementById('btnVistaSemana');
    const btnMes = document.getElementById('btnVistaMes');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    console.log('Botones encontrados:', { btnDia, btnSemana, btnMes, btnPrev, btnNext });
    if (!btnDia || !btnSemana || !btnMes || !btnPrev || !btnNext) {
        console.error('FALTAN BOTONES! No se pueden agregar listeners');
        return;
    }

    // REMOVER LISTENERS EXISTENTES ANTES DE AGREGAR NUEVOS
    const newBtnDia = btnDia.cloneNode(true);
    const newBtnSemana = btnSemana.cloneNode(true);
    const newBtnMes = btnMes.cloneNode(true);
    const newBtnPrev = btnPrev.cloneNode(true);
    const newBtnNext = btnNext.cloneNode(true);
    
    btnDia.parentNode.replaceChild(newBtnDia, btnDia);
    btnSemana.parentNode.replaceChild(newBtnSemana, btnSemana);
    btnMes.parentNode.replaceChild(newBtnMes, btnMes);
    btnPrev.parentNode.replaceChild(newBtnPrev, btnPrev);
    btnNext.parentNode.replaceChild(newBtnNext, btnNext);

    // Variable para controlar debounce
    let navegacionEnProceso = false;

    newBtnDia.addEventListener('click', () => {
        let calendar = calendarInstance || calendarMultipleInstance;
        if (calendar) {
            const currentDate = calendar.getDate();
            // Intentar vista de recursos primero, luego vista normal
            try {
                if (calendarMultipleInstance && calendar === calendarMultipleInstance) {
                    calendar.changeView('resourceTimeGridDay');
                } else {
                    calendar.changeView('timeGridDay');
                }
            } catch (e) {
                console.log('Vista de recursos no disponible, usando vista normal');
                calendar.changeView('timeGridDay');
            }
            calendar.gotoDate(currentDate);
        }
        activarBotonVista('day');
        actualizarLabelCalendario();
    });
    newBtnSemana.addEventListener('click', () => {
        let calendar = calendarInstance || calendarMultipleInstance;
        if (calendar) {
            const currentDate = calendar.getDate();
            // Intentar vista de recursos primero, luego vista normal
            try {
                if (calendarMultipleInstance && calendar === calendarMultipleInstance) {
                    calendar.changeView('resourceTimeGridWeek');
                } else {
                    calendar.changeView('timeGridWeek');
                }
            } catch (e) {
                console.log('Vista de recursos no disponible, usando vista normal');
                calendar.changeView('timeGridWeek');
            }
            calendar.gotoDate(currentDate);
        }
        activarBotonVista('week');
        actualizarLabelCalendario();
    });
    
    newBtnMes.addEventListener('click', () => {
        let calendar = calendarInstance || calendarMultipleInstance;
        if (calendar) {
            const currentDate = calendar.getDate();
            calendar.changeView('dayGridMonth');
            calendar.gotoDate(currentDate);
        }
        activarBotonVista('month');
        actualizarLabelCalendario();
    });
    newBtnPrev.addEventListener('click', () => {
        if (navegacionEnProceso) {
            console.log('PREV - Navegación en proceso, ignorando clic');
            return;
        }
        navegacionEnProceso = true;
        
        let calendar = calendarInstance || calendarMultipleInstance;
        if (calendar) {
            const view = calendar.view;
            console.log('PREV - Vista actual:', view.type);
            console.log('PREV - Fecha actual:', calendar.getDate());
            
            if (view.type === 'timeGridDay') {
                // Usar método más directo para día anterior
                const currentDate = new Date(calendar.getDate());
                currentDate.setUTCDate(currentDate.getUTCDate() - 1);
                console.log('PREV - Nueva fecha (día):', currentDate);
                calendar.gotoDate(currentDate);
            } else if (view.type === 'timeGridWeek') {
                // Usar método más directo para semana anterior
                const currentDate = new Date(calendar.getDate());
                currentDate.setUTCDate(currentDate.getUTCDate() - 7);
                console.log('PREV - Nueva fecha (semana):', currentDate);
                calendar.gotoDate(currentDate);
            } else if (view.type === 'dayGridMonth') {
                // Usar método más directo para mes anterior
                const currentDate = new Date(calendar.getDate());
                currentDate.setUTCMonth(currentDate.getUTCMonth() - 1);
                console.log('PREV - Nueva fecha (mes):', currentDate);
                calendar.gotoDate(currentDate);
            }
        }
        
        setTimeout(() => {
            actualizarLabelCalendario();
            navegacionEnProceso = false;
        }, 800);
    });
    newBtnNext.addEventListener('click', () => {
        if (navegacionEnProceso) {
            console.log('NEXT - Navegación en proceso, ignorando clic');
            return;
        }
        navegacionEnProceso = true;
        
        let calendar = calendarInstance || calendarMultipleInstance;
        if (calendar) {
            const view = calendar.view;
            console.log('NEXT - Vista actual:', view.type);
            console.log('NEXT - Fecha actual:', calendar.getDate());
            
            if (view.type === 'timeGridDay') {
                // Usar método más directo para día siguiente
                const currentDate = new Date(calendar.getDate());
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
                console.log('NEXT - Nueva fecha (día):', currentDate);
                calendar.gotoDate(currentDate);
            } else if (view.type === 'timeGridWeek') {
                // Usar método más directo para semana siguiente
                const currentDate = new Date(calendar.getDate());
                currentDate.setUTCDate(currentDate.getUTCDate() + 7);
                console.log('NEXT - Nueva fecha (semana):', currentDate);
                calendar.gotoDate(currentDate);
            } else if (view.type === 'dayGridMonth') {
                // Usar método más directo para mes siguiente
                const currentDate = new Date(calendar.getDate());
                currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
                console.log('NEXT - Nueva fecha (mes):', currentDate);
                calendar.gotoDate(currentDate);
            }
        }
        
        setTimeout(() => {
            actualizarLabelCalendario();
            navegacionEnProceso = false;
        }, 800);
    });
}

function activarBotonVista(tipo) {
    const btnDia = document.getElementById('btnVistaDia');
    const btnSemana = document.getElementById('btnVistaSemana');
    const btnMes = document.getElementById('btnVistaMes');
    if (!btnDia || !btnSemana || !btnMes) return;
    
    // Resetear todos los botones
    [btnDia, btnSemana, btnMes].forEach(btn => {
        btn.classList.remove('bg-primary-700', 'text-white');
        btn.classList.add('bg-gray-200');
    });
    
    // Activar el botón correspondiente
    if (tipo === 'day') {
        btnDia.classList.add('bg-primary-700', 'text-white');
        btnDia.classList.remove('bg-gray-200');
    } else if (tipo === 'week') {
        btnSemana.classList.add('bg-primary-700', 'text-white');
        btnSemana.classList.remove('bg-gray-200');
    } else if (tipo === 'month') {
        btnMes.classList.add('bg-primary-700', 'text-white');
        btnMes.classList.remove('bg-gray-200');
    }
    actualizarLabelCalendario();
}

// Variables para el filtro de profesionales
let profesionalesDisponibles = [];
let profesionalesSeleccionados = [];

// Función para asignar colores: Violeta para días ocupados
function getColorForProfessional(profesionalId) {
    // Todos los eventos (días ocupados) serán de color violeta
    return '#8b5cf6'; // violet
}

// Función para cargar select de profesionales
function cargarFiltrosProfesionales() {
    console.log('🎯 === INICIANDO cargarFiltrosProfesionales ===');
    console.log('📋 profesionalesDisponibles:', profesionalesDisponibles);
    
    const profesionalesSelect = document.getElementById('profesionalesSelect');
    console.log('🎯 profesionalesSelect encontrado:', !!profesionalesSelect);
    
    if (!profesionalesSelect) {
        console.error('❌ No se encontró profesionalesSelect');
        return;
    }
    
    // Verificar que el contenedor padre también sea visible
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    if (profesionalesFilter) {
        // Forzar visibilidad del filtro
        profesionalesFilter.classList.remove('hidden');
        profesionalesFilter.style.display = 'flex';
        profesionalesFilter.style.visibility = 'visible';
        profesionalesFilter.style.opacity = '1';
        
        console.log('📊 Estado del filtro padre después de forzar visibilidad:', {
            classList: profesionalesFilter.classList.toString(),
            display: getComputedStyle(profesionalesFilter).display,
            visibility: getComputedStyle(profesionalesFilter).visibility
        });
    }
    
    console.log('✅ Cargando opciones para', profesionalesDisponibles.length, 'profesionales');
    
    // Limpiar opciones existentes (excepto "Todos")
    profesionalesSelect.innerHTML = '<option value="todos">Todos los profesionales</option>';
    
    if (profesionalesDisponibles.length === 0) {
        console.warn('⚠️ No hay profesionales disponibles para mostrar');
        profesionalesSelect.innerHTML = '<option value="todos">No hay profesionales</option>';
        return;
    }
    
    // Agregar opción para cada profesional
    profesionalesDisponibles.forEach((profesional, index) => {
        const option = document.createElement('option');
        option.value = profesional.id;
        option.textContent = profesional.title;
        profesionalesSelect.appendChild(option);
        console.log(`✅ Opción ${index + 1}/${profesionalesDisponibles.length} creada para:`, profesional.title);
    });
    
    // Seleccionar "Todos" por defecto
    profesionalesSelect.value = 'todos';
    profesionalesSeleccionados = profesionalesDisponibles.map(p => p.id);
    
    // Agregar event listener para cambios (solo si no existe)
    if (!profesionalesSelect.hasAttribute('data-listener-added')) {
        profesionalesSelect.addEventListener('change', async (e) => {
            const selectedValue = e.target.value;
            console.log('🔄 === CAMBIO DE FILTRO DETECTADO ===');
            console.log('🔄 Profesional seleccionado:', selectedValue);
            
            // Actualizar la selección global
            if (selectedValue === 'todos') {
                profesionalesSeleccionados = profesionalesDisponibles.map(p => p.id);
                console.log('📋 Seleccionando todos los profesionales:', profesionalesSeleccionados.length);
            } else {
                profesionalesSeleccionados = [selectedValue];
                const profesional = profesionalesDisponibles.find(p => p.id === selectedValue);
                console.log('📋 Seleccionando solo:', profesional?.title, `(${selectedValue})`);
            }
            
            console.log('📊 profesionalesSeleccionados actualizado:', profesionalesSeleccionados);
            
            // DESTRUIR completamente el calendario actual
            if (calendarMultipleInstance) {
                console.log('🗑️ Destruyendo calendario existente...');
                calendarMultipleInstance.destroy();
                calendarMultipleInstance = null;
            }
            
            // Limpiar el contenedor del calendario
            const calendarEl = document.getElementById('calendar');
            if (calendarEl) {
                calendarEl.innerHTML = '';
                console.log('🧹 Contenedor del calendario limpiado');
            }
            
            // Esperar un momento antes de recrear
            setTimeout(async () => {
                console.log('🔄 === RECREANDO CALENDARIO CON FILTRO ===');
                
                // Cargar eventos filtrados usando la nueva función
                const eventosFiltrados = await cargarEventosFiltrados();
                console.log('📊 Eventos filtrados cargados:', eventosFiltrados.length);
                
                if (eventosFiltrados.length === 0) {
                    console.warn('⚠️ No se encontraron eventos para la selección actual');
                }
                
                // Determinar vista inicial basada en la selección
                const vistaInicial = profesionalesSeleccionados.length === 1 ? 'timeGridDay' : 'timeGridWeek';
                console.log(`📅 Vista inicial: ${vistaInicial}`);
                
                // Crear nuevo calendario con eventos filtrados
                calendarMultipleInstance = new window.FullCalendar.Calendar(calendarEl, {
                    initialView: vistaInicial,
                    views: {
                        timeGridWeek: { 
                            type: 'timeGridWeek', 
                            buttonText: 'Semana'
                        },
                        timeGridDay: { 
                            type: 'timeGridDay', 
                            buttonText: 'Día'
                        },
                        dayGridMonth: { 
                            type: 'dayGridMonth', 
                            buttonText: 'Mes'
                        }
                    },
                    locale: 'es',
                    headerToolbar: false,
                    height: 600,
                    slotMinTime: '08:00:00',
                    slotMaxTime: '19:00:00',
                    allDaySlot: false,
                    events: eventosFiltrados,
                    editable: false,
                    selectable: false,
                    eventClick: function(info) {
                        const event = info.event;
                        if (modalDetalleSesionMultiple && detalleSesionMultipleContent) {
                            const props = event.extendedProps;
                            let contenido = `
                              <div><span class='font-semibold'>Paciente:</span> ${props.pacienteNombre || ''}</div>
                              <div><span class='font-semibold'>Profesional:</span> ${props.profesionalName || ''}</div>
                              <div><span class='font-semibold'>Fecha y hora:</span> ${event.start ? event.start.toLocaleString('es-AR') : ''}</div>
                              <div><span class='font-semibold'>Notas:</span> ${props.notas || ''}</div>
                            `;
                            
                            // Agregar información CIE-10 si existe
                            if (props.nomencladorCIE10) {
                                const cie10 = props.nomencladorCIE10;
                                contenido += `
                                    <div class="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
                                        <div class="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">📋 Clasificación CIE-10</div>
                                        <div class="text-sm text-blue-600 dark:text-blue-400">
                                            <div><strong>Código:</strong> ${cie10.codigo}</div>
                                            <div><strong>Categoría:</strong> ${cie10.categoriaNombre}</div>
                                            <div class="mt-1 text-blue-500 dark:text-blue-300">${cie10.descripcion}</div>
                                        </div>
                                    </div>
                                `;
                            }
                            
                            detalleSesionMultipleContent.innerHTML = contenido;
                            modalDetalleSesionMultiple.classList.remove('hidden');
                        }
                    },
                    dateClick: null,
                    eventDidMount: function(info) {
                        console.log('📌 Evento montado:', info.event.title);
                    }
                });
                
                calendarMultipleInstance.render();
                console.log('✅ Calendario recreado con eventos filtrados');
                
                // Configurar listeners de vista
                agregarListenersVistaCalendario();
                
                // Activar botón de vista correcto
                if (vistaInicial === 'timeGridDay') {
                    activarBotonVista('day');
                } else if (vistaInicial === 'timeGridWeek') {
                    activarBotonVista('week');
                } else if (vistaInicial === 'dayGridMonth') {
                    activarBotonVista('month');
                }
                
                // Actualizar label del calendario
                setTimeout(() => {
                    actualizarLabelCalendario();
                }, 100);
                
                // Verificación final
                setTimeout(() => {
                    const renderedEvents = calendarMultipleInstance.getEvents();
                    console.log('🔍 === VERIFICACIÓN FINAL DEL FILTRADO ===');
                    console.log('📊 Eventos finales en calendario:', renderedEvents.length);
                    console.log('📋 Profesionales seleccionados:', profesionalesSeleccionados);
                    
                    const eventsProfessionalIds = [...new Set(renderedEvents.map(e => e.extendedProps.profesionalId))];
                    console.log('📋 Profesionales en eventos:', eventsProfessionalIds);
                    
                    const correctos = eventsProfessionalIds.every(id => profesionalesSeleccionados.includes(id));
                    if (correctos) {
                        console.log('✅ FILTRADO CORRECTO: Todos los eventos pertenecen a profesionales seleccionados');
                    } else {
                        console.error('❌ FILTRADO INCORRECTO: Hay eventos de profesionales no seleccionados');
                        eventsProfessionalIds.forEach(id => {
                            if (!profesionalesSeleccionados.includes(id)) {
                                const prof = profesionalesDisponibles.find(p => p.id === id);
                                console.error(`❌ Evento incorrecto de: ${prof?.title || 'Desconocido'} (${id})`);
                            }
                        });
                    }
                }, 200);
                
                console.log('✅ === RECARGA DEL CALENDARIO COMPLETADA ===');
            }, 150);
        });
        profesionalesSelect.setAttribute('data-listener-added', 'true');
        console.log('✅ Event listener actualizado agregado al select');
    }
    
    console.log('🎉 === FILTRO SELECT CARGADO EXITOSAMENTE ===');
    console.log('📊 Total de opciones creadas:', profesionalesDisponibles.length + 1); // +1 por "Todos"
    console.log('📊 Valor seleccionado:', profesionalesSelect.value);
    
    // Verificación final después de un breve delay
    setTimeout(() => {
        console.log('🔍 === VERIFICACIÓN FINAL DEL FILTRO ===');
        console.log('🔍 Opciones finales en select:', profesionalesSelect.options.length);
        console.log('🔍 Filtro visible:', getComputedStyle(profesionalesFilter).display !== 'none');
        
        if (profesionalesSelect.options.length > 1) {
            console.log('✅ === FILTRO COMPLETAMENTE FUNCIONAL ===');
        } else {
            console.warn('⚠️ === PROBLEMA CON EL FILTRO ===');
        }
    }, 50);
}



// Función para cargar eventos filtrados desde Firebase
async function cargarEventosFiltrados() {
    console.log('🔍 === INICIANDO CARGA DE EVENTOS FILTRADOS ===');
    console.log('📋 profesionalesSeleccionados:', profesionalesSeleccionados);
    console.log('📋 profesionalesDisponibles:', profesionalesDisponibles.map(p => ({ id: p.id, title: p.title })));
    
    let eventos = [];
    
    // Filtrar solo los profesionales seleccionados
    const profesionalesFiltrados = profesionalesDisponibles.filter(p => {
        const incluido = profesionalesSeleccionados.includes(p.id);
        console.log(`🔍 Profesional "${p.title}" (${p.id}) - ¿Incluido?: ${incluido}`);
        return incluido;
    });
    
    console.log('👥 Profesionales que se procesarán:', profesionalesFiltrados.map(p => ({ id: p.id, title: p.title })));
    
    if (profesionalesFiltrados.length === 0) {
        console.error('❌ No hay profesionales filtrados! Verificar lógica de filtrado');
        console.log('🔍 Comparación detallada:');
        console.log('  profesionalesDisponibles:', profesionalesDisponibles);
        console.log('  profesionalesSeleccionados:', profesionalesSeleccionados);
        return [];
    }
    
    // Cargar eventos solo de los profesionales filtrados
    for (const profesional of profesionalesFiltrados) {
        console.log(`🔍 === PROCESANDO ${profesional.title.toUpperCase()} (${profesional.id}) ===`);
        
        try {
            // Buscar pacientes de este profesional específico
            const pacientesSnap = await window.firebaseDB
                .collection('pacientes')
                .where('owner', '==', profesional.id)
                .get();
            
            console.log(`📋 Pacientes encontrados para ${profesional.title}:`, pacientesSnap.size);
            
            if (pacientesSnap.empty) {
                console.log(`ℹ️ No hay pacientes para ${profesional.title}`);
                continue;
            }
            
            // Procesar cada paciente
            for (const pacDoc of pacientesSnap.docs) {
                const pacienteData = pacDoc.data();
                console.log(`👤 Procesando paciente: ${pacienteData.nombre || pacienteData.email} (owner: ${pacienteData.owner})`);
                
                // Verificar que el owner coincida exactamente
                if (pacienteData.owner !== profesional.id) {
                    console.warn(`⚠️ INCONSISTENCIA: Paciente ${pacienteData.nombre} tiene owner ${pacienteData.owner} pero se encontró bajo profesional ${profesional.id}`);
                    continue;
                }
                
                // Cargar sesiones de este paciente
                const sesionesSnap = await window.firebaseDB
                    .collection('pacientes')
                    .doc(pacDoc.id)
                    .collection('sesiones')
                    .get();
                
                console.log(`📝 Sesiones para paciente ${pacienteData.nombre}:`, sesionesSnap.size);
                
                // Convertir sesiones a array para poder ordenar y encontrar la primera
                const sesionesArray = [];
                sesionesSnap.forEach(sesionDoc => {
                    const sesionData = sesionDoc.data();
                    sesionesArray.push({
                        id: sesionDoc.id,
                        data: sesionData,
                        fecha: new Date(sesionData.fecha).getTime()
                    });
                });
                
                // Ordenar sesiones por fecha para identificar la primera
                sesionesArray.sort((a, b) => a.fecha - b.fecha);
                
                // Crear eventos para cada sesión
                sesionesArray.forEach((sesionInfo, index) => {
                    const sesionData = sesionInfo.data;
                    const esPrimera = index === 0; // La primera en el array ordenado
                    
                    const extendedProps = {
                        pacienteId: pacDoc.id,
                        profesionalId: profesional.id,
                        profesionalName: profesional.title,
                        pacienteNombre: pacienteData.nombre || pacienteData.email,
                        notas: sesionData.comentario,
                        presentismo: sesionData.presentismo,
                        sesionId: sesionInfo.id,
                        fecha: sesionData.fecha,
                        esPrimeraSesion: esPrimera
                    };
                    
                    // Agregar información CIE-10 si existe
                    if (sesionData.nomencladorCIE10) {
                        extendedProps.nomencladorCIE10 = sesionData.nomencladorCIE10;
                        console.log(`📋 Sesión tiene clasificación CIE-10: ${sesionData.nomencladorCIE10.codigo}`);
                    }
                    
                    // Determinar color y título según si es primera sesión
                    const backgroundColor = esPrimera ? getColorPrimeraSesion() : getColorForProfessional(profesional.id);
                    const borderColor = backgroundColor;
                    const title = generarTituloSesion(
                        pacienteData.nombre || pacienteData.email, 
                        profesional.title, 
                        esPrimera
                    );
                    
                    const evento = {
                        title: title,
                        start: sesionData.fecha,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        extendedProps: extendedProps
                    };
                    
                    eventos.push(evento);
                    console.log(`✅ Evento creado: "${evento.title}" - ${esPrimera ? '🌟 PRIMERA SESIÓN' : 'Sesión regular'} - Profesional: ${profesional.title} (${profesional.id})`);
                });
            }
            
        } catch (error) {
            console.error(`❌ Error cargando datos para ${profesional.title}:`, error);
        }
    }
    
    console.log(`🎯 === RESUMEN DE CARGA FILTRADA ===`);
    console.log(`📊 Total de eventos cargados: ${eventos.length}`);
    console.log(`👥 Profesionales procesados: ${profesionalesFiltrados.length}`);
    
    // Verificar que todos los eventos pertenecen a profesionales seleccionados
    const eventsProfessionalIds = [...new Set(eventos.map(e => e.extendedProps.profesionalId))];
    console.log('📋 IDs de profesionales en eventos:', eventsProfessionalIds);
    console.log('📋 IDs de profesionales seleccionados:', profesionalesSeleccionados);
    
    const eventosCorrectos = eventsProfessionalIds.every(id => profesionalesSeleccionados.includes(id));
    if (eventosCorrectos) {
        console.log('✅ VERIFICACIÓN: Todos los eventos pertenecen a profesionales seleccionados');
    } else {
        console.error('❌ VERIFICACIÓN FALLIDA: Hay eventos de profesionales no seleccionados');
        eventsProfessionalIds.forEach(id => {
            if (!profesionalesSeleccionados.includes(id)) {
                const prof = profesionalesDisponibles.find(p => p.id === id);
                console.error(`❌ Evento incorrecto de: ${prof?.title || 'Desconocido'} (${id})`);
            }
        });
    }
    
    eventos.forEach(evento => {
        console.log(`📌 "${evento.title}" - ID Profesional: ${evento.extendedProps.profesionalId}`);
    });
    
    return eventos;
}

// Función para inicializar la agenda múltiple
async function mostrarAgendaMultiple() {
    console.log('=== INICIANDO AGENDA MÚLTIPLE ===');
    console.log('📋 profesionalesSeleccionados al inicio:', profesionalesSeleccionados);
    
    // SIEMPRE destruir el calendario anterior
    if (calendarMultipleInstance) {
        console.log('🗑️ Destruyendo calendario múltiple existente...');
        calendarMultipleInstance.destroy();
        calendarMultipleInstance = null;
    }
    
    // Limpiar el contenedor del calendario
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        calendarEl.innerHTML = '';
        console.log('🧹 Contenedor del calendario limpiado');
    }
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    
    console.log('Elementos encontrados:', { calendarEl, profesionalesFilter });
    
    if (!calendarEl) {
        console.error('No se encontró el elemento calendar');
        return;
    }
    if (!window.FullCalendar) {
        console.error('FullCalendar no está disponible');
        return;
    }
    
    // Mostrar filtro de profesionales SIEMPRE para agenda múltiple
    if (profesionalesFilter) {
        console.log('✅ Filtro de profesionales encontrado, mostrándolo...');
        // Forzar que el filtro sea visible removiendo todas las clases que lo ocultan
        profesionalesFilter.classList.remove('hidden');
        profesionalesFilter.style.display = 'flex';
        profesionalesFilter.style.visibility = 'visible';
        profesionalesFilter.style.opacity = '1';
        
        console.log('📊 Estilos del filtro aplicados:', {
            display: profesionalesFilter.style.display,
            visibility: profesionalesFilter.style.visibility,
            opacity: profesionalesFilter.style.opacity,
            classList: profesionalesFilter.classList.toString()
        });
    } else {
        console.error('No se encontró el elemento profesionalesFilter');
    }
    
    // Usar la función que sabemos que funciona
    console.log('🔄 Cargando profesionales usando cargarProfesionalesFirebase...');
    
    try {
        const profesionales = await window.cargarProfesionalesFirebase();
        
        if (profesionales && profesionales.length > 0) {
            console.log('✅ Profesionales cargados exitosamente desde Firebase:', profesionales.length);
        } else {
            console.warn('⚠️ No se pudieron cargar profesionales desde Firebase, usando fallback...');
            // Crear profesionales de prueba en caso de error
            profesionalesDisponibles = [
                { id: 'fallback1', title: 'Profesional 1 (Prueba)' },
                { id: 'fallback2', title: 'Profesional 2 (Prueba)' },
                { id: 'fallback3', title: 'Profesional 3 (Prueba)' }
            ];
            profesionalesSeleccionados = profesionalesDisponibles.map(p => p.id);
            
            console.log('🛠️ Usando profesionales de fallback:', profesionalesDisponibles);
            cargarFiltrosProfesionales();
        }
        
        // Verificar que el filtro se muestre después de cargar
        setTimeout(() => {
            const profesionalesFilter = document.getElementById('profesionalesFilter');
            const profesionalesSelect = document.getElementById('profesionalesSelect');
            
            if (profesionalesFilter) {
                const isVisible = getComputedStyle(profesionalesFilter).display !== 'none';
                console.log('🔍 Filtro visible después de cargar:', isVisible);
                
                if (!isVisible) {
                    console.warn('⚠️ El filtro sigue oculto, forzando visibilidad...');
                    profesionalesFilter.classList.remove('hidden');
                    profesionalesFilter.style.display = 'flex';
                    profesionalesFilter.style.visibility = 'visible';
                    profesionalesFilter.style.opacity = '1';
                }
                
                // Verificar que el select tenga opciones
                if (profesionalesSelect) {
                    console.log('🔍 Opciones en select:', profesionalesSelect.options.length);
                    if (profesionalesSelect.options.length <= 1) {
                        console.warn('⚠️ No hay opciones en el select, forzando carga...');
                        window.crearSelectPrueba();
                    }
                }
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error en la carga de profesionales:', error);
        
        // Fallback completo
        profesionalesDisponibles = [
            { id: 'error1', title: 'Error - Profesional 1' },
            { id: 'error2', title: 'Error - Profesional 2' }
        ];
        profesionalesSeleccionados = profesionalesDisponibles.map(p => p.id);
        cargarFiltrosProfesionales();
    }
    
    console.log('Iniciando calendario múltiple simple (sin recursos)');
    
    // Usar la nueva función de carga filtrada
    const eventos = await cargarEventosFiltrados();
    
    if (eventos.length === 0) {
        console.warn('⚠️ No se encontraron eventos para mostrar');
    }
    
    // Determinar vista inicial basada en la selección
    const vistaInicial = profesionalesSeleccionados.length === 1 ? 'timeGridDay' : 'timeGridWeek';
    console.log(`📅 Vista inicial del calendario: ${vistaInicial}`);
    
    // Crear calendario simple
    calendarMultipleInstance = new window.FullCalendar.Calendar(calendarEl, {
        initialView: vistaInicial,
        views: {
            timeGridWeek: { 
                type: 'timeGridWeek', 
                buttonText: 'Semana'
            },
            timeGridDay: { 
                type: 'timeGridDay', 
                buttonText: 'Día'
            },
            dayGridMonth: { 
                type: 'dayGridMonth', 
                buttonText: 'Mes'
            }
        },
        locale: 'es',
        headerToolbar: false,
        height: 600,
        slotMinTime: '08:00:00',
        slotMaxTime: '19:00:00',
        allDaySlot: false,
        events: eventos,
        editable: false,
        selectable: false,
        eventClick: function(info) {
            const event = info.event;
            if (modalDetalleSesionMultiple && detalleSesionMultipleContent) {
                const props = event.extendedProps;
                detalleSesionMultipleContent.innerHTML = `
                  <div><span class='font-semibold'>Paciente:</span> ${props.pacienteNombre || ''}</div>
                  <div><span class='font-semibold'>Profesional:</span> ${props.profesionalName || ''}</div>
                  <div><span class='font-semibold'>Fecha y hora:</span> ${event.start ? event.start.toLocaleString('es-AR') : ''}</div>
                  <div><span class='font-semibold'>Notas:</span> ${props.notas || ''}</div>
                `;
                modalDetalleSesionMultiple.classList.remove('hidden');
            }
        },
        dateClick: null,
        // Agregar callback para cuando el calendario esté listo
        eventDidMount: function(info) {
            console.log('📌 Evento montado:', info.event.title);
        }
    });
    
    calendarMultipleInstance.render();
    console.log('=== CALENDARIO MÚLTIPLE SIMPLE RENDERIZADO ===');
    console.log(`📊 Eventos renderizados en el calendario: ${eventos.length}`);
    
    // Verificación final de que los eventos son correctos
    setTimeout(() => {
        const renderedEvents = calendarMultipleInstance.getEvents();
        console.log('🔍 === VERIFICACIÓN FINAL DE EVENTOS ===');
        console.log('📊 Eventos finales en calendario:', renderedEvents.length);
        console.log('📋 Profesionales que deberían estar:', profesionalesSeleccionados);
        
        const eventsProfessionalIds = [...new Set(renderedEvents.map(e => e.extendedProps.profesionalId))];
        console.log('📋 Profesionales en eventos:', eventsProfessionalIds);
        
        const correctos = eventsProfessionalIds.every(id => profesionalesSeleccionados.includes(id));
        if (correctos) {
            console.log('✅ FILTRADO CORRECTO: Todos los eventos pertenecen a profesionales seleccionados');
        } else {
            console.error('❌ FILTRADO INCORRECTO: Hay eventos de profesionales no seleccionados');
            eventsProfessionalIds.forEach(id => {
                if (!profesionalesSeleccionados.includes(id)) {
                    const prof = profesionalesDisponibles.find(p => p.id === id);
                    console.error(`❌ Evento incorrecto de: ${prof?.title || 'Desconocido'} (${id})`);
                }
            });
        }
    }, 200);
    
    agregarListenersVistaCalendario();
    
    // Activar el botón correcto según la vista inicial
    if (vistaInicial === 'timeGridDay') {
        activarBotonVista('day');
    } else if (vistaInicial === 'timeGridWeek') {
        activarBotonVista('week');
    } else if (vistaInicial === 'dayGridMonth') {
        activarBotonVista('month');
    }
}

// Función para volver a la agenda individual
function mostrarAgendaIndividual() {
    if (calendarMultipleInstance) {
        calendarMultipleInstance.destroy();
        calendarMultipleInstance = null;
    }
    if (calendarInstance) {
        calendarInstance.destroy();
        calendarInstance = null;
    }
    
    // Ocultar filtro de profesionales
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    if (profesionalesFilter) {
        profesionalesFilter.classList.add('hidden');
        profesionalesFilter.style.display = 'none';
        profesionalesFilter.style.visibility = 'hidden';
        profesionalesFilter.style.opacity = '0';
    }
    
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        if (!window.FullCalendar) {
            console.error('FullCalendar no está disponible');
            return;
        }
        calendarInstance = new window.FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            views: {
                timeGridWeek: { 
                    type: 'timeGridWeek', 
                    buttonText: 'Semana'
                },
                timeGridDay: { 
                    type: 'timeGridDay', 
                    buttonText: 'Día'
                },
                dayGridMonth: { 
                    type: 'dayGridMonth', 
                    buttonText: 'Mes'
                }
            },
            locale: 'es',
            headerToolbar: false,
            height: 600,
            slotMinTime: '08:00:00',
            slotMaxTime: '19:00:00',
            allDaySlot: false,
            events: async function(info, successCallback, failureCallback) {
                try {
                    const user = window.firebaseAuth.currentUser;
                    if (!user) {
                        successCallback([]);
                        return;
                    }
                    // Cargar eventos del profesional actual
                    const eventos = [];
                    const pacientesSnap = await window.firebaseDB.collection('pacientes').where('owner', '==', user.uid).get();
                    for (const pacDoc of pacientesSnap.docs) {
                        const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(pacDoc.id).collection('sesiones').get();
                        
                        // Convertir sesiones a array para poder ordenar y encontrar la primera
                        const sesionesArray = [];
                        sesionesSnap.forEach(sDoc => {
                            const s = sDoc.data();
                            sesionesArray.push({
                                id: sDoc.id,
                                data: s,
                                fecha: new Date(s.fecha).getTime()
                            });
                        });
                        
                        // Ordenar sesiones por fecha para identificar la primera
                        sesionesArray.sort((a, b) => a.fecha - b.fecha);
                        
                        // Crear eventos para cada sesión
                        sesionesArray.forEach((sesionInfo, index) => {
                            const s = sesionInfo.data;
                            const esPrimera = index === 0; // La primera en el array ordenado
                            const pacienteNombre = pacDoc.data().nombre || pacDoc.data().email;
                            
                            // Determinar color y título según si es primera sesión
                            const backgroundColor = esPrimera ? getColorPrimeraSesion() : '#8b5cf6'; // Violeta por defecto
                            const borderColor = backgroundColor;
                            const title = generarTituloSesion(pacienteNombre, null, esPrimera);
                            
                            eventos.push({
                                title: title,
                                start: s.fecha,
                                backgroundColor: backgroundColor,
                                borderColor: borderColor,
                                extendedProps: {
                                    pacienteId: pacDoc.id,
                                    notas: s.comentario,
                                    presentismo: s.presentismo,
                                    sesionId: sesionInfo.id,
                                    esPrimeraSesion: esPrimera
                                }
                            });
                        });
                    }
                    successCallback(eventos);
                } catch (error) {
                    console.error('Error al cargar eventos:', error);
                    failureCallback(error);
                }
            },
            dateClick: function(info) {
                abrirModalNuevaSesion(info);
            },
            eventClick: function(info) {
                const event = info.event;
                inputFechaSesion.value = event.start ? event.start.toISOString().slice(0,16) : '';
                inputPresentismoSesion.value = event.extendedProps.presentismo || '';
                inputNotasSesion.value = event.extendedProps.notas || '';
                cargarPacientesParaSelect().then(() => {
                    selectPaciente.value = event.extendedProps.pacienteId || '';
                });
                modalNuevaSesion.classList.remove('hidden');
                sesionEditando = {
                    pacienteId: event.extendedProps.pacienteId,
                    sesionId: event.extendedProps.sesionId,
                    eventObj: event
                };
                if (btnEliminarSesion) btnEliminarSesion.classList.remove('hidden');
            }
        });
        calendarInstance.render();
        console.log('=== CALENDARIO INDIVIDUAL RENDERIZADO ===');
        agregarListenersVistaCalendario();
        activarBotonVista('week');
    }
}

// Estado de visibilidad del calendario y pacientes
let calendarVisible = false;
let patientsVisible = true; // Por defecto mostramos pacientes
let activeTab = 'patients'; // 'patients', 'individual', 'multiple'

// Event listeners para tabs (Pacientes, Agenda Individual, Agenda Múltiple)
const tabPacientes = document.getElementById('tabPacientes');
const tabAgendaIndividual = document.getElementById('tabAgendaIndividual');
const tabAgendaMultiple = document.getElementById('tabAgendaMultiple');
const calendarTabs = document.getElementById('calendarTabs');
const dashboardPacientesSection = document.getElementById('dashboardPacientesSection');

if (tabPacientes && tabAgendaIndividual && tabAgendaMultiple && calendarTabs && dashboardPacientesSection) {
    
    // Función para resetear todos los botones
    function resetearBotones() {
        [tabPacientes, tabAgendaIndividual, tabAgendaMultiple].forEach(btn => {
            btn.classList.remove('bg-primary-700', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-800');
        });
    }
    
    // Función para mostrar solo pacientes
    function mostrarSoloPacientes() {
        calendarTabs.classList.add('hidden');
        patientsVisible = true;
        calendarVisible = false;
        
        // Manejar visibilidad según el tipo de usuario
        if (isAdmin) {
            // Para administradores: ocultar dashboard normal y mostrar panel admin
            dashboardPacientesSection.classList.add('hidden');
            if (adminPanel) {
                adminPanel.classList.remove('hidden');
                adminPanel.style.display = 'block';
            }
        } else {
            // Para usuarios normales: mostrar dashboard normal y ocultar panel admin
            dashboardPacientesSection.classList.remove('hidden');
            if (adminPanel) {
                adminPanel.classList.add('hidden');
                adminPanel.style.display = 'none';
            }
        }
        
        // Ocultar filtro cuando se oculta el calendario
        const profesionalesFilter = document.getElementById('profesionalesFilter');
        if (profesionalesFilter) {
            profesionalesFilter.classList.add('hidden');
            profesionalesFilter.style.display = 'none';
        }
    }
    
    // Función para mostrar solo calendario
    function mostrarSoloCalendario() {
        // Ocultar ambas secciones de pacientes (normal y admin)
        dashboardPacientesSection.classList.add('hidden');
        if (adminPanel) {
            adminPanel.classList.add('hidden');
            adminPanel.style.display = 'none';
        }
        
        calendarTabs.classList.remove('hidden');
        patientsVisible = false;
        calendarVisible = true;
    }
    
    // Event listener para botón Pacientes
    tabPacientes.addEventListener('click', () => {
        resetearBotones();
        tabPacientes.classList.add('bg-primary-700', 'text-white');
        tabPacientes.classList.remove('bg-gray-200', 'text-gray-800');
        
        mostrarSoloPacientes();
        activeTab = 'patients';
        console.log('🔄 Mostrando solo pacientes');
    });
    
    // Event listener para Agenda Individual
    tabAgendaIndividual.addEventListener('click', () => {
        resetearBotones();
        tabAgendaIndividual.classList.add('bg-primary-700', 'text-white');
        tabAgendaIndividual.classList.remove('bg-gray-200', 'text-gray-800');
        
        mostrarSoloCalendario();
        activeTab = 'individual';
        mostrarAgendaIndividual();
        console.log('🔄 Mostrando agenda individual');
    });
    
    // Event listener para Agenda Múltiple
    tabAgendaMultiple.addEventListener('click', async () => {
        console.log('🎯 CLICK EN AGENDA MÚLTIPLE');
        resetearBotones();
        tabAgendaMultiple.classList.add('bg-primary-700', 'text-white');
        tabAgendaMultiple.classList.remove('bg-gray-200', 'text-gray-800');
        
        mostrarSoloCalendario();
        activeTab = 'multiple';
        
        // Asegurar que el filtro se muestre inmediatamente ANTES de cargar la agenda
        const profesionalesFilter = document.getElementById('profesionalesFilter');
        if (profesionalesFilter) {
            console.log('🎯 Mostrando filtro inmediatamente');
            profesionalesFilter.classList.remove('hidden');
            profesionalesFilter.style.display = 'flex';
            profesionalesFilter.style.visibility = 'visible';
            profesionalesFilter.style.opacity = '1';
            console.log('✅ Filtro visible antes de cargar agenda');
        }
        
        // Verificar si ya tenemos profesionales cargados
        if (profesionalesDisponibles.length === 0) {
            console.log('🔄 No hay profesionales cargados, cargando automáticamente...');
            try {
                await window.cargarProfesionalesFirebase();
                console.log('✅ Profesionales cargados automáticamente');
            } catch (error) {
                console.error('❌ Error al cargar profesionales automáticamente:', error);
            }
        } else {
            console.log('✅ Profesionales ya disponibles:', profesionalesDisponibles.length);
            // Asegurar que el filtro esté cargado
            cargarFiltrosProfesionales();
        }
        
        console.log('🚀 Llamando a mostrarAgendaMultiple()');
        mostrarAgendaMultiple();
        console.log('🔄 Mostrando agenda múltiple');
    });
}

// Cerrar modal
if (cancelNuevaSesion) {
    cancelNuevaSesion.addEventListener('click', () => {
        modalNuevaSesion.classList.add('hidden');
    });
}

// Guardar nueva sesión o editar
if (formNuevaSesion) {
    formNuevaSesion.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pacienteId = selectPaciente.value;
        const fecha = inputFechaSesion.value;
        const presentismo = inputPresentismoSesion.value;
        const notas = inputNotasSesion.value;
        let profesionalId = null;
        if (isAdmin && profesionalSelectContainer && profesionalSelectContainer.style.display !== 'none' && selectProfesional) {
            profesionalId = selectProfesional.value;
        }
        if (!pacienteId || !fecha) return;
        try {
            // Obtener datos del nomenclador CIE-10
            const datosCIE10 = obtenerDatosCIE10('calendar');
            console.log('📋 Datos CIE-10 para sesión de calendario:', datosCIE10);
            if (sesionEditando && sesionEditando.sesionId) {
                // Editar sesión existente
                const datosActualizacion = {
                    fecha,
                    comentario: notas,
                    notas: notas, // <-- Guardar también como 'notas'
                    presentismo: presentismo
                };
                if (profesionalId) datosActualizacion.profesionalId = profesionalId;
                if (datosCIE10) {
                    datosActualizacion.nomencladorCIE10 = datosCIE10;
                    console.log('✅ Datos CIE-10 incluidos en actualización');
                }
                await window.firebaseDB.collection('pacientes').doc(pacienteId).collection('sesiones').doc(sesionEditando.sesionId).update(datosActualizacion);
                if (sesionEditando.eventObj) {
                    sesionEditando.eventObj.setStart(fecha);
                    sesionEditando.eventObj.setProp('title', selectPaciente.options[selectPaciente.selectedIndex].text);
                    sesionEditando.eventObj.setExtendedProp('notas', notas);
                    sesionEditando.eventObj.setExtendedProp('presentismo', presentismo);
                    sesionEditando.eventObj.setExtendedProp('pacienteId', pacienteId);
                    if (profesionalId) sesionEditando.eventObj.setExtendedProp('profesionalId', profesionalId);
                    if (datosCIE10) {
                        sesionEditando.eventObj.setExtendedProp('nomencladorCIE10', datosCIE10);
                    }
                    if (presentismo) {
                        sesionEditando.eventObj.setExtendedProp('presentismo', presentismo);
                    }
                }
            } else {
                // Crear nueva sesión
                const datosSession = {
                    fecha,
                    comentario: notas,
                    notas: notas, // <-- Guardar también como 'notas'
                    presentismo: presentismo,
                    creado: new Date()
                };
                if (profesionalId) datosSession.profesionalId = profesionalId;
                if (datosCIE10) {
                    datosSession.nomencladorCIE10 = datosCIE10;
                    console.log('✅ Datos CIE-10 incluidos en nueva sesión');
                }
                const docRef = await window.firebaseDB.collection('pacientes').doc(pacienteId).collection('sesiones').add(datosSession);
                // Verificar si es la primera sesión de este paciente
                const esPrimera = await esPrimeraSesion(pacienteId, fecha);
                // Agregar evento a la instancia activa
                const activeCalendar = calendarMultipleInstance || calendarInstance;
                if (activeCalendar) {
                    const eventProps = { pacienteId, notas, presentismo, sesionId: docRef.id, esPrimeraSesion: esPrimera };
                    if (profesionalId) eventProps.profesionalId = profesionalId;
                    if (datosCIE10) {
                        eventProps.nomencladorCIE10 = datosCIE10;
                    }
                    if (presentismo) {
                        eventProps.presentismo = presentismo;
                    }
                    // Obtener nombre del paciente y profesional para el título
                    const pacienteNombre = selectPaciente.options[selectPaciente.selectedIndex].text;
                    const profesionalNombre = profesionalId ? (selectProfesional.options[selectProfesional.selectedIndex].text) : null;
                    const title = generarTituloSesion(pacienteNombre, profesionalNombre, esPrimera);
                    // Determinar colores
                    const backgroundColor = esPrimera ? getColorPrimeraSesion() : (calendarMultipleInstance ? '#8b5cf6' : '#8b5cf6');
                    const borderColor = backgroundColor;
                    activeCalendar.addEvent({
                        title: title,
                        start: fecha,
                        end: null,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        extendedProps: eventProps
                    });
                    console.log(`✅ Evento agregado al calendario: "${title}" - ${esPrimera ? '🌟 PRIMERA SESIÓN' : 'Sesión regular'}`);
                }
            }
            modalNuevaSesion.classList.add('hidden');
            limpiarCamposCIE10(); // Limpiar campos del nomenclador
        } catch (error) {
            alert('Error al guardar sesión: ' + error.message);
        }
    });
}

// Eliminar sesión
const btnEliminarSesion = document.getElementById('btnEliminarSesion');
let sesionEditando = null; // { pacienteId, sesionId, eventObj }
if (btnEliminarSesion) {
    btnEliminarSesion.addEventListener('click', async () => {
        if (!sesionEditando || !sesionEditando.sesionId || !sesionEditando.pacienteId) return;
        if (!confirm('¿Seguro que deseas eliminar la sesión?')) return;
        try {
            await window.firebaseDB.collection('pacientes').doc(sesionEditando.pacienteId).collection('sesiones').doc(sesionEditando.sesionId).delete();
            if (sesionEditando.eventObj) sesionEditando.eventObj.remove();
            modalNuevaSesion.classList.add('hidden');
        } catch (error) {
            alert('Error al eliminar sesión: ' + error.message);
        }
    });
}

// console.log(window.FullCalendar, window.FullCalendarPlugins);
// console.log(window.ResourceTimeGrid, window.ResourceCommon); 

if (cerrarDetalleSesionMultiple) {
    cerrarDetalleSesionMultiple.addEventListener('click', () => {
        modalDetalleSesionMultiple.classList.add('hidden');
        detalleSesionMultipleContent.innerHTML = '';
    });
} 

document.addEventListener('DOMContentLoaded', function() {
    // Referencias al modal de solo lectura para agenda múltiple
    const modalDetalleSesionMultiple = document.getElementById('modalDetalleSesionMultiple');
    const cerrarDetalleSesionMultiple = document.getElementById('cerrarDetalleSesionMultiple');
    const detalleSesionMultipleContent = document.getElementById('detalleSesionMultipleContent');
    if (cerrarDetalleSesionMultiple) {
        cerrarDetalleSesionMultiple.addEventListener('click', () => {
            modalDetalleSesionMultiple.classList.add('hidden');
            detalleSesionMultipleContent.innerHTML = '';
        });
    }
    // Sobrescribir mostrarAgendaMultiple para usar estas referencias
    window.mostrarAgendaMultiple = async function() {
        if (calendarMultipleInstance) {
            calendarMultipleInstance.destroy();
            calendarMultipleInstance = null;
        }
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;
        if (!window.FullCalendar) {
            console.error('FullCalendar no está disponible');
            return;
        }
        const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
        const profesionales = usuariosSnap.docs.map(doc => ({
            id: doc.id,
            title: doc.data().displayName || doc.data().email
        }));
        let eventos = [];
        for (const pro of profesionales) {
            const pacientesSnap = await window.firebaseDB.collection('pacientes').where('owner', '==', pro.id).get();
            for (const pacDoc of pacientesSnap.docs) {
                const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(pacDoc.id).collection('sesiones').get();
                sesionesSnap.forEach(sDoc => {
                    const s = sDoc.data();
                    eventos.push({
                        title: `${pacDoc.data().nombre || pacDoc.data().email} (${pro.title})`,
                        start: s.fecha,
                        extendedProps: {
                            pacienteId: pacDoc.id,
                            profesionalId: pro.id,
                            profesionalName: pro.title,
                            pacienteNombre: pacDoc.data().nombre || pacDoc.data().email,
                            notas: s.comentario,
                            sesionId: sDoc.id,
                            fecha: s.fecha
                        }
                    });
                });
            }
        }
        calendarMultipleInstance = new window.FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            views: {
                timeGridWeek: { 
                    type: 'timeGridWeek', 
                    buttonText: 'Semana'
                },
                timeGridDay: { 
                    type: 'timeGridDay', 
                    buttonText: 'Día'
                },
                dayGridMonth: { 
                    type: 'dayGridMonth', 
                    buttonText: 'Mes'
                }
            },
            locale: 'es',
            headerToolbar: false,
            height: 600,
            slotMinTime: '08:00:00',
            slotMaxTime: '19:00:00',
            allDaySlot: false,
            events: eventos,
            editable: false,
            selectable: false,
            eventClick: function(info) {
                const event = info.event;
                if (modalDetalleSesionMultiple && detalleSesionMultipleContent) {
                    const props = event.extendedProps;
                    detalleSesionMultipleContent.innerHTML = `
                      <div><span class='font-semibold'>Paciente:</span> ${props.pacienteNombre || ''}</div>
                      <div><span class='font-semibold'>Profesional:</span> ${props.profesionalName || ''}</div>
                      <div><span class='font-semibold'>Fecha y hora:</span> ${event.start ? event.start.toLocaleString('es-AR') : ''}</div>
                      <div><span class='font-semibold'>Notas:</span> ${props.notas || ''}</div>
                    `;
                    modalDetalleSesionMultiple.classList.remove('hidden');
                }
            },
            dateClick: null
        });
        calendarMultipleInstance.render();
        agregarListenersVistaCalendario();
        activarBotonVista('week');
    }
}); 

// === FUNCIONES DEL NOMENCLADOR CIE-10 ===

// Función para mostrar todas las categorías disponibles
window.mostrarCategorias = function() {
    console.log('=== CATEGORÍAS CIE-10 DISPONIBLES ===');
    const categorias = obtenerCategorias();
    categorias.forEach(cat => {
        console.log(`${cat.id}. ${cat.categoria} (${cat.totalSubcategorias} diagnósticos)`);
    });
    return categorias;
};

// Función para buscar diagnósticos por término
window.buscarDiagnostico = function(termino) {
    console.log(`🔍 Buscando: "${termino}"`);
    const resultados = buscarPorDescripcion(termino);
    
    if (resultados.length > 0) {
        console.log(`✅ Encontrados ${resultados.length} resultado(s):`);
        resultados.forEach((resultado, index) => {
            console.log(`${index + 1}. ${resultado.codigo}: ${resultado.descripcion}`);
            console.log(`   Categoría: ${resultado.categoria}`);
        });
    } else {
        console.log('❌ No se encontraron resultados');
    }
    
    return resultados;
};

// Función para obtener información de un código específico
window.obtenerDiagnostico = function(codigo) {
    console.log(`🔍 Buscando código: ${codigo}`);
    const resultado = buscarPorCodigo(codigo);
    
    if (resultado) {
        console.log(`✅ Encontrado:`);
        console.log(`   Código: ${resultado.codigo}`);
        console.log(`   Descripción: ${resultado.descripcion}`);
        console.log(`   Categoría: ${resultado.categoria}`);
    } else {
        console.log(`❌ Código ${codigo} no encontrado`);
    }
    
    return resultado;
};

// Función para agregar campo de nomenclador a las sesiones
window.agregarCampoNomenclador = function() {
    console.log('💡 Para agregar el nomenclador a las sesiones:');
    console.log('1. Agregar un campo "codigo_cie10" en el formulario de sesiones');
    console.log('2. Usar buscarDiagnostico("ansiedad") para buscar códigos');
    console.log('3. Usar obtenerDiagnostico("F41.1") para validar códigos');
    console.log('4. Guardar el código junto con la sesión en Firebase');
    
    console.log('\n📋 Ejemplos de uso:');
    console.log('- buscarDiagnostico("depresión")');
    console.log('- buscarDiagnostico("ansiedad")');
    console.log('- obtenerDiagnostico("F32.1")');
    console.log('- mostrarCategorias()');
};

// Función de ejemplo para mostrar cómo integrar con sesiones
window.ejemploIntegracionSesion = function() {
    console.log('📝 === EJEMPLO DE INTEGRACIÓN CON SESIONES ===');
    
    // Ejemplo de cómo podrías agregar el nomenclador al formulario de sesiones
    const ejemploSesion = {
        pacienteId: 'ejemplo123',
        fecha: '2024-01-15T10:00',
        comentario: 'Sesión inicial de evaluación',
        notas: 'Paciente presenta síntomas de ansiedad generalizada',
        codigo_cie10: 'F41.1', // Código del nomenclador
        diagnostico_descripcion: 'Trastorno de ansiedad generalizada'
    };
    
    console.log('Ejemplo de sesión con nomenclador:', ejemploSesion);
    
    // Validar el código
    const diagnostico = buscarPorCodigo(ejemploSesion.codigo_cie10);
    if (diagnostico) {
        console.log('✅ Código válido:', diagnostico.descripcion);
    } else {
        console.log('❌ Código inválido');
    }
    
    return ejemploSesion;
};

// Mostrar información del nomenclador al cargar
console.log('📋 Nomenclador CIE-10 cargado exitosamente!');
console.log('💡 Funciones disponibles:');
console.log('  - mostrarCategorias(): Ver todas las categorías');
console.log('  - buscarDiagnostico("término"): Buscar por descripción');
console.log('  - obtenerDiagnostico("código"): Buscar por código CIE-10');
console.log('  - ejemploIntegracionSesion(): Ver ejemplo de uso');

// Agregar al objeto window para fácil acceso
window.nomenclador = {
    mostrarCategorias,
    buscarDiagnostico,
    obtenerDiagnostico,
    agregarCampoNomenclador,
    ejemploIntegracionSesion
};

// === FUNCIONES PARA DROPDOWNS DEL NOMENCLADOR CIE-10 ===

// Función para cargar las categorías en los dropdowns
function cargarCategoriasCIE10() {
    console.log('📋 Cargando categorías CIE-10 en dropdowns...');
    
    // Verificar que el nomenclador esté disponible
    if (typeof obtenerCategorias !== 'function') {
        console.error('❌ Nomenclador CIE-10 no está disponible');
        return;
    }
    
    const categorias = obtenerCategorias();
    console.log('✅ Categorías obtenidas:', categorias.length);
    
    // Cargar en dropdown de ficha clínica
    const selectCategoria = document.getElementById('sesionCategoriaCIE10');
    if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">Seleccionar categoría...</option>';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = `${categoria.categoria} (${categoria.totalSubcategorias} códigos)`;
            selectCategoria.appendChild(option);
        });
        console.log('✅ Categorías cargadas en ficha clínica:', categorias.length);
    }
    
    // Cargar en dropdown de calendario
    const selectCategoriaCalendar = document.getElementById('inputCategoriaCIE10');
    if (selectCategoriaCalendar) {
        selectCategoriaCalendar.innerHTML = '<option value="">Seleccionar categoría...</option>';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = `${categoria.categoria} (${categoria.totalSubcategorias} códigos)`;
            selectCategoriaCalendar.appendChild(option);
        });
        console.log('✅ Categorías cargadas en calendario:', categorias.length);
    }
}

// Función para cargar subcategorías (códigos específicos) basado en la categoría seleccionada
function cargarSubcategoriasCIE10(categoriaId, selectCodigoId, descripcionId) {
    console.log('🔍 Cargando subcategorías para categoría:', categoriaId);
    
    const selectCodigo = document.getElementById(selectCodigoId);
    const descripcionDiv = document.getElementById(descripcionId);
    
    if (!selectCodigo) {
        console.error('❌ No se encontró el select de códigos:', selectCodigoId);
        return;
    }
    
    // Limpiar opciones anteriores
    selectCodigo.innerHTML = '<option value="">Seleccionar código...</option>';
    
    if (descripcionDiv) {
        descripcionDiv.classList.add('hidden');
        descripcionDiv.innerHTML = '';
    }
    
    if (!categoriaId) {
        selectCodigo.disabled = true;
        return;
    }
    
    // Verificar que la función esté disponible
    if (typeof obtenerSubcategoriasPorCategoria !== 'function') {
        console.error('❌ Función obtenerSubcategoriasPorCategoria no está disponible');
        return;
    }
    
    const subcategorias = obtenerSubcategoriasPorCategoria(parseInt(categoriaId));
    console.log('✅ Subcategorías obtenidas:', subcategorias.length);
    
    if (subcategorias.length > 0) {
        selectCodigo.disabled = false;
        subcategorias.forEach(subcategoria => {
            const option = document.createElement('option');
            option.value = subcategoria.codigo;
            option.textContent = `${subcategoria.codigo}: ${subcategoria.descripcion}`;
            option.setAttribute('data-descripcion', subcategoria.descripcion);
            selectCodigo.appendChild(option);
        });
        console.log('✅ Subcategorías cargadas:', subcategorias.length);
    } else {
        selectCodigo.disabled = true;
        console.warn('⚠️ No se encontraron subcategorías para la categoría:', categoriaId);
    }
}

// Función para mostrar la descripción del código seleccionado
function mostrarDescripcionCIE10(codigo, descripcionId) {
    const descripcionDiv = document.getElementById(descripcionId);
    if (!descripcionDiv) return;
    
    if (!codigo) {
        descripcionDiv.classList.add('hidden');
        descripcionDiv.innerHTML = '';
        return;
    }
    
    // Buscar información completa del código
    const diagnostico = buscarPorCodigo(codigo);
    if (diagnostico) {
        descripcionDiv.innerHTML = `
            <strong>Código:</strong> ${diagnostico.codigo}<br>
            <strong>Descripción:</strong> ${diagnostico.descripcion}<br>
            <strong>Categoría:</strong> ${diagnostico.categoria}
        `;
        descripcionDiv.classList.remove('hidden');
        console.log('✅ Descripción mostrada para código:', codigo);
    } else {
        descripcionDiv.classList.add('hidden');
        console.warn('⚠️ No se encontró información para el código:', codigo);
    }
}

// Función para configurar los event listeners de los dropdowns
function configurarDropdownsCIE10() {
    console.log('🔧 Configurando event listeners para dropdowns CIE-10...');
    
    // Event listener para categoría en ficha clínica
    const selectCategoria = document.getElementById('sesionCategoriaCIE10');
    if (selectCategoria) {
        selectCategoria.addEventListener('change', (e) => {
            const categoriaId = e.target.value;
            cargarSubcategoriasCIE10(categoriaId, 'sesionCodigoCIE10', 'descripcionCIE10');
        });
        console.log('✅ Listener configurado para categoría en ficha clínica');
    }
    
    // Event listener para código en ficha clínica
    const selectCodigo = document.getElementById('sesionCodigoCIE10');
    if (selectCodigo) {
        selectCodigo.addEventListener('change', (e) => {
            const codigo = e.target.value;
            mostrarDescripcionCIE10(codigo, 'descripcionCIE10');
        });
        console.log('✅ Listener configurado para código en ficha clínica');
    }
    
    // Event listener para categoría en calendario
    const selectCategoriaCalendar = document.getElementById('inputCategoriaCIE10');
    if (selectCategoriaCalendar) {
        selectCategoriaCalendar.addEventListener('change', (e) => {
            const categoriaId = e.target.value;
            cargarSubcategoriasCIE10(categoriaId, 'inputCodigoCIE10', 'descripcionCIE10Calendar');
        });
        console.log('✅ Listener configurado para categoría en calendario');
    }
    
    // Event listener para código en calendario
    const selectCodigoCalendar = document.getElementById('inputCodigoCIE10');
    if (selectCodigoCalendar) {
        selectCodigoCalendar.addEventListener('change', (e) => {
            const codigo = e.target.value;
            mostrarDescripcionCIE10(codigo, 'descripcionCIE10Calendar');
        });
        console.log('✅ Listener configurado para código en calendario');
    }
}

// Función para limpiar los campos del nomenclador
function limpiarCamposCIE10() {
    // Limpiar campos de ficha clínica
    const selectCategoria = document.getElementById('sesionCategoriaCIE10');
    const selectCodigo = document.getElementById('sesionCodigoCIE10');
    const descripcion = document.getElementById('descripcionCIE10');
    
    if (selectCategoria) selectCategoria.value = '';
    if (selectCodigo) {
        selectCodigo.value = '';
        selectCodigo.disabled = true;
        selectCodigo.innerHTML = '<option value="">Seleccionar código...</option>';
    }
    if (descripcion) {
        descripcion.classList.add('hidden');
        descripcion.innerHTML = '';
    }
    
    // Limpiar campos de calendario
    const selectCategoriaCalendar = document.getElementById('inputCategoriaCIE10');
    const selectCodigoCalendar = document.getElementById('inputCodigoCIE10');
    const descripcionCalendar = document.getElementById('descripcionCIE10Calendar');
    
    if (selectCategoriaCalendar) selectCategoriaCalendar.value = '';
    if (selectCodigoCalendar) {
        selectCodigoCalendar.value = '';
        selectCodigoCalendar.disabled = true;
        selectCodigoCalendar.innerHTML = '<option value="">Seleccionar código...</option>';
    }
    if (descripcionCalendar) {
        descripcionCalendar.classList.add('hidden');
        descripcionCalendar.innerHTML = '';
    }
}

// Función para inicializar el sistema de nomenclador
function inicializarNomencladorCIE10() {
    console.log('🚀 Inicializando sistema de nomenclador CIE-10...');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                cargarCategoriasCIE10();
                configurarDropdownsCIE10();
                console.log('✅ Sistema de nomenclador CIE-10 inicializado');
            }, 500); // Pequeño delay para asegurar que todo esté cargado
        });
    } else {
        setTimeout(() => {
            cargarCategoriasCIE10();
            configurarDropdownsCIE10();
            console.log('✅ Sistema de nomenclador CIE-10 inicializado');
        }, 500);
    }
}

// Función para obtener los datos CIE-10 del formulario
function obtenerDatosCIE10(formType = 'ficha') {
    let categoriaId, codigo;
    
    if (formType === 'ficha') {
        const selectCategoria = document.getElementById('sesionCategoriaCIE10');
        const selectCodigo = document.getElementById('sesionCodigoCIE10');
        categoriaId = selectCategoria ? selectCategoria.value : '';
        codigo = selectCodigo ? selectCodigo.value : '';
    } else {
        const selectCategoria = document.getElementById('inputCategoriaCIE10');
        const selectCodigo = document.getElementById('inputCodigoCIE10');
        categoriaId = selectCategoria ? selectCategoria.value : '';
        codigo = selectCodigo ? selectCodigo.value : '';
    }
    
    if (!categoriaId || !codigo) {
        return null;
    }
    
    // Obtener información completa
    const diagnostico = buscarPorCodigo(codigo);
    const categorias = obtenerCategorias();
    const categoria = categorias.find(cat => cat.id == categoriaId);
    
    return {
        categoriaId: parseInt(categoriaId),
        categoriaNombre: categoria ? categoria.categoria : '',
        codigo: codigo,
        descripcion: diagnostico ? diagnostico.descripcion : '',
        diagnosticoCompleto: diagnostico
    };
}

// Inicializar el sistema
inicializarNomencladorCIE10();

// Función de debug para probar el sistema de nomenclador
window.debugNomenclador = function() {
    console.log('🧪 === DEBUG SISTEMA NOMENCLADOR CIE-10 ===');
    
    // 1. Verificar disponibilidad de funciones
    console.log('📋 Funciones disponibles:');
    console.log('  - obtenerCategorias:', typeof obtenerCategorias);
    console.log('  - obtenerSubcategoriasPorCategoria:', typeof obtenerSubcategoriasPorCategoria);
    console.log('  - buscarPorCodigo:', typeof buscarPorCodigo);
    
    // 2. Verificar elementos HTML
    console.log('🔍 Elementos HTML encontrados:');
    console.log('  - sesionCategoriaCIE10:', !!document.getElementById('sesionCategoriaCIE10'));
    console.log('  - sesionCodigoCIE10:', !!document.getElementById('sesionCodigoCIE10'));
    console.log('  - inputCategoriaCIE10:', !!document.getElementById('inputCategoriaCIE10'));
    console.log('  - inputCodigoCIE10:', !!document.getElementById('inputCodigoCIE10'));
    
    // 3. Verificar datos cargados
    if (typeof obtenerCategorias === 'function') {
        const categorias = obtenerCategorias();
        console.log('📊 Total de categorías:', categorias.length);
        if (categorias.length > 0) {
            console.log('📋 Primera categoría:', categorias[0]);
            console.log('📋 Última categoría:', categorias[categorias.length - 1]);
        }
    }
    
    // 4. Verificar opciones en selects
    const selectCategoria = document.getElementById('sesionCategoriaCIE10');
    if (selectCategoria) {
        console.log('🎯 Opciones en select de categorías:', selectCategoria.options.length);
    }
    
    // 5. Ejemplo de uso
    console.log('💡 === EJEMPLOS DE USO ===');
    console.log('Para probar manualmente:');
    console.log('1. cargarCategoriasCIE10() - Recargar categorías');
    console.log('2. cargarSubcategoriasCIE10(1, "sesionCodigoCIE10", "descripcionCIE10") - Cargar subcategorías');
    console.log('3. obtenerDatosCIE10("ficha") - Obtener datos seleccionados');
    console.log('4. buscarDiagnostico("ansiedad") - Buscar por término');
    console.log('5. obtenerDiagnostico("F41.1") - Buscar por código');
    
    console.log('🧪 === FIN DEBUG NOMENCLADOR ===');
};

// Función para probar una sesión completa con nomenclador
window.probarSesionConNomenclador = function() {
    console.log('🧪 === PRUEBA SESIÓN CON NOMENCLADOR ===');
    
    // Simular datos de una sesión con nomenclador
    const ejemploSesion = {
        fecha: '2024-01-15T10:00',
        comentario: 'Sesión inicial de evaluación',
        notas: 'Paciente presenta síntomas de ansiedad generalizada',
        nomencladorCIE10: {
            categoriaId: 12,
            categoriaNombre: 'Trastornos de ansiedad',
            codigo: 'F41.1',
            descripcion: 'Trastorno de ansiedad generalizada',
            diagnosticoCompleto: {
                categoria: 'Trastornos de ansiedad',
                codigo: 'F41.1',
                descripcion: 'Trastorno de ansiedad generalizada'
            }
        }
    };
    
    console.log('📋 Ejemplo de sesión con nomenclador:', ejemploSesion);
    
    // Simular cómo se vería en la interfaz
    console.log('🎨 Cómo se mostraría en la interfaz:');
    console.log(`Fecha: ${ejemploSesion.fecha}`);
    console.log(`Comentario: ${ejemploSesion.comentario}`);
    console.log(`Notas: ${ejemploSesion.notas}`);
    console.log(`📋 CIE-10: ${ejemploSesion.nomencladorCIE10.codigo} - ${ejemploSesion.nomencladorCIE10.descripcion}`);
    console.log(`Categoría: ${ejemploSesion.nomencladorCIE10.categoriaNombre}`);
    
    return ejemploSesion;
};

// Hacer disponibles las funciones globalmente para debugging
window.cargarCategoriasCIE10 = cargarCategoriasCIE10;
window.cargarSubcategoriasCIE10 = cargarSubcategoriasCIE10;
window.mostrarDescripcionCIE10 = mostrarDescripcionCIE10;
window.limpiarCamposCIE10 = limpiarCamposCIE10;
window.obtenerDatosCIE10 = obtenerDatosCIE10;

// === FUNCIONES PARA EL MODAL DEL NOMENCLADOR CIE-10 ===

// Variables globales para el modal
let modalNomencladorAbiertoPor = null; // 'ficha' o 'calendar'
let datosNomencladorSeleccionados = {
    ficha: null,
    calendar: null
};

// Función para abrir el modal del nomenclador
function abrirModalNomenclador(origen) {
    console.log('📋 Abriendo modal del nomenclador desde:', origen);
    modalNomencladorAbiertoPor = origen;
    
    const modal = document.getElementById('modalNomencladorCIE10');
    if (!modal) {
        console.error('❌ No se encontró el modal del nomenclador');
        return;
    }
    
    // Cargar categorías en el modal si no están cargadas
    cargarCategoriasEnModal();
    
    // Cargar datos existentes si los hay
    const datosExistentes = datosNomencladorSeleccionados[origen];
    if (datosExistentes) {
        precargarDatosEnModal(datosExistentes);
    } else {
        limpiarModal();
    }
    
    modal.classList.remove('hidden');
    
    // Forzar que el modal sea visible con z-index alto
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.zIndex = '999999';
    
    console.log('✅ Modal del nomenclador mostrado');
}

// Función para cerrar el modal del nomenclador
function cerrarModalNomenclador() {
    const modal = document.getElementById('modalNomencladorCIE10');
    if (modal) {
        modal.classList.add('hidden');
        // Limpiar estilos inline
        modal.style.display = '';
        modal.style.visibility = '';
        modal.style.opacity = '';
        modal.style.zIndex = '';
    }
    modalNomencladorAbiertoPor = null;
    console.log('✅ Modal del nomenclador cerrado');
}

// Función para cargar categorías en el modal
function cargarCategoriasEnModal() {
    const selectCategoria = document.getElementById('modalCategoriaCIE10');
    if (!selectCategoria) return;
    
    if (typeof obtenerCategorias !== 'function') {
        console.error('❌ Función obtenerCategorias no disponible');
        return;
    }
    
    const categorias = obtenerCategorias();
    selectCategoria.innerHTML = '<option value="">Seleccionar categoría...</option>';
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = `${categoria.categoria} (${categoria.totalSubcategorias} códigos)`;
        selectCategoria.appendChild(option);
    });
    
    console.log('✅ Categorías cargadas en modal:', categorias.length);
}

// Función para cargar subcategorías en el modal
function cargarSubcategoriasEnModal(categoriaId) {
    const selectCodigo = document.getElementById('modalCodigoCIE10');
    const descripcionDiv = document.getElementById('modalDescripcionCIE10');
    
    if (!selectCodigo) return;
    
    // Limpiar opciones anteriores
    selectCodigo.innerHTML = '<option value="">Seleccionar código...</option>';
    
    if (descripcionDiv) {
        descripcionDiv.classList.add('hidden');
        descripcionDiv.innerHTML = '';
    }
    
    if (!categoriaId) {
        selectCodigo.disabled = true;
        return;
    }
    
    if (typeof obtenerSubcategoriasPorCategoria !== 'function') {
        console.error('❌ Función obtenerSubcategoriasPorCategoria no disponible');
        return;
    }
    
    const subcategorias = obtenerSubcategoriasPorCategoria(parseInt(categoriaId));
    
    if (subcategorias.length > 0) {
        selectCodigo.disabled = false;
        subcategorias.forEach(subcategoria => {
            const option = document.createElement('option');
            option.value = subcategoria.codigo;
            option.textContent = `${subcategoria.codigo}: ${subcategoria.descripcion}`;
            selectCodigo.appendChild(option);
        });
        console.log('✅ Subcategorías cargadas en modal:', subcategorias.length);
    } else {
        selectCodigo.disabled = true;
        console.warn('⚠️ No se encontraron subcategorías para la categoría:', categoriaId);
    }
}

// Función para mostrar descripción en el modal
function mostrarDescripcionEnModal(codigo) {
    const descripcionDiv = document.getElementById('modalDescripcionCIE10');
    if (!descripcionDiv) return;
    
    if (!codigo) {
        descripcionDiv.classList.add('hidden');
        descripcionDiv.innerHTML = '';
        return;
    }
    
    const diagnostico = buscarPorCodigo(codigo);
    if (diagnostico) {
        descripcionDiv.innerHTML = `
            <div class="font-semibold text-blue-700 dark:text-blue-300 mb-2">📋 Información del Diagnóstico</div>
            <div><strong>Código:</strong> ${diagnostico.codigo}</div>
            <div><strong>Descripción:</strong> ${diagnostico.descripcion}</div>
            <div><strong>Categoría:</strong> ${diagnostico.categoria}</div>
        `;
        descripcionDiv.classList.remove('hidden');
        console.log('✅ Descripción mostrada en modal para código:', codigo);
    } else {
        descripcionDiv.classList.add('hidden');
        console.warn('⚠️ No se encontró información para el código:', codigo);
    }
}

// Función para precargar datos en el modal
function precargarDatosEnModal(datos) {
    const selectCategoria = document.getElementById('modalCategoriaCIE10');
    const selectCodigo = document.getElementById('modalCodigoCIE10');
    
    if (selectCategoria && datos.categoriaId) {
        selectCategoria.value = datos.categoriaId;
        // Cargar subcategorías
        cargarSubcategoriasEnModal(datos.categoriaId);
        
        // Esperar un poco y luego seleccionar el código
        setTimeout(() => {
            if (selectCodigo && datos.codigo) {
                selectCodigo.value = datos.codigo;
                mostrarDescripcionEnModal(datos.codigo);
            }
        }, 100);
    }
}

// Función para limpiar el modal
function limpiarModal() {
    const selectCategoria = document.getElementById('modalCategoriaCIE10');
    const selectCodigo = document.getElementById('modalCodigoCIE10');
    const descripcionDiv = document.getElementById('modalDescripcionCIE10');
    
    if (selectCategoria) selectCategoria.value = '';
    if (selectCodigo) {
        selectCodigo.value = '';
        selectCodigo.disabled = true;
        selectCodigo.innerHTML = '<option value="">Seleccionar código...</option>';
    }
    if (descripcionDiv) {
        descripcionDiv.classList.add('hidden');
        descripcionDiv.innerHTML = '';
    }
}

// Función para aceptar la selección del modal
function aceptarSeleccionModal() {
    const selectCategoria = document.getElementById('modalCategoriaCIE10');
    const selectCodigo = document.getElementById('modalCodigoCIE10');
    
    if (!selectCategoria || !selectCodigo) return;
    
    const categoriaId = selectCategoria.value;
    const codigo = selectCodigo.value;
    
    if (!categoriaId || !codigo) {
        alert('Por favor selecciona una categoría y un código específico.');
        return;
    }
    
    // Obtener información completa
    const diagnostico = buscarPorCodigo(codigo);
    const categorias = obtenerCategorias();
    const categoria = categorias.find(cat => cat.id == categoriaId);
    
    const datosCompletos = {
        categoriaId: parseInt(categoriaId),
        categoriaNombre: categoria ? categoria.categoria : '',
        codigo: codigo,
        descripcion: diagnostico ? diagnostico.descripcion : '',
        diagnosticoCompleto: diagnostico
    };
    
    // Guardar los datos según el origen
    datosNomencladorSeleccionados[modalNomencladorAbiertoPor] = datosCompletos;
    
    // Actualizar el botón correspondiente
    actualizarBotonNomenclador(modalNomencladorAbiertoPor, datosCompletos);
    
    console.log('✅ Datos del nomenclador guardados:', datosCompletos);
    
    // Cerrar modal
    cerrarModalNomenclador();
}

// Función para actualizar el botón del nomenclador
function actualizarBotonNomenclador(origen, datos) {
    let spanId;
    if (origen === 'agregar') {
        spanId = 'nomencladorSeleccionadoAgregar';
    } else if (origen === 'editar') {
        spanId = 'nomencladorSeleccionadoEditar';
    } else {
        spanId = 'nomencladorSeleccionadoCalendar';
    }
    
    const span = document.getElementById(spanId);
    if (span && datos) {
        span.textContent = datos.codigo;
        span.classList.remove('hidden');
        span.title = `${datos.codigo}: ${datos.descripcion}`;
    }
}

// Función para limpiar la selección del nomenclador
function limpiarSeleccionNomenclador() {
    if (modalNomencladorAbiertoPor) {
        datosNomencladorSeleccionados[modalNomencladorAbiertoPor] = null;
        
        // Limpiar el botón correspondiente
        let spanId;
        if (modalNomencladorAbiertoPor === 'agregar') {
            spanId = 'nomencladorSeleccionadoAgregar';
        } else if (modalNomencladorAbiertoPor === 'editar') {
            spanId = 'nomencladorSeleccionadoEditar';
        } else {
            spanId = 'nomencladorSeleccionadoCalendar';
        }
        
        const span = document.getElementById(spanId);
        if (span) {
            span.textContent = '';
            span.classList.add('hidden');
            span.title = '';
        }
    }
    
    limpiarModal();
    console.log('🧹 Selección del nomenclador limpiada');
}

// Función actualizada para obtener datos CIE-10 (ahora usa el modal)
function obtenerDatosCIE10(formType = 'agregar') {
    return datosNomencladorSeleccionados[formType];
}

// Función actualizada para limpiar campos CIE-10 (ahora usa el modal)
function limpiarCamposCIE10() {
    datosNomencladorSeleccionados.agregar = null;
    datosNomencladorSeleccionados.editar = null;
    datosNomencladorSeleccionados.calendar = null;
    
    // Limpiar botones
    const spanAgregar = document.getElementById('nomencladorSeleccionadoAgregar');
    const spanEditar = document.getElementById('nomencladorSeleccionadoEditar');
    const spanCalendar = document.getElementById('nomencladorSeleccionadoCalendar');
    
    if (spanAgregar) {
        spanAgregar.textContent = '';
        spanAgregar.classList.add('hidden');
        spanAgregar.title = '';
    }
    
    if (spanEditar) {
        spanEditar.textContent = '';
        spanEditar.classList.add('hidden');
        spanEditar.title = '';
    }
    
    if (spanCalendar) {
        spanCalendar.textContent = '';
        spanCalendar.classList.add('hidden');
        spanCalendar.title = '';
    }
    
    console.log('🧹 Todos los campos CIE-10 limpiados');
}

// Configurar event listeners para el modal del nomenclador
function configurarModalNomenclador() {
    console.log('🔧 Configurando event listeners del modal del nomenclador...');
    
    // Botones para abrir el modal
    const btnAgregar = document.getElementById('btnAbrirNomencladorAgregar');
    const btnEditar = document.getElementById('btnAbrirNomencladorEditar');
    const btnCalendar = document.getElementById('btnAbrirNomencladorCalendar');
    
    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => abrirModalNomenclador('agregar'));
        console.log('✅ Listener configurado para botón de agregar paciente');
    }
    
    if (btnEditar) {
        btnEditar.addEventListener('click', () => abrirModalNomenclador('editar'));
        console.log('✅ Listener configurado para botón de editar paciente');
    }
    
    if (btnCalendar) {
        btnCalendar.addEventListener('click', () => abrirModalNomenclador('calendar'));
        console.log('✅ Listener configurado para botón de calendario');
    }
    
    // Botones del modal
    const btnCerrar = document.getElementById('cerrarModalNomenclador');
    const btnCancelar = document.getElementById('btnCancelarNomenclador');
    const btnLimpiar = document.getElementById('btnLimpiarNomenclador');
    const btnAceptar = document.getElementById('btnAceptarNomenclador');
    
    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarModalNomenclador);
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cerrarModalNomenclador);
    }
    
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarSeleccionNomenclador);
    }
    
    if (btnAceptar) {
        btnAceptar.addEventListener('click', aceptarSeleccionModal);
    }
    
    // Dropdowns del modal
    const selectCategoria = document.getElementById('modalCategoriaCIE10');
    const selectCodigo = document.getElementById('modalCodigoCIE10');
    
    if (selectCategoria) {
        selectCategoria.addEventListener('change', (e) => {
            cargarSubcategoriasEnModal(e.target.value);
        });
        console.log('✅ Listener configurado para categoría del modal');
    }
    
    if (selectCodigo) {
        selectCodigo.addEventListener('change', (e) => {
            mostrarDescripcionEnModal(e.target.value);
        });
        console.log('✅ Listener configurado para código del modal');
    }
    
    console.log('✅ Modal del nomenclador configurado completamente');
}

// Inicializar el modal del nomenclador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        configurarModalNomenclador();
        console.log('✅ Sistema de modal del nomenclador inicializado');
    }, 1000); // Delay para asegurar que todo esté cargado
});

// Hacer disponibles las nuevas funciones globalmente
window.abrirModalNomenclador = abrirModalNomenclador;
window.cerrarModalNomenclador = cerrarModalNomenclador;
window.limpiarSeleccionNomenclador = limpiarSeleccionNomenclador;
window.configurarModalNomenclador = configurarModalNomenclador;

// === FUNCIONES PARA EDITAR PACIENTE ===

// Variables para el modal de edición
let pacienteEditandoId = null;
let pacienteEditandoRef = null;

// Mostrar/Ocultar modal de edición de paciente
window.hideEditPatientModal = function() {
    console.log('🔄 Iniciando cierre del modal de edición...');
    
    const modal = document.getElementById('editPatientModal');
    const form = document.getElementById('editPatientForm');
    
    console.log('🔍 Modal encontrado:', !!modal);
    console.log('🔍 Form encontrado:', !!form);
    
    if (modal) {
        modal.classList.add('hidden');
        // También remover estilos inline que puedan estar interfiriendo
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        console.log('✅ Modal ocultado');
    } else {
        console.error('❌ No se encontró el modal editPatientModal');
    }
    
    if (form) {
        form.reset();
        limpiarDatosFamilia('editar');
        console.log('✅ Formulario reseteado');
    } else {
        console.error('❌ No se encontró el formulario editPatientForm');
    }
    
    // Limpiar variables globales
    pacienteEditandoId = null;
    pacienteEditandoRef = null;
    
    // Limpiar datos del nomenclador
    datosNomencladorSeleccionados.editar = null;
    const spanEditar = document.getElementById('nomencladorSeleccionadoEditar');
    if (spanEditar) {
        spanEditar.textContent = '';
        spanEditar.classList.add('hidden');
        spanEditar.title = '';
    }
    
    console.log('✅ Modal de edición cerrado completamente');
};

// Función para abrir el modal de edición con los datos del paciente
window.showEditPatientModal = function(pacienteId, pacienteData) {
    console.log('✏️ Abriendo modal de edición para paciente:', pacienteId);
    console.log('📋 Datos del paciente:', pacienteData);
    
    // Verificar que el modal existe
    const modal = document.getElementById('editPatientModal');
    console.log('🔍 Modal encontrado:', !!modal);
    
    if (!modal) {
        console.error('❌ No se encontró el modal de edición');
        return;
    }
    
    pacienteEditandoId = pacienteId;
    pacienteEditandoRef = window.firebaseDB.collection('pacientes').doc(pacienteId);
    
    // Verificar que los campos existen
    const nameField = document.getElementById('editPatientName');
    const dniField = document.getElementById('editPatientDni');
    const fechaNacimientoField = document.getElementById('editPatientFechaNacimiento');
    const sexoField = document.getElementById('editPatientSexo');
    const lugarNacimientoField = document.getElementById('editPatientLugarNacimiento');
    const emailField = document.getElementById('editPatientEmail');
    const telefonoField = document.getElementById('editPatientTelefono');
    const contactoField = document.getElementById('editPatientContacto');
    const educacionField = document.getElementById('editPatientEducacion');
    const institutoField = document.getElementById('editPatientInstituto');
    const motivoField = document.getElementById('editPatientMotivo');
    
    console.log('🔍 Campos encontrados:', {
        name: !!nameField,
        dni: !!dniField,
        fechaNacimiento: !!fechaNacimientoField,
        sexo: !!sexoField,
        lugarNacimiento: !!lugarNacimientoField,
        email: !!emailField,
        telefono: !!telefonoField,
        contacto: !!contactoField,
        educacion: !!educacionField,
        instituto: !!institutoField,
        motivo: !!motivoField
    });
    
    // Prellenar los campos con los datos actuales
    if (nameField) nameField.value = pacienteData.nombre || '';
    if (dniField) dniField.value = pacienteData.dni || '';
    if (fechaNacimientoField) fechaNacimientoField.value = pacienteData.fechaNacimiento || '';
    if (sexoField) sexoField.value = pacienteData.sexo || '';
    if (lugarNacimientoField) lugarNacimientoField.value = pacienteData.lugarNacimiento || '';
    if (emailField) emailField.value = pacienteData.email || '';
    if (telefonoField) telefonoField.value = pacienteData.telefono || '';
    if (contactoField) contactoField.value = pacienteData.contacto || '';
    if (educacionField) educacionField.value = pacienteData.educacion || '';
    if (institutoField) institutoField.value = pacienteData.instituto || '';
    if (motivoField) motivoField.value = pacienteData.motivo || '';
    
    // Cargar datos de familia
    cargarDatosFamilia(pacienteData, 'editar');
    
    // Precargar datos del nomenclador CIE-10 si existen
    if (pacienteData.nomencladorCIE10) {
        datosNomencladorSeleccionados.editar = pacienteData.nomencladorCIE10;
        const spanEditar = document.getElementById('nomencladorSeleccionadoEditar');
        if (spanEditar) {
            spanEditar.textContent = pacienteData.nomencladorCIE10.codigo;
            spanEditar.classList.remove('hidden');
            spanEditar.title = `${pacienteData.nomencladorCIE10.codigo}: ${pacienteData.nomencladorCIE10.descripcion}`;
        }
    }
    
    console.log('✅ Mostrando modal...');
    modal.classList.remove('hidden');
    console.log('🔍 Clases del modal después de mostrar:', modal.classList.toString());
    
    // Verificar estilos computados
    const computedStyle = getComputedStyle(modal);
    console.log('🔍 Estilos computados del modal:', {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        zIndex: computedStyle.zIndex,
        position: computedStyle.position
    });
    
    // Forzar que el modal sea visible
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.zIndex = '99999'; // Z-index muy alto para estar por encima de todo
    
    console.log('🔧 Estilos forzados aplicados al modal');
    
    // Configurar botones de hermanos después de mostrar el modal
    setTimeout(() => configurarBotonesHermanos(), 100);
};

// Event listeners adicionales para el modal de edición
document.addEventListener('DOMContentLoaded', () => {
    // Event listener para el botón X de cerrar
    const btnCerrarModal = document.querySelector('#editPatientModal button[onclick="hideEditPatientModal()"]');
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔄 Cerrando modal por botón X');
            hideEditPatientModal();
        });
    }
    
    // Event listener para el botón Cancelar
    const btnCancelarModal = document.querySelector('#editPatientModal button[type="button"][onclick="hideEditPatientModal()"]');
    if (btnCancelarModal) {
        btnCancelarModal.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔄 Cerrando modal por botón Cancelar');
            hideEditPatientModal();
        });
    }
    
    // Event listener para cerrar al hacer clic fuera del modal
    const editPatientModal = document.getElementById('editPatientModal');
    if (editPatientModal) {
        editPatientModal.addEventListener('click', (e) => {
            if (e.target === editPatientModal) {
                console.log('🔄 Cerrando modal por clic fuera');
                hideEditPatientModal();
            }
        });
    }
});

// Event listener para el formulario de edición
const editPatientFormElement = document.getElementById('editPatientForm');
if (editPatientFormElement) {
    editPatientFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!pacienteEditandoRef) {
            console.error('❌ No hay referencia del paciente a editar');
            showMessage('Error: No se pudo identificar el paciente a editar');
            return;
        }
        
        if (!pacienteEditandoId) {
            console.error('❌ No hay ID del paciente a editar');
            showMessage('Error: No se pudo identificar el ID del paciente');
            return;
        }
        
        // Verificar que Firebase esté disponible
        if (!window.firebaseDB) {
            console.error('❌ Firebase DB no está disponible');
            showMessage('Error: Base de datos no disponible');
            return;
        }
        
        const nombre = editPatientFormElement.editPatientName.value;
        const dni = editPatientFormElement.editPatientDni.value;
        const fechaNacimiento = editPatientFormElement.editPatientFechaNacimiento.value;
        const sexo = editPatientFormElement.editPatientSexo.value;
        const lugarNacimiento = editPatientFormElement.editPatientLugarNacimiento.value;
        const email = editPatientFormElement.editPatientEmail.value;
        const telefono = editPatientFormElement.editPatientTelefono.value;
        const contacto = editPatientFormElement.editPatientContacto.value;
        const educacion = editPatientFormElement.editPatientEducacion.value;
        const instituto = editPatientFormElement.editPatientInstituto.value;
        const motivo = editPatientFormElement.editPatientMotivo.value;

        // Obtener datos de familia
        const infoPadre = {
            nombre: editPatientFormElement.editPatientPadreNombre.value,
            edad: editPatientFormElement.editPatientPadreEdad.value,
            ocupacion: editPatientFormElement.editPatientPadreOcupacion.value,
            estadoCivil: editPatientFormElement.editPatientPadreEstadoCivil.value,
            salud: editPatientFormElement.editPatientPadreSalud.value
        };

        const infoMadre = {
            nombre: editPatientFormElement.editPatientMadreNombre.value,
            edad: editPatientFormElement.editPatientMadreEdad.value,
            ocupacion: editPatientFormElement.editPatientMadreOcupacion.value,
            estadoCivil: editPatientFormElement.editPatientMadreEstadoCivil.value,
            salud: editPatientFormElement.editPatientMadreSalud.value
        };

        // Obtener datos de hermanos
        const hermanos = obtenerDatosHermanos('editar');
        
        // Obtener datos del nomenclador CIE-10 si fueron seleccionados
        const datosCIE10 = obtenerDatosCIE10('editar');
        
        // Validar que al menos el nombre esté presente
        if (!nombre || nombre.trim() === '') {
            showMessage('Error: El nombre del paciente es obligatorio');
            return;
        }
        
        try {
            console.log('💾 Actualizando datos del paciente...');
            console.log('📋 Datos a actualizar:', { 
                nombre, dni, fechaNacimiento, sexo, lugarNacimiento, 
                email, telefono, contacto, educacion, instituto, motivo 
            });
            console.log('🔍 Referencia del paciente:', pacienteEditandoRef);
            console.log('🔍 ID del paciente:', pacienteEditandoId);
            
            const updateData = {
                // Información personal
                nombre,
                dni,
                fechaNacimiento,
                sexo,
                lugarNacimiento,
                // Información de contacto
                email,
                telefono,
                contacto,
                // Información educativa
                educacion,
                instituto,
                // Motivo de consulta
                motivo,
                // Información de familia
                infoPadre,
                infoMadre,
                infoHermanos: hermanos,
                // Metadatos
                actualizado: new Date()
            };

            // Agregar o actualizar datos del nomenclador CIE-10
            if (datosCIE10) {
                updateData.nomencladorCIE10 = datosCIE10;
            }
            
            await pacienteEditandoRef.update(updateData);
            
            console.log('✅ Paciente actualizado exitosamente');
            
            // Cerrar modal
            hideEditPatientModal();
            
            // Limpiar datos del nomenclador después de guardar
            datosNomencladorSeleccionados.editar = null;
            const spanEditar = document.getElementById('nomencladorSeleccionadoEditar');
            if (spanEditar) {
                spanEditar.textContent = '';
                spanEditar.classList.add('hidden');
            }
            
            // Recargar la lista de pacientes
            const user = window.firebaseAuth.currentUser;
            if (user) {
                // Determinar qué lista recargar según el contexto
                if (isAdmin && adminPanelState.selectedUser) {
                    loadPatients(adminPanelState.selectedUser);
                } else {
                    loadPatients(user.uid);
                }
            }
            
            // Si la ficha clínica está abierta para este paciente, actualizarla
            if (fichaPacienteId === pacienteEditandoId) {
                console.log('🔄 Actualizando ficha clínica abierta...');
                const doc = await pacienteEditandoRef.get();
                if (doc.exists) {
                    const p = doc.data();
                    
                    // Calcular edad si hay fecha de nacimiento
                    let edadTexto = '';
                    if (p.fechaNacimiento) {
                        const hoy = new Date();
                        const fechaNac = new Date(p.fechaNacimiento);
                        const edad = Math.floor((hoy - fechaNac) / (365.25 * 24 * 60 * 60 * 1000));
                        edadTexto = ` (${edad} años)`;
                    }
                    
                    fichaPacienteDatos.innerHTML = `
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex-1">
                                <div class="font-bold text-[#2d3748] dark:text-gray-100 text-lg mb-2">${p.nombre || ''}${edadTexto}</div>
                                
                                <!-- Información Personal -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                    ${p.dni ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">DNI:</span> ${p.dni}</div>` : ''}
                                    ${p.fechaNacimiento ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Fecha Nac.:</span> ${new Date(p.fechaNacimiento).toLocaleDateString('es-AR')}</div>` : ''}
                                    ${p.sexo ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Sexo:</span> ${p.sexo.charAt(0).toUpperCase() + p.sexo.slice(1)}</div>` : ''}
                                    ${p.lugarNacimiento ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Lugar Nac.:</span> ${p.lugarNacimiento}</div>` : ''}
                                </div>
                                
                                <!-- Información de Contacto -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                    ${p.email ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Email:</span> ${p.email}</div>` : ''}
                                    ${p.telefono ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Teléfono:</span> ${p.telefono}</div>` : ''}
                                    ${p.contacto ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm md:col-span-2"><span class="font-semibold">Contacto Emerg.:</span> ${p.contacto}</div>` : ''}
                                </div>
                                
                                <!-- Información Educativa -->
                                ${p.educacion || p.instituto ? `
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                    ${p.educacion ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Educación:</span> ${p.educacion.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>` : ''}
                                    ${p.instituto ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Instituto:</span> ${p.instituto}</div>` : ''}
                                </div>
                                ` : ''}
                                
                                <!-- Información Familiar -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 border-t pt-3">
                                    <button onclick="abrirModalInfoPadre('${pacienteId}')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                                        👨 Info. Padre ${p.infoPadre && p.infoPadre.nombre ? '✓' : ''}
                                    </button>
                                    <button onclick="abrirModalInfoMadre('${pacienteId}')" class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                                        👩 Info. Madre ${p.infoMadre && p.infoMadre.nombre ? '✓' : ''}
                                    </button>
                                    <button onclick="abrirModalInfoHermanos('${pacienteId}')" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                                        👫 Info. Hermanos ${p.infoHermanos && p.infoHermanos.length > 0 ? '✓' : ''}
                                    </button>
                                </div>
                                
                                <!-- Motivo de Consulta -->
                                ${p.motivo ? `<div class="text-[#4b5563] dark:text-gray-200 text-sm mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><span class="font-semibold">Motivo:</span> ${p.motivo}</div>` : ''}
                                
                                <!-- Clasificación CIE-10 -->
                                ${p.nomencladorCIE10 ? `
                                <div class="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">
                                    <div class="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">📋 Clasificación CIE-10</div>
                                    <div class="text-xs text-green-600 dark:text-green-400">
                                        <div><strong>Código:</strong> ${p.nomencladorCIE10.codigo}</div>
                                        <div><strong>Categoría:</strong> ${p.nomencladorCIE10.categoriaNombre}</div>
                                        <div class="mt-1 text-green-500 dark:text-green-300">${p.nomencladorCIE10.descripcion}</div>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            <button onclick="showEditPatientModal('${pacienteId}', ${JSON.stringify(p).replace(/"/g, '&quot;')})" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1">
                                ✏️ Editar
                            </button>
                        </div>
                    `;
                }
            }
            
            showMessage('Paciente actualizado exitosamente', 'success');
            
        } catch (error) {
            console.error('❌ Error al actualizar paciente:', error);
            console.error('❌ Detalles del error:', {
                message: error.message,
                code: error.code,
                stack: error.stack,
                pacienteEditandoRef: pacienteEditandoRef,
                pacienteEditandoId: pacienteEditandoId
            });
            
            let errorMessage = 'Error al actualizar paciente: ';
            if (error.code) {
                errorMessage += `[${error.code}] `;
            }
            errorMessage += error.message || 'Error desconocido';
            
            showMessage(errorMessage);
        }
    });
}

// Función para obtener el texto del presentismo
function obtenerTextoPresentismo(presentismo) {
    const presentismoMap = {
        'presente': '🟢 Presente',
        'ausente': '🔴 Ausente',
        'desiste': '🟠 Desiste tratamiento',
        'no-admitido': '⚫ No Admitido / Derivación externa',
        'reprogramar': '⚪ Reprogramar',
        'segunda-entrevista': '⚫ Requiere segunda entrevista admisión',
        'vacaciones': '🔵 Vacaciones'
    };
    return presentismoMap[presentismo] || presentismo;
}

// Función para verificar si una sesión tiene comentarios válidos
function tieneComentariosValidos(comentario) {
    return comentario && comentario.trim() !== '' && comentario.trim() !== '<p><br></p>';
}

// Función para determinar si es la primera sesión de un paciente
async function esPrimeraSesion(pacienteId, fechaSesion) {
    try {
        const sesionesSnap = await window.firebaseDB
            .collection('pacientes')
            .doc(pacienteId)
            .collection('sesiones')
            .orderBy('fecha', 'asc')
            .get();
        
        if (sesionesSnap.empty) {
            return true; // Si no hay sesiones, la próxima será la primera
        }
        
        // Filtrar solo sesiones que tienen comentarios (no solo notas)
        const sesionesConComentarios = [];
        sesionesSnap.forEach(doc => {
            const sesionData = doc.data();
                    // Solo considerar sesiones que tienen comentarios (no vacíos)
        if (tieneComentariosValidos(sesionData.comentario)) {
                sesionesConComentarios.push({
                    id: doc.id,
                    data: sesionData,
                    fecha: new Date(sesionData.fecha).getTime()
                });
            }
        });
        
        // Si no hay sesiones con comentarios, la próxima será la primera
        if (sesionesConComentarios.length === 0) {
            return true;
        }
        
        // Ordenar por fecha y obtener la primera sesión con comentarios
        sesionesConComentarios.sort((a, b) => a.fecha - b.fecha);
        const primeraSesionConComentarios = sesionesConComentarios[0];
        const fechaActual = new Date(fechaSesion).getTime();
        
        // Es primera sesión si es la fecha más temprana de las que tienen comentarios
        return fechaActual === primeraSesionConComentarios.fecha;
    } catch (error) {
        console.error('Error verificando primera sesión:', error);
        return false;
    }
}

// Función para obtener el color de primera sesión
function getColorPrimeraSesion() {
    return '#10b981'; // Verde esmeralda para primera sesión
}

// Función para generar título de sesión con indicador de primera sesión
function generarTituloSesion(pacienteNombre, profesionalNombre, esPrimera) {
    if (esPrimera) {
        if (profesionalNombre) {
            return `🌟 Primera Sesión - ${pacienteNombre} (${profesionalNombre})`;
        } else {
            return `🌟 Primera Sesión - ${pacienteNombre}`;
        }
    } else {
        if (profesionalNombre) {
            return `${pacienteNombre} (${profesionalNombre})`;
        } else {
            return pacienteNombre;
        }
    }
}

// ===== FUNCIONES PARA MODALES DE INFORMACIÓN FAMILIAR =====

// Variables globales para manejo de información familiar
let currentPacienteId = null;
let hermanosCounter = 0;

// === MODAL INFORMACIÓN PADRE ===
window.abrirModalInfoPadre = async function(pacienteId) {
    currentPacienteId = pacienteId;
    const modal = document.getElementById('modalInfoPadre');
    modal.classList.remove('hidden');
    
    // Cargar datos existentes si los hay
    try {
        const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(pacienteId).get();
        if (pacienteDoc.exists) {
            const pacienteData = pacienteDoc.data();
            if (pacienteData.infoPadre) {
                cargarDatosPadre(pacienteData.infoPadre);
            }
        }
    } catch (error) {
        console.error('Error cargando datos del padre:', error);
    }
};

window.cerrarModalInfoPadre = function() {
    const modal = document.getElementById('modalInfoPadre');
    modal.classList.add('hidden');
    limpiarFormularioPadre();
};

function cargarDatosPadre(datosPadre) {
    document.getElementById('padreNombre').value = datosPadre.nombre || '';
    document.getElementById('padreEdad').value = datosPadre.edad || '';
    document.getElementById('padreOcupacion').value = datosPadre.ocupacion || '';
    document.getElementById('padreEstadoCivil').value = datosPadre.estadoCivil || '';
    document.getElementById('padreEducacion').value = datosPadre.educacion || '';
    document.getElementById('padreObservaciones').value = datosPadre.observaciones || '';
}

function limpiarFormularioPadre() {
    document.getElementById('formInfoPadre').reset();
}

// === MODAL INFORMACIÓN MADRE ===
window.abrirModalInfoMadre = async function(pacienteId) {
    currentPacienteId = pacienteId;
    const modal = document.getElementById('modalInfoMadre');
    modal.classList.remove('hidden');
    
    // Cargar datos existentes si los hay
    try {
        const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(pacienteId).get();
        if (pacienteDoc.exists) {
            const pacienteData = pacienteDoc.data();
            if (pacienteData.infoMadre) {
                cargarDatosMadre(pacienteData.infoMadre);
            }
        }
    } catch (error) {
        console.error('Error cargando datos de la madre:', error);
    }
};

window.cerrarModalInfoMadre = function() {
    const modal = document.getElementById('modalInfoMadre');
    modal.classList.add('hidden');
    limpiarFormularioMadre();
};

function cargarDatosMadre(datosMadre) {
    document.getElementById('madreNombre').value = datosMadre.nombre || '';
    document.getElementById('madreEdad').value = datosMadre.edad || '';
    document.getElementById('madreOcupacion').value = datosMadre.ocupacion || '';
    document.getElementById('madreEstadoCivil').value = datosMadre.estadoCivil || '';
    document.getElementById('madreEducacion').value = datosMadre.educacion || '';
    document.getElementById('madreObservaciones').value = datosMadre.observaciones || '';
}

function limpiarFormularioMadre() {
    document.getElementById('formInfoMadre').reset();
}

// === MODAL INFORMACIÓN HERMANOS ===
window.abrirModalInfoHermanos = async function(pacienteId) {
    currentPacienteId = pacienteId;
    const modal = document.getElementById('modalInfoHermanos');
    modal.classList.remove('hidden');
    
    // Cargar datos existentes si los hay
    try {
        const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(pacienteId).get();
        if (pacienteDoc.exists) {
            const pacienteData = pacienteDoc.data();
            if (pacienteData.infoHermanos && pacienteData.infoHermanos.length > 0) {
                cargarDatosHermanos(pacienteData.infoHermanos);
            } else {
                // Si no hay hermanos, agregar uno vacío por defecto
                agregarHermano();
            }
        }
    } catch (error) {
        console.error('Error cargando datos de hermanos:', error);
    }
};

window.cerrarModalInfoHermanos = function() {
    const modal = document.getElementById('modalInfoHermanos');
    modal.classList.add('hidden');
    limpiarListaHermanos();
};

window.agregarHermano = function() {
    const listaHermanos = document.getElementById('listaHermanos');
    const hermanoId = hermanosCounter++;
    
    const div = document.createElement('div');
    div.className = 'border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800';
    div.setAttribute('data-hermano-id', hermanoId);
    
    div.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h5 class="font-semibold text-gray-700 dark:text-gray-300">Hermano/a ${hermanoId + 1}</h5>
            <button type="button" onclick="eliminarHermano(${hermanoId})" class="text-red-500 hover:text-red-700 text-xl">×</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input type="text" name="hermanoNombre_${hermanoId}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-darkbg dark:text-darktext" placeholder="Nombre del hermano/a">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Edad</label>
                <input type="number" name="hermanoEdad_${hermanoId}" min="0" max="100" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-darkbg dark:text-darktext" placeholder="Edad">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ocupación/Estudios</label>
                <input type="text" name="hermanoOcupacion_${hermanoId}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-darkbg dark:text-darktext" placeholder="Estudios o trabajo">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relación</label>
                <select name="hermanoRelacion_${hermanoId}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-darkbg dark:text-darktext">
                    <option value="">Seleccionar...</option>
                    <option value="hermano">Hermano</option>
                    <option value="hermana">Hermana</option>
                    <option value="medio-hermano">Medio hermano</option>
                    <option value="media-hermana">Media hermana</option>
                </select>
            </div>
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
                <textarea name="hermanoObservaciones_${hermanoId}" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-darkbg dark:text-darktext" placeholder="Información adicional..."></textarea>
            </div>
        </div>
    `;
    
    listaHermanos.appendChild(div);
};

window.eliminarHermano = function(hermanoId) {
    const hermanoDiv = document.querySelector(`[data-hermano-id="${hermanoId}"]`);
    if (hermanoDiv) {
        hermanoDiv.remove();
    }
};

function cargarDatosHermanos(hermanos) {
    limpiarListaHermanos();
    
    hermanos.forEach((hermano, index) => {
        agregarHermano();
        const hermanoDiv = document.querySelector(`[data-hermano-id="${index}"]`);
        if (hermanoDiv) {
            hermanoDiv.querySelector(`input[name="hermanoNombre_${index}"]`).value = hermano.nombre || '';
            hermanoDiv.querySelector(`input[name="hermanoEdad_${index}"]`).value = hermano.edad || '';
            hermanoDiv.querySelector(`input[name="hermanoOcupacion_${index}"]`).value = hermano.ocupacion || '';
            hermanoDiv.querySelector(`select[name="hermanoRelacion_${index}"]`).value = hermano.relacion || '';
            hermanoDiv.querySelector(`textarea[name="hermanoObservaciones_${index}"]`).value = hermano.observaciones || '';
        }
    });
}

function limpiarListaHermanos() {
    const listaHermanos = document.getElementById('listaHermanos');
    listaHermanos.innerHTML = '';
    hermanosCounter = 0;
}

window.guardarInfoHermanos = async function() {
    if (!currentPacienteId) return;
    
    const listaHermanos = document.getElementById('listaHermanos');
    const hermanosData = [];
    
    // Recopilar datos de todos los hermanos
    const hermanoDivs = listaHermanos.querySelectorAll('[data-hermano-id]');
    hermanoDivs.forEach(div => {
        const hermanoId = div.getAttribute('data-hermano-id');
        const nombre = div.querySelector(`input[name="hermanoNombre_${hermanoId}"]`).value;
        const edad = div.querySelector(`input[name="hermanoEdad_${hermanoId}"]`).value;
        const ocupacion = div.querySelector(`input[name="hermanoOcupacion_${hermanoId}"]`).value;
        const relacion = div.querySelector(`select[name="hermanoRelacion_${hermanoId}"]`).value;
        const observaciones = div.querySelector(`textarea[name="hermanoObservaciones_${hermanoId}"]`).value;
        
        // Solo agregar si tiene al menos el nombre
        if (nombre.trim()) {
            hermanosData.push({
                nombre: nombre.trim(),
                edad: edad ? parseInt(edad) : null,
                ocupacion: ocupacion.trim(),
                relacion: relacion,
                observaciones: observaciones.trim()
            });
        }
    });
    
    try {
        await window.firebaseDB.collection('pacientes').doc(currentPacienteId).update({
            infoHermanos: hermanosData,
            modificado: new Date()
        });
        
        showMessage('✅ Información de hermanos guardada exitosamente', 'success');
        cerrarModalInfoHermanos();
        
        // Actualizar la ficha si está abierta
        if (fichaPacienteId === currentPacienteId) {
            // Recargar los datos de la ficha
            const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(currentPacienteId).get();
            if (pacienteDoc.exists) {
                // Actualizar solo los botones con el indicador ✓
                actualizarIndicadoresFamilia(pacienteDoc.data());
            }
        }
    } catch (error) {
        console.error('Error guardando información de hermanos:', error);
        showMessage('❌ Error al guardar información de hermanos', 'error');
    }
};

// === EVENT LISTENERS PARA FORMULARIOS ===
document.addEventListener('DOMContentLoaded', function() {
    // Form Padre
    const formPadre = document.getElementById('formInfoPadre');
    if (formPadre) {
        formPadre.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!currentPacienteId) return;
            
            const formData = new FormData(formPadre);
            const datosPadre = {
                nombre: formData.get('padreNombre')?.trim() || '',
                edad: formData.get('padreEdad') ? parseInt(formData.get('padreEdad')) : null,
                ocupacion: formData.get('padreOcupacion')?.trim() || '',
                estadoCivil: formData.get('padreEstadoCivil') || '',
                educacion: formData.get('padreEducacion') || '',
                observaciones: formData.get('padreObservaciones')?.trim() || ''
            };
            
            try {
                await window.firebaseDB.collection('pacientes').doc(currentPacienteId).update({
                    infoPadre: datosPadre,
                    modificado: new Date()
                });
                
                showMessage('✅ Información del padre guardada exitosamente', 'success');
                cerrarModalInfoPadre();
                
                // Actualizar la ficha si está abierta
                if (fichaPacienteId === currentPacienteId) {
                    // Recargar los datos de la ficha
                    const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(currentPacienteId).get();
                    if (pacienteDoc.exists) {
                        actualizarIndicadoresFamilia(pacienteDoc.data());
                    }
                }
            } catch (error) {
                console.error('Error guardando información del padre:', error);
                showMessage('❌ Error al guardar información del padre', 'error');
            }
        });
    }
    
    // Form Madre
    const formMadre = document.getElementById('formInfoMadre');
    if (formMadre) {
        formMadre.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!currentPacienteId) return;
            
            const formData = new FormData(formMadre);
            const datosMadre = {
                nombre: formData.get('madreNombre')?.trim() || '',
                edad: formData.get('madreEdad') ? parseInt(formData.get('madreEdad')) : null,
                ocupacion: formData.get('madreOcupacion')?.trim() || '',
                estadoCivil: formData.get('madreEstadoCivil') || '',
                educacion: formData.get('madreEducacion') || '',
                observaciones: formData.get('madreObservaciones')?.trim() || ''
            };
            
            try {
                await window.firebaseDB.collection('pacientes').doc(currentPacienteId).update({
                    infoMadre: datosMadre,
                    modificado: new Date()
                });
                
                showMessage('✅ Información de la madre guardada exitosamente', 'success');
                cerrarModalInfoMadre();
                
                // Actualizar la ficha si está abierta
                if (fichaPacienteId === currentPacienteId) {
                    // Recargar los datos de la ficha
                    const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(currentPacienteId).get();
                    if (pacienteDoc.exists) {
                        actualizarIndicadoresFamilia(pacienteDoc.data());
                    }
                }
            } catch (error) {
                console.error('Error guardando información de la madre:', error);
                showMessage('❌ Error al guardar información de la madre', 'error');
            }
        });
    }
});

// Función para actualizar solo los indicadores de familia sin recargar toda la ficha
function actualizarIndicadoresFamilia(pacienteData) {
    // Esta función se ejecuta para actualizar los indicadores ✓ en los botones
    // sin necesidad de recargar toda la ficha clínica
    console.log('🔄 Actualizando indicadores de información familiar');
}

console.log('✅ Funciones de información familiar cargadas correctamente');

// ===== FUNCIONES PARA MODAL DE VERSIÓN =====

// Variable para controlar si el usuario es administrador
let isUserAdmin = false;

// Función para verificar si el usuario es administrador
async function verificarSiEsAdmin(uid) {
    try {
        const userDoc = await window.firebaseDB.collection('usuarios').doc(uid).get();
        return userDoc.exists && userDoc.data().isAdmin === true;
    } catch (error) {
        console.error('Error verificando si es admin:', error);
        return false;
    }
}

// Función para mostrar/ocultar el botón de versión
function actualizarVisibilidadVersion(esAdmin) {
    console.log('🎛️ Actualizando visibilidad de versión. Es admin:', esAdmin);
    
    const versionBtn = document.getElementById('versionBtn'); // Footer landing page
    const versionBtnDashboard = document.getElementById('versionBtnDashboard'); // Dashboard
    
    console.log('🔍 Elementos encontrados:', {
        versionBtn: !!versionBtn,
        versionBtnDashboard: !!versionBtnDashboard
    });
    
    if (versionBtn) {
        if (esAdmin) {
            versionBtn.classList.remove('hidden');
            console.log('✅ Botón footer visible');
        } else {
            versionBtn.classList.add('hidden');
            console.log('❌ Botón footer oculto');
        }
    }
    
    if (versionBtnDashboard) {
        if (esAdmin) {
            versionBtnDashboard.classList.remove('hidden');
            console.log('✅ Botón dashboard visible');
        } else {
            versionBtnDashboard.classList.add('hidden');
            console.log('❌ Botón dashboard oculto');
        }
    } else {
        console.log('⚠️ Elemento versionBtnDashboard no encontrado');
        
        // Reintentar después de un momento si es admin
        if (esAdmin) {
            console.log('🔄 Reintentando en 500ms...');
            setTimeout(() => {
                const versionBtnDashboardRetry = document.getElementById('versionBtnDashboard');
                if (versionBtnDashboardRetry) {
                    versionBtnDashboardRetry.classList.remove('hidden');
                    console.log('✅ Botón dashboard visible (segundo intento)');
                } else {
                    console.log('❌ Elemento versionBtnDashboard aún no encontrado');
                }
            }, 500);
        }
    }
}

// Función para abrir el modal de versión
window.abrirModalVersion = function() {
    console.log('🚀 abrirModalVersion() ejecutándose');
    console.log('🚀 Stack trace:', new Error().stack);
    
    // Cerrar TODOS los modales agresivamente
    const modalBackup = document.getElementById('modalBackupPacientes');
    if (modalBackup) {
        console.log('🚀 Cerrando modal de backup AGRESIVAMENTE antes de abrir modal de versión');
        modalBackup.classList.add('hidden');
        modalBackup.style.display = 'none !important';
        modalBackup.style.visibility = 'hidden !important';
        modalBackup.style.opacity = '0 !important';
        modalBackup.style.zIndex = '-1';
        
        // Forzar que el modal se mueva fuera de la vista
        modalBackup.style.transform = 'translate(-9999px, -9999px)';
        modalBackup.style.pointerEvents = 'none';
    }
    
    // Cerrar modal de ver backup si existe
    const modalVerBackup = document.getElementById('modalVerBackup');
    if (modalVerBackup) {
        modalVerBackup.classList.add('hidden');
        modalVerBackup.style.display = 'none';
        modalVerBackup.style.visibility = 'hidden';
        modalVerBackup.style.opacity = '0';
    }
    
    // Cerrar loader si existe
    const loaderVerBackup = document.getElementById('loaderVerBackup');
    if (loaderVerBackup) {
        loaderVerBackup.classList.add('hidden');
        loaderVerBackup.style.display = 'none';
        loaderVerBackup.style.visibility = 'hidden';
        loaderVerBackup.style.opacity = '0';
    }
    
    // Cerrar menú de foto de perfil si está abierto
    const profilePhotoMenu = document.getElementById('profilePhotoMenu');
    if (profilePhotoMenu && !profilePhotoMenu.classList.contains('hidden')) {
        console.log('🚀 Cerrando menú de foto de perfil antes de abrir modal de versión');
        profilePhotoMenu.classList.add('hidden');
        profilePhotoMenu.style.display = 'none';
        profilePhotoMenu.style.visibility = 'hidden';
        profilePhotoMenu.style.opacity = '0';
    }
    
    // Esperar un poco antes de abrir el modal de versión para asegurar que todo esté cerrado
    setTimeout(() => {
        const modal = document.getElementById('modalVersion');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.zIndex = '99999';
            console.log('🚀 Modal de versión abierto');
        } else {
            console.error('🚀 Modal de versión no encontrado');
        }
    }, 50);
    
    // Verificar si el botón de backup está siendo activado
    const btnBackup = document.getElementById('btnBackupPacientes');
    if (btnBackup) {
        console.log('🚀 Estado del botón de backup después de abrir modal de versiones:', {
            visible: !btnBackup.classList.contains('hidden'),
            display: window.getComputedStyle(btnBackup).display
        });
    }
};

// Función para cerrar el modal de versión
window.cerrarModalVersion = function() {
    const modal = document.getElementById('modalVersion');
    if (modal) {
        modal.classList.add('hidden');
        console.log('🚀 Modal de versión cerrado');
        
        // Restaurar estado normal del modal de backup (sin mostrarlo, solo limpiar estilos agresivos)
        const modalBackup = document.getElementById('modalBackupPacientes');
        if (modalBackup) {
            modalBackup.classList.add('hidden');
            modalBackup.style.display = 'none';
            modalBackup.style.visibility = 'hidden';
            modalBackup.style.opacity = '0';
            modalBackup.style.zIndex = '';
            modalBackup.style.transform = '';
            modalBackup.style.pointerEvents = '';
        }
    }
};

// Función para inicializar la funcionalidad de versión cuando el usuario se autentica
async function inicializarVersion(user) {
    console.log('🚀 Inicializando versión para usuario:', user?.email);
    
    if (user && user.uid) {
        console.log('🔍 Verificando si es administrador...');
        isUserAdmin = await verificarSiEsAdmin(user.uid);
        console.log('👤 Es administrador:', isUserAdmin);
        
        actualizarVisibilidadVersion(isUserAdmin);
        
        if (isUserAdmin) {
            console.log('🔧 Usuario administrador detectado - Funcionalidades de versión habilitadas');
        } else {
            console.log('👨‍💼 Usuario normal - Versión oculta');
        }
    } else {
        // Usuario no autenticado - ocultar versión
        console.log('❌ Usuario no autenticado - Ocultando versión');
        actualizarVisibilidadVersion(false);
        isUserAdmin = false;
    }
}

// La inicialización de versión se llamará desde showDashboard directamente

// Event listener para cerrar modal con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modalVersion = document.getElementById('modalVersion');
        if (modalVersion && !modalVersion.classList.contains('hidden')) {
            cerrarModalVersion();
        }
    }
});

// Event listener para cerrar modal haciendo clic fuera
document.addEventListener('click', function(e) {
    const modalVersion = document.getElementById('modalVersion');
    if (modalVersion && !modalVersion.classList.contains('hidden')) {
        // Si el clic fue en el fondo del modal (no en el contenido)
        if (e.target === modalVersion) {
            cerrarModalVersion();
        }
    }
});

console.log('🚀 Funciones de versión cargadas correctamente');

// === FOTO DE PERFIL DEL TERAPEUTA ===
function inicializarFotoPerfil() {
  console.log('[DEBUG] Inicializando funcionalidad de foto de perfil...');
  const profileAvatar = document.getElementById('profileAvatar');
  const changeProfilePhotoBtn = document.getElementById('changeProfilePhotoBtn');
  const profilePhotoInput = document.getElementById('profilePhotoInput');
  const profilePhotoMenu = document.getElementById('profilePhotoMenu');
  const optionUploadPhoto = document.getElementById('optionUploadPhoto');
  const optionTakePhoto = document.getElementById('optionTakePhoto');
  const cameraModal = document.getElementById('cameraModal');
  const closeCameraModal = document.getElementById('closeCameraModal');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const takePhotoBtn = document.getElementById('takePhotoBtn');
  const confirmPhotoBtn = document.getElementById('confirmPhotoBtn');
  const retakePhotoBtn = document.getElementById('retakePhotoBtn');
  
  console.log('[DEBUG] Elementos encontrados:', {
    profileAvatar: !!profileAvatar,
    changeProfilePhotoBtn: !!changeProfilePhotoBtn,
    profilePhotoInput: !!profilePhotoInput,
    profilePhotoMenu: !!profilePhotoMenu,
    optionUploadPhoto: !!optionUploadPhoto,
    optionTakePhoto: !!optionTakePhoto,
    cameraModal: !!cameraModal,
    closeCameraModal: !!closeCameraModal,
    cameraVideo: !!cameraVideo,
    cameraCanvas: !!cameraCanvas,
    takePhotoBtn: !!takePhotoBtn,
    confirmPhotoBtn: !!confirmPhotoBtn,
    retakePhotoBtn: !!retakePhotoBtn
  });

  let cameraStream = null;
  let photoBlob = null;

  // Mostrar menú al hacer clic en el ícono de cámara
  if (changeProfilePhotoBtn && profilePhotoMenu) {
    console.log('[DEBUG] Configurando event listener para changeProfilePhotoBtn');
    changeProfilePhotoBtn.addEventListener('click', (e) => {
      console.log('[DEBUG] Click en botón de cambiar foto detectado');
      e.stopPropagation();
      
      const isCurrentlyHidden = profilePhotoMenu.classList.contains('hidden');
      profilePhotoMenu.classList.toggle('hidden');
      console.log('[DEBUG] Menu visibility toggled, hidden?', profilePhotoMenu.classList.contains('hidden'));
      
      if (isCurrentlyHidden) {
        // Mostrar el menú
        // Posicionar el menú debajo del botón y asegurar visibilidad
        const rect = changeProfilePhotoBtn.getBoundingClientRect();
        profilePhotoMenu.style.position = 'fixed';
        profilePhotoMenu.style.top = rect.bottom + 8 + 'px';
        profilePhotoMenu.style.left = rect.left + 'px';
        profilePhotoMenu.style.zIndex = '99999';
        profilePhotoMenu.style.display = 'block';
        profilePhotoMenu.style.visibility = 'visible';
        profilePhotoMenu.style.opacity = '1';
        
        // Aplicar estilos apropiados para tema oscuro
        const isDarkMode = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
        profilePhotoMenu.style.backgroundColor = isDarkMode ? '#232b3b' : 'white';
        profilePhotoMenu.style.border = isDarkMode ? '1px solid #313a4d' : '1px solid #e5e7eb';
        profilePhotoMenu.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        profilePhotoMenu.style.borderRadius = '8px';
        profilePhotoMenu.style.minWidth = '192px'; // w-48 = 192px
        
        // Mover el menú al final del body para asegurar visibilidad
        document.body.appendChild(profilePhotoMenu);
        
        // Asegurar que los botones tengan los colores correctos
        const uploadBtn = profilePhotoMenu.querySelector('#optionUploadPhoto');
        const takePhotoBtn = profilePhotoMenu.querySelector('#optionTakePhoto');
        
        if (uploadBtn) {
          uploadBtn.style.color = isDarkMode ? 'white' : '#1f2937';
          uploadBtn.style.backgroundColor = 'transparent';
        }
        
        if (takePhotoBtn) {
          takePhotoBtn.style.color = isDarkMode ? 'white' : '#1f2937';
          takePhotoBtn.style.backgroundColor = 'transparent';
        }
      } else {
        // Ocultar el menú
        profilePhotoMenu.style.display = 'none';
        profilePhotoMenu.style.visibility = 'hidden';
        profilePhotoMenu.style.opacity = '0';
      }
      
      console.log('[DEBUG] Menu positioned at:', {
        top: profilePhotoMenu.style.top,
        left: profilePhotoMenu.style.left,
        display: profilePhotoMenu.style.display,
        zIndex: profilePhotoMenu.style.zIndex
      });
    });
    // Ocultar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!profilePhotoMenu.contains(e.target) && e.target !== changeProfilePhotoBtn) {
        profilePhotoMenu.classList.add('hidden');
        profilePhotoMenu.style.display = 'none';
        profilePhotoMenu.style.visibility = 'hidden';
        profilePhotoMenu.style.opacity = '0';
      }
    });
  }

  // Opción: Subir foto (abre input file)
  if (optionUploadPhoto && profilePhotoInput) {
    console.log('[DEBUG] Configurando event listener para optionUploadPhoto');
    optionUploadPhoto.addEventListener('click', () => {
      console.log('[DEBUG] Click en Subir foto detectado');
      profilePhotoMenu.classList.add('hidden');
      profilePhotoMenu.style.display = 'none';
      profilePhotoMenu.style.visibility = 'hidden';
      profilePhotoMenu.style.opacity = '0';
      profilePhotoInput.click();
    });
  } else {
    console.log('[DEBUG] optionUploadPhoto o profilePhotoInput no encontrados');
  }
  
  // Debug específico para optionTakePhoto
  console.log('[DEBUG] optionTakePhoto element:', optionTakePhoto);
  console.log('[DEBUG] cameraModal element:', cameraModal);

  // Opción: Tomar foto (abre modal de cámara)
  console.log('[DEBUG] Elementos de cámara encontrados:', {
    optionTakePhoto: !!optionTakePhoto,
    cameraModal: !!cameraModal,
    profilePhotoMenu: !!profilePhotoMenu
  });
  
  if (optionTakePhoto && cameraModal) {
    console.log('[DEBUG] Configurando event listener para optionTakePhoto');
    optionTakePhoto.addEventListener('click', async () => {
      console.log('[DEBUG] Click en Tomar foto detectado');
      profilePhotoMenu.classList.add('hidden');
      profilePhotoMenu.style.display = 'none';
      profilePhotoMenu.style.visibility = 'hidden';
      profilePhotoMenu.style.opacity = '0';
      cameraModal.classList.remove('hidden');
      cameraModal.style.display = 'flex';
      cameraModal.style.visibility = 'visible';
      cameraModal.style.opacity = '1';
      cameraModal.style.zIndex = '99999';
      
      // Forzar repaint: quitar y volver a agregar el modal al body
      const parentCamera = cameraModal.parentNode;
      parentCamera.removeChild(cameraModal);
      document.body.appendChild(cameraModal);
      
      console.log('[DEBUG] Modal de cámara después de mostrar:', cameraModal.classList.toString());
      console.log('[DEBUG] Modal de cámara display:', window.getComputedStyle(cameraModal).display);
      console.log('[DEBUG] Modal de cámara z-index:', window.getComputedStyle(cameraModal).zIndex);
      
      cameraCanvas.classList.add('hidden');
      confirmPhotoBtn.classList.add('hidden');
      retakePhotoBtn.classList.add('hidden');
      takePhotoBtn.classList.remove('hidden');
      // Iniciar cámara
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraVideo.srcObject = cameraStream;
        cameraVideo.play();
      } catch (err) {
        showMessage('No se pudo acceder a la cámara: ' + err.message, 'error');
        cameraModal.classList.add('hidden');
        cameraModal.style.display = 'none';
        cameraModal.style.visibility = 'hidden';
        cameraModal.style.opacity = '0';
      }
    });
  }

  // Cerrar modal de cámara
  if (closeCameraModal && cameraModal) {
    closeCameraModal.addEventListener('click', () => {
      cameraModal.classList.add('hidden');
      cameraModal.style.display = 'none';
      cameraModal.style.visibility = 'hidden';
      cameraModal.style.opacity = '0';
      
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
      }
      cameraVideo.srcObject = null;
      cameraCanvas.classList.add('hidden');
      confirmPhotoBtn.classList.add('hidden');
      retakePhotoBtn.classList.add('hidden');
      takePhotoBtn.classList.remove('hidden');
    });
  }

  // Tomar foto
  if (takePhotoBtn && cameraVideo && cameraCanvas) {
    takePhotoBtn.addEventListener('click', () => {
      const ctx = cameraCanvas.getContext('2d');
      cameraCanvas.width = cameraVideo.videoWidth;
      cameraCanvas.height = cameraVideo.videoHeight;
      ctx.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
      cameraCanvas.classList.remove('hidden');
      cameraVideo.classList.add('hidden');
      takePhotoBtn.classList.add('hidden');
      confirmPhotoBtn.classList.remove('hidden');
      retakePhotoBtn.classList.remove('hidden');
      // Convertir a blob para subir luego
      cameraCanvas.toBlob(blob => {
        photoBlob = blob;
      }, 'image/jpeg', 0.95);
    });
  }

  // Repetir foto
  if (retakePhotoBtn && cameraVideo && cameraCanvas) {
    retakePhotoBtn.addEventListener('click', () => {
      cameraCanvas.classList.add('hidden');
      cameraVideo.classList.remove('hidden');
      takePhotoBtn.classList.remove('hidden');
      confirmPhotoBtn.classList.add('hidden');
      retakePhotoBtn.classList.add('hidden');
      photoBlob = null;
    });
  }

  // Confirmar y subir foto tomada
  if (confirmPhotoBtn) {
    confirmPhotoBtn.addEventListener('click', async () => {
      if (!photoBlob) return;
      const user = window.firebaseAuth.currentUser;
      if (!user) {
        showMessage('Debes iniciar sesión para cambiar tu foto de perfil', 'error');
        return;
      }
      // Validar tamaño (2MB)
      if (photoBlob.size > 2 * 1024 * 1024) {
        showMessage('La foto es demasiado grande (máx 2MB)', 'error');
        return;
      }
      try {
        // Subir a Storage
        const storageRef = window.firebaseStorage.ref(`usuarios_fotos/${user.uid}.jpg`);
        await storageRef.put(photoBlob);
        const url = await storageRef.getDownloadURL();
        // Guardar en Firestore
        await window.firebaseDB.collection('usuarios').doc(user.uid).set({ photoURL: url }, { merge: true });
        // Actualizar avatar en pantalla
        if (profileAvatar) profileAvatar.src = url;
        showMessage('Foto de perfil actualizada', 'success');
        // Cerrar modal y detener cámara
        cameraModal.classList.add('hidden');
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          cameraStream = null;
        }
        cameraVideo.srcObject = null;
        cameraCanvas.classList.add('hidden');
        confirmPhotoBtn.classList.add('hidden');
        retakePhotoBtn.classList.add('hidden');
        takePhotoBtn.classList.remove('hidden');
      } catch (err) {
        showMessage('Error al subir la foto: ' + err.message, 'error');
      }
    });
  }

  // Validación y vista previa para input file
  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      // Validar tipo y tamaño
      if (!file.type.startsWith('image/')) {
        showMessage('Solo se permiten imágenes', 'error');
        profilePhotoInput.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showMessage('La imagen es demasiado grande (máx 2MB)', 'error');
        profilePhotoInput.value = '';
        return;
      }
      // Vista previa
      const reader = new FileReader();
      reader.onload = function(ev) {
        if (profileAvatar) profileAvatar.src = ev.target.result;
      };
      reader.readAsDataURL(file);
      // Subir a Firebase Storage y guardar en Firestore
      const user = window.firebaseAuth.currentUser;
      if (!user) {
        showMessage('Debes iniciar sesión para cambiar tu foto de perfil', 'error');
        return;
      }
      try {
        const storageRef = window.firebaseStorage.ref(`usuarios_fotos/${user.uid}.jpg`);
        await storageRef.put(file);
        const url = await storageRef.getDownloadURL();
        await window.firebaseDB.collection('usuarios').doc(user.uid).set({ photoURL: url }, { merge: true });
        if (profileAvatar) profileAvatar.src = url;
        showMessage('Foto de perfil actualizada', 'success');
      } catch (err) {
        showMessage('Error al subir la foto: ' + err.message, 'error');
      }
    });
  }
}

// === FUNCIONES PARA DATOS DE FAMILIA ===

// Función para obtener datos de hermanos del formulario
function obtenerDatosHermanos(formType) {
    const container = document.getElementById(formType === 'agregar' ? 'hermanosContainer' : 'hermanosContainerEditar');
    if (!container) return [];
    
    const hermanos = [];
    const hermanoDivs = container.querySelectorAll('.hermano-item');
    
    hermanoDivs.forEach((div, index) => {
        const hermano = {
            nombre: div.querySelector('.hermano-nombre').value,
            edad: div.querySelector('.hermano-edad').value,
            ocupacion: div.querySelector('.hermano-ocupacion').value,
            estadoCivil: div.querySelector('.hermano-estado-civil').value,
            salud: div.querySelector('.hermano-salud').value
        };
        
        // Solo agregar si tiene al menos nombre
        if (hermano.nombre.trim()) {
            hermanos.push(hermano);
        }
    });
    
    return hermanos;
}

// Función para agregar un hermano al formulario
// Variables para el estado de los hermanos

let modoFormulario = 'agregar'; // Puede ser 'agregar' o 'editar'

// Función para abrir el modal de información de un hermano
function abrirModalInfoHermano(modo, index = -1) {
    const modal = document.getElementById('modalInfoHermano');
    const form = document.getElementById('formInfoHermano');
    
    if (!modal || !form) return;

    form.reset();
    document.getElementById('hermanoIndex').value = index;

    if (modo === 'editar' && index > -1 && hermanosData[index]) {
        const hermano = hermanosData[index];
        document.getElementById('hermanoNombre').value = hermano.nombre || '';
        document.getElementById('hermanoEdad').value = hermano.edad || '';
        document.getElementById('hermanoOcupacion').value = hermano.ocupacion || '';
        document.getElementById('hermanoObservaciones').value = hermano.observaciones || '';
    }

    modal.classList.remove('hidden');
}

// Función para cerrar el modal de información de un hermano
function cerrarModalInfoHermano() {
    const modal = document.getElementById('modalInfoHermano');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Manejar el envío del formulario de hermano
document.addEventListener('DOMContentLoaded', function() {
    const formInfoHermano = document.getElementById('formInfoHermano');
    if (formInfoHermano) {
        formInfoHermano.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const index = parseInt(document.getElementById('hermanoIndex').value, 10);
            const hermano = {
                nombre: document.getElementById('hermanoNombre').value,
                edad: document.getElementById('hermanoEdad').value,
                ocupacion: document.getElementById('hermanoOcupacion').value,
                observaciones: document.getElementById('hermanoObservaciones').value
            };

            if (index > -1) {
                // Editar
                hermanosData[index] = hermano;
            } else {
                // Agregar
                hermanosData.push(hermano);
            }

            renderizarHermanos();
            cerrarModalInfoHermano();
        });
    }
});

// Renderizar la lista de hermanos en el formulario principal
function renderizarHermanos() {
    const containerId = modoFormulario === 'agregar' ? 'hermanosContainer' : 'hermanosContainerEditar';
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    hermanosData.forEach((hermano, index) => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded';
        div.innerHTML = `
            <span>${hermano.nombre} (${hermano.edad} años)</span>
            <div>
                <button type="button" onclick="abrirModalInfoHermano('editar', ${index})" class="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
                <button type="button" onclick="eliminarHermano(${index})" class="text-red-500 hover:text-red-700">Eliminar</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Eliminar un hermano de la lista
function eliminarHermano(index) {
    hermanosData.splice(index, 1);
    renderizarHermanos();
}



// Función para eliminar un hermano del formulario


function configurarBotonesHermanos() {
    // Esta función puede ser usada para configurar listeners adicionales si fuera necesario
}



// También configurar cuando se abren los modales
window.configurarBotonesHermanos = configurarBotonesHermanos;

// Hacer las funciones disponibles globalmente
window.agregarHermano = agregarHermano;
window.eliminarHermano = eliminarHermano;
window.limpiarDatosFamilia = limpiarDatosFamilia;
window.cargarDatosFamilia = cargarDatosFamilia;
window.obtenerDatosHermanos = obtenerDatosHermanos;

// Función de debug para verificar botones
window.debugBotonesHermanos = function() {
    console.log('🔍 === DEBUG BOTONES HERMANOS ===');
    const btnAgregar = document.getElementById('btnAgregarHermano');
    const btnAgregarEditar = document.getElementById('btnAgregarHermanoEditar');
    
    console.log('Botón agregar encontrado:', !!btnAgregar);
    console.log('Botón agregar editar encontrado:', !!btnAgregarEditar);
    
    if (btnAgregar) {
        console.log('Event listeners del botón agregar:', btnAgregar.onclick);
    }
    
    if (btnAgregarEditar) {
        console.log('Event listeners del botón agregar editar:', btnAgregarEditar.onclick);
    }
    
    console.log('Función agregarHermano disponible:', typeof agregarHermano);
    console.log('Función configurarBotonesHermanos disponible:', typeof configurarBotonesHermanos);
};

function limpiarDatosFamilia(tipo) {
    // Limpiar campos de padre
    const padrePrefix = tipo === 'agregar' ? 'patientPadre' : 'editPatientPadre';
    const madrePrefix = tipo === 'agregar' ? 'patientMadre' : 'editPatientMadre';
    const padreCampos = ['Nombre', 'Edad', 'Ocupacion', 'EstadoCivil', 'Salud'];
    const madreCampos = ['Nombre', 'Edad', 'Ocupacion', 'EstadoCivil', 'Salud'];
    padreCampos.forEach(campo => {
        const input = document.getElementById(`${padrePrefix}${campo}`);
        if (input) input.value = '';
    });
    madreCampos.forEach(campo => {
        const input = document.getElementById(`${madrePrefix}${campo}`);
        if (input) input.value = '';
    });
    // Limpiar hermanos
    const hermanosContainer = document.getElementById(tipo === 'agregar' ? 'hermanosContainer' : 'hermanosContainerEditar');
    if (hermanosContainer) hermanosContainer.innerHTML = '';
    if (typeof hermanosData !== 'undefined') hermanosData = [];
    if (typeof renderizarHermanos === 'function') renderizarHermanos();
}

// Placeholder para evitar error si no está definida
function cargarDatosFamilia(pacienteData, modo) {
    // Esta función puede ser implementada para cargar datos de familia en el formulario de edición
    // Por ahora no hace nada
}

// (Bloque duplicado eliminado para evitar error de referencia a cargarPacientesBackup)

// === BACKUP MODAL LOGIC ===
window.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] DOMContentLoaded ejecutándose para backup modal');
    const btnBackup = document.getElementById('btnBackupPacientes');
    const modalBackup = document.getElementById('modalBackupPacientes');
    const btnCerrarModalBackup = document.getElementById('btnCerrarModalBackup');
    const btnCancelarBackup = document.getElementById('btnCancelarBackup');
    const btnDescargarBackup = document.getElementById('btnDescargarBackup');
    const btnVerBackup = document.getElementById('btnVerBackup');
    const btnVerBackupSinNotas = document.getElementById('btnVerBackupSinNotas');
    const btnDescargarBackupSinNotas = document.getElementById('btnDescargarBackupSinNotas');
    const inputBuscarPacienteBackup = document.getElementById('inputBuscarPacienteBackup');
    const listaPacientesBackup = document.getElementById('listaPacientesBackup');
    const checkTodosBackup = document.getElementById('checkTodosBackup');
    const modalVerBackup = document.getElementById('modalVerBackup');
    const btnCerrarModalVerBackup = document.getElementById('btnCerrarModalVerBackup');
    const btnCerrarVerBackup = document.getElementById('btnCerrarVerBackup');
    const contenidoVerBackup = document.getElementById('contenidoVerBackup');

    console.log('[DEBUG] Elementos encontrados:', {
        btnBackup: !!btnBackup,
        modalBackup: !!modalBackup,
        btnVerBackup: !!btnVerBackup,
        btnVerBackupSinNotas: !!btnVerBackupSinNotas,
        btnDescargarBackupSinNotas: !!btnDescargarBackupSinNotas,
        modalVerBackup: !!modalVerBackup,
        contenidoVerBackup: !!contenidoVerBackup
    });

    let pacientesBackupData = [];
    let pacientesBackupFiltrados = [];
    let pacientesBackupSeleccionados = new Set();

    function renderizarListaPacientesBackup() {
        const listaPacientesBackup = document.getElementById('listaPacientesBackup');
        if (!listaPacientesBackup) {
            console.error('No se encontró el div listaPacientesBackup');
            return;
        }
        listaPacientesBackup.innerHTML = '';
        if (pacientesBackupFiltrados.length === 0) {
            listaPacientesBackup.innerHTML = '<div class="text-gray-300 dark:text-gray-300 text-center">No se encontraron pacientes.</div>';
            return;
        }
        
        // Agrupar pacientes por profesional
        const pacientesPorProfesional = {};
        pacientesBackupFiltrados.forEach(p => {
            if (!pacientesPorProfesional[p.profesional]) {
                pacientesPorProfesional[p.profesional] = [];
            }
            pacientesPorProfesional[p.profesional].push(p);
        });
        
        // Renderizar por profesional con checkbox
        Object.entries(pacientesPorProfesional).forEach(([profesional, pacientes]) => {
            // Verificar si todos los pacientes del profesional están seleccionados
            const todosPacientesSeleccionados = pacientes.every(p => pacientesBackupSeleccionados.has(p.id));
            
            // Div del profesional con checkbox
            const profDiv = document.createElement('div');
            profDiv.className = 'flex items-center gap-2 mt-3 mb-2';
            profDiv.innerHTML = `
                <input type="checkbox" class="checkProfesionalBackup" data-profesional="${profesional}" ${todosPacientesSeleccionados ? 'checked' : ''}>
                <span class="font-bold text-primary-700 dark:text-primary-300">${profesional}</span>
            `;
            listaPacientesBackup.appendChild(profDiv);
            
            // Pacientes del profesional (con indentación)
            pacientes.forEach(p => {
                const div = document.createElement('div');
                div.className = 'flex items-center gap-2 mb-1 ml-6';
                div.innerHTML = `<input type="checkbox" class="checkPacienteBackup" data-id="${p.id}" data-profesional="${profesional}" ${pacientesBackupSeleccionados.has(p.id) ? 'checked' : ''}> <span class="text-gray-100 dark:text-gray-100">${p.nombre}</span>`;
                listaPacientesBackup.appendChild(div);
            });
        });
        
        // Listeners para checkboxes de profesionales
        listaPacientesBackup.querySelectorAll('.checkProfesionalBackup').forEach(chkProf => {
            chkProf.addEventListener('change', (e) => {
                const profesional = chkProf.getAttribute('data-profesional');
                const pacientesDelProfesional = pacientesBackupFiltrados.filter(p => p.profesional === profesional);
                
                if (chkProf.checked) {
                    // Seleccionar todos los pacientes del profesional
                    pacientesDelProfesional.forEach(p => {
                        pacientesBackupSeleccionados.add(p.id);
                    });
                } else {
                    // Deseleccionar todos los pacientes del profesional
                    pacientesDelProfesional.forEach(p => {
                        pacientesBackupSeleccionados.delete(p.id);
                    });
                }
                
                // Actualizar checkboxes de pacientes
                listaPacientesBackup.querySelectorAll(`.checkPacienteBackup[data-profesional="${profesional}"]`).forEach(chkPac => {
                    chkPac.checked = chkProf.checked;
                });
                
                // Actualizar checkbox "Seleccionar todos"
                actualizarCheckboxTodos();
            });
        });
        
        // Listeners para checkboxes de pacientes
        listaPacientesBackup.querySelectorAll('.checkPacienteBackup').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const id = chk.getAttribute('data-id');
                const profesional = chk.getAttribute('data-profesional');
                
                if (chk.checked) {
                    pacientesBackupSeleccionados.add(id);
                } else {
                    pacientesBackupSeleccionados.delete(id);
                }
                
                // Actualizar checkbox del profesional
                const pacientesDelProfesional = pacientesBackupFiltrados.filter(p => p.profesional === profesional);
                const todosPacientesSeleccionados = pacientesDelProfesional.every(p => pacientesBackupSeleccionados.has(p.id));
                const checkProfesional = listaPacientesBackup.querySelector(`.checkProfesionalBackup[data-profesional="${profesional}"]`);
                if (checkProfesional) {
                    checkProfesional.checked = todosPacientesSeleccionados;
                }
                
                // Actualizar checkbox "Seleccionar todos"
                actualizarCheckboxTodos();
            });
        });
    }
    
    // Función auxiliar para actualizar el checkbox "Seleccionar todos"
    function actualizarCheckboxTodos() {
        const checkTodosBackup = document.getElementById('checkTodosBackup');
        if (checkTodosBackup) {
            checkTodosBackup.checked = pacientesBackupFiltrados.length > 0 && pacientesBackupFiltrados.every(p => pacientesBackupSeleccionados.has(p.id));
        }
    }

    async function cargarPacientesBackup() {
        // Obtener profesionales
        const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
        const profesionales = {};
        usuariosSnap.forEach(doc => {
            const data = doc.data();
            profesionales[doc.id] = data.displayName || data.email || doc.id;
        });
        // Obtener pacientes
        const snapshot = await window.firebaseDB.collection('pacientes').get();
        pacientesBackupData = [];
        snapshot.forEach(doc => {
            const p = doc.data();
            pacientesBackupData.push({
                id: doc.id,
                nombre: p.nombre || '(sin nombre)',
                profesional: profesionales[p.owner] || p.owner || 'sin profesional',
                ...p
            });
        });
        pacientesBackupData.sort((a, b) => a.profesional.localeCompare(b.profesional) || a.nombre.localeCompare(b.nombre));
        pacientesBackupFiltrados = [...pacientesBackupData];
        pacientesBackupSeleccionados = new Set(); // Iniciar vacío (todos deseleccionados)
        renderizarListaPacientesBackup();
        const checkTodosBackup = document.getElementById('checkTodosBackup');
        if (checkTodosBackup) {
            checkTodosBackup.checked = false;
        } else {
            console.error('No se encontró el checkbox checkTodosBackup');
        }
    }

    if (btnBackup && modalBackup) {
        console.log('[DEBUG] Configurando event listener para btnBackup');

        btnBackup.addEventListener('click', async (e) => {
            console.log('[DEBUG] Click en backup detectado');
            console.log('[DEBUG] Event target:', e.target);
            console.log('[DEBUG] Event currentTarget:', e.currentTarget);
            console.log('[DEBUG] Event type:', e.type);
            console.log('[DEBUG] Event bubbles:', e.bubbles);
            console.log('[DEBUG] Stack trace:', new Error().stack);
            console.log('[DEBUG] ¿Es un clic directo en btnBackup?', e.target === btnBackup);
            console.log('[DEBUG] ¿Es un clic en versionBtnDashboard?', e.target.id === 'versionBtnDashboard');
            try {
                await cargarPacientesBackup();
                console.log('[DEBUG] Pacientes cargados, mostrando modal');
                console.log('[DEBUG] Modal antes de mostrar:', modalBackup.classList.toString());
                modalBackup.classList.remove('hidden');
                modalBackup.style.display = 'flex';
                modalBackup.style.zIndex = '99999';
                // Forzar reflow/repaint
                modalBackup.offsetHeight; // Accede a la propiedad para forzar reflow
                modalBackup.style.visibility = 'visible';
                modalBackup.style.opacity = '1';
                
                // Forzar repaint: quitar y volver a agregar el modal al body
                const parent = modalBackup.parentNode;
                parent.removeChild(modalBackup);
                document.body.appendChild(modalBackup);
                
                // Reconfigurar event listeners después de mover el modal
                const btnCerrarModalBackup = document.getElementById('btnCerrarModalBackup');
                const btnCancelarBackup = document.getElementById('btnCancelarBackup');
                const btnVerBackup = document.getElementById('btnVerBackup');
                const btnVerBackupSinNotas = document.getElementById('btnVerBackupSinNotas');
                const btnDescargarBackup = document.getElementById('btnDescargarBackup');
                const btnDescargarBackupSinNotas = document.getElementById('btnDescargarBackupSinNotas');
                
                if (btnCerrarModalBackup) {
                    btnCerrarModalBackup.removeEventListener('click', cerrarModalBackup);
                    btnCerrarModalBackup.addEventListener('click', cerrarModalBackup);
                }
                
                if (btnCancelarBackup) {
                    btnCancelarBackup.removeEventListener('click', cerrarModalBackup);
                    btnCancelarBackup.addEventListener('click', cerrarModalBackup);
                }
                
                // Reconfigurar botones de Ver y Descargar
                if (btnVerBackup) {
                    const existingListeners = btnVerBackup.cloneNode(true);
                    btnVerBackup.parentNode.replaceChild(existingListeners, btnVerBackup);
                    document.getElementById('btnVerBackup').addEventListener('click', async () => {
                        await mostrarVistaBackup(false); // false = con notas
                    });
                }
                
                if (btnVerBackupSinNotas) {
                    const existingListeners = btnVerBackupSinNotas.cloneNode(true);
                    btnVerBackupSinNotas.parentNode.replaceChild(existingListeners, btnVerBackupSinNotas);
                    document.getElementById('btnVerBackupSinNotas').addEventListener('click', async () => {
                        await mostrarVistaBackup(true); // true = sin notas
                    });
                }
                
                if (btnDescargarBackup) {
                    const existingListeners = btnDescargarBackup.cloneNode(true);
                    btnDescargarBackup.parentNode.replaceChild(existingListeners, btnDescargarBackup);
                    document.getElementById('btnDescargarBackup').addEventListener('click', async () => {
                        await descargarBackup(false); // false = con notas
                    });
                }
                
                if (btnDescargarBackupSinNotas) {
                    const existingListeners = btnDescargarBackupSinNotas.cloneNode(true);
                    btnDescargarBackupSinNotas.parentNode.replaceChild(existingListeners, btnDescargarBackupSinNotas);
                    document.getElementById('btnDescargarBackupSinNotas').addEventListener('click', async () => {
                        await descargarBackup(true); // true = sin notas
                    });
                }
                
                // Cerrar cualquier otro modal que esté abierto
                const modalVersion = document.getElementById('modalVersion');
                if (modalVersion && !modalVersion.classList.contains('hidden')) {
                    console.log('[DEBUG] Cerrando modal de versiones antes de abrir backup');
                    modalVersion.classList.add('hidden');
                }
                
                // Cerrar modal de sesión si está abierto
                const modalSesion = document.getElementById('modalSesion');
                if (modalSesion && !modalSesion.classList.contains('hidden')) {
                    console.log('[DEBUG] Cerrando modal de sesión antes de abrir backup');
                    modalSesion.classList.add('hidden');
                }
                
                // Cerrar modal de paciente si está abierto
                const modalPaciente = document.getElementById('modalPaciente');
                if (modalPaciente && !modalPaciente.classList.contains('hidden')) {
                    console.log('[DEBUG] Cerrando modal de paciente antes de abrir backup');
                    modalPaciente.classList.add('hidden');
                }
                console.log('[DEBUG] Modal después de mostrar:', modalBackup.classList.toString());
                console.log('[DEBUG] Modal visible:', !modalBackup.classList.contains('hidden'));
                console.log('[DEBUG] Modal display:', window.getComputedStyle(modalBackup).display);
                console.log('[DEBUG] Modal z-index:', window.getComputedStyle(modalBackup).zIndex);
                
                // Verificación final después de mover el modal al final del body
                setTimeout(() => {
                    const isVisible = !modalBackup.classList.contains('hidden') && 
                                    window.getComputedStyle(modalBackup).display !== 'none';
                    console.log('[DEBUG] Verificación final - Modal visible:', isVisible);
                    
                    if (!isVisible) {
                        console.error('[DEBUG] Modal aún no visible, forzando...');
                        modalBackup.style.display = 'flex';
                        modalBackup.style.visibility = 'visible';
                        modalBackup.style.opacity = '1';
                    } else {
                        console.log('[DEBUG] ✅ Modal visible correctamente');
                    }
                }, 100);
            } catch (error) {
                console.error('[DEBUG] Error al cargar backup:', error);
            }
        });
    } else {
        console.error('[DEBUG] No se encontraron elementos necesarios:', {
            btnBackup: !!btnBackup,
            modalBackup: !!modalBackup
        });
    }
            // Función para cerrar el modal de backup
        function cerrarModalBackup() {
            console.log('[DEBUG] Cerrando modal de backup');
            modalBackup.classList.add('hidden');
            modalBackup.style.display = 'none';
            modalBackup.style.visibility = 'hidden';
            modalBackup.style.opacity = '0';
            console.log('[DEBUG] Modal después de cerrar:', modalBackup.classList.contains('hidden'));
            // Limpiar búsqueda y selecciones
            const inputBuscar = document.getElementById('inputBuscarPacienteBackup');
            if (inputBuscar) inputBuscar.value = '';
            const checkTodos = document.getElementById('checkTodosBackup');
            if (checkTodos) checkTodos.checked = false;
        }
        
        // Remover event listeners anteriores para evitar duplicados
        if (btnCerrarModalBackup) {
            btnCerrarModalBackup.removeEventListener('click', cerrarModalBackup);
            btnCerrarModalBackup.addEventListener('click', cerrarModalBackup);
            console.log('[DEBUG] Event listener agregado a btnCerrarModalBackup');
        }
        
        if (btnCancelarBackup) {
            btnCancelarBackup.removeEventListener('click', cerrarModalBackup);
            btnCancelarBackup.addEventListener('click', cerrarModalBackup);
            console.log('[DEBUG] Event listener agregado a btnCancelarBackup');
        }
        
        // Cerrar modal con tecla Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && !modalBackup.classList.contains('hidden')) {
                console.log('[DEBUG] Cerrando modal de backup (Escape)');
                cerrarModalBackup();
            }
        };
        document.removeEventListener('keydown', escapeHandler);
        document.addEventListener('keydown', escapeHandler);
    if (inputBuscarPacienteBackup) {
        inputBuscarPacienteBackup.addEventListener('input', () => {
            const q = inputBuscarPacienteBackup.value.trim().toLowerCase();
            pacientesBackupFiltrados = pacientesBackupData.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                (p.profesional && p.profesional.toLowerCase().includes(q))
            );
            renderizarListaPacientesBackup();
        });
    }
    if (checkTodosBackup) {
        checkTodosBackup.addEventListener('change', () => {
            if (checkTodosBackup.checked) {
                pacientesBackupFiltrados.forEach(p => pacientesBackupSeleccionados.add(p.id));
            } else {
                pacientesBackupFiltrados.forEach(p => pacientesBackupSeleccionados.delete(p.id));
            }
            renderizarListaPacientesBackup();
        });
    }
    if (btnDescargarBackup) {
        btnDescargarBackup.addEventListener('click', async () => {
            console.log('Click en Descargar Backup');
            const loader = document.getElementById('loaderVerBackup');
            
            if (pacientesBackupSeleccionados.size === 0) {
                alert('Selecciona al menos un paciente para descargar.');
                return;
            }
            
            // Mostrar loader con tiempo estimativo
            if (loader) {
                loader.classList.remove('hidden');
                loader.style.display = 'flex';
                loader.style.visibility = 'visible';
                loader.style.opacity = '1';
                loader.style.zIndex = '100000';
                
                // Forzar repaint del loader
                loader.offsetHeight;
                
                // Mover el loader al final del body para asegurar visibilidad
                const parentLoader = loader.parentNode;
                parentLoader.removeChild(loader);
                document.body.appendChild(loader);
                
                // Iniciar contador de tiempo estimativo
                iniciarContadorTiempo();
            }
            
            try {
            // Obtener profesionales
            const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
            const profesionales = {};
            usuariosSnap.forEach(doc => {
                const data = doc.data();
                profesionales[doc.id] = data.displayName || data.email || doc.id;
            });
            // Filtrar pacientes seleccionados
            const pacientesSeleccionados = pacientesBackupData.filter(p => pacientesBackupSeleccionados.has(p.id));
            // Ordenar por profesional y nombre
            pacientesSeleccionados.sort((a, b) => a.profesional.localeCompare(b.profesional) || a.nombre.localeCompare(b.nombre));
            // Agrupar por profesional
            const pacientesPorProfesional = {};
            pacientesSeleccionados.forEach(p => {
                if (!pacientesPorProfesional[p.owner]) pacientesPorProfesional[p.owner] = [];
                pacientesPorProfesional[p.owner].push(p);
            });
            // Campos
            const fields = [
                'profesional', 'nombre', 'dni', 'fechaNacimiento', 'sexo', 'lugarNacimiento',
                'email', 'telefono', 'contacto',
                'educacion', 'instituto', 'motivo',
                'infoPadre', 'infoMadre', 'infoHermanos',
                'nomencladorCIE10', 'creado', 'actualizado',
                'fechaSesion', 'comentarioSesion', 'notasSesion', 'cie10Sesion', 'archivosSesion'
            ];
            function formatTimestamp(val) {
                if (val && typeof val === 'object' && val.seconds) {
                    const d = new Date(val.seconds * 1000);
                    return d.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ');
                }
                return '';
            }
            const csvRows = [];
            // Por cada profesional
            for (const [owner, pacientes] of Object.entries(pacientesPorProfesional)) {
                const nombreProfesional = profesionales[owner] || owner;
                if (csvRows.length > 0) csvRows.push(''); // Línea vacía entre profesionales
                csvRows.push(`PROFESIONAL: ${nombreProfesional}`);
                csvRows.push(fields.join(','));
                for (const p of pacientes) {
                    // Obtener sesiones del paciente
                    let sesiones = [];
                    try {
                        const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(p.id).collection('sesiones').get();
                        sesiones = [];
                        sesionesSnap.forEach(doc => {
                            const s = doc.data();
                            sesiones.push({
                                fechaSesion: s.fecha || '',
                                comentarioSesion: s.comentario || '',
                                notasSesion: s.notas || '',
                                cie10Sesion: s.nomencladorCIE10 ? (s.nomencladorCIE10.codigo + ' - ' + s.nomencladorCIE10.descripcion) : '',
                                archivosSesion: s.archivosUrls ? s.archivosUrls.join(' | ') : ''
                            });
                        });
                    } catch (e) {
                        sesiones = [];
                    }
                    if (sesiones.length === 0) {
                        // Paciente sin sesiones: fila con datos vacíos de sesión
                        const row = fields.map(f => {
                            let val = p[f];
                            if ((f === 'creado' || f === 'actualizado') && val && typeof val === 'object' && val.seconds) {
                                val = formatTimestamp(val);
                            } else if (typeof val === 'object' && val !== null) {
                                val = JSON.stringify(val).replace(/\n/g, ' ');
                            }
                            if (val === undefined) val = '';
                            return '"' + String(val).replace(/"/g, '""') + '"';
                        });
                        csvRows.push(row.join(','));
                    } else {
                        // Una fila por cada sesión
                        for (const sesion of sesiones) {
                            const row = fields.map(f => {
                                let val = p[f];
                                if ((f === 'creado' || f === 'actualizado') && val && typeof val === 'object' && val.seconds) {
                                    val = formatTimestamp(val);
                                } else if (typeof val === 'object' && val !== null) {
                                    val = JSON.stringify(val).replace(/\n/g, ' ');
                                }
                                if (val === undefined) val = '';
                                // Sobrescribir con datos de sesión si corresponde
                                if (f === 'fechaSesion') val = sesion.fechaSesion;
                                if (f === 'comentarioSesion') val = sesion.comentarioSesion;
                                if (f === 'notasSesion') val = sesion.notasSesion;
                                if (f === 'cie10Sesion') val = sesion.cie10Sesion;
                                if (f === 'archivosSesion') val = sesion.archivosSesion;
                                return '"' + String(val).replace(/"/g, '""') + '"';
                            });
                            csvRows.push(row.join(','));
                        }
                    }
                }
            }
            const csvContent = csvRows.join('\r\n');
            // Descargar archivo
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup_pacientes.csv';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            modalBackup.classList.add('hidden');
            
            } catch (error) {
                console.error('Error al descargar backup:', error);
                alert('Error al generar el archivo. Por favor, inténtalo de nuevo.');
            } finally {
                // Detener el contador de tiempo
                detenerContadorTiempo();
                
                if (loader) {
                    loader.classList.add('hidden');
                    loader.style.display = 'none';
                    loader.style.visibility = 'hidden';
                    loader.style.opacity = '0';
                }
            }
        });
    }
         // Función para descargar backup
     async function descargarBackup(sinNotas = false) {
         const loader = document.getElementById('loaderVerBackup');
         
         if (pacientesBackupSeleccionados.size === 0) {
             alert('Selecciona al menos un paciente para descargar.');
             return;
         }
         
         // Mostrar loader con tiempo estimativo
         if (loader) {
             loader.classList.remove('hidden');
             loader.style.display = 'flex';
             loader.style.visibility = 'visible';
             loader.style.opacity = '1';
             loader.style.zIndex = '100000';
             
             // Forzar repaint del loader
             loader.offsetHeight;
             
             // Mover el loader al final del body para asegurar visibilidad
             const parentLoader = loader.parentNode;
             parentLoader.removeChild(loader);
             document.body.appendChild(loader);
             
             // Iniciar contador de tiempo estimativo
             iniciarContadorTiempo();
         }
         
         try {
             // Obtener profesionales
             const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
             const profesionales = {};
             usuariosSnap.forEach(doc => {
                 const data = doc.data();
                 profesionales[doc.id] = data.displayName || data.email || doc.id;
             });
             
             // Filtrar pacientes seleccionados
             const pacientesSeleccionados = pacientesBackupData.filter(p => pacientesBackupSeleccionados.has(p.id));
             
             // Ordenar por profesional y nombre
             pacientesSeleccionados.sort((a, b) => a.profesional.localeCompare(b.profesional) || a.nombre.localeCompare(b.nombre));
             
             // Agrupar por profesional
             const pacientesPorProfesional = {};
             pacientesSeleccionados.forEach(p => {
                 if (!pacientesPorProfesional[p.owner]) pacientesPorProfesional[p.owner] = [];
                 pacientesPorProfesional[p.owner].push(p);
             });
             
             // Campos para el CSV
             const fields = [
                 'profesional', 'nombre', 'dni', 'fechaNacimiento', 'sexo', 'lugarNacimiento',
                 'email', 'telefono', 'contacto',
                 'educacion', 'instituto', 'motivo',
                 'infoPadre', 'infoMadre', 'infoHermanos',
                 'nomencladorCIE10', 'creado', 'actualizado',
                 'fechaSesion', 'comentarioSesion'
             ];
             
             // Agregar campo de notas solo si no es "sin notas"
             if (!sinNotas) {
                 fields.push('notasSesion');
             }
             
             fields.push('cie10Sesion', 'archivosSesion');
             
             function formatTimestamp(val) {
                 if (val && typeof val === 'object' && val.seconds) {
                     const d = new Date(val.seconds * 1000);
                     return d.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ');
                 }
                 return '';
             }
             
             const csvRows = [];
             
             // Por cada profesional
             for (const [owner, pacientes] of Object.entries(pacientesPorProfesional)) {
                 const nombreProfesional = profesionales[owner] || owner;
                 if (csvRows.length > 0) csvRows.push(''); // Línea vacía entre profesionales
                 csvRows.push(`PROFESIONAL: ${nombreProfesional}`);
                 csvRows.push(fields.join(','));
                 
                 for (const p of pacientes) {
                     // Obtener sesiones del paciente
                     let sesiones = [];
                     try {
                         const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(p.id).collection('sesiones').get();
                         sesiones = [];
                         sesionesSnap.forEach(doc => {
                             const s = doc.data();
                             const sesionData = {
                                 fechaSesion: s.fecha || '',
                                 comentarioSesion: s.comentario || '',
                                 cie10Sesion: s.nomencladorCIE10 ? (s.nomencladorCIE10.codigo + ' - ' + s.nomencladorCIE10.descripcion) : '',
                                 archivosSesion: s.archivosUrls ? s.archivosUrls.join(' | ') : ''
                             };
                             
                             // Solo agregar notas si no es "sin notas"
                             if (!sinNotas) {
                                 sesionData.notasSesion = s.notas || '';
                             }
                             
                             sesiones.push(sesionData);
                         });
                     } catch (e) {
                         sesiones = [];
                     }
                     
                     if (sesiones.length === 0) {
                         // Paciente sin sesiones: fila con datos vacíos de sesión
                         const row = fields.map(f => {
                             let val = p[f];
                             if ((f === 'creado' || f === 'actualizado') && val && typeof val === 'object' && val.seconds) {
                                 val = formatTimestamp(val);
                             } else if (typeof val === 'object' && val !== null) {
                                 val = JSON.stringify(val).replace(/\n/g, ' ');
                             }
                             if (val === undefined) val = '';
                             return '"' + String(val).replace(/"/g, '""') + '"';
                         });
                         csvRows.push(row.join(','));
                     } else {
                         // Una fila por cada sesión
                         for (const sesion of sesiones) {
                             const row = fields.map(f => {
                                 let val = p[f];
                                 if ((f === 'creado' || f === 'actualizado') && val && typeof val === 'object' && val.seconds) {
                                     val = formatTimestamp(val);
                                 } else if (typeof val === 'object' && val !== null) {
                                     val = JSON.stringify(val).replace(/\n/g, ' ');
                                 }
                                 if (val === undefined) val = '';
                                 
                                 // Sobrescribir con datos de sesión si corresponde
                                 if (f === 'fechaSesion') val = sesion.fechaSesion;
                                 if (f === 'comentarioSesion') val = sesion.comentarioSesion;
                                 if (f === 'notasSesion' && !sinNotas) val = sesion.notasSesion;
                                 if (f === 'cie10Sesion') val = sesion.cie10Sesion;
                                 if (f === 'archivosSesion') val = sesion.archivosSesion;
                                 
                                 return '"' + String(val).replace(/"/g, '""') + '"';
                             });
                             csvRows.push(row.join(','));
                         }
                     }
                 }
             }
             
             const csvContent = csvRows.join('\r\n');
             
             // Descargar archivo
             const blob = new Blob([csvContent], { type: 'text/csv' });
             const url = URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = sinNotas ? 'backup_pacientes_sin_notas.csv' : 'backup_pacientes.csv';
             document.body.appendChild(a);
             a.click();
             setTimeout(() => {
                 document.body.removeChild(a);
                 URL.revokeObjectURL(url);
             }, 100);
             
         } catch (error) {
             console.error('Error al descargar backup:', error);
             alert('Error al generar el archivo. Por favor, inténtalo de nuevo.');
         } finally {
             // Detener el contador de tiempo
             detenerContadorTiempo();
             
             if (loader) {
                 loader.classList.add('hidden');
                 loader.style.display = 'none';
                 loader.style.visibility = 'hidden';
                 loader.style.opacity = '0';
             }
         }
     }
     
     // Función para mostrar vista de backup
     async function mostrarVistaBackup(sinNotas = false) {
         const loader = document.getElementById('loaderVerBackup');
         const modalVerBackup = document.getElementById('modalVerBackup');
         const contenidoVerBackup = document.getElementById('contenidoVerBackup');
         
         // No cerrar el modal de backup, mantenerlo abierto
         
         if (loader) {
             loader.classList.remove('hidden');
             loader.style.display = 'flex';
             loader.style.visibility = 'visible';
             loader.style.opacity = '1';
             loader.style.zIndex = '100000';
             
             // Forzar repaint del loader
             loader.offsetHeight;
             
             // Mover el loader al final del body para asegurar visibilidad
             const parentLoader = loader.parentNode;
             parentLoader.removeChild(loader);
             document.body.appendChild(loader);
             
             // Iniciar contador de tiempo estimativo
             iniciarContadorTiempo();
         }
         
         if (pacientesBackupSeleccionados.size === 0) {
             if (loader) {
                 loader.classList.add('hidden');
                 loader.style.display = 'none';
             }
             alert('Selecciona al menos un paciente para ver.');
             return;
         }
        
                 try {
             // Obtener profesionales
             const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
         const profesionales = {};
         usuariosSnap.forEach(doc => {
             const data = doc.data();
             profesionales[doc.id] = data.displayName || data.email || doc.id;
         });
         
         // Filtrar pacientes seleccionados
         const pacientesSeleccionados = pacientesBackupData.filter(p => pacientesBackupSeleccionados.has(p.id));
         
         // Agrupar por profesional
         const pacientesPorProfesional = {};
         pacientesSeleccionados.forEach(p => {
             if (!pacientesPorProfesional[p.profesional]) pacientesPorProfesional[p.profesional] = [];
             pacientesPorProfesional[p.profesional].push(p);
         });
         
         // Renderizar agrupado por profesional con acordeón de pacientes y sesiones
         let html = '<div class="bg-gray-800 text-gray-100">';
         let profIdx = 0;
         for (const [profesional, pacientes] of Object.entries(pacientesPorProfesional)) {
             const profId = `ver-prof-${profIdx}`;
             html += `<div class='mb-4 border border-gray-600 rounded'>`;
             html += `<button class='w-full text-left px-4 py-2 font-bold bg-gray-700 hover:bg-gray-600 border-b border-gray-600 text-gray-100' onclick=\"document.getElementById('${profId}').classList.toggle('hidden')\">${profesional}</button>`;
             html += `<div id='${profId}' class='p-2'>`;
             
             // Cargar sesiones de todos los pacientes y ordenarlos alfabéticamente por nombre
             let pacientesConSesiones = [];
             for (const p of pacientes) {
                 let sesiones = [];
                 try {
                     const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(p.id).collection('sesiones').get();
                     sesionesSnap.forEach(doc => {
                         const s = doc.data();
                         sesiones.push({
                             fechaSesion: s.fecha || '',
                             comentarioSesion: s.comentario || '',
                             notasSesion: sinNotas ? '' : (s.notas || '')
                         });
                     });
                 } catch (e) {
                     sesiones = [];
                 }
                 
                 // Ordenar sesiones por fecha descendente
                 sesiones.sort((a, b) => {
                     const fa = a.fechaSesion ? new Date(a.fechaSesion.seconds ? a.fechaSesion.seconds * 1000 : a.fechaSesion).getTime() : 0;
                     const fb = b.fechaSesion ? new Date(b.fechaSesion.seconds ? b.fechaSesion.seconds * 1000 : b.fechaSesion).getTime() : 0;
                     return fb - fa;
                 });
                 pacientesConSesiones.push({ paciente: p, sesiones });
             }
             
             // Ordenar pacientes alfabéticamente por nombre
             pacientesConSesiones.sort((a, b) => {
                 const na = (a.paciente.nombre || '').toLowerCase();
                 const nb = (b.paciente.nombre || '').toLowerCase();
                 if (na < nb) return -1;
                 if (na > nb) return 1;
                 return 0;
             });
             
             // Renderizar acordeón de pacientes
             let pacIdx = 0;
             for (const { paciente: p, sesiones } of pacientesConSesiones) {
                 const pacId = `${profId}-pac-${pacIdx}`;
                 html += `<div class='mb-2 border border-gray-600 rounded'>`;
                 html += `<button class='w-full text-left px-4 py-2 font-semibold bg-gray-600 hover:bg-gray-500 border-b border-gray-600 text-gray-100' onclick=\"document.getElementById('${pacId}').classList.toggle('hidden')\">${p.nombre || ''}</button>`;
                 html += `<div id='${pacId}' class='p-2 hidden'>`;
                 
                                      if (sesiones.length > 0) {
                         sesiones.forEach(sesion => {
                             html += `<div class='mb-2 p-2 border border-gray-500 rounded bg-gray-700'>`;
                             html += `<div><span class='font-semibold text-gray-300'>Fecha:</span> <span class='text-gray-100'>${sesion.fechaSesion ? new Date(sesion.fechaSesion.seconds ? sesion.fechaSesion.seconds * 1000 : sesion.fechaSesion).toLocaleDateString() : '-'}</span></div>`;
                             html += `<div><span class='font-semibold text-gray-300'>Comentarios:</span> <span class='text-gray-100'>${sesion.comentarioSesion || '-'}</span></div>`;
                             if (!sinNotas) {
                                 html += `<div><span class='font-semibold text-gray-300'>Notas:</span> <span class='text-gray-100'>${sesion.notasSesion || '-'}</span></div>`;
                             }
                             html += `</div>`;
                         });
                     } else {
                         html += `<div class='mb-2 p-2 border border-gray-500 rounded bg-gray-700'>`;
                         html += `<div><span class='font-semibold text-gray-300'>Fecha:</span> <span class='text-gray-100'>-</span></div>`;
                         html += `<div><span class='font-semibold text-gray-300'>Comentarios:</span> <span class='text-gray-100'>-</span></div>`;
                         if (!sinNotas) {
                             html += `<div><span class='font-semibold text-gray-300'>Notas:</span> <span class='text-gray-100'>-</span></div>`;
                         }
                         html += `</div>`;
                     }
                 html += `</div></div>`;
                 pacIdx++;
             }
             html += `</div></div>`;
             profIdx++;
         }
         html += '</div>';
         
         contenidoVerBackup.innerHTML = html;
         modalVerBackup.classList.remove('hidden');
         modalVerBackup.style.display = 'flex';
         modalVerBackup.style.visibility = 'visible';
         modalVerBackup.style.opacity = '1';
         modalVerBackup.style.zIndex = '99999';
         
         // Forzar repaint: quitar y volver a agregar el modal al body
         const parentVer = modalVerBackup.parentNode;
         parentVer.removeChild(modalVerBackup);
         document.body.appendChild(modalVerBackup);
         
         // Reconfigurar event listeners del modal de visualización
         const btnCerrarModalVerBackup = document.getElementById('btnCerrarModalVerBackup');
         const btnCerrarVerBackup = document.getElementById('btnCerrarVerBackup');
         
         if (btnCerrarModalVerBackup) {
             btnCerrarModalVerBackup.removeEventListener('click', cerrarModalVerBackup);
             btnCerrarModalVerBackup.addEventListener('click', cerrarModalVerBackup);
         }
         
         if (btnCerrarVerBackup) {
             btnCerrarVerBackup.removeEventListener('click', cerrarModalVerBackup);
             btnCerrarVerBackup.addEventListener('click', cerrarModalVerBackup);
         }
         
         // Forzar repaint del modal de visualización
         modalVerBackup.offsetHeight;
         
         // Asegurar que todos los paneles estén colapsados por defecto
         for (let i = 0; i < profIdx; i++) {
             const el = document.getElementById(`ver-prof-${i}`);
             if (el) el.classList.add('hidden');
         }
         
         // Aplicar tema oscuro
         modalVerBackup.classList.add('dark');
         modalVerBackup.classList.remove('force-light');
         
         } catch (error) {
             console.error('Error al mostrar vista de backup:', error);
             alert('Error al cargar los datos. Por favor, inténtalo de nuevo.');
         } finally {
             // Detener el contador de tiempo
             detenerContadorTiempo();
             
             if (loader) {
                 loader.classList.add('hidden');
                 loader.style.display = 'none';
                 loader.style.visibility = 'hidden';
                 loader.style.opacity = '0';
             }
         }
          }
     
     // Función para cerrar el modal de visualización de backup
     function cerrarModalVerBackup() {
         const modalVerBackup = document.getElementById('modalVerBackup');
         if (modalVerBackup) {
             modalVerBackup.classList.add('hidden');
             modalVerBackup.style.display = 'none';
             modalVerBackup.style.visibility = 'hidden';
             modalVerBackup.style.opacity = '0';
         }
     }
     
     // Variables para el contador de tiempo
     let contadorTiempo;
     let tiempoInicio;
     
     // Función para iniciar el contador de tiempo estimativo
     function iniciarContadorTiempo() {
         const tiempoEstimativo = document.getElementById('tiempoEstimativo');
         if (!tiempoEstimativo) return;
         
         tiempoInicio = Date.now();
         let segundos = 0;
         
         // Estimar tiempo basado en cantidad de pacientes seleccionados
         const cantidadPacientes = pacientesBackupSeleccionados.size;
         const tiempoEstimadoTotal = Math.max(3, Math.min(15, cantidadPacientes * 0.5)); // Entre 3 y 15 segundos
         
         contadorTiempo = setInterval(() => {
             segundos++;
             const progreso = Math.min(100, (segundos / tiempoEstimadoTotal) * 100);
             
             if (segundos < tiempoEstimadoTotal) {
                 const tiempoRestante = Math.ceil(tiempoEstimadoTotal - segundos);
                 tiempoEstimativo.textContent = `Tiempo estimado restante: ${tiempoRestante}s (${Math.round(progreso)}%)`;
             } else {
                 tiempoEstimativo.textContent = `Finalizando carga... (${Math.round(progreso)}%)`;
             }
         }, 1000);
     }
     
     // Función para detener el contador de tiempo
     function detenerContadorTiempo() {
         if (contadorTiempo) {
             clearInterval(contadorTiempo);
             contadorTiempo = null;
         }
     }
    if (btnVerBackupSinNotas) {
        btnVerBackupSinNotas.addEventListener('click', async () => {
            console.log('[DEBUG] Click en Ver (sin notas)');
            const loader = document.getElementById('loaderVerBackup');
            if (loader) loader.classList.remove('hidden');
            // Ocultar y limpiar el modal de visualización antes de mostrar nuevo contenido
            if (modalVerBackup) {
                modalVerBackup.classList.add('hidden');
                contenidoVerBackup.innerHTML = '';
            }
            if (pacientesBackupSeleccionados.size === 0) {
                if (loader) loader.classList.add('hidden');
                alert('Selecciona al menos un paciente para ver.');
                return;
            }
            // Obtener profesionales
            const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
            const profesionales = {};
            usuariosSnap.forEach(doc => {
                const data = doc.data();
                profesionales[doc.id] = data.displayName || data.email || doc.id;
            });
            // Filtrar pacientes seleccionados
            const pacientesSeleccionados = pacientesBackupData.filter(p => pacientesBackupSeleccionados.has(p.id));
            // Agrupar por profesional
            const pacientesPorProfesional = {};
            pacientesSeleccionados.forEach(p => {
                if (!pacientesPorProfesional[p.profesional]) pacientesPorProfesional[p.profesional] = [];
                pacientesPorProfesional[p.profesional].push(p);
            });
            // Renderizar agrupado por profesional con acordeón de pacientes y sesiones (sin notas)
            let html = '<div class="bg-white text-gray-900">';
            let profIdx = 0;
            for (const [profesional, pacientes] of Object.entries(pacientesPorProfesional)) {
                const profId = `ver-prof-sin-notas-${profIdx}`;
                html += `<div class='mb-4 border rounded'>`;
                html += `<button class='w-full text-left px-4 py-2 font-bold bg-blue-100 hover:bg-blue-200 border-b' style='color:#1e293b' onclick=\"document.getElementById('${profId}').classList.toggle('hidden')\">${profesional}</button>`;
                html += `<div id='${profId}' class='p-2'>`;
                // Cargar sesiones de todos los pacientes y ordenarlos alfabéticamente por nombre
                let pacientesConSesiones = [];
                for (const p of pacientes) {
                    let sesiones = [];
                    try {
                        const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(p.id).collection('sesiones').get();
                        sesionesSnap.forEach(doc => {
                            const s = doc.data();
                            sesiones.push({
                                fechaSesion: s.fecha || '',
                                comentarioSesion: s.comentario || ''
                            });
                        });
                    } catch (e) {
                        sesiones = [];
                    }
                    // Ordenar sesiones por fecha descendente
                    sesiones.sort((a, b) => {
                        const fa = a.fechaSesion ? new Date(a.fechaSesion.seconds ? a.fechaSesion.seconds * 1000 : a.fechaSesion).getTime() : 0;
                        const fb = b.fechaSesion ? new Date(b.fechaSesion.seconds ? b.fechaSesion.seconds * 1000 : b.fechaSesion).getTime() : 0;
                        return fb - fa;
                    });
                    pacientesConSesiones.push({ paciente: p, sesiones });
                }
                // Ordenar pacientes alfabéticamente por nombre
                pacientesConSesiones.sort((a, b) => {
                    const na = (a.paciente.nombre || '').toLowerCase();
                    const nb = (b.paciente.nombre || '').toLowerCase();
                    if (na < nb) return -1;
                    if (na > nb) return 1;
                    return 0;
                });
                // Renderizar acordeón de pacientes
                let pacIdx = 0;
                for (const { paciente: p, sesiones } of pacientesConSesiones) {
                    const pacId = `${profId}-pac-${pacIdx}`;
                    html += `<div class='mb-2 border rounded'>`;
                    html += `<button class='w-full text-left px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 border-b' onclick=\"document.getElementById('${pacId}').classList.toggle('hidden')\">${p.nombre || ''}</button>`;
                    html += `<div id='${pacId}' class='p-2 hidden'>`;
                    if (sesiones.length > 0) {
                        sesiones.forEach(sesion => {
                            html += `<div class='mb-2 p-2 border rounded bg-gray-50'>`;
                            html += `<div><span class='font-semibold'>Fecha:</span> ${sesion.fechaSesion ? new Date(sesion.fechaSesion.seconds ? sesion.fechaSesion.seconds * 1000 : sesion.fechaSesion).toLocaleDateString() : '-'}</div>`;
                            html += `<div><span class='font-semibold'>Comentarios:</span> ${sesion.comentarioSesion || '-'}</div>`;
                            html += `</div>`;
                        });
                    } else {
                        html += `<div class='mb-2 p-2 border rounded bg-gray-50'>`;
                        html += `<div><span class='font-semibold'>Fecha:</span> -</div>`;
                        html += `<div><span class='font-semibold'>Comentarios:</span> -</div>`;
                        html += `</div>`;
                    }
                    html += `</div></div>`;
                    pacIdx++;
                }
                html += `</div></div>`;
                profIdx++;
            }
            html += '</div>';
            contenidoVerBackup.innerHTML = html;
            modalVerBackup.classList.remove('hidden');
            // Asegurar que todos los paneles estén colapsados por defecto
            for (let i = 0; i < profIdx; i++) {
                const el = document.getElementById(`ver-prof-sin-notas-${i}`);
                if (el) el.classList.add('hidden');
            }
            // Forzar fondo claro y texto oscuro
            modalVerBackup.classList.remove('dark');
            modalVerBackup.classList.add('force-light');
            if (loader) loader.classList.add('hidden');
        });
    }
    if (btnDescargarBackupSinNotas) {
        btnDescargarBackupSinNotas.addEventListener('click', async () => {
            const loader = document.getElementById('loaderVerBackup');
            
            if (pacientesBackupSeleccionados.size === 0) {
                alert('Selecciona al menos un paciente para descargar.');
                return;
            }
            
            // Mostrar loader con tiempo estimativo
            if (loader) {
                loader.classList.remove('hidden');
                loader.style.display = 'flex';
                loader.style.visibility = 'visible';
                loader.style.opacity = '1';
                loader.style.zIndex = '100000';
                
                // Forzar repaint del loader
                loader.offsetHeight;
                
                // Mover el loader al final del body para asegurar visibilidad
                const parentLoader = loader.parentNode;
                parentLoader.removeChild(loader);
                document.body.appendChild(loader);
                
                // Iniciar contador de tiempo estimativo
                iniciarContadorTiempo();
            }
            
            try {
            // Obtener profesionales
            const usuariosSnap = await window.firebaseDB.collection('usuarios').get();
            const profesionales = {};
            usuariosSnap.forEach(doc => {
                const data = doc.data();
                profesionales[doc.id] = data.displayName || data.email || doc.id;
            });
            // Filtrar pacientes seleccionados
            const pacientesSeleccionados = pacientesBackupData.filter(p => pacientesBackupSeleccionados.has(p.id));
            // Agrupar por profesional
            const pacientesPorProfesional = {};
            pacientesSeleccionados.forEach(p => {
                if (!pacientesPorProfesional[p.owner]) pacientesPorProfesional[p.owner] = [];
                pacientesPorProfesional[p.owner].push(p);
            });
            // Campos sin notas
            const fields = [
                'profesional', 'nombre', 'dni', 'fechaNacimiento', 'sexo', 'lugarNacimiento',
                'email', 'telefono', 'contacto',
                'educacion', 'instituto', 'motivo',
                'nomencladorCIE10', 'creado', 'actualizado',
                'fechaSesion', 'comentarioSesion', 'cie10Sesion', 'archivosSesion'
            ];
            let csvRows = [];
            for (const [owner, pacientes] of Object.entries(pacientesPorProfesional)) {
                const nombreProfesional = profesionales[owner] || owner;
                if (csvRows.length > 0) csvRows.push(''); // Línea vacía entre profesionales
                csvRows.push(`PROFESIONAL: ${nombreProfesional}`);
                csvRows.push(fields.join(','));
                for (const p of pacientes) {
                    // Obtener sesiones del paciente
                    let sesiones = [];
                    try {
                        const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(p.id).collection('sesiones').get();
                        sesionesSnap.forEach(doc => {
                            const s = doc.data();
                            sesiones.push({
                                fechaSesion: s.fecha || '',
                                comentarioSesion: s.comentario || '',
                                cie10Sesion: s.nomencladorCIE10 ? (s.nomencladorCIE10.codigo + ' - ' + s.nomencladorCIE10.descripcion) : '',
                                archivosSesion: s.archivosUrls ? JSON.stringify(s.archivosUrls) : ''
                            });
                        });
                    } catch (e) {
                        sesiones = [];
                    }
                    if (sesiones.length === 0) {
                        // Paciente sin sesiones: fila con datos vacíos de sesión
                        const row = fields.map(f => {
                            let val = p[f];
                            if ((f === 'creado' || f === 'actualizado') && val && typeof val === 'object' && val.seconds) {
                                val = new Date(val.seconds * 1000).toLocaleString();
                            } else if (typeof val === 'object' && val !== null) {
                                val = JSON.stringify(val).replace(/\n/g, ' ');
                            }
                            if (val === undefined) val = '';
                            return '"' + String(val).replace(/"/g, '""') + '"';
                        });
                        csvRows.push(row.join(','));
                    } else {
                        // Una fila por cada sesión
                        for (const sesion of sesiones) {
                            const row = fields.map(f => {
                                let val = p[f];
                                if ((f === 'creado' || f === 'actualizado') && val && typeof val === 'object' && val.seconds) {
                                    val = new Date(val.seconds * 1000).toLocaleString();
                                } else if (typeof val === 'object' && val !== null) {
                                    val = JSON.stringify(val).replace(/\n/g, ' ');
                                }
                                if (val === undefined) val = '';
                                // Sobrescribir con datos de sesión si corresponde
                                if (f === 'fechaSesion') val = sesion.fechaSesion;
                                if (f === 'comentarioSesion') val = sesion.comentarioSesion;
                                if (f === 'cie10Sesion') val = sesion.cie10Sesion;
                                if (f === 'archivosSesion') val = sesion.archivosSesion;
                                return '"' + String(val).replace(/"/g, '""') + '"';
                            });
                            csvRows.push(row.join(','));
                        }
                    }
                }
            }
            const csvContent = csvRows.join('\r\n');
            // Descargar archivo
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup_pacientes_sin_notas.csv';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            modalBackup.classList.add('hidden');
            
            } catch (error) {
                console.error('Error al descargar backup sin notas:', error);
                alert('Error al generar el archivo. Por favor, inténtalo de nuevo.');
            } finally {
                // Detener el contador de tiempo
                detenerContadorTiempo();
                
                if (loader) {
                    loader.classList.add('hidden');
                    loader.style.display = 'none';
                    loader.style.visibility = 'hidden';
                    loader.style.opacity = '0';
                }
            }
        });
    }
});

// === QUILL para Observaciones en Nueva Sesión ===
let quillSesionComentario = null;
let quillOriginalParent = null;
let quillOverlay = null;
document.addEventListener('DOMContentLoaded', function() {
  const quillDiv = document.getElementById('sesionComentarioQuill');
  const quillWrapper = document.getElementById('quillEditorWrapper');
  if (quillDiv && quillWrapper) {
    quillSesionComentario = new Quill('#sesionComentarioQuill', {
      theme: 'snow',
      placeholder: 'Detalle de la sesión',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['clean']
        ]
      }
    });
    // Maximizar/minimizar
    const btn = document.getElementById('quillMaximizeBtn');
    quillOriginalParent = quillWrapper.parentNode;
    btn.addEventListener('click', function() {
      if (!quillOverlay) {
        // Crear overlay flotante
        quillOverlay = document.createElement('div');
        quillOverlay.className = 'quill-fullscreen-bg';
        document.body.appendChild(quillOverlay);
      }
      if (!quillWrapper.classList.contains('quill-fullscreen-editor')) {
        // Maximizar: mover wrapper al overlay
        quillOverlay.appendChild(quillWrapper);
        quillWrapper.classList.add('quill-fullscreen-editor');
        btn.textContent = '⤡';
      } else {
        // Minimizar: devolver wrapper a su lugar original
        quillWrapper.classList.remove('quill-fullscreen-editor');
        if (quillOverlay && quillOverlay.contains(quillWrapper)) {
          quillOriginalParent.appendChild(quillWrapper);
        }
        btn.textContent = '⤢';
        // Eliminar overlay si está vacío
        if (quillOverlay && quillOverlay.childNodes.length === 0) {
          quillOverlay.remove();
          quillOverlay = null;
        }
      }
    });
  }
});