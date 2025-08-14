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
const forgotPasswordFormContainer = document.getElementById('forgotPasswordFormContainer');

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

// Opciones para el selector múltiple de Motivo de Consulta organizadas por profesional
const MOTIVOS_CONSULTA_POR_PROFESIONAL = {
    'psicologia_infantil': [
        'Retraso en el lenguaje o en el desarrollo',
        'Trastornos del lenguaje (TDL)',
        'Sospecha Trastorno del espectro autista (TEA)',
        'Problemas de conducta',
        'Trastornos del sueño',
        'Ansiedad por separación / miedos intensos',
        'Síntomas somáticos (dolores, vómitos, regresiones)',
        'Regresiones evolutivas',
        'Hipersensibilidad sensorial o conductas repetitivas',
        'Problemas de atención / sospecha de TDAH',
        'Dificultades en el aprendizaje',
        'Dislexia',
        'Discalculia',
        'Disgrafía',
        'Problemas de concentracion',
        'Ansiedad escolar / fobia escolar',
        'Baja autoestima',
        'retraimiento social',
        'bullying',
        'Conflictos con figuras de autoridad',
        'Síntomas depresivos',
        'Celos entre hermanos',
        'Miedos intensos o trastornos obsesivos (rituales, manías)',
        'Consultas vinculadas a muerte, divorcio o mudanzas',
        'Depresión / síntomas depresivos / desmotivación',
        'Autolesiones',
        'Problemas con la imagen corporal',
        'Aislamiento social o problemas de vinculación con pares',
        'Identidad de género u orientación sexual',
        'Problemas de rendimiento escolar / abandono escolar',
        'Consultas por demanda de terceros (escuela, pediatra, padres separados)',
        'Situaciones de abuso (sexual, físico o emocional)',
        'Violencia familiar (presenciada o sufrida)',
        'Secretos Familiares (ocultar maternidad o paternidad)',
        'Dependencia o uso excesivo de pantallas',
        'Mutismo Selectivo',
        'No controla esfínteres'
    ],
    'fonoaudiologia': [
        'TDL (Trastorno del desarrollo del lenguaje) severo',
        'TDL (Trastorno del desarrollo del lenguaje) moderado',
        'TDL (Trastorno del desarrollo del lenguaje) leve',
        'Mutismo (no TEA)',
        'TSH (Trastorno de los sonidos del habla)',
        'Tartamudez (Disfluencia)',
        'Respiración Bucal',
        'Deglución Disfuncional',
        'Afasia Global',
        'Afasia Mixta',
        'Afasia Expresiva',
        'Disartria',
        'Disfonía',
        'Apraxia del habla',
        'Trastorno Deglutorio'
    ],
    'nutricion': [
        'Sobrepeso/Obesidad',
        'Bajo peso/Desnutrición',
        'Trastornos de la conducta alimentaria',
        'Alergias alimentarias',
        'Intolerancias alimentarias',
        'Diabetes',
        'Hipertensión arterial',
        'Dislipidemias',
        'Anemia',
        'Problemas digestivos',
        'Educación nutricional',
        'Planificación de menús',
        'Suplementación nutricional'
    ],
    'psicologia_adultos': [
        'Ansiedad',
        'Depresión',
        'Estrés laboral',
        'Problemas de pareja',
        'Duelo',
        'Trastornos de personalidad',
        'Trastornos obsesivo-compulsivos',
        'Fobias',
        'Trastornos del sueño',
        'Problemas de autoestima',
        'Crisis vitales',
        'Trastornos adaptativos',
        'Problemas de comunicación',
        'Manejo de emociones',
        'Desarrollo personal'
    ],
    'psicopedagogia': [
        'Dificultades de aprendizaje',
        'Problemas de atención',
        'Dislexia',
        'Discalculia',
        'Disgrafía',
        'Problemas de memoria',
        'Dificultades en comprensión lectora',
        'Problemas de razonamiento lógico',
        'Dificultades en matemáticas',
        'Problemas de organización y planificación',
        'Dificultades en expresión escrita',
        'Problemas de velocidad de procesamiento',
        'Dificultades visoespaciales',
        'Problemas de coordinación motora',
        'Evaluación psicopedagógica'
    ]
};

// Lista de profesionales disponibles
const PROFESIONALES = [
    { id: 'psicologia_infantil', nombre: 'Psicología Infantil', icono: '🧒' },
    { id: 'fonoaudiologia', nombre: 'Fonoaudiología', icono: '🗣️' },
    { id: 'nutricion', nombre: 'Nutrición', icono: '🥗' },
    { id: 'psicologia_adultos', nombre: 'Psicología Adultos', icono: '👨‍🦳' },
    { id: 'psicopedagogia', nombre: 'Psicopedagogía', icono: '📚' }
];

// Variable global para el profesional seleccionado
let profesionalSeleccionado = 'psicologia_infantil'; // Por defecto psicología infantil

// Función para obtener la lista de motivos según el profesional seleccionado
function obtenerMotivosPorProfesional(profesionalId) {
    return MOTIVOS_CONSULTA_POR_PROFESIONAL[profesionalId] || MOTIVOS_CONSULTA_POR_PROFESIONAL['psicologia_infantil'];
}

// Referencias al modal de nueva sesión
const modalNuevaSesion = document.getElementById('modalNuevaSesion');
const formNuevaSesion = document.getElementById('formNuevaSesion');
const selectPaciente = document.getElementById('selectPaciente');
const inputFechaSesion = document.getElementById('inputFechaSesion');
const inputPresentismoSesion = document.getElementById('inputPresentismoSesion');
const inputNotasSesion = document.getElementById('inputNotasSesion');
const cancelNuevaSesion = document.getElementById('cancelNuevaSesion');
// Nuevos campos para pagos
const inputPagoSesion = document.getElementById('inputPagoSesion');
const inputMontoSesion = document.getElementById('inputMontoSesion');
const inputCostoSesion = document.getElementById('inputCostoSesion');

// Formateo y parseo de montos
function formatThousandDotsFromString(str) {
    const digits = String(str || '').replace(/\D/g, '');
    if (!digits) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseMoneyString(str) {
    if (typeof str !== 'string') return Number(str) || 0;
    const clean = str.replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(clean) || 0;
}

function setupMoneyInputs() {
    const moneyInputs = document.querySelectorAll('.money-input');
    moneyInputs.forEach((el) => {
        el.addEventListener('input', () => {
            const caretEnd = el.selectionEnd;
            el.value = formatThousandDotsFromString(el.value);
            try { el.setSelectionRange(caretEnd, caretEnd); } catch (_) {}
        });
        // Inicializar formato si tiene valor
        if (el.value) el.value = formatThousandDotsFromString(el.value);
    });
}

// Inicializar formateo para inputs ya presentes
setupMoneyInputs();

// Referencias al modal de solo lectura para agenda múltiple
const modalDetalleSesionMultiple = document.getElementById('modalDetalleSesionMultiple');
const cerrarDetalleSesionMultiple = document.getElementById('cerrarDetalleSesionMultiple');
const detalleSesionMultipleContent = document.getElementById('detalleSesionMultipleContent');

// Referencias al modal de información de un hermano
const modalInfoHermano = document.getElementById('modalInfoHermano');
const formInfoHermano = document.getElementById('formInfoHermano');
const btnCerrarModalInfoHermano = document.querySelector('#modalInfoHermano button[onclick="cerrarModalInfoHermano()"]');

// Configuración del tema (light, dark, dust)
function setTheme(theme) {
    // Remover todas las clases de tema
    document.documentElement.classList.remove('dark', 'dust');
    document.body.classList.remove('bg-white', 'dust-bg');
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('bg-white', 'dust-bg'); // Quitar ambas clases
        if (themeIcon) themeIcon.textContent = '🏜️'; // Siguiente: dust
        if (themeIconDashboard) themeIconDashboard.textContent = '🏜️';
        localStorage.setItem('theme', 'dark');
    } else if (theme === 'dust') {
        document.documentElement.classList.add('dust');
        document.body.classList.remove('bg-white'); // Quitar bg-white
        document.body.classList.add('dust-bg');
        if (themeIcon) themeIcon.textContent = '☀️'; // Siguiente: light
        if (themeIconDashboard) themeIconDashboard.textContent = '☀️';
        localStorage.setItem('theme', 'dust');
    } else {
        // theme === 'light' o por defecto
        document.body.classList.remove('dust-bg'); // Quitar dust-bg
        document.body.classList.add('bg-white');
        if (themeIcon) themeIcon.textContent = '🌙'; // Siguiente: dark
        if (themeIconDashboard) themeIconDashboard.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
    
    console.log('🎨 Tema cambiado a:', theme);
}

// Detectar preferencia inicial - por defecto dark como solicita el usuario
(function() {
    const saved = localStorage.getItem('theme');
    if (saved && ['light', 'dark', 'dust'].includes(saved)) {
        setTheme(saved);
    } else {
        // Por defecto dark según solicitud del usuario
        setTheme('dark');
    }
})();

// Función para obtener el siguiente tema en el ciclo
function getNextTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const themes = ['light', 'dark', 'dust'];
    const currentIndex = themes.indexOf(currentTheme);
    return themes[(currentIndex + 1) % themes.length];
}

// Event listeners para el tema
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = getNextTheme();
        setTheme(nextTheme);
    });
}

if (themeToggleDashboard) {
    themeToggleDashboard.addEventListener('click', () => {
        const nextTheme = getNextTheme();
        setTheme(nextTheme);
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
    forgotPasswordFormContainer.classList.add('hidden');
}

function showRegisterForm() {
    registerFormContainer.classList.remove('hidden');
    loginFormContainer.classList.add('hidden');
    forgotPasswordFormContainer.classList.add('hidden');
}

function showForgotPasswordForm() {
    forgotPasswordFormContainer.classList.remove('hidden');
    loginFormContainer.classList.add('hidden');
    registerFormContainer.classList.add('hidden');
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

// Event listeners para recuperación de contraseña
const showForgotPasswordFormBtn = document.getElementById('showForgotPasswordForm');
const showLoginFormFromForgotBtn = document.getElementById('showLoginFormFromForgot');

if (showForgotPasswordFormBtn) {
    showForgotPasswordFormBtn.addEventListener('click', showForgotPasswordForm);
}

if (showLoginFormFromForgotBtn) {
    showLoginFormFromForgotBtn.addEventListener('click', showLoginForm);
}

// Botones de demo y contacto (placeholder)
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

// Función para obtener el nombre del profesional que derivó un paciente
async function obtenerNombreProfesionalDerivador(uid) {
    try {
        // Intentar primero en la colección 'usuarios'
        let doc = await window.firebaseDB.collection('usuarios').doc(uid).get();
        if (doc.exists) {
            const data = doc.data();
            return data.name || data.displayName || data.email || 'Profesional';
        }
        
        // Si no existe en 'usuarios', intentar en 'users'
        doc = await window.firebaseDB.collection('users').doc(uid).get();
        if (doc.exists) {
            const data = doc.data();
            return data.name || data.displayName || data.email || 'Profesional';
        }
        
        return 'Profesional';
    } catch (error) {
        console.error('Error al obtener nombre del profesional:', error);
        return 'Profesional';
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
    if (inputPagoSesion) inputPagoSesion.value = '';
    if (inputMontoSesion) inputMontoSesion.value = '';
    
    // Prefill costo sesión con el último usado del paciente (si hay paciente ya cargado en ficha)
    if (inputCostoSesion) {
        inputCostoSesion.value = '';
        (async () => {
            try {
                // Si hay fichaPacienteRef activo, tomar última sesión que tenga 'costo'
                if (fichaPacienteRef) {
                    const lastSnap = await fichaPacienteRef.collection('sesiones').orderBy('fecha', 'desc').limit(1).get();
                    if (!lastSnap.empty) {
                        const last = lastSnap.docs[0].data();
                        if (typeof last.costo !== 'undefined' && last.costo !== null) {
                            const formatted = String(Math.round(Number(last.costo) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                            inputCostoSesion.value = formatted;
                        }
                    }
                }
            } catch (err) {
                console.warn('No se pudo prellenar costo sesión:', err);
            }
        })();
    }
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
    // Detectar admin, derivador y plan del usuario
    const userDoc = await window.firebaseDB.collection('usuarios').doc(user.uid).get();
    isAdmin = userDoc.exists && userDoc.data().isAdmin === true;
    window.isAdmin = isAdmin;
    
    // Verificar si es derivador
    const isDerivador = userDoc.exists && userDoc.data().isDerivar === true;
    window.isDerivador = isDerivador;
    
    // Verificar plan del usuario
    const planUsuario = await verificarPlanUsuario(user.uid);
    window.planUsuario = planUsuario;
    
    // Contar pacientes del usuario
    const cantidadPacientes = await contarPacientesUsuario(user.uid);
    window.cantidadPacientes = cantidadPacientes;
    
    // Función helper para extraer el primer nombre del displayName o email
    function obtenerPrimerNombre(displayName, email) {
        // Si hay displayName, usar ese
        if (displayName && displayName.trim()) {
            const palabras = displayName.trim().split(' ');
            const primerNombre = palabras[0];
            return primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1);
        }
        
        // Si no hay displayName, extraer del email
        if (email && email.includes('@')) {
            const parteLocal = email.split('@')[0];
            return parteLocal.charAt(0).toUpperCase() + parteLocal.slice(1);
        }
        
        return '';
    }
    
    // Función helper para verificar si un usuario es Evelyn o Triana (excepción especial)
    function esUsuarioEspecial(displayName, email) {
        if (!displayName && !email) return false;
        
        const nombreCompleto = displayName || email || '';
        const nombreLower = nombreCompleto.toLowerCase();
        
        // Verificar si es Evelyn o Triana
        return nombreLower.includes('evelyn') || nombreLower.includes('triana');
    }
    
    // Obtener primer nombre del displayName o email
    const primerNombre = obtenerPrimerNombre(user.displayName, user.email);
    
    // Usar el primer nombre para los tags
    const displayNameWithTags = await agregarTagsUsuario(user.uid, primerNombre);
    
    welcomeUser.innerHTML = `Bienvenido${primerNombre ? ', ' + displayNameWithTags : ''}`;
    userEmail.textContent = user.email;
    welcomeBlock.classList.remove('hidden');
    document.getElementById('calendarToggleBlock').classList.remove('hidden');
    document.getElementById('landingPage').classList.add('hidden');
    hideAuthModal();
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
    
    // Cargar recordatorios WhatsApp
    await mostrarRecordatoriosEnDashboard();
    
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
    // Mostrar el botón Backup según el plan
    const btnBackup = document.getElementById('btnBackupPacientes');
    if (btnBackup) {
        if (isAdmin || planUsuario === 'ultra' || planUsuario === 'pro') {
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
    
    // Configurar event listener para el botón Pagos
    const btnPagos = document.getElementById('btnPagos');
    if (btnPagos) {
        btnPagos.addEventListener('click', () => {
            window.location.href = 'pagos.html';
        });
    }
    // Mostrar botón Marketing solo a admins
    const btnMarketing = document.getElementById('btnMarketing');
    if (btnMarketing) {
        const user = window.firebaseAuth && window.firebaseAuth.currentUser;
        // Revisar flag isAdmin en Firestore
        (async () => {
            try {
                if (!user) return;
                const doc = await window.firebaseDB.collection('usuarios').doc(user.uid).get();
                const isAdmin = !!(doc.exists && doc.data().isAdmin === true);
                if (isAdmin) {
                    btnMarketing.classList.remove('hidden');
                }
            } catch (_) {}
        })();
        btnMarketing.addEventListener('click', () => {
            window.location.href = 'marketing.html';
        });
    }
    
    // Mostrar el botón Agenda Múltiple (Calendario compartido) solo para Pro, Ultra y Admin
    const btnAgendaMultiple = document.getElementById('tabAgendaMultiple');
    if (btnAgendaMultiple) {
        if (isAdmin || planUsuario === 'ultra' || planUsuario === 'pro') {
            btnAgendaMultiple.classList.remove('hidden');
        } else {
            btnAgendaMultiple.classList.add('hidden');
        }
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

// Recuperación de contraseña
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.forgotPasswordEmail.value;
    try {
        await window.firebaseAuth.sendPasswordResetEmail(email);
        showMessage('Se ha enviado un email de recuperación a tu dirección de correo. Revisa tu bandeja de entrada y sigue las instrucciones.', 'success');
        showLoginForm(); // Volver al formulario de login
    } catch (error) {
        showMessage('Error al enviar email de recuperación: ' + error.message);
    }
});

// Mantener sesión iniciada
window.firebaseAuth.onAuthStateChanged(user => {
    if (user) {
        // Verificar si debe ir directamente al dashboard
        const goToDashboard = sessionStorage.getItem('goToDashboard');
        if (goToDashboard === 'true') {
            // Limpiar la bandera
            sessionStorage.removeItem('goToDashboard');
            // Ocultar landing page inmediatamente
            document.getElementById('landingPage').classList.add('hidden');
        }
        
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

// Función para cambiar el profesional seleccionado
function cambiarProfesional(profesionalId) {
    profesionalSeleccionado = profesionalId;
    cargarOpcionesMotivoConsulta();
    
    // Actualizar botones activos
    document.querySelectorAll('.btn-profesional').forEach(btn => {
        btn.classList.remove('bg-primary-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
    });
    
    const btnActivo = document.querySelector(`[data-profesional="${profesionalId}"]`);
    if (btnActivo) {
        btnActivo.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        btnActivo.classList.add('bg-primary-600', 'text-white');
    }
}

// Función para cargar opciones en los checkboxes de motivo de consulta
function cargarOpcionesMotivoConsulta() {
    const checkboxesAgregar = document.getElementById('patientMotivoCheckboxes');
    const checkboxesEditar = document.getElementById('editPatientMotivoCheckboxes');
    
    console.log('📋 Cargando opciones de motivo de consulta para profesional:', profesionalSeleccionado);
    console.log('🔍 Checkboxes agregar encontrado:', !!checkboxesAgregar);
    console.log('🔍 Checkboxes editar encontrado:', !!checkboxesEditar);
    
    const motivosActuales = obtenerMotivosPorProfesional(profesionalSeleccionado);
    
    if (checkboxesAgregar) {
        checkboxesAgregar.innerHTML = '';
        motivosActuales.forEach(motivo => {
            const div = document.createElement('div');
            div.className = 'flex items-center space-x-2';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `patientMotivo_${motivo.replace(/\s+/g, '_')}`;
            checkbox.name = 'patientMotivo';
            checkbox.value = motivo;
            checkbox.className = 'checkbox checkbox-sm checkbox-primary';
            
            const label = document.createElement('label');
            label.htmlFor = `patientMotivo_${motivo.replace(/\s+/g, '_')}`;
            label.className = 'text-sm text-gray-700 dark:text-gray-300 cursor-pointer';
            label.textContent = motivo;
            
            div.appendChild(checkbox);
            div.appendChild(label);
            checkboxesAgregar.appendChild(div);
        });
        console.log('✅ Checkboxes cargados en agregar:', checkboxesAgregar.children.length);
    }
    
    if (checkboxesEditar) {
        checkboxesEditar.innerHTML = '';
        console.log('🔧 Generando checkboxes para editar...');
        motivosActuales.forEach((motivo, index) => {
            const div = document.createElement('div');
            div.className = 'flex items-center space-x-2';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `editPatientMotivo_${motivo.replace(/\s+/g, '_')}`;
            checkbox.name = 'editPatientMotivo';
            checkbox.value = motivo;
            checkbox.className = 'checkbox checkbox-sm checkbox-primary';
            
            console.log(`🔧 Checkbox ${index + 1} creado con valor:`, motivo);
            
            const label = document.createElement('label');
            label.htmlFor = `editPatientMotivo_${motivo.replace(/\s+/g, '_')}`;
            label.className = 'text-sm text-gray-700 dark:text-gray-300 cursor-pointer';
            label.textContent = motivo;
            
            div.appendChild(checkbox);
            div.appendChild(label);
            checkboxesEditar.appendChild(div);
            
            console.log(`🔧 Checkbox ${index + 1} creado:`, motivo);
        });
        console.log('✅ Checkboxes cargados en editar:', checkboxesEditar.children.length);
        console.log('✅ Checkboxes DOM generados:', checkboxesEditar.querySelectorAll('input[type="checkbox"]').length);
    }
}

// Función para crear los botones de profesionales
function crearBotonesProfesionales() {
    const contenedorAgregar = document.getElementById('botonesProfesionalesAgregar');
    const contenedorEditar = document.getElementById('botonesProfesionalesEditar');
    
    const crearBotones = (contenedor) => {
        if (!contenedor) return;
        
        contenedor.innerHTML = '';
        PROFESIONALES.forEach(profesional => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `btn-profesional px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                profesional.id === profesionalSeleccionado 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`;
            btn.setAttribute('data-profesional', profesional.id);
            btn.onclick = () => cambiarProfesional(profesional.id);
            btn.innerHTML = `${profesional.icono} ${profesional.nombre}`;
            
            contenedor.appendChild(btn);
        });
    };
    
    crearBotones(contenedorAgregar);
    crearBotones(contenedorEditar);
}

// Función para obtener los motivos seleccionados de los checkboxes
function obtenerMotivosSeleccionados(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Función para establecer los motivos seleccionados en los checkboxes
function establecerMotivosSeleccionados(containerId, motivos) {
    const container = document.getElementById(containerId);
    console.log('🔧 Estableciendo motivos seleccionados para:', containerId);
    console.log('🔧 Contenedor encontrado:', !!container);
    console.log('🔧 Motivos recibidos:', motivos);
    console.log('🔧 Es array:', Array.isArray(motivos));
    
    if (!container) {
        console.error('❌ No se encontró el contenedor:', containerId);
        return;
    }
    
    if (!motivos || !Array.isArray(motivos)) {
        console.log('⚠️ No hay motivos para establecer o no es un array');
        return;
    }
    
    // Primero desmarcar todos
    const allCheckboxes = container.querySelectorAll('input[type="checkbox"]');
    console.log('🔧 Total de checkboxes encontrados:', allCheckboxes.length);
    
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Luego marcar los que están en la lista
    let marcados = 0;
    allCheckboxes.forEach(checkbox => {
        console.log('🔍 Verificando checkbox:', checkbox.value, 'contra motivos:', motivos);
        console.log('🔍 Checkbox value:', checkbox.value);
        console.log('🔍 Motivos incluye este valor:', motivos.includes(checkbox.value));
        if (motivos.includes(checkbox.value)) {
            checkbox.checked = true;
            marcados++;
            console.log('✅ Marcado:', checkbox.value);
        } else {
            console.log('❌ No marcado:', checkbox.value);
        }
    });
    
    console.log('✅ Total de checkboxes marcados:', marcados);
}

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
    
    // Limpiar pestañas del formulario
    limpiarPestanasFormulario();
};

showAddPatientBtn.addEventListener('click', async () => {
    // Verificar límites según el plan
    const planUsuario = window.planUsuario || 'gratis';
    const cantidadPacientes = window.cantidadPacientes || 0;
    
    console.log(`🔍 Debug Agregar Paciente - Plan: ${planUsuario}, Cantidad actual: ${cantidadPacientes}`);
    
    // Si es derivador, mostrar página de precios
    if (window.isDerivador) {
        showMessage('Para agregar pacientes, actualiza a un plan Pro o Ultra.', 'info');
        abrirModalPrecios();
        return;
    }
    
    // Si es usuario Gratis, verificar límite de 3 pacientes
    if (planUsuario === 'gratis') {
        if (cantidadPacientes >= 3) {
            showMessage('Has alcanzado el límite de 3 pacientes para el plan Gratis. Actualiza a Pro o Ultra para más pacientes.', 'info');
            abrirModalPrecios();
            return;
        }
    }
    
    // Verificar límites para plan Pro (10 pacientes)
    if (planUsuario === 'pro') {
        if (cantidadPacientes >= 10) {
            showMessage('Has alcanzado el límite de 10 pacientes para el plan Pro. Actualiza a Ultra para pacientes ilimitados.', 'error');
            abrirModalPrecios();
            return;
        }
    }
    
    // Plan Ultra y Admin no tienen límites
    if (planUsuario === 'ultra' || planUsuario === 'admin') {
        console.log(`✅ Usuario ${planUsuario} - Sin límite de pacientes`);
    }
    
    addPatientModal.classList.remove('hidden');
    addPatientForm.reset();
    limpiarDatosFamilia('agregar');
    // Cargar opciones del selector de motivos
    cargarOpcionesMotivoConsulta();
    // Crear botones de profesionales
    crearBotonesProfesionales();
    // Configurar botones de hermanos después de mostrar el modal
    setTimeout(() => configurarBotonesHermanos(), 100);
});
// Cargar pacientes desde Firestore
async function loadPatients(uid) {
    console.log('📋 Cargando pacientes para UID:', uid);
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
    console.log(`📋 Total de pacientes a renderizar: ${pacientes.length}`);
    
    for (const { id, data: p } of pacientes) {
        console.log(`🎯 Renderizando paciente: ${p.nombre} (ID: ${id})`);
        const div = document.createElement('div');
        
        // Verificar si el paciente fue derivado
        const esDerivado = p.derivadoEl && p.derivadoPor;
        let nombreDerivador = '';
        
        if (esDerivado) {
            try {
                nombreDerivador = await obtenerNombreProfesionalDerivador(p.derivadoPor);
            } catch (error) {
                nombreDerivador = 'Profesional';
            }
        }
        
        // Consultar última sesión para resaltar si desiste tratamiento
        let ultimaSesDesiste = false;
        try {
            const lastSesSnap = await window.firebaseDB
                .collection('pacientes').doc(id)
                .collection('sesiones')
                .orderBy('fecha', 'desc')
                .limit(1)
                .get();
            if (!lastSesSnap.empty) {
                const lastData = lastSesSnap.docs[0].data();
                const lastPresentismo = (lastData.presentismo || '').toLowerCase();
                ultimaSesDesiste = lastPresentismo.includes('desiste');
            }
        } catch (e) {
            console.warn('No se pudo obtener última sesión de', id, e);
        }
        // Fallback por 'creado'
        if (!ultimaSesDesiste) {
            try {
                const lastByCreated = await window.firebaseDB
                    .collection('pacientes').doc(id)
                    .collection('sesiones')
                    .orderBy('creado', 'desc')
                    .limit(1)
                    .get();
                if (!lastByCreated.empty) {
                    const lastData = lastByCreated.docs[0].data();
                    const lastPresentismo = (lastData.presentismo || '').toLowerCase();
                    ultimaSesDesiste = lastPresentismo.includes('desiste');
                }
            } catch (e2) {
                console.warn('Fallback por creado falló para', id, e2);
            }
        }
        
        // Aplicar clases CSS según si es derivado o no
        const baseClasses = 'border rounded p-3 cursor-pointer transition';
        const normalClasses = 'bg-gray-50 dark:bg-darkbg hover:bg-primary-50 dark:hover:bg-darkborder';
        const derivadoClasses = 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30';
        
        const cardClasses = ultimaSesDesiste
            ? `${baseClasses} ${normalClasses}`
            : (esDerivado ? `${baseClasses} ${derivadoClasses}` : `${baseClasses} ${normalClasses}`);
        
        div.className = `${cardClasses}`;
        div.setAttribute('data-paciente-id', id);
        
        // Crear avatar del paciente
        let avatarHTML = '';
        console.log(`👤 Paciente ${p.nombre}: foto existe = ${!!p.foto}`);
        console.log(`🔍 Datos completos del paciente ${p.nombre}:`, p);
        
        if (p.foto) {
            console.log(`📸 Mostrando foto para ${p.nombre}`);
            console.log(`📸 URL de la foto:`, p.foto.substring(0, 100) + '...');
            avatarHTML = `<img src="${p.foto}" alt="Foto de ${p.nombre}" class="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600">`;
        } else {
            console.log(`🎨 Mostrando avatar por defecto para ${p.nombre} - NO TIENE FOTO`);
            // Avatar por defecto con iniciales
            const iniciales = p.nombre ? p.nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'P';
            avatarHTML = `<div class="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm border-2 border-gray-200 dark:border-gray-600">${iniciales}</div>`;
        }
        
        let contenidoHTML = `
            <div class="flex items-center gap-3">
                ${avatarHTML}
                <div>
                    <div class="font-bold ${ultimaSesDesiste ? 'text-red-700 dark:text-red-300' : 'text-[#2d3748] dark:text-gray-100'}">${p.nombre || ''}${ultimaSesDesiste ? ' (desiste)' : ''}</div>
        `;
        
        // Agregar información de derivación si corresponde
        if (esDerivado) {
            contenidoHTML += `
                <div class="text-sm text-green-600 dark:text-green-400 mt-1">
                    📤 Paciente derivado de ${nombreDerivador}
                </div>
            `;
        }
        
        contenidoHTML += `</div></div>`;
        div.innerHTML = contenidoHTML;
        patientsList.appendChild(div);
    }
}
    // Agregar paciente
addPatientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = window.firebaseAuth.currentUser;
    if (!user) return;
    
    // Verificar límites según el plan antes de agregar
    const planUsuario = window.planUsuario || 'gratis';
    const cantidadPacientes = window.cantidadPacientes || 0;
    
    if (planUsuario === 'pro' && cantidadPacientes >= 10) {
        showMessage('Has alcanzado el límite de 10 pacientes para el plan Pro. Actualiza a Ultra para pacientes ilimitados.', 'error');
        abrirModalPrecios();
        return;
    }
    
    // Obtener todos los valores del formulario
    const nombre = addPatientForm.patientName.value;
    const dni = addPatientForm.patientDni.value;
    const fechaNacimiento = addPatientForm.patientFechaNacimiento.value;
    const sexo = addPatientForm.patientSexo.value;
    const lugarNacimiento = addPatientForm.patientLugarNacimiento.value;
    const email = addPatientForm.patientEmail.value;
    const telefono = addPatientForm.patientTelefono.value;
    const contacto = addPatientForm.patientContacto.value;
    const direccion = addPatientForm.patientDireccion.value;
    const educacion = addPatientForm.patientEducacion.value;
    const instituto = addPatientForm.patientInstituto.value;
    const motivos = obtenerMotivosSeleccionados('patientMotivoCheckboxes');

    // Obtener datos del colegio
    const infoColegio = {
        nombre: addPatientForm.patientColegioNombre.value,
        grado: addPatientForm.patientColegioGrado.value,
        turno: addPatientForm.patientColegioTurno.value,
        telefono: addPatientForm.patientColegioTelefono.value,
        direccion: addPatientForm.patientColegioDireccion.value,
        observaciones: addPatientForm.patientColegioObservaciones.value
    };

    // Obtener datos de familia
    const infoPadre = {
        nombre: addPatientForm.patientPadreNombre.value,
        edad: addPatientForm.patientPadreEdad.value,
        dni: addPatientForm.patientPadreDni.value,
        email: addPatientForm.patientPadreEmail.value,
        direccion: addPatientForm.patientPadreDireccion.value,
        ocupacion: addPatientForm.patientPadreOcupacion.value,
        nacionalidad: addPatientForm.patientPadreNacionalidad.value,
        estudios: addPatientForm.patientPadreEstudios.value,
        estadoCivil: addPatientForm.patientPadreEstadoCivil.value
    };

    const infoMadre = {
        nombre: addPatientForm.patientMadreNombre.value,
        edad: addPatientForm.patientMadreEdad.value,
        dni: addPatientForm.patientMadreDni.value,
        email: addPatientForm.patientMadreEmail.value,
        direccion: addPatientForm.patientMadreDireccion.value,
        ocupacion: addPatientForm.patientMadreOcupacion.value,
        nacionalidad: addPatientForm.patientMadreNacionalidad.value,
        estudios: addPatientForm.patientMadreEstudios.value,
        estadoCivil: addPatientForm.patientMadreEstadoCivil.value
    };



    // Obtener datos del nomenclador CIE-10 si fueron seleccionados
    const datosCIE10 = obtenerDatosCIE10('agregar');

    // Obtener la foto del paciente si existe
    const fotoPaciente = patientPhotoData;

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
            // Foto del paciente
            foto: fotoPaciente,
            // Información de contacto
            email,
            telefono,
            contacto,
            direccion,
            // Información educativa
            educacion,
            instituto,
            // Información del colegio
            infoColegio,
            // Motivo de consulta
            motivos,
            profesionalSeleccionado,
            // Información de familia
            infoPadre,
            infoMadre,
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
        
        // Actualizar contador de pacientes
        window.cantidadPacientes = (window.cantidadPacientes || 0) + 1;
        
        // Limpiar datos del nomenclador después de guardar
        datosNomencladorSeleccionados.agregar = null;
        const spanAgregar = document.getElementById('nomencladorSeleccionadoAgregar');
        if (spanAgregar) {
            spanAgregar.textContent = '';
            spanAgregar.classList.add('hidden');
        }
        
        // Limpiar foto del paciente
        patientPhotoData = null;
        patientPhotoBlob = null;
        
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

// Función para generar el HTML de la ficha clínica
function generarHTMLFichaClinica(p, pacienteId) {
    // Calcular edad si hay fecha de nacimiento
    let edadTexto = '';
    if (p.fechaNacimiento) {
        const hoy = new Date();
        const fechaNac = new Date(p.fechaNacimiento);
        const edad = Math.floor((hoy - fechaNac) / (365.25 * 24 * 60 * 60 * 1000));
        edadTexto = ` (${edad} años)`;
    }
    
    // Crear avatar del paciente para la ficha
    let avatarHTML = '';
    if (p.foto) {
        avatarHTML = `<img src="${p.foto}" alt="Foto de ${p.nombre}" class="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600">`;
    } else {
        // Avatar por defecto con iniciales
        const iniciales = p.nombre ? p.nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'P';
        avatarHTML = `<div class="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl border-2 border-gray-200 dark:border-gray-600">${iniciales}</div>`;
    }
    
    return `
        <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
                <div class="flex items-center gap-4 mb-3">
                    ${avatarHTML}
                    <div>
                        <div class="font-bold text-[#2d3748] dark:text-gray-100 text-lg">${p.nombre || ''}${edadTexto}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">ID: ${pacienteId}</div>
                    </div>
                </div>
                
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
                <div class="mb-3 border-t pt-3">
                    <button onclick="abrirModalInfoHermanos('${pacienteId}')" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full max-w-xs">
                        👫 Info. Hermanos ${p.infoHermanos && p.infoHermanos.length > 0 ? '✓' : ''}
                    </button>
                </div>
                
                <!-- Motivo de Consulta -->
                ${p.motivos && p.motivos.length > 0 ? `
                <div class="text-[#4b5563] dark:text-gray-200 text-sm mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span class="font-semibold">Motivos de Consulta:</span>
                    <ul class="mt-1 list-disc list-inside space-y-1">
                        ${p.motivos.map(motivo => `<li>${motivo}</li>`).join('')}
                    </ul>
                </div>` : ''}
                
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
            <div class="flex flex-col gap-2">
                <div class="flex gap-2">
                    <button onclick="showEditPatientModal('${pacienteId}', ${JSON.stringify(p).replace(/"/g, '&quot;')})" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1">
                        ✏️ Editar
                    </button>
                    ${window.isAdmin ? `
                    <button onclick="abrirModalDerivarSeguro(this)"
                            data-paciente-id="${pacienteId}"
                            data-paciente-nombre="${(p.nombre || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}"
                            data-paciente-email="${(p.email || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}"
                            class="bg-orange-600 hover:bg-orange-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1">
                        🔄 Derivar
                    </button>
                    ` : ''}
                </div>
                ${window.isAdmin ? `
                <button onclick="eliminarPaciente('${pacienteId}')" class="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1 w-full">
                    🗑️ Eliminar
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

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
    
    // Generar HTML de la ficha clínica
    fichaPacienteDatos.innerHTML = generarHTMLFichaClinica(p, fichaPacienteId);
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
    
    // Obtener último costo para prellenar en el formulario principal también
    let lastCosto = 0;
    if (sesionesParaMostrar.length > 0) {
        const first = sesionesParaMostrar[0].data;
        if (typeof first.costo !== 'undefined' && first.costo !== null) {
            lastCosto = Number(first.costo) || 0;
        }
    }
    const costoInput = document.getElementById('sesionCosto');
    if (costoInput) {
        costoInput.value = lastCosto ? String(Math.round(lastCosto)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
    }

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
        `;

        // Estado de pagos (resumen por sesión)
        {
            const parseMoney = (val) => {
                if (typeof val === 'number') return isNaN(val) ? 0 : val;
                if (typeof val === 'string') {
                    const clean = val.replace(/\./g, '').replace(/,/g, '.');
                    const n = parseFloat(clean);
                    return isNaN(n) ? 0 : n;
                }
                return 0;
            };
            const fmt = (n) => (Number(n) || 0).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            const pago = s.pago || 'debe';
            const costo = parseMoney(s.costo);
            const pagado = parseMoney(s.monto);
            const saldo = costo - pagado;
            const pagoTexto = pago === 'pago' ? 'Pagado' : (pago === 'pago-una-parte' ? 'Pago parcial' : 'Pendiente');
            htmlContent += `
                <div class="text-xs mt-1"><span class="font-semibold">Pago:</span> ${pagoTexto} · Costo $${fmt(costo)} · Pagado $${fmt(pagado)} · Saldo $${fmt(saldo)}</div>
            `;
        }

        htmlContent += `
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

// === MODAL DE HISTORIAL EXPANDIDO ===

// Variables globales para el modal de historial
let historialOverlay = null;

// Función para crear HTML de una sesión para el modal expandido
function crearHtmlSesionModal(sesionInfo, esPrimera) {
    const s = sesionInfo.data;
    
    let htmlContent = '<div class="sesion-item bg-white dark:bg-gray-800">';
    
    if (esPrimera) {
        htmlContent += `
            <div class="flex items-center gap-3 mb-4">
                <span class="text-2xl">🌟</span>
                <span class="text-base font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800 px-3 py-2 rounded-full">
                    Primera Sesión
                </span>
            </div>
        `;
    }
    
    htmlContent += `
        <div class="mb-4">
            <div class="text-lg font-bold text-[#2d3748] dark:text-gray-100 mb-2">
                <span class="font-semibold">Fecha:</span> ${s.fecha || ''}
            </div>
            ${s.presentismo ? `<div class=\"text-sm mb-2 text-gray-600 dark:text-gray-400\"><span class=\"font-semibold\">Presentismo:</span> ${obtenerTextoPresentismo(s.presentismo)}</div>` : ''}
    `;

    // Bloque de pagos para el modal
    {
        const parseMoney = (val) => {
            if (typeof val === 'number') return isNaN(val) ? 0 : val;
            if (typeof val === 'string') {
                const clean = val.replace(/\./g, '').replace(/,/g, '.');
                const n = parseFloat(clean);
                return isNaN(n) ? 0 : n;
            }
            return 0;
        };
        const fmt = (n) => (Number(n) || 0).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        const pago = s.pago || 'debe';
        const costo = parseMoney(s.costo);
        const pagado = parseMoney(s.monto);
        const saldo = costo - pagado;
        const pagoTexto = pago === 'pago' ? 'Pagado' : (pago === 'pago-una-parte' ? 'Pago parcial' : 'Pendiente');
        htmlContent += `
            <div class=\"text-sm mb-2 text-gray-600 dark:text-gray-400\"><span class=\"font-semibold\">Pago:</span> ${pagoTexto} · Costo $${fmt(costo)} · Pagado $${fmt(pagado)} · Saldo $${fmt(saldo)}</div>
        `;
    }

    htmlContent += `
        </div>
        
        <div class="mb-4">
            <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Observaciones:</h5>
            <div class="text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg leading-relaxed">
                ${s.comentario || 'Sin observaciones registradas'}
            </div>
        </div>
    `;
    
    if (s.notas) {
        htmlContent += `
            <div class="mb-4">
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Notas adicionales:</h5>
                <div class="text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    ${s.notas}
                </div>
            </div>
        `;
    }
    
    // Agregar información del nomenclador CIE-10 si existe
    if (s.nomencladorCIE10) {
        const cie10 = s.nomencladorCIE10;
        htmlContent += `
            <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                <div class="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">📋 Clasificación CIE-10</div>
                <div class="text-sm text-blue-600 dark:text-blue-400">
                    <div class="mb-1"><strong>Código:</strong> ${cie10.codigo}</div>
                    <div class="mb-2"><strong>Categoría:</strong> ${cie10.categoriaNombre}</div>
                    <div class="text-blue-500 dark:text-blue-300">${cie10.descripcion}</div>
                </div>
            </div>
        `;
    }
    
    // Agregar archivos adjuntos
    if (s.archivosUrls && s.archivosUrls.length) {
        htmlContent += `
            <div class="mb-4">
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Archivos adjuntos:</h5>
                <div class="flex flex-col gap-2">
                    ${s.archivosUrls.map((url, index) => `
                        <a href="${url}" target="_blank" class="text-primary-700 underline dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                            📎 Ver archivo adjunto ${index + 1}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    htmlContent += '</div>';
    return htmlContent;
}

// Función para mostrar el modal de historial expandido
async function mostrarHistorialExpandido() {
    if (!fichaPacienteRef) return;
    
    console.log('📋 Abriendo historial expandido...');
    
    // Crear overlay si no existe
    if (!historialOverlay) {
        historialOverlay = document.createElement('div');
        historialOverlay.className = 'historial-fullscreen-bg';
        document.body.appendChild(historialOverlay);
    }
    
    // Cargar datos del paciente
    const pacienteDoc = await fichaPacienteRef.get();
    const pacienteData = pacienteDoc.data();
    const nombrePaciente = pacienteData?.nombre || pacienteData?.email || 'Paciente';
    
    // Cargar sesiones
    const snapshot = await fichaPacienteRef.collection('sesiones').orderBy('fecha', 'desc').get();
    
    if (snapshot.empty) {
        historialOverlay.innerHTML = `
            <div class="historial-fullscreen-modal">
                <div class="historial-fullscreen-header">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">📋 Historial Completo - ${nombrePaciente}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Vista expandida del historial de sesiones</p>
                    </div>
                    <button class="historial-fullscreen-close" onclick="cerrarHistorialExpandido()">✕ Cerrar</button>
                </div>
                <div class="historial-fullscreen-content">
                    <div class="text-center py-16 text-gray-500 dark:text-gray-400">
                        <div class="text-6xl mb-4">📝</div>
                        <p>No hay sesiones registradas para este paciente.</p>
                    </div>
                </div>
            </div>
        `;
        historialOverlay.style.display = 'flex';
        return;
    }
    
    // Procesar sesiones como en loadSesiones()
    const sesionesArray = [];
    snapshot.forEach(doc => {
        const s = doc.data();
        sesionesArray.push({
            id: doc.id,
            data: s,
            fecha: new Date(s.fecha).getTime()
        });
    });
    
    const sesionesConComentarios = sesionesArray.filter(sesion => {
        return tieneComentariosValidos(sesion.data.comentario);
    });
    
    sesionesConComentarios.sort((a, b) => a.fecha - b.fecha);
    const sesionesParaMostrar = [...sesionesArray].sort((a, b) => b.fecha - a.fecha);
    const primeraSesionConComentariosId = sesionesConComentarios.length > 0 ? sesionesConComentarios[0].id : null;
    
    // Generar HTML del contenido
    let contenidoSesiones = '';
    sesionesParaMostrar.forEach(sesionInfo => {
        const esPrimera = sesionInfo.id === primeraSesionConComentariosId;
        contenidoSesiones += crearHtmlSesionModal(sesionInfo, esPrimera);
    });
    
    historialOverlay.innerHTML = `
        <div class="historial-fullscreen-modal">
            <div class="historial-fullscreen-header">
                <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">📋 Historial Completo - ${nombrePaciente}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Vista expandida del historial de sesiones (${sesionesParaMostrar.length} sesiones)</p>
                </div>
                <button class="historial-fullscreen-close" onclick="cerrarHistorialExpandido()">✕ Cerrar</button>
            </div>
            <div class="historial-fullscreen-content">
                ${contenidoSesiones}
            </div>
        </div>
    `;
    
    historialOverlay.style.display = 'flex';
    console.log('✅ Historial expandido mostrado');
}

// Función para cerrar el modal de historial expandido
window.cerrarHistorialExpandido = function() {
    if (historialOverlay) {
        historialOverlay.style.display = 'none';
        console.log('📋 Historial expandido cerrado');
    }
}

// Event listener para el botón de maximizar historial
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar selectores de motivo de consulta
    cargarOpcionesMotivoConsulta();
    // Crear botones de profesionales
    crearBotonesProfesionales();
    
    setTimeout(() => {
        const historialMaxBtn = document.getElementById('historialMaximizeBtn');
        if (historialMaxBtn) {
            historialMaxBtn.addEventListener('click', mostrarHistorialExpandido);
            console.log('✅ Event listener del historial expandido configurado');
        }
    }, 1000);
    
    // Event listener para cerrar modal con ESC y clic fuera
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && historialOverlay && historialOverlay.style.display === 'flex') {
            cerrarHistorialExpandido();
        }
        
        // Cerrar modal de derivación con ESC
        const modalDerivar = document.getElementById('modalDerivarPaciente');
        if (e.key === 'Escape' && modalDerivar && !modalDerivar.classList.contains('hidden')) {
            cerrarModalDerivar();
        }
    });
    
    // Event listener para clic fuera del modal
    document.addEventListener('click', function(e) {
        if (historialOverlay && e.target === historialOverlay && historialOverlay.style.display === 'flex') {
            cerrarHistorialExpandido();
        }
        
        // Cerrar modal de derivación si se hace clic fuera
        const modalDerivar = document.getElementById('modalDerivarPaciente');
        if (modalDerivar && e.target === modalDerivar && !modalDerivar.classList.contains('hidden')) {
            cerrarModalDerivar();
        }
    });
});
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
        
        // Obtener datos de pago
        const pago = addSesionForm.sesionPago ? addSesionForm.sesionPago.value : 'debe';
        // Parsear montos con separadores (puntos) a número
        const parseMoney = (val) => {
            if (typeof val !== 'string') return Number(val) || 0;
            const clean = val.replace(/\./g, '').replace(/,/g, '.');
            return parseFloat(clean) || 0;
        };
        const monto = addSesionForm.sesionMonto ? parseMoney(addSesionForm.sesionMonto.value) : 0;
        const costo = addSesionForm.sesionCosto ? parseMoney(addSesionForm.sesionCosto.value) : 0;
        
        console.log('💰 Datos de pago a guardar:', { pago, monto });
        console.log('💰 Elementos del formulario:', {
            sesionPago: addSesionForm.sesionPago,
            sesionMonto: addSesionForm.sesionMonto,
            pagoValue: addSesionForm.sesionPago ? addSesionForm.sesionPago.value : 'no existe',
            montoValue: addSesionForm.sesionMonto ? addSesionForm.sesionMonto.value : 'no existe'
        });
        
        const datosSession = {
            fecha,
            comentario,
            notas,
            presentismo,
            pago,
            monto,
            costo,
            archivosUrls,
            creado: new Date()
        };
        
        console.log('💾 Datos completos de la sesión a guardar:', datosSession);
        
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

// Función auxiliar para determinar si un usuario es de prueba
function esUsuarioTest(u) {
  return u.isTest === true || 
         (u.email && u.email.toLowerCase().includes('test')) ||
         (u.displayName && u.displayName.toLowerCase().includes('test')) ||
         (u.email && u.email.toLowerCase().includes('malaika')) ||
         (u.email && u.email.toLowerCase().includes('cristiansan'));
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
      adminPanelState.profesionales = usuariosSnap.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          uid: doc.id
        };
      });
    }
    
    // Ordenar profesionales alfabéticamente por nombre
    const profesionalesOrdenados = [...adminPanelState.profesionales].sort((a, b) => {
      const nombreA = (a.displayName || a.email || '').toLowerCase();
      const nombreB = (b.displayName || b.email || '').toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
    
    for (const u of profesionalesOrdenados) {
      const avatarUrl = u.photoURL ? u.photoURL : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName || u.email || 'U')}&background=8b5cf6&color=fff&size=80`;
      
      // Verificar si el usuario es derivador para agregar el tag
      const displayNameWithTag = await agregarTagsUsuario(u.uid, u.displayName || u.email);
      
      html += `<li>
        <button class="w-full text-left flex items-center gap-2 px-3 py-2 rounded transition font-medium
          ${adminPanelState.selectedUser === u.uid ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'hover:bg-primary-50 dark:hover:bg-darkborder text-gray-700 dark:text-gray-200'}"
          data-uid="${u.uid}">
          <img src="${avatarUrl}" alt="avatar" class="w-10 h-10 rounded-full object-cover border border-primary-200 dark:border-primary-700 bg-gray-100 dark:bg-gray-800" />
          <span>${displayNameWithTag}</span>
          ${u.isAdmin ? '<span class=\"text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2\">admin</span>' : ''}
          ${esUsuarioTest(u) ? '<span class=\"text-xs bg-orange-100 text-orange-700 rounded px-2 py-0.5 ml-2\">Test</span>' : ''}
        </button>
      </li>`;
    }
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
      // Verificar si el usuario es derivador para agregar el tag en el header
      const displayNameWithTagHeader = await agregarTagsUsuario(u.uid, u.displayName || u.email);
      
      html += `<div class="mb-4 font-bold text-lg flex items-center gap-2">
         <span class="text-white">${displayNameWithTagHeader}</span>
        ${u.isAdmin ? '<span class=\"text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2\">admin</span>' : ''}
        ${esUsuarioTest(u) ? '<span class=\"text-xs bg-orange-100 text-orange-700 rounded px-2 py-0.5 ml-2\">Test</span>' : ''}
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
      // Verificar si el usuario es derivador para agregar el tag en el header
      const displayNameWithTagHeader2 = await agregarTagsUsuario(u.uid, u.displayName || u.email);
      
      headerHtml += `<div class="mb-4 font-bold text-lg flex items-center gap-2">👤 ${displayNameWithTagHeader2} ${u.isAdmin ? '<span class=\"text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2\">admin</span>' : ''} ${esUsuarioTest(u) ? '<span class=\"text-xs bg-orange-100 text-orange-700 rounded px-2 py-0.5 ml-2\">Test</span>' : ''}</div>`;
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
          // Verificar si el paciente fue derivado
          const esDerivado = p.derivadoEl && p.derivadoPor;
          let nombreDerivador = '';
          
          if (esDerivado) {
            try {
              nombreDerivador = await obtenerNombreProfesionalDerivador(p.derivadoPor);
            } catch (error) {
              nombreDerivador = 'Profesional';
            }
          }
          
          // Consultar última sesión para resaltar si desiste tratamiento
          let ultimaSesDesiste = false;
          try {
            const lastSesSnap = await window.firebaseDB
              .collection('pacientes').doc(id)
              .collection('sesiones')
              .orderBy('fecha', 'desc')
              .limit(1)
              .get();
            if (!lastSesSnap.empty) {
              const lastData = lastSesSnap.docs[0].data();
              const lastPresentismo = (lastData.presentismo || '').toLowerCase();
              ultimaSesDesiste = lastPresentismo.includes('desiste');
            }
          } catch (e) {
            console.warn('No se pudo obtener última sesión de', id, e);
          }
          // Fallback por 'creado'
          if (!ultimaSesDesiste) {
            try {
                const lastByCreated = await window.firebaseDB
                    .collection('pacientes').doc(id)
                    .collection('sesiones')
                    .orderBy('creado', 'desc')
                    .limit(1)
                    .get();
                if (!lastByCreated.empty) {
                    const lastData = lastByCreated.docs[0].data();
                    const lastPresentismo = (lastData.presentismo || '').toLowerCase();
                    ultimaSesDesiste = lastPresentismo.includes('desiste');
                }
            } catch (e2) {
                console.warn('Fallback por creado falló para', id, e2);
            }
          }
          
          // Aplicar clases CSS según si es derivado o no
          const baseClasses = 'border rounded p-3 cursor-pointer transition';
          const normalClasses = 'bg-gray-50 dark:bg-darkbg hover:bg-primary-50 dark:hover:bg-darkborder';
          const derivadoClasses = 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30';
          
          const cardClasses = ultimaSesDesiste
            ? `${baseClasses} ${normalClasses}`
            : (esDerivado ? `${baseClasses} ${derivadoClasses}` : `${baseClasses} ${normalClasses}`);
          
          const div = document.createElement('div');
          div.className = `${cardClasses}`;
          div.setAttribute('data-paciente-id', id);
          
          div.innerHTML = `
            <div class="font-bold ${ultimaSesDesiste ? 'text-red-700 dark:text-red-300' : 'text-[#2d3748] dark:text-gray-100'}">${p.nombre || '(sin nombre)'}${ultimaSesDesiste ? ' (desiste)' : ''}</div>\n`;
          
          // Agregar información de derivación si corresponde
          if (esDerivado) {
            div.innerHTML += `<div class=\"text-sm text-green-600 dark:text-green-400 mt-1\">📤 Derivado de ${nombreDerivador}</div>\n`;
          }
          
          pacientesHtml += div.outerHTML;
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
                      <div class="mb-3 border-t pt-3">
                          <button onclick="abrirModalInfoHermanos('${fichaPacienteId}')" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full max-w-xs">
                              👫 Info. Hermanos ${p.infoHermanos && p.infoHermanos.length > 0 ? '✓' : ''}
                          </button>
                      </div>
                      
                      <!-- Motivo de Consulta -->
                      ${p.motivos && p.motivos.length > 0 ? `
                      <div class="text-[#4b5563] dark:text-gray-200 text-sm mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <span class="font-semibold">Motivos de Consulta:</span>
                          <ul class="mt-1 list-disc list-inside space-y-1">
                              ${p.motivos.map(motivo => `<li>${motivo}</li>`).join('')}
                          </ul>
                      </div>` : ''}
                      
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
                  <div class="flex flex-col gap-2 -mt-4">
                      <div class="flex gap-2">
                          <button onclick="showEditPatientModal('${fichaPacienteId}', ${JSON.stringify(p).replace(/"/g, '&quot;')})" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1">
                              ✏️ Editar
                          </button>
                          ${isAdmin ? `
                          <button onclick="abrirModalDerivarSeguro(this)" 
                                  data-paciente-id="${fichaPacienteId}" 
                                  data-paciente-nombre="${(p.nombre || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}" 
                                  data-paciente-email="${(p.email || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}" 
                                  class="bg-orange-600 hover:bg-orange-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1">
                              🔄 Derivar
                          </button>
                          ` : ''}
                      </div>
                      ${isAdmin ? `
                      <button onclick="eliminarPaciente('${fichaPacienteId}')" class="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded text-sm flex items-center gap-1 w-full">
                          🗑️ Eliminar paciente
                      </button>
                      ` : ''}
                  </div>
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
          btnAdmin.addEventListener('click', async () => {
            // Verificar límites según el plan
            const planUsuario = window.planUsuario || 'gratis';
            const cantidadPacientes = window.cantidadPacientes || 0;
            
            console.log(`🔍 Debug Agregar Paciente (Admin) - Plan: ${planUsuario}, Cantidad actual: ${cantidadPacientes}`);
            
            // Si es derivador, mostrar página de precios
            if (window.isDerivador) {
              showMessage('Para agregar pacientes, actualiza a un plan Pro o Ultra.', 'info');
              abrirModalPrecios();
              return;
            }
            
            // Si es usuario Gratis, verificar límite de 3 pacientes
            if (planUsuario === 'gratis') {
              if (cantidadPacientes >= 3) {
                showMessage('Has alcanzado el límite de 3 pacientes para el plan Gratis. Actualiza a Pro o Ultra para más pacientes.', 'info');
                abrirModalPrecios();
                return;
              }
            }
            
            // Verificar límites para plan Pro (10 pacientes)
            if (planUsuario === 'pro') {
              if (cantidadPacientes >= 10) {
                showMessage('Has alcanzado el límite de 10 pacientes para el plan Pro. Actualiza a Ultra para pacientes ilimitados.', 'error');
                abrirModalPrecios();
                return;
              }
            }
            
            // Plan Ultra y Admin no tienen límites
            if (planUsuario === 'ultra' || planUsuario === 'admin') {
              console.log(`✅ Usuario ${planUsuario} (Admin) - Sin límite de pacientes`);
            }
            
            addPatientModal.classList.remove('hidden');
            addPatientForm.reset();
            limpiarDatosFamilia('agregar');
            // Cargar opciones del selector de motivos
            cargarOpcionesMotivoConsulta();
            // Configurar botones de hermanos después de mostrar el modal
            setTimeout(() => configurarBotonesHermanos(), 100);
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
            
            // Manejar específicamente errores de permisos
            if (error.message && (error.message.includes('permissions') || error.message.includes('Missing or insufficient permissions'))) {
                console.warn(`⚠️ Error de permisos para ${profesional.title}, saltando...`);
                continue;
            } else {
                console.error(`❌ Error inesperado para ${profesional.title}:`, error);
                continue; // Continuar con el siguiente profesional
            }
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
    
    // Verificar permisos según el plan
    const planUsuario = window.planUsuario || 'gratis';
    const isAdmin = window.isAdmin || false;
    
    // Solo admin, pro y ultra pueden ver agenda múltiple (calendario compartido)
    if (!isAdmin && planUsuario !== 'ultra' && planUsuario !== 'pro') {
        showMessage('El calendario compartido está disponible solo para los planes Pro y Ultra. Actualiza tu plan para acceder a esta función.', 'error');
        abrirModalPrecios();
        return;
    }
    
    // Verificar que estemos en el estado correcto
    const calendarTabs = document.getElementById('calendarTabs');
    const dashboardPacientesSection = document.getElementById('dashboardPacientesSection');
    
    if (calendarTabs) {
        calendarTabs.classList.remove('hidden');
        console.log('✅ Mostrando calendarTabs');
    }
    
    if (dashboardPacientesSection) {
        dashboardPacientesSection.classList.add('hidden');
        console.log('✅ Ocultando dashboardPacientesSection');
    }
    
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
        console.error('❌ No se encontró el elemento calendar');
        showMessage('Error: No se encontró el elemento del calendario', 'error');
        return;
    }
    if (!window.FullCalendar) {
        console.error('❌ FullCalendar no está disponible');
        showMessage('Error: FullCalendar no está disponible', 'error');
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
        console.error('❌ No se encontró el elemento profesionalesFilter');
        showMessage('Error: No se encontró el filtro de profesionales', 'error');
    }
    
    // Usar la función que sabemos que funciona
    console.log('🔄 Cargando profesionales usando cargarProfesionalesFirebase...');
    
    try {
        const profesionales = await window.cargarProfesionalesFirebase();
        
        if (profesionales && profesionales.length > 0) {
            console.log('✅ Profesionales cargados exitosamente desde Firebase:', profesionales.length);
            // Asegurar que el filtro se muestre después de cargar
            setTimeout(() => {
                const profesionalesFilter = document.getElementById('profesionalesFilter');
                if (profesionalesFilter) {
                    profesionalesFilter.classList.remove('hidden');
                    profesionalesFilter.style.display = 'flex';
                }
            }, 100);
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
    
    // Usar la nueva función de carga filtrada con manejo de errores
    let eventos = [];
    try {
        eventos = await cargarEventosFiltrados();
        console.log('✅ Eventos cargados exitosamente:', eventos.length);
    } catch (error) {
        console.error('❌ Error cargando eventos:', error);
        if (error.message && error.message.includes('permissions')) {
            console.warn('⚠️ Error de permisos detectado, mostrando calendario vacío');
            showMessage('No tienes permisos para ver eventos de otros profesionales. Mostrando calendario vacío.', 'warning');
        } else {
            showMessage('Error al cargar eventos del calendario: ' + error.message, 'error');
        }
        eventos = []; // Usar array vacío en caso de error
    }
    
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
    
    // Verificar que el calendario sea visible
    setTimeout(() => {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl) {
            const computedStyle = getComputedStyle(calendarEl);
            console.log('👁️ Estado del calendario después del render:', {
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                height: computedStyle.height,
                width: computedStyle.width
            });
            
            // Si el calendario no es visible, intentar forzar la visibilidad
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                console.warn('⚠️ El calendario no es visible, forzando visibilidad...');
                calendarEl.style.display = 'block';
                calendarEl.style.visibility = 'visible';
            }
        }
    }, 200);
    
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
    // Ocultar sección de pacientes cuando se muestra el calendario
    const dashboardPacientesSection = document.getElementById('dashboardPacientesSection');
    if (dashboardPacientesSection) {
        dashboardPacientesSection.classList.add('hidden');
    }
    
    // Ocultar panel de administración si existe
    const adminPanel = document.querySelector('#adminPanel');
    if (adminPanel) {
        adminPanel.classList.add('hidden');
        adminPanel.style.display = 'none';
    }
    
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
        
        // Ocultar perfil
        const dashboardMiPerfilSection = document.getElementById('dashboardMiPerfilSection');
        if (dashboardMiPerfilSection) {
            dashboardMiPerfilSection.classList.add('hidden');
        }
        
        calendarTabs.classList.remove('hidden');
        patientsVisible = false;
        calendarVisible = true;
    }
    

    
    // Event listener para botón Mi Perfil - redirige a perfil.html
    const tabMiPerfil = document.getElementById('tabMiPerfil');
    if (tabMiPerfil) {
        tabMiPerfil.addEventListener('click', () => {
            window.location.href = 'perfil.html';
        });
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
        
        try {
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
            await mostrarAgendaMultiple();
            console.log('✅ Agenda múltiple mostrada exitosamente');
            
            // Verificación final después de un tiempo
            setTimeout(() => {
                const calendarEl = document.getElementById('calendar');
                const profesionalesFilter = document.getElementById('profesionalesFilter');
                
                if (calendarEl && profesionalesFilter) {
                    const calendarVisible = getComputedStyle(calendarEl).display !== 'none';
                    const filterVisible = getComputedStyle(profesionalesFilter).display !== 'none';
                    
                    console.log('🔍 Verificación final:', {
                        calendarVisible,
                        filterVisible,
                        calendarHeight: getComputedStyle(calendarEl).height
                    });
                    
                    if (!calendarVisible || !filterVisible) {
                        console.warn('⚠️ Problemas detectados, ejecutando reparación automática...');
                        window.repararAgendaMultiple();
                    }
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error en agenda múltiple:', error);
            showMessage('Error al cargar la agenda múltiple. Intentando reparación automática...', 'error');
            
            // Intentar reparación automática
            setTimeout(() => {
                window.repararAgendaMultiple();
            }, 1000);
        }
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
        const pago = inputPagoSesion ? inputPagoSesion.value : 'debe';
        const parseMoney = (val) => {
            if (typeof val !== 'string') return Number(val) || 0;
            const clean = val.replace(/\./g, '').replace(/,/g, '.');
            return parseFloat(clean) || 0;
        };
        const monto = inputMontoSesion ? parseMoney(inputMontoSesion.value) : 0;
        const costo = typeof inputCostoSesion !== 'undefined' && inputCostoSesion ? parseMoney(inputCostoSesion.value) : 0;
        
        console.log('💰 Datos de pago del calendario a guardar:', { pago, monto });
        console.log('💰 Elementos del formulario del calendario:', {
            inputPagoSesion: inputPagoSesion,
            inputMontoSesion: inputMontoSesion,
            pagoValue: inputPagoSesion ? inputPagoSesion.value : 'no existe',
            montoValue: inputMontoSesion ? inputMontoSesion.value : 'no existe'
        });
        const crearRecordatorio = document.getElementById('crearRecordatorioWhatsApp').checked;
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
                    presentismo: presentismo,
                    pago: pago,
                    monto: monto,
                    costo: costo
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
                    pago: pago,
                    monto: monto,
                    costo: costo,
                    creado: new Date()
                };
                
                console.log('💾 Datos completos de la sesión del calendario a guardar:', datosSession);
                if (profesionalId) datosSession.profesionalId = profesionalId;
                if (datosCIE10) {
                    datosSession.nomencladorCIE10 = datosCIE10;
                    console.log('✅ Datos CIE-10 incluidos en nueva sesión');
                }
                const docRef = await window.firebaseDB.collection('pacientes').doc(pacienteId).collection('sesiones').add(datosSession);
                
                // Crear recordatorio para WhatsApp solo si está marcado
                if (crearRecordatorio) {
                    await crearRecordatorioWhatsApp(pacienteId, fecha, docRef.id);
                    
                    // Actualizar dashboard de recordatorios inmediatamente
                    setTimeout(async () => {
                        await mostrarRecordatoriosEnDashboard();
                    }, 1000);
                }
                
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

// --- FUNCIÓN GLOBAL PARA ELIMINAR PACIENTE ---
window.eliminarPaciente = async function(pacienteId) {
    const ok = confirm('¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.');
    if (!ok) return;
    try {
        await window.firebaseDB.collection('pacientes').doc(pacienteId).delete();
        showMessage('Paciente eliminado exitosamente', 'success');
        if (typeof hideFichaPacienteModal === 'function') hideFichaPacienteModal();
        // Mostrar y refrescar la lista de pacientes según el tipo de usuario
        if (isAdmin) {
            if (typeof showAdminPanel === 'function') await showAdminPanel();
        } else {
            const dashboardPacientesSection = document.getElementById('dashboardPacientesSection');
            if (dashboardPacientesSection) dashboardPacientesSection.classList.remove('hidden');
            if (typeof loadPatients === 'function' && window.firebaseAuth.currentUser) {
                await loadPatients(window.firebaseAuth.currentUser.uid);
            }
        }
    } catch (error) {
        showMessage('Error al eliminar paciente: ' + (error.message || error), 'error');
    }
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
        // No resetear el formulario para mantener los checkboxes seleccionados
        // Solo limpiar los campos de texto
        const textFields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], select, textarea');
        textFields.forEach(field => {
            field.value = '';
        });
        
        // No resetear los checkboxes de motivos para mantener la selección
        limpiarDatosFamilia('editar');
        console.log('✅ Campos de texto limpiados, checkboxes preservados');
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

// Función para limpiar completamente el formulario de edición (incluyendo checkboxes)
function limpiarFormularioEdicion() {
    const form = document.getElementById('editPatientForm');
    if (form) {
        form.reset();
        limpiarDatosFamilia('editar');
        console.log('✅ Formulario de edición completamente reseteado');
    }
}
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
    
    console.log('🔧 Variables de edición establecidas:');
    console.log('🔧 pacienteEditandoId:', pacienteEditandoId);
    console.log('🔧 pacienteEditandoRef:', pacienteEditandoRef);
    
    // Verificar que los campos existen
    const nameField = document.getElementById('editPatientName');
    const dniField = document.getElementById('editPatientDni');
    const fechaNacimientoField = document.getElementById('editPatientFechaNacimiento');
    const sexoField = document.getElementById('editPatientSexo');
    const lugarNacimientoField = document.getElementById('editPatientLugarNacimiento');
    const emailField = document.getElementById('editPatientEmail');
    const telefonoField = document.getElementById('editPatientTelefono');
    const contactoField = document.getElementById('editPatientContacto');
    const direccionField = document.getElementById('editPatientDireccion');
    const educacionField = document.getElementById('editPatientEducacion');
    const institutoField = document.getElementById('editPatientInstituto');
    
    // Verificar que el contenedor de checkboxes existe
    const motivoCheckboxesContainer = document.getElementById('editPatientMotivoCheckboxes');
    console.log('🔍 Contenedor de checkboxes motivo encontrado:', !!motivoCheckboxesContainer);
    
    console.log('🔍 Campos encontrados:', {
        name: !!nameField,
        dni: !!dniField,
        fechaNacimiento: !!fechaNacimientoField,
        sexo: !!sexoField,
        lugarNacimiento: !!lugarNacimientoField,
        email: !!emailField,
        telefono: !!telefonoField,
        contacto: !!contactoField,
        direccion: !!direccionField,
        educacion: !!educacionField,
        instituto: !!institutoField,
        motivo: !!motivoCheckboxesContainer
    });
    
    // Función para cargar todos los datos del paciente
    function cargarDatosPaciente() {
        console.log('🔄 Cargando datos del paciente en el formulario...');
        
        // Cargar opciones del selector de motivos ANTES de prellenar los campos
        cargarOpcionesMotivoConsulta();
        // Crear botones de profesionales
        crearBotonesProfesionales();
        
        // Prellenar los campos con los datos actuales
        if (nameField) nameField.value = pacienteData.nombre || '';
        if (dniField) dniField.value = pacienteData.dni || '';
        if (fechaNacimientoField) fechaNacimientoField.value = pacienteData.fechaNacimiento || '';
        if (sexoField) sexoField.value = pacienteData.sexo || '';
        if (lugarNacimientoField) lugarNacimientoField.value = pacienteData.lugarNacimiento || '';
        if (emailField) emailField.value = pacienteData.email || '';
        if (telefonoField) telefonoField.value = pacienteData.telefono || '';
        if (contactoField) contactoField.value = pacienteData.contacto || '';
        if (direccionField) direccionField.value = pacienteData.direccion || '';
        if (educacionField) educacionField.value = pacienteData.educacion || '';
        if (institutoField) institutoField.value = pacienteData.instituto || '';
        
        // Función para establecer motivos cuando los checkboxes estén listos
        function establecerMotivosCuandoListos(intentos = 0) {
            const checkboxesContainer = document.getElementById('editPatientMotivoCheckboxes');
            const checkboxes = checkboxesContainer.querySelectorAll('input[type="checkbox"]');
            
            console.log('🔧 Verificando checkboxes...', checkboxes.length, 'intento:', intentos);
            
            if (checkboxes.length > 0) {
                console.log('🔧 Datos de motivos del paciente:', pacienteData.motivos);
                console.log('🔧 Tipo de datos de motivos:', typeof pacienteData.motivos);
                console.log('🔧 Es array:', Array.isArray(pacienteData.motivos));
                establecerMotivosSeleccionados('editPatientMotivoCheckboxes', pacienteData.motivos || []);
            } else if (intentos < 20) { // Máximo 20 intentos (1 segundo)
                console.log('⏳ Checkboxes aún no están listos, reintentando...');
                setTimeout(() => establecerMotivosCuandoListos(intentos + 1), 50);
            } else {
                console.error('❌ No se pudieron generar los checkboxes después de 20 intentos');
            }
        }
        
        // Iniciar el proceso de establecimiento de motivos
        establecerMotivosCuandoListos();
        
        // Establecer el profesional seleccionado si existe en los datos
        if (pacienteData.profesionalSeleccionado) {
            profesionalSeleccionado = pacienteData.profesionalSeleccionado;
            // Actualizar los botones de profesionales para reflejar la selección
            setTimeout(() => {
                document.querySelectorAll('.btn-profesional').forEach(btn => {
                    btn.classList.remove('bg-primary-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
                });
                
                const btnActivo = document.querySelector(`[data-profesional="${profesionalSeleccionado}"]`);
                if (btnActivo) {
                    btnActivo.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
                    btnActivo.classList.add('bg-primary-600', 'text-white');
                }
            }, 100);
        }
        
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
        
        // Cargar foto existente del paciente si existe
        if (pacienteData.foto) {
            console.log('📸 Cargando foto existente del paciente...');
            console.log('📸 Tipo de foto:', typeof pacienteData.foto);
            console.log('📸 Longitud de datos de foto:', pacienteData.foto ? pacienteData.foto.length : 0);
            patientPhotoData = pacienteData.foto;
            // La foto se mostrará cuando se abra el modal de foto
        } else {
            console.log('📸 No hay foto existente para este paciente');
        }
        
        console.log('✅ Datos del paciente cargados correctamente');
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
    
    // Inicializar pestañas del formulario de edición y cargar datos
    setTimeout(() => {
        // Inicializar pestañas específicamente para el formulario de edición
        inicializarPestanasFormularioEdicion();
        mostrarPrimeraPestanaEdicion();
        cargarDatosPaciente(); // Cargar datos después de que las pestañas estén listas
        crearBotonesProfesionales(); // Crear botones de profesionales
        configurarBotonesHermanos();
    }, 100);
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
        
        console.log('📝 Iniciando submit del formulario de edición...');
        console.log('🔍 Estado de variables de edición:');
        console.log('🔍 pacienteEditandoId:', pacienteEditandoId);
        console.log('🔍 pacienteEditandoRef:', pacienteEditandoRef);
        
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
        const direccion = editPatientFormElement.editPatientDireccion.value;
        const educacion = editPatientFormElement.editPatientEducacion.value;
        const instituto = editPatientFormElement.editPatientInstituto.value;
        const motivos = obtenerMotivosSeleccionados('editPatientMotivoCheckboxes');
        console.log('🔍 Motivos seleccionados en edición:', motivos);

        // Obtener datos del colegio
        const infoColegio = {
            nombre: editPatientFormElement.editPatientColegioNombre.value,
            grado: editPatientFormElement.editPatientColegioGrado.value,
            turno: editPatientFormElement.editPatientColegioTurno.value,
            telefono: editPatientFormElement.editPatientColegioTelefono.value,
            direccion: editPatientFormElement.editPatientColegioDireccion.value,
            observaciones: editPatientFormElement.editPatientColegioObservaciones.value
        };

        // Obtener datos de familia
        const infoPadre = {
            nombre: editPatientFormElement.editPatientPadreNombre.value,
            edad: editPatientFormElement.editPatientPadreEdad.value,
            dni: editPatientFormElement.editPatientPadreDni.value,
            email: editPatientFormElement.editPatientPadreEmail.value,
            direccion: editPatientFormElement.editPatientPadreDireccion.value,
            ocupacion: editPatientFormElement.editPatientPadreOcupacion.value,
            nacionalidad: editPatientFormElement.editPatientPadreNacionalidad.value,
            estudios: editPatientFormElement.editPatientPadreEstudios.value,
            estadoCivil: editPatientFormElement.editPatientPadreEstadoCivil.value
        };

        const infoMadre = {
            nombre: editPatientFormElement.editPatientMadreNombre.value,
            edad: editPatientFormElement.editPatientMadreEdad.value,
            dni: editPatientFormElement.editPatientMadreDni.value,
            email: editPatientFormElement.editPatientMadreEmail.value,
            direccion: editPatientFormElement.editPatientMadreDireccion.value,
            ocupacion: editPatientFormElement.editPatientMadreOcupacion.value,
            nacionalidad: editPatientFormElement.editPatientMadreNacionalidad.value,
            estudios: editPatientFormElement.editPatientMadreEstudios.value,
            estadoCivil: editPatientFormElement.editPatientMadreEstadoCivil.value
        };


        
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
                email, telefono, contacto, direccion, educacion, instituto, infoColegio, motivos 
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
                direccion,
                // Información educativa
                educacion,
                instituto,
                // Información del colegio
                infoColegio,
                // Motivo de consulta
                motivos,
                profesionalSeleccionado,
                // Información de familia
                infoPadre,
                infoMadre,
                // Foto del paciente (si existe)
                ...(patientPhotoData && { foto: patientPhotoData }),
                // Metadatos
                actualizado: new Date()
            };
            
            console.log('💾 Datos que se van a guardar en Firebase:', updateData);
            console.log('🔍 Motivos específicos a guardar:', motivos);

            // Agregar o actualizar datos del nomenclador CIE-10
            if (datosCIE10) {
                updateData.nomencladorCIE10 = datosCIE10;
            }
            
            await pacienteEditandoRef.update(updateData);
            
            console.log('✅ Paciente actualizado exitosamente');
            
            // Guardar las variables antes de limpiarlas para actualizar la ficha
            const pacienteIdParaActualizar = pacienteEditandoId;
            const pacienteRefParaActualizar = pacienteEditandoRef;
            
            // Cerrar modal y limpiar completamente el formulario
            hideEditPatientModal();
            limpiarFormularioEdicion();
            
            // Limpiar datos del nomenclador después de guardar
            datosNomencladorSeleccionados.editar = null;
            const spanEditar = document.getElementById('nomencladorSeleccionadoEditar');
            if (spanEditar) {
                spanEditar.textContent = '';
                spanEditar.classList.add('hidden');
            }
            
            // Limpiar variables de foto después de guardar
            patientPhotoData = null;
            patientPhotoBlob = null;
            
            // Recargar la lista de pacientes
            const user = window.firebaseAuth.currentUser;
            if (user) {
                console.log('🔄 Recargando lista de pacientes...');
                console.log('🔍 Estado de admin:', isAdmin);
                console.log('🔍 adminPanelState.selectedUser:', adminPanelState?.selectedUser);
                console.log('🔍 user.uid:', user.uid);
                
                // Determinar qué lista recargar según el contexto
                if (isAdmin && adminPanelState.selectedUser) {
                    console.log('👑 Admin: recargando pacientes de', adminPanelState.selectedUser);
                    loadPatients(adminPanelState.selectedUser);
                } else {
                    console.log('👤 Usuario normal: recargando pacientes propios');
                    loadPatients(user.uid);
                }
            }
            
            // Si la ficha clínica está abierta para este paciente, actualizarla
            if (fichaPacienteId === pacienteIdParaActualizar && pacienteRefParaActualizar) {
                console.log('🔄 Actualizando ficha clínica abierta...');
                const doc = await pacienteRefParaActualizar.get();
                if (doc.exists) {
                    const p = doc.data();
                    
                    // Generar HTML de la ficha clínica usando la función unificada
                    fichaPacienteDatos.innerHTML = generarHTMLFichaClinica(p, pacienteIdParaActualizar);
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
        // Agregar nuevo hermano
        agregarHermano();
        
        // Obtener el ID real que se asignó al último hermano agregado
        const realHermanoId = hermanosCounter - 1; // Ya se incrementó en agregarHermano()
        const hermanoDiv = document.querySelector(`[data-hermano-id="${realHermanoId}"]`);
        
        if (hermanoDiv) {
            hermanoDiv.querySelector(`input[name="hermanoNombre_${realHermanoId}"]`).value = hermano.nombre || '';
            hermanoDiv.querySelector(`input[name="hermanoEdad_${realHermanoId}"]`).value = hermano.edad || '';
            hermanoDiv.querySelector(`input[name="hermanoOcupacion_${realHermanoId}"]`).value = hermano.ocupacion || '';
            hermanoDiv.querySelector(`select[name="hermanoRelacion_${realHermanoId}"]`).value = hermano.relacion || '';
            hermanoDiv.querySelector(`textarea[name="hermanoObservaciones_${realHermanoId}"]`).value = hermano.observaciones || '';
        }
    });
}

function limpiarListaHermanos() {
    const listaHermanos = document.getElementById('listaHermanos');
    listaHermanos.innerHTML = '';
    hermanosCounter = 0; // Resetear contador para empezar de cero
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

// Función para verificar si el usuario es derivador (solo para mostrar tag visual)
// NOTA: Este campo NO otorga permisos de derivación, solo los admins pueden derivar
async function verificarSiEsDerivador(uid) {
    try {
        const userDoc = await window.firebaseDB.collection('usuarios').doc(uid).get();
        return userDoc.exists && userDoc.data().isDerivar === true;
    } catch (error) {
        console.error('Error verificando si es derivador:', error);
        return false;
    }
}

// Función para verificar el plan del usuario
async function verificarPlanUsuario(uid) {
    try {
        const userDoc = await window.firebaseDB.collection('usuarios').doc(uid).get();
        if (!userDoc.exists) {
            console.log(`❌ Usuario ${uid} no existe en la base de datos`);
            return 'gratis';
        }
        
        const userData = userDoc.data();
        console.log(`📊 Datos del usuario ${uid}:`, userData);
        
        // Priorizar Ultra sobre Admin para mostrar el tag correcto
        if (userData.isUltra === true) {
            console.log(`✅ Usuario ${uid} detectado como Ultra`);
            return 'ultra';
        }
        if (userData.isPro === true) {
            console.log(`✅ Usuario ${uid} detectado como Pro`);
            return 'pro';
        }
        if (userData.isAdmin === true) {
            console.log(`✅ Usuario ${uid} detectado como Admin`);
            return 'admin';
        }
        
        console.log(`ℹ️ Usuario ${uid} no tiene plan específico, usando 'gratis'`);
        return 'gratis';
    } catch (error) {
        console.error('Error verificando plan del usuario:', error);
        return 'gratis';
    }
}

// Función para contar pacientes del usuario
async function contarPacientesUsuario(uid) {
    try {
        const pacientesSnapshot = await window.firebaseDB.collection('pacientes')
            .where('owner', '==', uid)
            .get();
        console.log(`📊 Contando pacientes para usuario ${uid}: ${pacientesSnapshot.size} pacientes encontrados`);
        return pacientesSnapshot.size;
    } catch (error) {
        console.error('Error contando pacientes:', error);
        return 0;
    }
}

// Función helper para agregar tags según el plan y derivador
async function agregarTagsUsuario(uid, displayName) {
    try {
        const [isDerivador, planUsuario] = await Promise.all([
            verificarSiEsDerivador(uid),
            verificarPlanUsuario(uid)
        ]);
        
        // Debug: mostrar información del usuario
        console.log(`🔍 Debug tags para ${displayName} (${uid}):`, {
            isDerivador,
            planUsuario,
            displayName
        });
        
        let tags = displayName;
        
        // Agregar tag de plan (clickeable para abrir modal de precios)
        if (planUsuario === 'pro') {
            tags += ' <span class="text-xs bg-purple-100 text-purple-700 rounded px-2 py-0.5 ml-2 cursor-pointer hover:bg-purple-200 transition-colors" onclick="abrirModalPrecios()" title="Ver planes disponibles">Pro</span>';
        } else if (planUsuario === 'ultra') {
            tags += ' <span class="text-xs bg-yellow-100 text-yellow-700 rounded px-2 py-0.5 ml-2 cursor-pointer hover:bg-yellow-200 transition-colors" onclick="abrirModalPrecios()" title="Ver planes disponibles">Ultra</span>';
        } else if (planUsuario === 'admin') {
            tags += ' <span class="text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2">Admin</span>';
        } else {
            // Plan gratuito por defecto (clickeable para ver opciones de upgrade)
            tags += ' <span class="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5 ml-2 cursor-pointer hover:bg-gray-200 transition-colors" onclick="abrirModalPrecios()" title="Ver planes disponibles">Gratis</span>';
        }
        
        // Agregar tag de derivador (solo visual, no da permisos de derivación)
        if (isDerivador) {
            tags += ' <span class="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5 ml-2">Derivar</span>';
        }
        
        return tags;
    } catch (error) {
        console.error('Error agregando tags de usuario:', error);
        return displayName;
    }
}

// Función helper para agregar tag "Derivar" si el usuario es derivador (solo visual)
// NOTA: Este campo NO otorga permisos de derivación, solo los admins pueden derivar
async function agregarTagDerivador(uid, displayName) {
    try {
        const isDerivador = await verificarSiEsDerivador(uid);
        return isDerivador ? `${displayName} <span class="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5 ml-2">Derivar</span>` : displayName;
    } catch (error) {
        console.error('Error agregando tag derivador:', error);
        return displayName;
    }
}

// Funciones para el modal de precios
window.abrirModalPrecios = function() {
    const modal = document.getElementById('modalPrecios');
    if (modal) {
        modal.classList.remove('hidden');
        // Configurar toggle de facturación
        configurarTogglePrecios();
    }
};

window.cerrarModalPrecios = function() {
    const modal = document.getElementById('modalPrecios');
    if (modal) {
        modal.classList.add('hidden');
    }
};

function configurarTogglePrecios() {
    const toggleMensual = document.getElementById('toggleMensual');
    const toggleAnual = document.getElementById('toggleAnual');
    const precioPro = document.getElementById('precioPro');
    const precioUltra = document.getElementById('precioUltra');
    const periodoPro = document.getElementById('periodoPro');
    const periodoUltra = document.getElementById('periodoUltra');
    
    if (!toggleMensual || !toggleAnual) return;
    
    // Precios mensuales
    const preciosMensuales = {
        pro: 15,
        ultra: 25
    };
    
    // Precios anuales (precios fijos en USD)
    const preciosAnuales = {
        pro: 100,
        ultra: 150
    };
    
    toggleMensual.addEventListener('click', function() {
        // Activar toggle mensual
        toggleMensual.classList.add('bg-white', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white', 'shadow-sm');
        toggleMensual.classList.remove('text-gray-600', 'dark:text-gray-400');
        toggleAnual.classList.remove('bg-white', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white', 'shadow-sm');
        toggleAnual.classList.add('text-gray-600', 'dark:text-gray-400');
        
        // Actualizar precios
        if (precioPro) precioPro.textContent = `u$s ${preciosMensuales.pro}`;
        if (precioUltra) precioUltra.textContent = `u$s ${preciosMensuales.ultra}`;
        if (periodoPro) periodoPro.textContent = 'por mes';
        if (periodoUltra) periodoUltra.textContent = 'por mes';
    });
    
    toggleAnual.addEventListener('click', function() {
        // Activar toggle anual
        toggleAnual.classList.add('bg-white', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white', 'shadow-sm');
        toggleAnual.classList.remove('text-gray-600', 'dark:text-gray-400');
        toggleMensual.classList.remove('bg-white', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white', 'shadow-sm');
        toggleMensual.classList.add('text-gray-600', 'dark:text-gray-400');
        
        // Actualizar precios
        if (precioPro) precioPro.textContent = `u$s ${preciosAnuales.pro}`;
        if (precioUltra) precioUltra.textContent = `u$s ${preciosAnuales.ultra}`;
        if (periodoPro) periodoPro.textContent = 'por año';
        if (periodoUltra) periodoUltra.textContent = 'por año';
    });
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modalPrecios');
            if (modal && !modal.classList.contains('hidden')) {
                cerrarModalPrecios();
            }
        }
    });
    
    // Cerrar modal haciendo clic fuera
    const modal = document.getElementById('modalPrecios');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalPrecios();
            }
        });
    }
}

// Función para abrir modal de registro
window.abrirModalRegistro = function() {
    // Cerrar modal de precios primero
    cerrarModalPrecios();
    
    // Abrir modal de registro
    const authModal = document.getElementById('authModal');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    
    if (authModal && loginFormContainer && registerFormContainer) {
        // Mostrar formulario de registro
        loginFormContainer.classList.add('hidden');
        registerFormContainer.classList.remove('hidden');
        
        // Mostrar modal
        authModal.classList.remove('hidden');
    }
};

// Función para abrir WhatsApp con mensaje personalizado
window.abrirWhatsApp = function(plan) {
    const numero = '1166251922';
    const mensaje = encodeURIComponent(`Hola! Me interesa el plan ${plan} de Espacio Cocrearte. ¿Podrías darme información sobre las opciones de pago?`);
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    
    // Cerrar modal de precios
    cerrarModalPrecios();
    
    // Abrir WhatsApp en nueva pestaña
    window.open(url, '_blank');
};

// Función para mostrar/ocultar el botón de versión (ahora siempre visible)
function actualizarVisibilidadVersion(esAdmin) {
    console.log('🎛️ Botón de versión ahora visible para todos los usuarios');
    
    const versionBtn = document.getElementById('versionBtn'); // Footer landing page
    const versionBtnDashboard = document.getElementById('versionBtnDashboard'); // Dashboard
    
    console.log('🔍 Elementos encontrados:', {
        versionBtn: !!versionBtn,
        versionBtnDashboard: !!versionBtnDashboard
    });
    
    // Los botones de versión ahora siempre están visibles
    if (versionBtn) {
        versionBtn.classList.remove('hidden');
        console.log('✅ Botón footer siempre visible');
    }
    
    if (versionBtnDashboard) {
        versionBtnDashboard.classList.remove('hidden');
        console.log('✅ Botón dashboard siempre visible');
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
    const padreCampos = ['Nombre', 'Edad', 'Dni', 'Email', 'Direccion', 'Ocupacion', 'Nacionalidad', 'Estudios', 'EstadoCivil'];
    const madreCampos = ['Nombre', 'Edad', 'Dni', 'Email', 'Direccion', 'Ocupacion', 'Nacionalidad', 'Estudios', 'EstadoCivil'];
    padreCampos.forEach(campo => {
        const input = document.getElementById(`${padrePrefix}${campo}`);
        if (input) input.value = '';
    });
    madreCampos.forEach(campo => {
        const input = document.getElementById(`${madrePrefix}${campo}`);
        if (input) input.value = '';
    });

}

// Función para cargar datos de familia en el formulario
function cargarDatosFamilia(pacienteData, modo) {
    console.log('🔄 Cargando datos de familia para modo:', modo);
    
    if (!pacienteData) return;
    
    const prefijo = modo === 'editar' ? 'edit' : '';
    
    // Cargar datos del padre
    if (pacienteData.infoPadre) {
        const padre = pacienteData.infoPadre;
        const nombreField = document.getElementById(`${prefijo}PatientPadreNombre`);
        const edadField = document.getElementById(`${prefijo}PatientPadreEdad`);
        const dniField = document.getElementById(`${prefijo}PatientPadreDni`);
        const emailField = document.getElementById(`${prefijo}PatientPadreEmail`);
        const direccionField = document.getElementById(`${prefijo}PatientPadreDireccion`);
        const ocupacionField = document.getElementById(`${prefijo}PatientPadreOcupacion`);
        const nacionalidadField = document.getElementById(`${prefijo}PatientPadreNacionalidad`);
        const estudiosField = document.getElementById(`${prefijo}PatientPadreEstudios`);
        const estadoCivilField = document.getElementById(`${prefijo}PatientPadreEstadoCivil`);
        
        if (nombreField) nombreField.value = padre.nombre || '';
        if (edadField) edadField.value = padre.edad || '';
        if (dniField) dniField.value = padre.dni || '';
        if (emailField) emailField.value = padre.email || '';
        if (direccionField) direccionField.value = padre.direccion || '';
        if (ocupacionField) ocupacionField.value = padre.ocupacion || '';
        if (nacionalidadField) nacionalidadField.value = padre.nacionalidad || '';
        if (estudiosField) estudiosField.value = padre.estudios || '';
        if (estadoCivilField) estadoCivilField.value = padre.estadoCivil || '';
    }
    
    // Cargar datos de la madre
    if (pacienteData.infoMadre) {
        const madre = pacienteData.infoMadre;
        const nombreField = document.getElementById(`${prefijo}PatientMadreNombre`);
        const edadField = document.getElementById(`${prefijo}PatientMadreEdad`);
        const dniField = document.getElementById(`${prefijo}PatientMadreDni`);
        const emailField = document.getElementById(`${prefijo}PatientMadreEmail`);
        const direccionField = document.getElementById(`${prefijo}PatientMadreDireccion`);
        const ocupacionField = document.getElementById(`${prefijo}PatientMadreOcupacion`);
        const nacionalidadField = document.getElementById(`${prefijo}PatientMadreNacionalidad`);
        const estudiosField = document.getElementById(`${prefijo}PatientMadreEstudios`);
        const estadoCivilField = document.getElementById(`${prefijo}PatientMadreEstadoCivil`);
        
        if (nombreField) nombreField.value = madre.nombre || '';
        if (edadField) edadField.value = madre.edad || '';
        if (dniField) dniField.value = madre.dni || '';
        if (emailField) emailField.value = madre.email || '';
        if (direccionField) direccionField.value = madre.direccion || '';
        if (ocupacionField) ocupacionField.value = madre.ocupacion || '';
        if (nacionalidadField) nacionalidadField.value = madre.nacionalidad || '';
        if (estudiosField) estudiosField.value = madre.estudios || '';
        if (estadoCivilField) estadoCivilField.value = madre.estadoCivil || '';
    }
    
    // Cargar datos del colegio
    if (pacienteData.infoColegio) {
        const colegio = pacienteData.infoColegio;
        const nombreField = document.getElementById(`${prefijo}PatientColegioNombre`);
        const gradoField = document.getElementById(`${prefijo}PatientColegioGrado`);
        const turnoField = document.getElementById(`${prefijo}PatientColegioTurno`);
        const telefonoField = document.getElementById(`${prefijo}PatientColegioTelefono`);
        const direccionField = document.getElementById(`${prefijo}PatientColegioDireccion`);
        const observacionesField = document.getElementById(`${prefijo}PatientColegioObservaciones`);
        
        if (nombreField) nombreField.value = colegio.nombre || '';
        if (gradoField) gradoField.value = colegio.grado || '';
        if (turnoField) turnoField.value = colegio.turno || '';
        if (telefonoField) telefonoField.value = colegio.telefono || '';
        if (direccionField) direccionField.value = colegio.direccion || '';
        if (observacionesField) observacionesField.value = colegio.observaciones || '';
    }
    
    console.log('✅ Datos de familia y colegio cargados correctamente');
}
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
         const modalBackup = document.getElementById('modalBackupPacientes');
         
         // Ocultar el modal de backup mientras se procesa
         if (modalBackup) {
             modalBackup.classList.add('hidden');
             modalBackup.style.display = 'none';
             modalBackup.style.visibility = 'hidden';
             modalBackup.style.opacity = '0';
         }
         
         // Mostrar loader
         if (loader) {
             loader.classList.remove('hidden');
             loader.style.display = 'flex';
             loader.style.visibility = 'visible';
             loader.style.opacity = '1';
             loader.style.zIndex = '100000';
             
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
             
             // Ocultar loader antes de mostrar el modal
             if (loader) {
                 loader.classList.add('hidden');
                 loader.style.display = 'none';
                 loader.style.visibility = 'hidden';
                 loader.style.opacity = '0';
             }
             
             // Mostrar el modal con el contenido
             contenidoVerBackup.innerHTML = html;
             modalVerBackup.classList.remove('hidden');
             modalVerBackup.style.display = 'flex';
             modalVerBackup.style.visibility = 'visible';
             modalVerBackup.style.opacity = '1';
             modalVerBackup.style.zIndex = '99999';
             
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
             
             // Asegurar que el loader esté oculto
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
         const modalBackup = document.getElementById('modalBackupPacientes');
         
         if (modalVerBackup) {
             modalVerBackup.classList.add('hidden');
             modalVerBackup.style.display = 'none';
             modalVerBackup.style.visibility = 'hidden';
             modalVerBackup.style.opacity = '0';
         }
         
         // Volver a mostrar el modal de backup
         if (modalBackup) {
             modalBackup.classList.remove('hidden');
             modalBackup.style.display = 'flex';
             modalBackup.style.visibility = 'visible';
             modalBackup.style.opacity = '1';
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
            const modalBackup = document.getElementById('modalBackupPacientes');
            
            // Ocultar el modal de backup mientras se procesa
            if (modalBackup) {
                modalBackup.classList.add('hidden');
                modalBackup.style.display = 'none';
                modalBackup.style.visibility = 'hidden';
                modalBackup.style.opacity = '0';
            }
            
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
        
        // Agregar botón de dictado en vista maximizada
        createFullscreenDictateButton();
      } else {
        // Minimizar: devolver wrapper a su lugar original
        quillWrapper.classList.remove('quill-fullscreen-editor');
        if (quillOverlay && quillOverlay.contains(quillWrapper)) {
          quillOriginalParent.appendChild(quillWrapper);
        }
        btn.textContent = '⤢';
        
        // Detener grabación si está activa desde el botón de pantalla completa
        const fullscreenBtn = document.getElementById('fullscreenDictateBtn');
        if (currentRecordingButton === fullscreenBtn) {
            stopRecording();
        }
        
        // Remover botón de dictado de vista maximizada
        removeFullscreenDictateButton();
        
        // Eliminar overlay si está vacío
        if (quillOverlay && quillOverlay.childNodes.length === 0) {
          quillOverlay.remove();
          quillOverlay = null;
        }
      }
    });
  }
});
// Función para crear botón de dictado en vista maximizada
function createFullscreenDictateButton() {
    // Verificar que no exista ya
    if (document.getElementById('fullscreenDictateBtn')) return;
    
    // Crear contenedor del botón
    const dictateContainer = document.createElement('div');
    dictateContainer.id = 'fullscreenDictateContainer';
    dictateContainer.className = 'fullscreen-dictate-container';
    
    // Crear botón de dictado
    const dictateBtn = document.createElement('button');
    dictateBtn.type = 'button';
    dictateBtn.id = 'fullscreenDictateBtn';
    dictateBtn.className = 'mic-button fullscreen-mic-button flex items-center gap-1 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors';
    dictateBtn.innerHTML = '🎤 <span class="mic-text">Dictar</span>';
    
    // Crear tooltip
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'relative group';
    
    const tooltipIcon = document.createElement('div');
    tooltipIcon.className = 'w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help';
    tooltipIcon.textContent = 'i';
    
    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50';
    tooltipContent.innerHTML = `
        Haz clic en "Dictar" para empezar a hablar.<br/>
        Haz clic en "Detener" para finalizar el dictado.<br/>
        El texto se insertará automáticamente.
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
    `;
    
    // Ensamblar elementos
    tooltipContainer.appendChild(tooltipIcon);
    tooltipContainer.appendChild(tooltipContent);
    dictateContainer.appendChild(dictateBtn);
    dictateContainer.appendChild(tooltipContainer);
    
    // Agregar al wrapper maximizado
    const quillWrapper = document.querySelector('.quill-fullscreen-editor');
    if (quillWrapper) {
        quillWrapper.appendChild(dictateContainer);
        
        // Agregar event listener
        dictateBtn.addEventListener('click', function() {
            if (speechRecognition && currentRecordingButton === dictateBtn) {
                stopRecording();
            } else {
                startRecording(dictateBtn, 'sesionComentarioQuill');
            }
        });
    }
}

// Función para remover botón de dictado en vista maximizada
function removeFullscreenDictateButton() {
    const container = document.getElementById('fullscreenDictateContainer');
    if (container) {
        container.remove();
    }
}

// === FUNCIONALIDAD DE VOZ A TEXTO ===

// Variables globales para reconocimiento de voz
let speechRecognition = null;
let currentRecordingButton = null;
let currentTargetField = null;
let recordingIndicator = null;

// Función auxiliar para insertar texto en el editor Quill
function insertTextIntoQuillEditor(text) {
    if (!text || text.trim() === '') return;
    
    const cleanText = text.trim();
    console.log('🎤 Insertando en Quill:', cleanText);
    
    // Método 1: Usar la instancia global de Quill si está disponible
    if (window.quillEditor && typeof window.quillEditor.insertText === 'function') {
        try {
            const currentLength = window.quillEditor.getLength();
            const currentText = window.quillEditor.getText().trim();
            
            // Insertar al final del contenido con espacio apropiado
            const insertPosition = currentLength - 1; // -1 porque Quill siempre tiene un \n al final
            const prefix = currentText ? ' ' : '';
            window.quillEditor.insertText(insertPosition, prefix + cleanText);
            console.log('✅ Texto insertado en Quill usando API');
            return;
        } catch (error) {
            console.warn('⚠️ Error usando API de Quill:', error);
        }
    }
    
    // Método 2: Buscar la instancia de Quill en el DOM
    const quillContainer = document.getElementById('sesionComentarioQuill');
    if (quillContainer && quillContainer.__quill) {
        try {
            const quill = quillContainer.__quill;
            const currentLength = quill.getLength();
            const currentText = quill.getText().trim();
            
            const insertPosition = currentLength - 1;
            const prefix = currentText ? ' ' : '';
            quill.insertText(insertPosition, prefix + cleanText);
            console.log('✅ Texto insertado en Quill usando instancia DOM');
            return;
        } catch (error) {
            console.warn('⚠️ Error usando instancia DOM de Quill:', error);
        }
    }
    
    // Método 3: Fallback directo al DOM
    const quillEditor = document.querySelector('#sesionComentarioQuill .ql-editor');
    if (quillEditor) {
        try {
            // Obtener el contenido actual
            const currentHTML = quillEditor.innerHTML;
            const currentText = quillEditor.textContent || '';
            
            // Si está vacío o solo tiene un párrafo vacío
            if (currentText.trim() === '' || currentHTML === '<p><br></p>') {
                quillEditor.innerHTML = `<p>${cleanText}</p>`;
            } else {
                // Agregar al final del último párrafo
                const lastP = quillEditor.querySelector('p:last-child');
                if (lastP) {
                    const lastPText = lastP.textContent || '';
                    if (lastPText.trim()) {
                        lastP.innerHTML = lastPText.trim() + ' ' + cleanText;
                    } else {
                        lastP.innerHTML = cleanText;
                    }
                } else {
                    // Si no hay párrafos, crear uno nuevo
                    quillEditor.innerHTML += `<p>${cleanText}</p>`;
                }
            }
            console.log('✅ Texto insertado en Quill usando fallback DOM');
            return;
        } catch (error) {
            console.warn('⚠️ Error en fallback DOM:', error);
        }
    }
    
    console.error('❌ No se pudo insertar texto en el editor Quill');
}

// Inicializar reconocimiento de voz
function initSpeechRecognition() {
    // Verificar soporte del navegador
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('🎤 Reconocimiento de voz no soportado en este navegador');
        return false;
    }

    // Usar la API disponible
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();

    // Configuración del reconocimiento
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'es-ES'; // Español de España
    speechRecognition.maxAlternatives = 1;

    // Event listeners
    speechRecognition.onstart = function() {
        console.log('🎤 Reconocimiento de voz iniciado');
        updateRecordingState('listening');
        showRecordingIndicator('Escuchando...');
    };

    speechRecognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                console.log('🎤 Texto final reconocido:', transcript);
            } else {
                interimTranscript += transcript;
            }
        }

        // Solo actualizar el campo si hay texto final (evita repeticiones)
        if (finalTranscript.trim() !== '' && currentTargetField) {
            console.log('🎤 Insertando texto final:', finalTranscript.trim());
            if (currentTargetField.id === 'sesionComentarioQuill') {
                insertTextIntoQuillEditor(finalTranscript.trim());
            } else {
                // Para textarea normal
                const currentValue = currentTargetField.value || '';
                const newValue = currentValue.trim() + (currentValue.trim() ? ' ' : '') + finalTranscript.trim();
                currentTargetField.value = newValue;
                console.log('🎤 Valor actualizado en textarea:', newValue);
            }
        }

        // Mostrar solo texto intermedio en el indicador (sin insertarlo)
        if (interimTranscript && !finalTranscript) {
            showRecordingIndicator(`Escuchando: "${interimTranscript.substring(0, 30)}${interimTranscript.length > 30 ? '...' : ''}"`);
        }
    };

    speechRecognition.onerror = function(event) {
        console.error('❌ Error en reconocimiento de voz:', event.error);
        let errorMessage = 'Error de reconocimiento';
        
        switch(event.error) {
            case 'network':
                errorMessage = 'Error de red';
                break;
            case 'not-allowed':
                errorMessage = 'Micrófono no permitido';
                break;
            case 'no-speech':
                errorMessage = 'No se detectó voz';
                break;
            case 'audio-capture':
                errorMessage = 'Error de micrófono';
                break;
            case 'service-not-allowed':
                errorMessage = 'Servicio no disponible';
                break;
        }
        
        showRecordingIndicator(`❌ ${errorMessage}`, 'error');
        updateRecordingState('error');
        
        setTimeout(() => {
            stopRecording();
        }, 2000);
    };

    speechRecognition.onend = function() {
        console.log('🎤 Reconocimiento de voz terminado');
        stopRecording();
    };

    return true;
}

// Iniciar grabación
function startRecording(button, targetFieldId) {
    if (!speechRecognition) {
        if (!initSpeechRecognition()) {
            alert('❌ Tu navegador no soporta reconocimiento de voz.\n\nRecomendamos usar Chrome, Edge o Safari para esta funcionalidad.');
            return;
        }
    }

    // Detener grabación anterior si existe
    if (currentRecordingButton) {
        stopRecording();
    }

    currentRecordingButton = button;
    
    if (targetFieldId === 'sesionComentarioQuill') {
        // Para el editor Quill, usar un objeto especial
        currentTargetField = { id: 'sesionComentarioQuill' };
    } else {
        currentTargetField = document.getElementById(targetFieldId);
        if (!currentTargetField) {
            console.error('❌ Campo de destino no encontrado:', targetFieldId);
            return;
        }
    }

    try {
        updateRecordingState('recording');
        speechRecognition.start();
    } catch (error) {
        console.error('❌ Error iniciando reconocimiento:', error);
        alert('❌ Error iniciando el reconocimiento de voz. Inténtalo de nuevo.');
        updateRecordingState('idle');
    }
}

// Detener grabación
function stopRecording() {
    if (speechRecognition) {
        speechRecognition.stop();
    }
    
    updateRecordingState('idle');
    hideRecordingIndicator();
    
    currentRecordingButton = null;
    currentTargetField = null;
}

// Actualizar estado visual del botón
function updateRecordingState(state) {
    if (!currentRecordingButton) return;

    const button = currentRecordingButton;
    const micText = button.querySelector('.mic-text');

    // Limpiar clases anteriores
    button.classList.remove('recording', 'listening', 'processing');

    switch (state) {
        case 'recording':
            button.classList.add('recording');
            if (micText) micText.textContent = 'Iniciando...';
            break;
        case 'listening':
            button.classList.add('listening');
            if (micText) micText.textContent = 'Escuchando';
            break;
        case 'processing':
            button.classList.add('processing');
            if (micText) micText.textContent = 'Procesando';
            break;
        case 'error':
            if (micText) micText.textContent = 'Error';
            break;
        default:
            if (micText) micText.textContent = 'Dictar';
    }
}

// Mostrar indicador de grabación
function showRecordingIndicator(text, type = 'recording') {
    hideRecordingIndicator();
    
    recordingIndicator = document.createElement('div');
    recordingIndicator.className = 'recording-indicator';
    recordingIndicator.textContent = text;
    
    if (type === 'error') {
        recordingIndicator.style.background = 'rgba(220, 38, 38, 0.95)';
    } else {
        recordingIndicator.style.background = 'rgba(5, 150, 105, 0.95)';
    }
    
    document.body.appendChild(recordingIndicator);
}

// Ocultar indicador de grabación
function hideRecordingIndicator() {
    if (recordingIndicator) {
        recordingIndicator.remove();
        recordingIndicator = null;
    }
}

// Event listeners para botones de micrófono
document.addEventListener('DOMContentLoaded', function() {
    // Botón de micrófono para comentarios/observaciones
    const btnMicComentario = document.getElementById('btnMicComentario');
    if (btnMicComentario) {
        btnMicComentario.addEventListener('click', function() {
            if (currentRecordingButton === this) {
                stopRecording();
            } else {
                startRecording(this, 'sesionComentarioQuill');
            }
        });
    }

    // Botón de micrófono para notas
    const btnMicNotas = document.getElementById('btnMicNotas');
    if (btnMicNotas) {
        btnMicNotas.addEventListener('click', function() {
            if (currentRecordingButton === this) {
                stopRecording();
            } else {
                startRecording(this, 'sesionNotas');
            }
        });
    }

    // Detener grabación con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentRecordingButton) {
            stopRecording();
        }
    });
    
    // Event listener para botón de actualizar recordatorios
    const actualizarRecordatoriosBtn = document.getElementById('actualizarRecordatoriosBtn');
    if (actualizarRecordatoriosBtn) {
        actualizarRecordatoriosBtn.addEventListener('click', async function() {
            this.disabled = true;
            this.innerHTML = '🔄 Cargando...';
            
            try {
                await mostrarRecordatoriosEnDashboard();
                this.innerHTML = '✅ Actualizado';
                setTimeout(() => {
                    this.innerHTML = '🔄 Actualizar';
                    this.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('Error actualizando recordatorios:', error);
                this.innerHTML = '❌ Error';
                setTimeout(() => {
                    this.innerHTML = '🔄 Actualizar';
                    this.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Event listeners para configuración de mensajes
    const configurarMensajeBtn = document.getElementById('configurarMensajeBtn');
    const modalConfiguracionMensaje = document.getElementById('modalConfiguracionMensaje');
    const cerrarConfiguracionMensaje = document.getElementById('cerrarConfiguracionMensaje');
    const cancelarConfiguracionMensaje = document.getElementById('cancelarConfiguracionMensaje');
    const guardarConfiguracionMensajeBtn = document.getElementById('guardarConfiguracionMensaje');
    const plantillasSelect = document.getElementById('plantillasSelect');
    const mensajePersonalizado = document.getElementById('mensajePersonalizado');
    const vistaPreviaMensaje = document.getElementById('vistaPreviaMensaje');
    
    if (configurarMensajeBtn && modalConfiguracionMensaje) {
        configurarMensajeBtn.addEventListener('click', function() {
            // Cargar configuración actual
            const config = cargarConfiguracionMensaje();
            plantillasSelect.value = config.plantilla;
            mensajePersonalizado.value = config.mensajePersonalizado;
            actualizarVistaPreviaConfig();
            modalConfiguracionMensaje.classList.remove('hidden');
        });
        
        cerrarConfiguracionMensaje.addEventListener('click', function() {
            modalConfiguracionMensaje.classList.add('hidden');
        });
        
        cancelarConfiguracionMensaje.addEventListener('click', function() {
            modalConfiguracionMensaje.classList.add('hidden');
        });
        
        plantillasSelect.addEventListener('change', function() {
            const plantillaSeleccionada = this.value;
            if (plantillasMensajes[plantillaSeleccionada]) {
                mensajePersonalizado.value = plantillasMensajes[plantillaSeleccionada];
                actualizarVistaPreviaConfig();
            }
        });
        
        mensajePersonalizado.addEventListener('input', actualizarVistaPreviaConfig);
        
        guardarConfiguracionMensajeBtn.addEventListener('click', function() {
            const config = {
                plantilla: plantillasSelect.value,
                mensajePersonalizado: mensajePersonalizado.value,
                lugar: 'Consultorio Cocrearte' // Por ahora fijo, se puede hacer configurable después
            };
            
            guardarConfiguracionMensaje(config);
            modalConfiguracionMensaje.classList.add('hidden');
            
            // Mostrar confirmación
            this.innerHTML = '✅ Guardado';
            setTimeout(() => {
                this.innerHTML = 'Guardar Configuración';
            }, 2000);
        });
    }
    
    // Función para actualizar vista previa
    function actualizarVistaPreviaConfig() {
        if (vistaPreviaMensaje && mensajePersonalizado) {
            const mensajeEjemplo = mensajePersonalizado.value
                .replace(/{nombre}/g, 'María García')
                .replace(/{fecha}/g, 'viernes, 17 de enero de 2025')
                .replace(/{hora}/g, '14:30')
                .replace(/{lugar}/g, 'Consultorio Cocrearte');
            
            vistaPreviaMensaje.textContent = mensajeEjemplo;
        }
    }
    
    // Event listener para mostrar/ocultar opción de WhatsApp según paciente seleccionado y plan
    const selectPaciente = document.getElementById('selectPaciente');
    const checkboxRecordatorio = document.getElementById('crearRecordatorioWhatsApp');
    const containerRecordatorio = checkboxRecordatorio ? checkboxRecordatorio.closest('div').parentElement : null;
    
    if (selectPaciente && containerRecordatorio) {
        selectPaciente.addEventListener('change', async function() {
            const pacienteId = this.value;
            
            if (pacienteId) {
                try {
                        // Prefill costo sesión (último valor)
                        try {
                            const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(pacienteId).collection('sesiones').orderBy('fecha', 'desc').limit(1).get();
                            const costoInputMain = document.getElementById('sesionCosto');
                            if (costoInputMain) {
                                if (!sesionesSnap.empty) {
                                    const d = sesionesSnap.docs[0].data();
                                    const lastCosto = Number(d.costo) || 0;
                                    costoInputMain.value = lastCosto ? String(Math.round(lastCosto)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
                                } else {
                                    costoInputMain.value = '';
                                }
                            }
                        } catch (e) { console.warn('No se pudo precargar costo en ficha:', e); }
                        
                    // Obtener datos del paciente
                    const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(pacienteId).get();
                    if (pacienteDoc.exists) {
                        const pacienteData = pacienteDoc.data();
                        const tieneTelefono = pacienteData.telefono && pacienteData.telefono.trim() !== '';
                        
                        // Verificar plan del usuario para mostrar opción de WhatsApp
                        const planUsuario = window.planUsuario || 'gratis';
                        const isAdmin = window.isAdmin || false;
                        const puedeUsarWhatsApp = isAdmin || planUsuario === 'ultra';
                        
                        if (tieneTelefono && puedeUsarWhatsApp) {
                            containerRecordatorio.style.display = 'block';
                            checkboxRecordatorio.checked = true;
                        } else {
                            containerRecordatorio.style.display = 'none';
                            checkboxRecordatorio.checked = false;
                        }
                    }
                } catch (error) {
                    console.error('Error verificando teléfono del paciente:', error);
                    containerRecordatorio.style.display = 'none';
                }
            } else {
                containerRecordatorio.style.display = 'none';
            }
        });
    }
});

// === SISTEMA DE RECORDATORIOS WHATSAPP ===

// Función para crear recordatorio de WhatsApp
async function crearRecordatorioWhatsApp(pacienteId, fechaSesion, sesionId) {
    try {
        console.log('📅 Creando recordatorio WhatsApp para sesión:', sesionId);
        
        // Verificar que el usuario tenga permisos para usar WhatsApp (solo Ultra y Admin)
        const planUsuario = window.planUsuario || 'gratis';
        const isAdmin = window.isAdmin || false;
        
        if (!isAdmin && planUsuario !== 'ultra') {
            console.warn('⚠️ Usuario sin permisos para crear recordatorios WhatsApp');
            return;
        }
        
        // Obtener datos del paciente
        const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(pacienteId).get();
        if (!pacienteDoc.exists) {
            console.error('❌ Paciente no encontrado para recordatorio');
            return;
        }
        
        const pacienteData = pacienteDoc.data();
        const telefono = pacienteData.telefono;
        
        if (!telefono || telefono.trim() === '') {
            console.warn('⚠️ Paciente sin teléfono, no se puede crear recordatorio WhatsApp');
            return;
        }
        
        // Calcular fecha de recordatorio (24 horas antes)
        const fechaSesionObj = new Date(fechaSesion);
        const fechaRecordatorio = new Date(fechaSesionObj.getTime() - (24 * 60 * 60 * 1000));
        
        // Crear datos del recordatorio
        const recordatorioData = {
            pacienteId: pacienteId,
            sesionId: sesionId,
            fechaSesion: fechaSesion,
            fechaRecordatorio: fechaRecordatorio,
            telefono: telefono,
            nombrePaciente: pacienteData.nombre || pacienteData.email,
            estado: 'pendiente', // pendiente, enviado, cancelado
            creado: new Date(),
            tipo: 'whatsapp'
        };
        
        // Guardar en colección de recordatorios
        await window.firebaseDB.collection('recordatorios').add(recordatorioData);
        console.log('✅ Recordatorio WhatsApp creado para:', pacienteData.nombre, 'el', fechaRecordatorio.toLocaleString());
        
    } catch (error) {
        console.error('❌ Error creando recordatorio WhatsApp:', error);
    }
}

// Función para generar enlace de WhatsApp
function generarEnlaceWhatsApp(telefono, mensaje) {
    // Limpiar el número de teléfono (solo dígitos)
    const telefonoLimpio = telefono.replace(/\D/g, '');
    
    // Agregar código de país si no lo tiene (Argentina por defecto)
    let telefonoCompleto = telefonoLimpio;
    if (!telefonoCompleto.startsWith('54') && telefonoCompleto.length === 10) {
        telefonoCompleto = '54' + telefonoCompleto;
    }
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear enlace de WhatsApp
    return `https://wa.me/${telefonoCompleto}?text=${mensajeCodificado}`;
}

// Función para generar mensaje de recordatorio
function generarMensajeRecordatorio(nombrePaciente, fechaSesion) {
    const fecha = new Date(fechaSesion);
    const fechaFormateada = fecha.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const horaFormateada = fecha.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `¡Hola ${nombrePaciente}! 👋

Te recordamos tu turno mañana:
📅 Fecha: ${fechaFormateada}
⏰ Hora: ${horaFormateada}
📍 Lugar: Consultorio Cocrearte

Si necesitas reprogramar, responde a este mensaje.

¡Te esperamos! 😊`;
}

// Función para cargar recordatorios pendientes
async function cargarRecordatoriosPendientes() {
    try {
        const ahora = new Date();
        const en48Horas = new Date(ahora.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 año para testing
        
        // Buscar todos los recordatorios pendientes (sin filtro de fecha para evitar índice)
        const recordatoriosSnap = await window.firebaseDB
            .collection('recordatorios')
            .where('estado', '==', 'pendiente')
            .get();
        
        const recordatorios = [];
        recordatoriosSnap.forEach(doc => {
            const data = doc.data();
            const fechaRecordatorio = new Date(data.fechaRecordatorio);
            
            // Filtrar en JavaScript: mostrar solo los próximos en 48 horas
            if (fechaRecordatorio <= en48Horas) {
                recordatorios.push({
                    id: doc.id,
                    ...data
                });
            }
        });
        
        console.log(`📱 Recordatorios pendientes encontrados: ${recordatorios.length}`);
        return recordatorios;
        
    } catch (error) {
        console.error('❌ Error cargando recordatorios:', error);
        return [];
    }
}

// Función para mostrar recordatorios en el dashboard
async function mostrarRecordatoriosEnDashboard() {
    try {
        const recordatorios = await cargarRecordatoriosPendientes();
        const recordatoriosList = document.getElementById('recordatoriosList');
        const recordatoriosCount = document.getElementById('recordatoriosCount');
        const recordatoriosSection = document.getElementById('recordatoriosSection');
        
        if (!recordatoriosList) return;
        
        // Mostrar/ocultar sección según si hay recordatorios
        if (recordatorios.length === 0) {
            recordatoriosSection.classList.add('hidden');
            return;
        } else {
            recordatoriosSection.classList.remove('hidden');
        }
        
        // Actualizar contador
        if (recordatoriosCount) {
            recordatoriosCount.textContent = recordatorios.length;
            recordatoriosCount.classList.remove('hidden');
        }
        
        // Generar HTML para cada recordatorio
        const recordatoriosHTML = recordatorios.map(recordatorio => {
            const fechaSesion = new Date(recordatorio.fechaSesion);
            const fechaRecordatorio = new Date(recordatorio.fechaRecordatorio);
            const ahora = new Date();
            
            // Determinar si es urgente (menos de 2 horas para enviar)
            const tiempoRestante = fechaRecordatorio - ahora;
            const esUrgente = tiempoRestante <= (2 * 60 * 60 * 1000) && tiempoRestante > 0;
            const yaVencido = tiempoRestante <= 0;
            
            const mensaje = generarMensajeRecordatorio(recordatorio.nombrePaciente, recordatorio.fechaSesion);
            const enlaceWhatsApp = generarEnlaceWhatsApp(recordatorio.telefono, mensaje);
            
            const colorBorde = yaVencido ? 'border-red-500' : esUrgente ? 'border-orange-500' : 'border-green-500';
            const colorFondo = yaVencido ? 'bg-red-50 dark:bg-red-900/20' : esUrgente ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-green-50 dark:bg-green-900/20';
            const iconoEstado = yaVencido ? '🚨' : esUrgente ? '⚠️' : '📅';
            
            return `
                <div class="border-l-4 ${colorBorde} ${colorFondo} p-4 rounded-r-lg">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-lg">${iconoEstado}</span>
                                <h4 class="font-semibold text-gray-900 dark:text-white">
                                    ${recordatorio.nombrePaciente}
                                </h4>
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    ${recordatorio.telefono}
                                </span>
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <div><strong>Sesión:</strong> ${fechaSesion.toLocaleString('es-AR')}</div>
                                <div><strong>Recordar:</strong> ${fechaRecordatorio.toLocaleString('es-AR')}</div>
                                ${yaVencido ? '<div class="text-red-600 dark:text-red-400 font-medium">⏰ Vencido</div>' : ''}
                                ${esUrgente && !yaVencido ? '<div class="text-orange-600 dark:text-orange-400 font-medium">⏰ Urgente</div>' : ''}
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 ml-4">
                            <a href="${enlaceWhatsApp}" target="_blank" 
                               class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2">
                                📱 Enviar WhatsApp
                            </a>
                            <button onclick="marcarRecordatorioEnviado('${recordatorio.id}')" 
                                    class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium transition">
                                ✅ Marcar enviado
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        recordatoriosList.innerHTML = recordatoriosHTML;
        
    } catch (error) {
        console.error('❌ Error mostrando recordatorios:', error);
        const recordatoriosList = document.getElementById('recordatoriosList');
        if (recordatoriosList) {
            recordatoriosList.innerHTML = `
                <div class="text-red-500 dark:text-red-400 text-center py-4">
                    Error cargando recordatorios
                </div>
            `;
        }
    }
}

// Función para marcar recordatorio como enviado
window.marcarRecordatorioEnviado = async function(recordatorioId) {
    try {
        await window.firebaseDB.collection('recordatorios').doc(recordatorioId).update({
            estado: 'enviado',
            fechaEnvio: new Date()
        });
        
        console.log('✅ Recordatorio marcado como enviado:', recordatorioId);
        
        // Actualizar la lista
        await mostrarRecordatoriosEnDashboard();
        
    } catch (error) {
        console.error('❌ Error marcando recordatorio como enviado:', error);
        alert('Error al marcar el recordatorio como enviado');
    }
}

// === PLANTILLAS DE MENSAJES ===

// Plantillas predefinidas
const plantillasMensajes = {
    default: `¡Hola {nombre}! 👋

Te recordamos tu turno mañana:
📅 Fecha: {fecha}
⏰ Hora: {hora}
📍 Lugar: {lugar}

Si necesitas reprogramar, responde a este mensaje.

¡Te esperamos! 😊`,

    formal: `Estimado/a {nombre},
Le recordamos que tiene una cita programada para mañana:

📅 Fecha: {fecha}
⏰ Horario: {hora}
📍 Ubicación: {lugar}

En caso de necesitar reprogramar, por favor responda a este mensaje.

Saludos cordiales,
Consultorio Cocrearte`,

    amigable: `¡Hola {nombre}! 🌟

¡No te olvides! Mañana nos vemos:
📅 {fecha}
⏰ {hora}
📍 {lugar}

Si surge algo y no puedes venir, ¡avísame!

¡Hasta mañana! 😊💜`,

    breve: `Hola {nombre}! 
Recordatorio: mañana {fecha} a las {hora} en {lugar}.
Cualquier cambio, responde este mensaje. ¡Nos vemos!`
};

// Función para cargar configuración de mensaje
function cargarConfiguracionMensaje() {
    const configuracion = localStorage.getItem('configuracionMensajeRecordatorio');
    if (configuracion) {
        return JSON.parse(configuracion);
    }
    return {
        plantilla: 'default',
        mensajePersonalizado: plantillasMensajes.default,
        lugar: 'Consultorio Cocrearte'
    };
}

// Función para guardar configuración de mensaje
function guardarConfiguracionMensaje(configuracion) {
    localStorage.setItem('configuracionMensajeRecordatorio', JSON.stringify(configuracion));
}

// Función para generar mensaje con plantilla personalizada
function generarMensajePersonalizado(nombrePaciente, fechaSesion) {
    const config = cargarConfiguracionMensaje();
    const fecha = new Date(fechaSesion);
    const fechaFormateada = fecha.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const horaFormateada = fecha.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return config.mensajePersonalizado
        .replace(/{nombre}/g, nombrePaciente)
        .replace(/{fecha}/g, fechaFormateada)
        .replace(/{hora}/g, horaFormateada)
        .replace(/{lugar}/g, config.lugar);
}

// Actualizar función original para usar plantilla personalizada
const generarMensajeRecordatorioOriginal = generarMensajeRecordatorio;
generarMensajeRecordatorio = function(nombrePaciente, fechaSesion) {
    return generarMensajePersonalizado(nombrePaciente, fechaSesion);
};

console.log('🎤 Sistema de voz a texto inicializado');
console.log('📱 Sistema de recordatorios WhatsApp inicializado');

// === FUNCIONES PARA DERIVAR PACIENTES ===

// Variables globales para la derivación
let pacienteADerivar = {
    id: null,
    nombre: '',
    email: ''
};

// Flag para evitar limpiar durante proceso activo
let derivacionEnProceso = false;

// Función de debug para interceptar llamadas
window.debugAbrirModalDerivar = function(...args) {
    console.log('🐛 DEBUG: arguments.length:', arguments.length);
    console.log('🐛 DEBUG: arguments:', arguments);
    console.log('🐛 DEBUG: args spread:', args);
    
    for (let i = 0; i < arguments.length; i++) {
        console.log(`🐛 DEBUG: arg[${i}]:`, {
            valor: arguments[i],
            tipo: typeof arguments[i],
            stringified: JSON.stringify(arguments[i])
        });
    }
    
    return abrirModalDerivar.apply(this, arguments);
};

// Función segura que extrae parámetros de atributos data-*
window.abrirModalDerivarSeguro = function(buttonElement) {
    console.log('🛡️ Iniciando derivación segura...');
    console.log('🔍 Elemento del botón:', buttonElement);
    console.log('🔍 this context:', this);
    console.log('🔍 arguments:', arguments);
    
    // Verificar permisos de administrador
    const isAdmin = window.isAdmin || false;
    if (!isAdmin) {
        console.error('🚫 ACCESO DENEGADO: Solo administradores pueden derivar pacientes');
        showMessage('❌ Acceso denegado: Esta funcionalidad está reservada para administradores', 'error');
        return;
    }
    
    console.log('✅ Permisos de admin verificados - continuando con derivación');
    
    if (!buttonElement) {
        console.error('❌ No se recibió elemento del botón');
        showMessage('Error interno: botón no válido');
        return;
    }
    
    const pacienteId = buttonElement.getAttribute('data-paciente-id');
    const nombrePaciente = buttonElement.getAttribute('data-paciente-nombre');
    const emailPaciente = buttonElement.getAttribute('data-paciente-email');
    
    console.log('📊 Datos extraídos de atributos:', {
        pacienteId: pacienteId,
        nombrePaciente: nombrePaciente,
        emailPaciente: emailPaciente
    });
    
    // Validar que tenemos datos
    if (!pacienteId) {
        console.error('❌ No se pudo obtener el ID del paciente del atributo data-paciente-id');
        showMessage('Error: No se pudo identificar el paciente (ID faltante)');
        return;
    }
    
    // Decodificar HTML entities si las hay
    const nombreDecodificado = nombrePaciente ? 
        nombrePaciente.replace(/&quot;/g, '"').replace(/&#39;/g, "'") : 'Sin nombre';
    const emailDecodificado = emailPaciente ? 
        emailPaciente.replace(/&quot;/g, '"').replace(/&#39;/g, "'") : 'Sin email';
    
    // Llamar a la función original con los datos extraídos
    abrirModalDerivar(pacienteId, nombreDecodificado, emailDecodificado);
};

// Función para abrir el modal de derivación
window.abrirModalDerivar = async function(pacienteId, nombrePaciente, emailPaciente) {
    console.log('🔄 Abriendo modal de derivación para:', nombrePaciente);
    console.log('📋 Parámetros recibidos:', { 
        pacienteId: pacienteId, 
        nombrePaciente: nombrePaciente, 
        emailPaciente: emailPaciente,
        tiposPacienteId: typeof pacienteId,
        longitudPacienteId: pacienteId ? pacienteId.length : 'N/A'
    });
    
    // Validar parámetros con más detalle
    if (!pacienteId || pacienteId === 'null' || pacienteId === 'undefined' || pacienteId === '' || (typeof pacienteId === 'string' && pacienteId.trim() === '')) {
        console.error('❌ Error: ID del paciente no válido:', pacienteId);
        console.error('❌ Tipo de dato:', typeof pacienteId);
        console.error('❌ Valor exacto:', JSON.stringify(pacienteId));
        showMessage('Error: No se pudo identificar el paciente para derivar. ID: ' + JSON.stringify(pacienteId));
        return;
    }
    
    pacienteADerivar = {
        id: pacienteId,
        nombre: nombrePaciente || 'Paciente sin nombre',
        email: emailPaciente || 'Sin email'
    };
    
    console.log('✅ Paciente configurado para derivar:', pacienteADerivar);
    console.log('🔍 Verificación inmediata - pacienteADerivar.id:', pacienteADerivar.id);
    console.log('🔍 Verificación inmediata - typeof pacienteADerivar.id:', typeof pacienteADerivar.id);
    console.log('🔍 Verificación inmediata - JSON.stringify(pacienteADerivar.id):', JSON.stringify(pacienteADerivar.id));
    
    // Marcar que no se debe limpiar durante el proceso
    derivacionEnProceso = false; // Resetear al abrir modal
    
    // Verificar que la variable global se asignó correctamente
    setTimeout(() => {
        console.log('⏱️ Verificación después de timeout - pacienteADerivar:', pacienteADerivar);
    }, 100);
    
    const modal = document.getElementById('modalDerivarPaciente');
    const infoPaciente = document.getElementById('infoPacienteDerivar');
    const selectProfesional = document.getElementById('selectProfesionalDerivacion');
    
    if (!modal) {
        showMessage('Error: No se pudo abrir el modal de derivación');
        return;
    }
    
    // Mostrar información del paciente
    infoPaciente.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <span class="text-orange-600 dark:text-orange-400 text-xl">👤</span>
            </div>
            <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">${nombrePaciente}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">${emailPaciente}</p>
            </div>
        </div>
    `;
    
    // Cargar lista de profesionales
    try {
        console.log('👥 Cargando lista de profesionales...');
        console.log('🔍 Estado del admin panel:', {
            isAdmin: isAdmin,
            selectedUser: adminPanelState?.selectedUser,
            currentUserUid: window.firebaseAuth.currentUser?.uid
        });
        
        if (!window.firebaseDB) {
            throw new Error('Firebase no está disponible');
        }
        
        const profesionalesSnapshot = await window.firebaseDB.collection('usuarios').get();
        selectProfesional.innerHTML = '<option value="">Seleccionar profesional...</option>';
        
        const currentUser = window.firebaseAuth.currentUser;
        if (!currentUser) {
            throw new Error('Usuario no autenticado');
        }
        
        let profesionalesEncontrados = 0;
        
        profesionalesSnapshot.forEach(doc => {
            const profesional = doc.data();
            const profesionalId = doc.id;
            
            console.log('👤 Profesional encontrado:', { id: profesionalId, nombre: profesional.displayName || profesional.email });
            
            // Determinar si incluir al usuario actual en la lista
            let incluirProfesional = false;
            
            if (profesionalId !== currentUser.uid) {
                // Siempre incluir otros profesionales
                incluirProfesional = true;
                console.log('✅ Incluir - profesional diferente al usuario actual');
            } else if (isAdmin && adminPanelState.selectedUser && adminPanelState.selectedUser !== currentUser.uid) {
                // Si soy admin y estoy viendo pacientes de otro profesional, incluir mi usuario
                incluirProfesional = true;
                console.log('✅ Incluir - admin derivando desde otro profesional hacia sí mismo');
            } else {
                console.log('❌ Excluir - usuario actual en su propia lista');
            }
            
            if (incluirProfesional) {
                const option = document.createElement('option');
                option.value = profesionalId;
                
                let nombreProfesional = profesional.displayName || profesional.email || `Profesional ${profesionalId}`;
                
                // Si es el usuario actual, agregar etiqueta especial
                if (profesionalId === currentUser.uid) {
                    nombreProfesional += ' (Yo mismo)';
                }
                
                option.textContent = nombreProfesional;
                selectProfesional.appendChild(option);
                profesionalesEncontrados++;
                
                console.log('✅ Profesional agregado a la lista:', nombreProfesional);
            }
        });
        
        console.log(`📊 Total profesionales disponibles: ${profesionalesEncontrados}`);
        
        if (profesionalesEncontrados === 0) {
            selectProfesional.innerHTML = '<option value="">No hay otros profesionales disponibles</option>';
        }
        
    } catch (error) {
        console.error('❌ Error cargando profesionales:', error);
        selectProfesional.innerHTML = '<option value="">Error al cargar profesionales</option>';
        showMessage('Error al cargar la lista de profesionales: ' + (error.message || error));
    }
    
    modal.classList.remove('hidden');
};

// Función para cerrar el modal de derivación
window.cerrarModalDerivar = function() {
    console.log('🚨 ¡LLAMADA A cerrarModalDerivar()!');
    console.log('🚨 Stack trace:', new Error().stack);
    console.log('🚨 pacienteADerivar ANTES de limpiar:', pacienteADerivar);
    console.log('🚨 derivacionEnProceso:', derivacionEnProceso);
    
    const modal = document.getElementById('modalDerivarPaciente');
    if (modal) {
        modal.classList.add('hidden');
        console.log('🚨 Modal ocultado');
    }
    
    // Solo limpiar variables si NO hay derivación en proceso
    if (!derivacionEnProceso) {
        console.log('🚨 Limpiando variables - derivación NO en proceso');
        pacienteADerivar = {
            id: null,
            nombre: '',
            email: ''
        };
        console.log('🚨 pacienteADerivar DESPUÉS de limpiar:', pacienteADerivar);
    } else {
        console.log('🛡️ NO limpiando variables - derivación EN PROCESO');
    }
};

// Función para confirmar la derivación
window.confirmarDerivacion = async function(event) {
    // Prevenir propagación del evento para evitar cerrar modal accidentalmente
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('⚠️ Evento prevenido para evitar propagación');
    }
    
    console.log('🎯 ¡USUARIO HIZO CLIC EN DERIVAR PACIENTE!');
    console.log('🎯 INICIANDO confirmarDerivacion()');
    console.log('🔍 Estado de pacienteADerivar al inicio:', pacienteADerivar);
    console.log('🔍 pacienteADerivar.id:', pacienteADerivar.id);
    console.log('🔍 typeof pacienteADerivar.id:', typeof pacienteADerivar.id);
    console.log('🔍 JSON.stringify(pacienteADerivar.id):', JSON.stringify(pacienteADerivar.id));
    
    const selectProfesional = document.getElementById('selectProfesionalDerivacion');
    const profesionalDestino = selectProfesional.value;
    
    console.log('👤 Profesional seleccionado:', profesionalDestino);
    
    if (!profesionalDestino) {
        showMessage('Por favor selecciona un profesional de destino');
        return;
    }
    
    console.log('🔍 Validando pacienteADerivar.id...');
    console.log('🔍 !pacienteADerivar.id:', !pacienteADerivar.id);
    console.log('🔍 pacienteADerivar.id === null:', pacienteADerivar.id === null);
    console.log('🔍 pacienteADerivar.id === undefined:', pacienteADerivar.id === undefined);
    console.log('🔍 pacienteADerivar.id === "":', pacienteADerivar.id === "");
    
    if (!pacienteADerivar.id) {
        console.error('❌ FALLO EN VALIDACIÓN: pacienteADerivar.id no válido');
        showMessage('Error: No hay paciente seleccionado para derivar');
        return;
    }
    
    console.log('✅ VALIDACIÓN PASADA - pacienteADerivar.id:', pacienteADerivar.id);
    
    // Marcar derivación en proceso ANTES del customConfirm
    derivacionEnProceso = true;
    console.log('🛡️ PROTECCIÓN ACTIVADA antes de customConfirm - derivacionEnProceso:', derivacionEnProceso);
    
    // Confirmar la acción con el usuario
    console.log('🤔 ANTES de customConfirm - pacienteADerivar.id:', pacienteADerivar.id);
    
    // Mostrar loading inmediatamente con toast personalizado
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    loadingToast.textContent = '⏳ Preparando derivación... Por favor espera';
    loadingToast.id = 'derivacion-loading-toast';
    document.body.appendChild(loadingToast);
    
    // Pequeño delay para asegurar que el toast se muestre
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Ocultar el toast automáticamente
    loadingToast.style.opacity = '0';
    setTimeout(() => {
        if (document.body.contains(loadingToast)) {
            document.body.removeChild(loadingToast);
        }
    }, 300);
    
    // Cerrar el modal de derivación inmediatamente
    const modal = document.getElementById('modalDerivarPaciente');
    if (modal) {
        modal.classList.add('hidden');
        console.log('🚪 Modal de derivación cerrado inmediatamente tras confirmación');
    }
    
    const confirmar = await customConfirm(
        `¿Estás seguro de derivar a "${pacienteADerivar.nombre}" al profesional seleccionado?

⚠️ El paciente desaparecerá de tu lista y se transferirá al otro profesional.`
    );
    console.log('✅ DESPUÉS de customConfirm - pacienteADerivar.id:', pacienteADerivar.id);
    
    if (!confirmar) {
        console.log('❌ Usuario canceló la derivación');
        // Resetear flag si usuario cancela
        derivacionEnProceso = false;
        console.log('🔄 Flag reseteado tras cancelación del usuario');
        return;
    }
    
    console.log('✅ USUARIO CONFIRMÓ - pacienteADerivar.id:', pacienteADerivar.id);
    
    try {
        console.log('🔄 Iniciando derivación del paciente...');
        console.log('🔍 JUSTO ANTES del logging - pacienteADerivar:', pacienteADerivar);
        console.log('🔍 JUSTO ANTES del logging - pacienteADerivar.id:', pacienteADerivar.id);
        
        // ¡VERIFICACIÓN CRÍTICA ANTES DE CONTINUAR!
        if (!pacienteADerivar.id) {
            console.error('🚨 CRÍTICO: pacienteADerivar.id se perdió después de la confirmación!');
            console.error('🚨 Estado actual de pacienteADerivar:', pacienteADerivar);
            throw new Error('ID del paciente se perdió durante el proceso - posible corrupción de estado');
        }
        
        console.log('📋 Datos de derivación:', {
            pacienteId: pacienteADerivar.id,
            profesionalDestino: profesionalDestino,
            currentUser: window.firebaseAuth.currentUser.uid
        });
        
        // Validar Firebase
        if (!window.firebaseDB) {
            throw new Error('Firebase Firestore no está disponible');
        }
        
        if (!window.firebaseAuth.currentUser) {
            throw new Error('Usuario no autenticado');
        }
        
        // Obtener información del profesional de destino
        console.log('📤 Obteniendo datos del profesional destino...');
        const profesionalDoc = await window.firebaseDB.collection('usuarios').doc(profesionalDestino).get();
        
        if (!profesionalDoc.exists) {
            throw new Error('El profesional de destino no existe');
        }
        
        const profesionalData = profesionalDoc.data();
        const nombreProfesional = profesionalData?.displayName || profesionalData?.email || 'Profesional';
        console.log('👨‍⚕️ Profesional destino:', nombreProfesional);
        
        // Verificar que el paciente existe antes de actualizar
        console.log('🔍 Verificando existencia del paciente...');
        console.log('🆔 ID del paciente a verificar:', pacienteADerivar.id);
        
        if (!pacienteADerivar.id) {
            throw new Error('ID del paciente no válido para la verificación');
        }
        
        const pacienteDoc = await window.firebaseDB.collection('pacientes').doc(pacienteADerivar.id).get();
        
        if (!pacienteDoc.exists) {
            throw new Error('El paciente no existe o ya fue derivado');
        }
        
        console.log('💾 Actualizando owner del paciente...');
        // Actualizar el owner del paciente
        await window.firebaseDB.collection('pacientes').doc(pacienteADerivar.id).update({
            owner: profesionalDestino,
            derivadoEl: new Date(),
            derivadoPor: window.firebaseAuth.currentUser.uid,
            derivadoA: profesionalDestino
        });
        
        console.log('✅ Actualización en Firebase completada');
        
        console.log('✅ Paciente derivado exitosamente');
        
        // Cerrar modal
        console.log('🚪 Cerrando modal de derivación...');
        cerrarModalDerivar();
        
        // Cerrar ficha clínica si está abierta
        if (fichaPacienteModal && !fichaPacienteModal.classList.contains('hidden')) {
            console.log('📋 Cerrando ficha clínica...');
            hideFichaPacienteModal();
        }
        
        // Recargar la lista de pacientes
        console.log('🔄 Recargando lista de pacientes...');
        const currentUser = window.firebaseAuth.currentUser;
        await loadPatients(currentUser.uid);
        console.log('✅ Lista de pacientes recargada');
        
        // Si hay panel admin abierto, recargarlo también
        if (isAdmin && adminPanel) {
            console.log('🔄 Recargando panel de administrador...');
            await showAdminPanel();
            console.log('✅ Panel de administrador recargado');
        }
        
        showMessage(
            `✅ Paciente "${pacienteADerivar.nombre}" derivado exitosamente a ${nombreProfesional}`, 
            'success'
        );
        
        console.log('🎉 Derivación completada exitosamente');
        
        // Resetear flag y limpiar variables al finalizar exitosamente
        derivacionEnProceso = false;
        pacienteADerivar = { id: null, nombre: '', email: '' };
        console.log('✅ Variables limpiadas tras derivación exitosa');
        
    } catch (error) {
        console.error('❌ Error al derivar paciente:', error);
        console.error('❌ Error completo:', error);
        console.error('❌ Stack trace:', error.stack);
        
        // Resetear flag en caso de error también
        derivacionEnProceso = false;
        console.log('❌ Flag reseteado tras error en derivación');
        
        const errorMessage = error.message || error.toString() || 'Error desconocido al derivar paciente';
        showMessage('Error al derivar paciente: ' + errorMessage);
    }
};

console.log('🔄 Sistema de derivación de pacientes inicializado');

// Función de diagnóstico para agenda múltiple
window.diagnosticarAgendaMultiple = async function() {
    console.log('🔍 === DIAGNÓSTICO AGENDA MÚLTIPLE ===');
    
    // 1. Verificar elementos del DOM
    const calendarEl = document.getElementById('calendar');
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    const profesionalesSelect = document.getElementById('profesionalesSelect');
    const tabAgendaMultiple = document.getElementById('tabAgendaMultiple');
    const calendarTabs = document.getElementById('calendarTabs');
    
    console.log('📋 Elementos DOM encontrados:', {
        calendar: !!calendarEl,
        profesionalesFilter: !!profesionalesFilter,
        profesionalesSelect: !!profesionalesSelect,
        tabAgendaMultiple: !!tabAgendaMultiple,
        calendarTabs: !!calendarTabs
    });
    
    // 2. Verificar FullCalendar
    console.log('📅 FullCalendar disponible:', !!window.FullCalendar);
    
    // 3. Verificar Firebase
    console.log('🔥 Firebase DB disponible:', !!window.firebaseDB);
    
    // 4. Verificar variables globales
    console.log('📊 Variables globales:', {
        profesionalesDisponibles: profesionalesDisponibles?.length || 0,
        profesionalesSeleccionados: profesionalesSeleccionados?.length || 0,
        calendarMultipleInstance: !!calendarMultipleInstance
    });
    
    // 5. Verificar visibilidad de elementos
    if (profesionalesFilter) {
        const computedStyle = getComputedStyle(profesionalesFilter);
        console.log('👁️ Visibilidad del filtro:', {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            hasHiddenClass: profesionalesFilter.classList.contains('hidden')
        });
    }
    
    if (calendarTabs) {
        const computedStyle = getComputedStyle(calendarTabs);
        console.log('👁️ Visibilidad de calendarTabs:', {
            display: computedStyle.display,
            hasHiddenClass: calendarTabs.classList.contains('hidden')
        });
    }
    
    // 6. Verificar opciones en el select
    if (profesionalesSelect) {
        console.log('📋 Opciones en select:', profesionalesSelect.options.length);
        for (let i = 0; i < profesionalesSelect.options.length; i++) {
            console.log(`  ${i}: ${profesionalesSelect.options[i].value} - ${profesionalesSelect.options[i].text}`);
        }
    }
    
    // 7. Intentar cargar profesionales
    try {
        console.log('🔄 Intentando cargar profesionales...');
        const profesionales = await window.cargarProfesionalesFirebase();
        console.log('✅ Profesionales cargados:', profesionales?.length || 0);
    } catch (error) {
        console.error('❌ Error cargando profesionales:', error);
    }
    
    // 8. Verificar eventos
    try {
        console.log('🔄 Intentando cargar eventos...');
        const eventos = await cargarEventosFiltrados();
        console.log('✅ Eventos cargados:', eventos?.length || 0);
    } catch (error) {
        console.error('❌ Error cargando eventos:', error);
    }
    
    console.log('🔍 === FIN DIAGNÓSTICO ===');
};

// Función de reparación automática para agenda múltiple
window.repararAgendaMultiple = async function() {
    console.log('🔧 === REPARACIÓN AGENDA MÚLTIPLE ===');
    
    // 1. Forzar visibilidad de elementos críticos
    const calendarTabs = document.getElementById('calendarTabs');
    const profesionalesFilter = document.getElementById('profesionalesFilter');
    const dashboardPacientesSection = document.getElementById('dashboardPacientesSection');
    
    if (calendarTabs) {
        calendarTabs.classList.remove('hidden');
        calendarTabs.style.display = 'block';
        console.log('✅ calendarTabs forzado a visible');
    }
    
    if (profesionalesFilter) {
        profesionalesFilter.classList.remove('hidden');
        profesionalesFilter.style.display = 'flex';
        profesionalesFilter.style.visibility = 'visible';
        profesionalesFilter.style.opacity = '1';
        console.log('✅ profesionalesFilter forzado a visible');
    }
    
    if (dashboardPacientesSection) {
        dashboardPacientesSection.classList.add('hidden');
        console.log('✅ dashboardPacientesSection ocultado');
    }
    
    // 2. Destruir calendario existente si existe
    if (calendarMultipleInstance) {
        calendarMultipleInstance.destroy();
        calendarMultipleInstance = null;
        console.log('✅ Calendario existente destruido');
    }
    
    // 3. Limpiar contenedor del calendario
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        calendarEl.innerHTML = '';
        console.log('✅ Contenedor del calendario limpiado');
    }
    
    // 4. Recargar profesionales
    try {
        await window.cargarProfesionalesFirebase();
        console.log('✅ Profesionales recargados');
    } catch (error) {
        console.error('❌ Error recargando profesionales:', error);
    }
    
    // 5. Recrear calendario
    setTimeout(async () => {
        try {
            await mostrarAgendaMultiple();
            console.log('✅ Calendario recreado exitosamente');
        } catch (error) {
            console.error('❌ Error recreando calendario:', error);
        }
    }, 500);
    
    console.log('🔧 === FIN REPARACIÓN ===');
};

// Función de debugging para ejecutar desde consola
window.debugDerivacion = function() {
    console.log('🐛 === DEBUG ESTADO DE DERIVACIÓN ===');
    console.log('🔍 pacienteADerivar:', pacienteADerivar);
    console.log('🔍 window.pacienteADerivar:', window.pacienteADerivar);
    console.log('🔍 fichaPacienteId:', fichaPacienteId);
    console.log('🔍 typeof fichaPacienteId:', typeof fichaPacienteId);
    
    const modal = document.getElementById('modalDerivarPaciente');
    console.log('🔍 Modal derivación visible:', modal ? !modal.classList.contains('hidden') : 'Modal no encontrado');
    
    const select = document.getElementById('selectProfesionalDerivacion');
    console.log('🔍 Profesional seleccionado:', select ? select.value : 'Select no encontrado');
    
    console.log('🐛 === FIN DEBUG ===');
};

// === FUNCIONES DE PERFIL MOVIDAS A perfil.html ===

// === FUNCIONALIDAD DE PESTAÑAS PARA FORMULARIO DE AGREGAR PACIENTE ===

// Función para inicializar las pestañas del formulario
function inicializarPestanasFormulario() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remover clases activas de todos los botones y contenidos
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'border-primary-600', 'text-primary-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });
            
            // Activar el botón y contenido seleccionado
            button.classList.add('active', 'border-primary-600', 'text-primary-600');
            button.classList.remove('border-transparent', 'text-gray-500');
            
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
            }
        });
    });
}

// Función para mostrar la primera pestaña por defecto
function mostrarPrimeraPestana() {
    const firstTabButton = document.querySelector('.tab-button[data-tab="motivos"]');
    const firstTabContent = document.getElementById('tab-motivos');
    
    if (firstTabButton && firstTabContent) {
        firstTabButton.click();
    }
}

// Función para inicializar las pestañas del formulario de edición específicamente
function inicializarPestanasFormularioEdicion() {
    console.log('🔄 Inicializando pestañas del formulario de edición...');
    
    const editModal = document.getElementById('editPatientModal');
    const tabButtons = editModal.querySelectorAll('.tab-button');
    const tabContents = editModal.querySelectorAll('.tab-content');
    
    console.log('🔍 Encontrados:', tabButtons.length, 'botones de pestaña y', tabContents.length, 'contenidos');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            console.log('🔄 Cambiando a pestaña:', targetTab);
            
            // Remover clases activas de todos los botones y contenidos
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'border-primary-600', 'text-primary-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });
            
            // Activar el botón y contenido seleccionado
            button.classList.add('active', 'border-primary-600', 'text-primary-600');
            button.classList.remove('border-transparent', 'text-gray-500');
            
            const targetContent = editModal.querySelector(`#tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
                console.log('✅ Pestaña activada:', targetTab);
            } else {
                console.error('❌ No se encontró el contenido para la pestaña:', targetTab);
            }
        });
    });
    
    console.log('✅ Pestañas del formulario de edición inicializadas');
}

// Función para mostrar la primera pestaña del formulario de edición
function mostrarPrimeraPestanaEdicion() {
    console.log('🔄 Mostrando primera pestaña del formulario de edición...');
    
    const editModal = document.getElementById('editPatientModal');
    const firstTabButton = editModal.querySelector('.tab-button[data-tab="motivos"]');
    const firstTabContent = editModal.querySelector('#tab-motivos');
    
    console.log('🔍 Botón primera pestaña encontrado:', !!firstTabButton);
    console.log('🔍 Contenido primera pestaña encontrado:', !!firstTabContent);
    
    if (firstTabButton && firstTabContent) {
        firstTabButton.click();
        console.log('✅ Primera pestaña activada');
    } else {
        console.error('❌ No se pudo activar la primera pestaña');
    }
}
// Agregar event listener para inicializar pestañas cuando se abra el modal
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar pestañas cuando se abra el modal de agregar paciente
    const addPatientModal = document.getElementById('addPatientModal');
    if (addPatientModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!addPatientModal.classList.contains('hidden')) {
                        inicializarPestanasFormulario();
                        mostrarPrimeraPestana();
                    }
                }
            });
        });
        
        observer.observe(addPatientModal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

// Variables globales para la foto del paciente
let patientPhotoData = null;
let patientPhotoBlob = null;

// Función para mostrar el modal de foto del paciente
window.showPatientPhotoModal = function() {
    console.log('📸 Abriendo modal de foto del paciente...');
    
    const modal = document.getElementById('patientPhotoModal');
    if (!modal) {
        console.error('❌ No se encontró el modal de foto');
        showMessage('Error: No se pudo abrir el modal de foto', 'error');
        return;
    }
    
    modal.classList.remove('hidden');
    
    // Forzar que el modal sea visible y esté por encima de todo
    modal.style.display = 'flex';
    modal.style.zIndex = '999999';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    // Asegurar que el contenido del modal también esté visible
    const modalContent = modal.querySelector('.bg-white, .dark\\:bg-darkcard');
    if (modalContent) {
        modalContent.style.zIndex = '1000000';
        modalContent.style.position = 'relative';
    }
    
    // Ocultar temporalmente el modal de editar para que no interfiera
    const editModal = document.getElementById('editPatientModal');
    if (editModal) {
        editModal.style.zIndex = '1';
    }
    
    // Verificar que el input file esté disponible
    const input = document.getElementById('patientPhotoInput');
    if (!input) {
        console.error('❌ No se encontró el input de foto en el modal');
        showMessage('Error: No se pudo configurar la cámara', 'error');
        return;
    }
    
    console.log('✅ Modal de foto abierto correctamente');
    console.log('🔍 Estilos aplicados al modal:', {
        display: modal.style.display,
        zIndex: modal.style.zIndex,
        position: modal.style.position,
        visibility: getComputedStyle(modal).visibility
    });
    
    // Si hay una foto existente (desde edición), mostrarla
    console.log('🔍 Verificando foto existente...');
    console.log('🔍 patientPhotoData existe:', !!patientPhotoData);
    console.log('🔍 patientPhotoData tipo:', typeof patientPhotoData);
    console.log('🔍 patientPhotoData longitud:', patientPhotoData ? patientPhotoData.length : 0);
    
    if (patientPhotoData) {
        console.log('📸 Mostrando foto existente del paciente...');
        const photoImage = document.getElementById('patientPhotoImage');
        const photoIcon = document.getElementById('patientPhotoIcon');
        const removeBtn = document.getElementById('removePhotoBtn');
        const redDot = document.getElementById('patientPhotoRedDot');
        
        if (photoImage && photoIcon && removeBtn && redDot) {
            // Mostrar imagen y ocultar ícono
            photoImage.classList.remove('hidden');
            photoIcon.classList.add('hidden');
            photoImage.src = patientPhotoData;
            
            // Ocultar punto rojo
            redDot.classList.add('hidden');
            
            // Mostrar botón de eliminar
            removeBtn.classList.remove('hidden');
            
            console.log('✅ Foto existente mostrada correctamente');
        } else {
            console.error('❌ No se encontraron elementos del modal de foto');
        }
    } else {
        // Resetear la vista previa solo si no hay foto existente
        console.log('📸 No hay foto existente, reseteando vista previa...');
        resetPatientPhotoPreview();
        
        // NO resetear variables aquí para mantener la foto existente
        // patientPhotoData = null;
        // patientPhotoBlob = null;
    }
};

// Función para resetear la vista previa de la foto
function resetPatientPhotoPreview() {
    const photoImage = document.getElementById('patientPhotoImage');
    const photoIcon = document.getElementById('patientPhotoIcon');
    const removeBtn = document.getElementById('removePhotoBtn');
    const redDot = document.getElementById('patientPhotoRedDot');
    
    // Ocultar imagen y mostrar ícono
    photoImage.classList.add('hidden');
    photoIcon.classList.remove('hidden');
    
    // Mostrar punto rojo
    redDot.classList.remove('hidden');
    
    // Ocultar botón de eliminar
    removeBtn.classList.add('hidden');
};

// Función para ocultar el modal de foto del paciente
window.hidePatientPhotoModal = function() {
    console.log('🔄 Cerrando modal de foto del paciente...');
    const modal = document.getElementById('patientPhotoModal');
    
    if (modal) {
        // Restaurar el modal de editar a su z-index original
        const editModal = document.getElementById('editPatientModal');
        if (editModal) {
            editModal.style.zIndex = '50';
        }
        
        // Ocultar el modal de foto
        modal.classList.add('hidden');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        
        console.log('✅ Modal de foto cerrado correctamente');
    } else {
        console.error('❌ No se encontró el modal de foto');
    }
};

// Función para capturar foto con la cámara
window.capturePatientPhoto = function() {
    console.log('📷 Intentando capturar foto con cámara...');
    const input = document.getElementById('patientPhotoInput');
    if (!input) {
        console.error('❌ No se encontró el input de foto');
        showMessage('Error: No se pudo acceder a la cámara', 'error');
        return;
    }
    
    // Limpiar el valor anterior para asegurar que se dispare el evento
    input.value = '';
    input.setAttribute('capture', 'user');
    console.log('📷 Input configurado para cámara, haciendo clic...');
    input.click();
};

// Función para subir archivo de foto
window.uploadPatientPhoto = function() {
    console.log('📁 Intentando subir archivo de foto...');
    const input = document.getElementById('patientPhotoInput');
    if (!input) {
        console.error('❌ No se encontró el input de foto');
        showMessage('Error: No se pudo acceder a los archivos', 'error');
        return;
    }
    
    // Limpiar el valor anterior para asegurar que se dispare el evento
    input.value = '';
    input.removeAttribute('capture');
    console.log('📁 Input configurado para archivo, haciendo clic...');
    input.click();
};

// Función para comprimir imagen
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calcular nuevas dimensiones manteniendo proporción
            let { width, height } = img;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            
            // Configurar canvas
            canvas.width = width;
            canvas.height = height;
            
            // Dibujar imagen comprimida
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir a blob con calidad especificada
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', quality);
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

// Función para manejar la selección de archivo
window.handlePhotoFileSelect = function(event) {
    console.log('📸 Archivo seleccionado:', event.target.files[0]);
    
    const file = event.target.files[0];
    if (!file) {
        console.log('❌ No se seleccionó ningún archivo');
        return;
    }
    
    console.log('📸 Información del archivo:', {
        name: file.name,
        size: file.size,
        type: file.type
    });
    
    // Validar tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
        console.error('❌ Archivo demasiado grande:', file.size, 'bytes');
        showMessage('El archivo es demasiado grande. Selecciona una imagen de menos de 10MB.', 'error');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        console.error('❌ Tipo de archivo no válido:', file.type);
        showMessage('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF)', 'error');
        return;
    }
    
    console.log('✅ Archivo válido, procesando...');
    // Mostrar indicador de carga
    showMessage('Procesando imagen...', 'info');
    
    // Comprimir imagen antes de procesar
    compressImage(file)
                .then(compressedBlob => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photoImage = document.getElementById('patientPhotoImage');
                        const photoIcon = document.getElementById('patientPhotoIcon');
                        const removeBtn = document.getElementById('removePhotoBtn');
                        const redDot = document.getElementById('patientPhotoRedDot');
                        
                        // Mostrar imagen y ocultar ícono
                        photoImage.src = e.target.result;
                        photoImage.classList.remove('hidden');
                        photoIcon.classList.add('hidden');
                        
                        // Ocultar punto rojo
                        redDot.classList.add('hidden');
                        
                        // Guardar datos comprimidos
                        patientPhotoData = e.target.result;
                        patientPhotoBlob = compressedBlob;
                        
                        // Mostrar botón de eliminar
                        removeBtn.classList.remove('hidden');
                        
                        // Mostrar mensaje de éxito
                        showMessage('Imagen procesada correctamente', 'success');
                    };
                    reader.readAsDataURL(compressedBlob);
                })
                .catch(error => {
                    console.error('Error al comprimir imagen:', error);
                    showMessage('Error al procesar la imagen. Intenta con una imagen más pequeña.', 'error');
                });
};

// Función para eliminar la foto
window.removePatientPhoto = function() {
    // Resetear la vista previa
    resetPatientPhotoPreview();
    
    // Resetear variables
    patientPhotoData = null;
    patientPhotoBlob = null;
    
    // Limpiar input
    document.getElementById('patientPhotoInput').value = '';
};

// Función para guardar la foto
window.savePatientPhoto = function() {
    console.log('💾 Guardando foto del paciente...');
    console.log('📸 patientPhotoData existe:', !!patientPhotoData);
    console.log('📸 patientPhotoBlob existe:', !!patientPhotoBlob);
    
    if (patientPhotoData && patientPhotoBlob) {
        // La foto ya está guardada en las variables globales
        console.log('✅ Foto del paciente guardada en memoria');
        console.log('📊 Tamaño del archivo comprimido:', patientPhotoBlob.size, 'bytes');
        console.log('📊 Tipo de archivo:', patientPhotoBlob.type);
        console.log('📊 Primeros 100 caracteres de la foto:', patientPhotoData.substring(0, 100));
        
        // Mostrar información útil para debugging
        const sizeInMB = (patientPhotoBlob.size / (1024 * 1024)).toFixed(2);
        showMessage(`Foto guardada correctamente (${sizeInMB}MB)`, 'success');
        
        // Cerrar el modal
        hidePatientPhotoModal();
        
        console.log('✅ Modal cerrado, foto lista para ser guardada en el formulario');
    } else {
        console.error('❌ No hay foto para guardar');
        showMessage('No hay foto para guardar', 'error');
    }
};

// Función para verificar si un paciente tiene foto
async function verificarFotoPaciente(pacienteId) {
    try {
        console.log(`🔍 Verificando foto del paciente ${pacienteId}...`);
        const doc = await window.firebaseDB.collection('pacientes').doc(pacienteId).get();
        
        if (doc.exists) {
            const data = doc.data();
            console.log(`📋 Datos del paciente ${pacienteId}:`, data);
            console.log(`📸 Tiene foto: ${!!data.foto}`);
            if (data.foto) {
                console.log(`📸 Tipo de foto: ${typeof data.foto}`);
                console.log(`📸 Longitud de foto: ${data.foto.length}`);
                console.log(`📸 Primeros 100 caracteres: ${data.foto.substring(0, 100)}`);
            }
            return data.foto;
        } else {
            console.log(`❌ Paciente ${pacienteId} no encontrado`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error verificando foto del paciente ${pacienteId}:`, error);
        return null;
    }
}

// Función global para debug de fotos de pacientes
window.debugFotosPacientes = async function() {
    console.log('🔍 === DEBUG FOTOS DE PACIENTES ===');
    
    try {
        // Obtener el UID del usuario seleccionado (admin) o actual
        const user = window.firebaseAuth.currentUser;
        if (!user) {
            console.error('❌ No hay usuario autenticado');
            return;
        }
        
        let uidParaVerificar = user.uid;
        if (isAdmin && adminPanelState.selectedUser) {
            uidParaVerificar = adminPanelState.selectedUser;
            console.log(`👑 Admin verificando pacientes de: ${uidParaVerificar}`);
        } else {
            console.log(`👤 Usuario normal verificando sus pacientes`);
        }
        
        // Obtener todos los pacientes
        const snapshot = await window.firebaseDB.collection('pacientes').where('owner', '==', uidParaVerificar).get();
        
        console.log(`📋 Total de pacientes encontrados: ${snapshot.size}`);
        
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`\n👤 Paciente: ${data.nombre} (ID: ${doc.id})`);
            console.log(`📸 Tiene foto: ${!!data.foto}`);
            if (data.foto) {
                console.log(`📸 Tipo: ${typeof data.foto}`);
                console.log(`📸 Longitud: ${data.foto.length}`);
                console.log(`📸 Inicio: ${data.foto.substring(0, 50)}...`);
            } else {
                console.log(`❌ NO TIENE FOTO`);
            }
        });
        
        console.log('🔍 === FIN DEBUG FOTOS ===');
        
    } catch (error) {
        console.error('❌ Error en debug de fotos:', error);
    }
};

// Función para limpiar las pestañas cuando se cierre el modal
function limpiarPestanasFormulario() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Resetear a la primera pestaña
    tabButtons.forEach(btn => {
        btn.classList.remove('active', 'border-primary-600', 'text-primary-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    tabContents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active');
    });
    
    // Activar la primera pestaña
    const firstTabButton = document.querySelector('.tab-button[data-tab="basica"]');
    const firstTabContent = document.getElementById('tab-basica');
    
    if (firstTabButton && firstTabContent) {
        firstTabButton.classList.add('active', 'border-primary-600', 'text-primary-600');
        firstTabButton.classList.remove('border-transparent', 'text-gray-500');
        firstTabContent.classList.remove('hidden');
        firstTabContent.classList.add('active');
    }
}

// Sobrescribir la función hideAddPatientModal para limpiar pestañas
const originalHideAddPatientModal = window.hideAddPatientModal;
window.hideAddPatientModal = function() {
    limpiarPestanasFormulario();
    if (originalHideAddPatientModal) {
        originalHideAddPatientModal();
    }
};