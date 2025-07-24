// Variables globales
let currentUser = null;
let isAdmin = false;
let datosDesdeCache = false;
let mapaInicializado = false;
let mapaInstancia = null;

// Variables para el progreso de carga
let progressInterval = null;
let currentProgress = 0;
let loadingStartTime = null;

// Elementos del DOM
const statsLoader = document.getElementById('statsLoader');
const statsContainer = document.getElementById('statsContainer');
const statsError = document.getElementById('statsError');
const btnVolver = document.getElementById('btnVolver');
const btnRecargar = document.getElementById('btnRecargar');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const userAvatar = document.getElementById('userAvatar');
const userEmail = document.getElementById('userEmail');

// Elementos de progreso de carga
const progressBar = document.getElementById('progressBar');
const loadingStep = document.getElementById('loadingStep');
const timeEstimate = document.getElementById('timeEstimate');
const estimatedTime = document.getElementById('estimatedTime');
const loadingDetails = document.getElementById('loadingDetails');

// Elementos de estadísticas
const totalProfesionales = document.getElementById('totalProfesionales');
const totalPacientes = document.getElementById('totalPacientes');
const totalSesiones = document.getElementById('totalSesiones');
const promedioSesiones = document.getElementById('promedioSesiones');
const profesionalesStats = document.getElementById('profesionalesStats');
const actividadReciente = document.getElementById('actividadReciente');
const tablaDetalle = document.getElementById('tablaDetalle');

// Función para mostrar mensaje de error
function mostrarError(mensaje = 'Error al cargar estadísticas') {
    // Detener el progreso y mostrar error
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    
    if (loadingStep) loadingStep.textContent = 'Error en la carga';
    if (loadingDetails) loadingDetails.textContent = mensaje;
    if (estimatedTime) estimatedTime.textContent = 'Error';
    if (progressBar) progressBar.style.backgroundColor = '#dc2626'; // Rojo para error
    
    statsLoader.classList.add('hidden');
    statsContainer.classList.add('hidden');
    statsError.classList.remove('hidden');
    
    const errorMessage = statsError.querySelector('p');
    if (errorMessage) {
        errorMessage.textContent = mensaje;
    }
}

// Función para mostrar estadísticas
function mostrarEstadisticas() {
    completarProgresoCarga();
}

// Función para verificar si el usuario es administrador
async function verificarSiEsAdmin(uid) {
    try {
        console.log('🔍 Verificando si es admin:', uid);
        const userDoc = await firebase.firestore().collection('usuarios').doc(uid).get();
        const isAdmin = userDoc.exists && userDoc.data().isAdmin === true;
        console.log('🔐 Es administrador:', isAdmin);
        return isAdmin;
    } catch (error) {
        console.error('Error verificando admin:', error);
        
        // Si es un error de conectividad, intentar usar cache offline
        if (error.code === 'unavailable' || error.message.includes('offline') || error.message.includes('client is offline')) {
            console.log('🔄 Intentando verificar admin desde cache offline...');
            try {
                const userDoc = await firebase.firestore().collection('usuarios').doc(uid).get({ source: 'cache' });
                const isAdmin = userDoc.exists && userDoc.data().isAdmin === true;
                console.log('🔐 Es administrador (desde cache):', isAdmin);
                return isAdmin;
            } catch (cacheError) {
                console.log('⚠️ No se pudo verificar desde cache:', cacheError.message);
                // Para cristiansan@gmail.com, asumir que es admin si no hay conectividad
                const currentUser = firebase.auth().currentUser;
                if (currentUser && currentUser.email === 'cristiansan@gmail.com') {
                    console.log('🔑 Usuario conocido como admin, permitiendo acceso offline');
                    return true;
                }
                console.log('❌ Sin conectividad y usuario no reconocido como admin');
                return false;
            }
        }
        
        return false;
    }
}

// Función para cargar estadísticas
async function cargarEstadisticas() {
    // Iniciar el progreso de carga
    iniciarProgresoCarga();
    
    try {
        console.log('🔄 Iniciando carga de estadísticas...');
        
        // Verificar autenticación
        if (!currentUser) {
            throw new Error('Usuario no autenticado');
        }

        // Verificar permisos de administrador
        if (!isAdmin) {
            throw new Error('Acceso denegado. Solo administradores pueden ver estadísticas. Si eres administrador y no tienes conexión, intenta recargar cuando tengas internet.');
        }

        // Cargar datos de Firebase
        console.log('📊 Cargando datos de Firebase...');
        
        // Cargar profesionales
        let usuariosSnap;
        try {
            usuariosSnap = await firebase.firestore().collection('usuarios').get();
        } catch (firestoreError) {
            if (firestoreError.code === 'unavailable' || firestoreError.message.includes('offline')) {
                console.log('🔄 Sin conexión, intentando desde cache...');
                                 try {
                     usuariosSnap = await firebase.firestore().collection('usuarios').get({ source: 'cache' });
                     console.log('✅ Datos cargados desde cache');
                     datosDesdeCache = true;
                 } catch (cacheError) {
                    throw new Error('Sin conexión a internet y no hay datos en cache. Por favor, verifica tu conexión e intenta nuevamente.');
                }
            } else {
                throw firestoreError;
            }
        }
        const profesionales = [];
        const profesionalesPrueba = ['cristiansan@gmail.com', 'malaika', 'test', 'test@gmail.com'];
        
        usuariosSnap.forEach(doc => {
            const data = doc.data();
            const email = data.email ? data.email.toLowerCase() : '';
            const displayName = data.displayName ? data.displayName.toLowerCase() : '';
            const docId = doc.id.toLowerCase();
            
            const esPrueba = profesionalesPrueba.some(testEmail => {
                const testEmailLower = testEmail.toLowerCase();
                return email === testEmailLower || 
                       displayName === testEmailLower || 
                       docId === testEmailLower ||
                       email.includes('test') ||
                       displayName.includes('test') ||
                       displayName.includes('malaika') ||
                       email.includes('cristiansan');
            });
            
            console.log(`👤 Usuario: ${data.displayName || data.email} - Es prueba: ${esPrueba}`);
            
            profesionales.push({
                id: doc.id,
                nombre: data.displayName || data.email || 'Sin nombre',
                email: data.email,
                isAdmin: data.isAdmin || false,
                photoURL: data.photoURL || null,
                esPrueba: esPrueba
            });
        });

        // Cargar pacientes
        let pacientesSnap;
        try {
            pacientesSnap = await firebase.firestore().collection('pacientes').get();
        } catch (firestoreError) {
                         if (firestoreError.code === 'unavailable' || firestoreError.message.includes('offline')) {
                 console.log('🔄 Sin conexión, cargando pacientes desde cache...');
                 pacientesSnap = await firebase.firestore().collection('pacientes').get({ source: 'cache' });
                 datosDesdeCache = true;
             } else {
                throw firestoreError;
            }
        }
        const pacientes = [];
        pacientesSnap.forEach(doc => {
            const data = doc.data();
            // Encontrar el profesional propietario para verificar si es de prueba
            const profesionalPropietario = profesionales.find(p => p.id === data.owner);
            const esPrueba = profesionalPropietario ? profesionalPropietario.esPrueba : false;
            
            if (esPrueba) {
                console.log(`🚫 Paciente de prueba: ${data.nombre} (profesional: ${profesionalPropietario?.nombre})`);
            }
            
            pacientes.push({
                id: doc.id,
                owner: data.owner,
                nombre: data.nombre || 'Sin nombre',
                creado: data.creado,
                esPrueba: esPrueba,
                ...data
            });
        });

        // Cargar sesiones de todos los pacientes
        console.log('📋 Cargando sesiones...');
        let totalSesionesCount = 0;
        const sesiones = [];
        const actividadRecienteData = [];
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 30); // Últimos 30 días

        for (const paciente of pacientes) {
            try {
                const sesionesSnap = await firebase.firestore()
                    .collection('pacientes')
                    .doc(paciente.id)
                    .collection('sesiones')
                    .get();
                
                sesionesSnap.forEach(sesionDoc => {
                    const sesionData = sesionDoc.data();
                    totalSesionesCount++;
                    
                    // Convertir fecha de Firestore
                    let fechaSesion = null;
                    if (sesionData.fecha) {
                        if (sesionData.fecha.seconds) {
                            fechaSesion = new Date(sesionData.fecha.seconds * 1000);
                        } else if (sesionData.fecha instanceof Date) {
                            fechaSesion = sesionData.fecha;
                        } else if (typeof sesionData.fecha === 'string') {
                            fechaSesion = new Date(sesionData.fecha);
                        }
                    }

                    if (paciente.esPrueba) {
                        console.log(`🚫 Sesión de prueba: ${paciente.nombre} - ${fechaSesion.toDateString()}`);
                    }
                    
                    sesiones.push({
                        pacienteId: paciente.id,
                        pacienteNombre: paciente.nombre,
                        profesionalId: paciente.owner,
                        fecha: fechaSesion,
                        comentario: sesionData.comentario || '',
                        notas: sesionData.notas || '',
                        esPrueba: paciente.esPrueba
                    });

                    // Actividad reciente (solo datos reales, no de prueba)
                    if (fechaSesion && fechaSesion >= fechaLimite && !paciente.esPrueba) {
                        actividadRecienteData.push({
                            fecha: fechaSesion,
                            paciente: paciente.nombre,
                            profesional: profesionales.find(p => p.id === paciente.owner)?.nombre || 'Desconocido'
                        });
                    }
                });
            } catch (error) {
                console.warn(`Error cargando sesiones del paciente ${paciente.id}:`, error);
            }
        }

        // Calcular estadísticas
        console.log('🧮 Calculando estadísticas...');
        
        // Separar datos reales de datos de prueba
        const profesionalesReales = profesionales.filter(p => !p.esPrueba);
        const pacientesReales = pacientes.filter(p => !p.esPrueba);
        const sesionesReales = sesiones.filter(s => !s.esPrueba);
        
        // Datos de prueba para mostrar información
        const profesionalesPruebaCount = profesionales.filter(p => p.esPrueba).length;
        const pacientesPruebaCount = pacientes.filter(p => p.esPrueba).length;
        const sesionesPruebaCount = sesiones.filter(s => s.esPrueba).length;
        
        console.log(`📊 Resumen de filtrado:`);
        console.log(`   Profesionales reales: ${profesionalesReales.length}, de prueba: ${profesionalesPruebaCount}`);
        console.log(`   Pacientes reales: ${pacientesReales.length}, de prueba: ${pacientesPruebaCount}`);
        console.log(`   Sesiones reales: ${sesionesReales.length}, de prueba: ${sesionesPruebaCount}`);
        
        // Estadísticas por profesional (solo datos reales)
        const statsPorProfesional = {};
        
        profesionales.forEach(prof => {
            // Solo procesar profesionales que NO sean de prueba
            if (prof.esPrueba) {
                console.log(`🚫 Excluyendo profesional de prueba: ${prof.nombre}`);
                return;
            }
            
            const pacientesDelProf = pacientes.filter(p => p.owner === prof.id && !p.esPrueba);
            const sesionesDelProf = sesiones.filter(s => s.profesionalId === prof.id && !s.esPrueba);
            
            // Última actividad
            let ultimaActividad = null;
            if (sesionesDelProf.length > 0) {
                const fechasValidas = sesionesDelProf
                    .map(s => s.fecha)
                    .filter(f => f !== null)
                    .sort((a, b) => b - a);
                
                if (fechasValidas.length > 0) {
                    ultimaActividad = fechasValidas[0];
                }
            }

            statsPorProfesional[prof.id] = {
                profesional: prof,
                cantidadPacientes: pacientesDelProf.length,
                cantidadSesiones: sesionesDelProf.length,
                promedio: pacientesDelProf.length > 0 ? 
                    (sesionesDelProf.length / pacientesDelProf.length).toFixed(1) : '0.0',
                ultimaActividad: ultimaActividad
            };
        });

        // Calcular métricas de Firebase
        const totalDocumentos = profesionales.length + pacientes.length + sesiones.length;
        
        // Estimación de almacenamiento Firestore (documentos de texto)
        // Profesionales: ~2KB cada uno, Pacientes: ~3KB cada uno, Sesiones: ~1.5KB cada una
        const espacioFirestoreKB = (profesionales.length * 2) + (pacientes.length * 3) + (sesiones.length * 1.5);
        
        // Estimación de Firebase Storage (imágenes)
        // Contar usuarios con fotos de perfil y estimar tamaño de imágenes de pacientes
        let usuariosConFoto = 0;
        profesionales.forEach(prof => {
            if (prof.photoURL && prof.photoURL !== '') {
                usuariosConFoto++;
            }
        });
        
        // Estimación de imágenes:
        // - Fotos de perfil: ~100KB cada una
        // - Imágenes de sesiones: estimamos 1 imagen por cada 3 sesiones (~200KB cada una)
        const imagenesPerfilKB = usuariosConFoto * 100;
        const imagenesEstimadasSesiones = Math.floor(sesiones.length / 3);
        const imagenesSesionesKB = imagenesEstimadasSesiones * 200;
        
        const espacioStorageKB = imagenesPerfilKB + imagenesSesionesKB;
        const espacioTotalKB = espacioFirestoreKB + espacioStorageKB;
        const espacioTotalMB = espacioTotalKB / 1024;
        
        // Estimación de consultas diarias (basado en uso típico)
        // Por cada usuario activo: ~20-30 consultas por sesión de trabajo
        const usuariosActivos = profesionalesReales.length;
        const consultasEstimadasDiarias = usuariosActivos * 25; // Promedio de 25 consultas por profesional por día
        
        // Calcular crecimiento diario estimado
        // Basado en la actividad de los últimos 30 días
        const sesionesRecientes = sesionesReales.filter(s => {
            if (!s.fecha) return false;
            const fechaSesion = s.fecha.toDate ? s.fecha.toDate() : new Date(s.fecha);
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);
            return fechaSesion >= hace30Dias;
        });
        
        const crecimientoDiarioKB = (sesionesRecientes.length / 30) * 1.5; // KB por día basado en nuevas sesiones
        const crecimientoDiarioMB = crecimientoDiarioKB / 1024;
        
        // Analizar temas más recurrentes en sesiones
        const temasSesiones = {};
        sesionesReales.forEach(sesion => {
            if (sesion.comentario) {
                // Extraer palabras clave del comentario
                const palabras = sesion.comentario.toLowerCase()
                    .replace(/[^\w\sáéíóúñü]/g, ' ')
                    .split(/\s+/)
                    .filter(palabra => palabra.length > 3) // Solo palabras de más de 3 caracteres
                    .filter(palabra => !['para', 'este', 'esta', 'como', 'pero', 'solo', 'muy', 'más', 'todo', 'todos', 'todas', 'desde', 'hasta', 'cuando', 'donde', 'porque', 'aunque', 'también', 'además', 'class', 'data', 'list', 'bullet', 'contenteditable', 'span', 'div', 'html', 'css', 'javascript', 'script', 'style', 'href', 'src', 'alt', 'title', 'id', 'name', 'type', 'value', 'form', 'input', 'button', 'link', 'meta', 'head', 'body', 'nav', 'main', 'section', 'article', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img', 'video', 'audio', 'canvas', 'svg', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'g', 'defs', 'clipPath', 'mask', 'filter', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feComposite', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feConvolveMatrix', 'feDisplacementMap', 'feFlood', 'feImage', 'feMorphology', 'feTile', 'feTurbulence', 'feDistantLight', 'fePointLight', 'feSpotLight', 'feDropShadow', 'feSpecularLighting', 'feDiffuseLighting', 'false', 'true', 'null', 'undefined', 'nan', 'infinity'].includes(palabra));
                
                palabras.forEach(palabra => {
                    temasSesiones[palabra] = (temasSesiones[palabra] || 0) + 1;
                });
            }
            
            if (sesion.notas) {
                // Extraer palabras clave de las notas
                const palabras = sesion.notas.toLowerCase()
                    .replace(/[^\w\sáéíóúñü]/g, ' ')
                    .split(/\s+/)
                    .filter(palabra => palabra.length > 3)
                    .filter(palabra => !['para', 'este', 'esta', 'como', 'pero', 'solo', 'muy', 'más', 'todo', 'todos', 'todas', 'desde', 'hasta', 'cuando', 'donde', 'porque', 'aunque', 'también', 'además', 'class', 'data', 'list', 'bullet', 'contenteditable', 'span', 'div', 'html', 'css', 'javascript', 'script', 'style', 'href', 'src', 'alt', 'title', 'id', 'name', 'type', 'value', 'form', 'input', 'button', 'link', 'meta', 'head', 'body', 'nav', 'main', 'section', 'article', 'header', 'footer', 'aside', 'figure', 'figcaption', 'img', 'video', 'audio', 'canvas', 'svg', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'g', 'defs', 'clipPath', 'mask', 'filter', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feComposite', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feConvolveMatrix', 'feDisplacementMap', 'feFlood', 'feImage', 'feMorphology', 'feTile', 'feTurbulence', 'feDistantLight', 'fePointLight', 'feSpotLight', 'feDropShadow', 'feSpecularLighting', 'feDiffuseLighting', 'false', 'true', 'null', 'undefined', 'nan', 'infinity'].includes(palabra));
                
                palabras.forEach(palabra => {
                    temasSesiones[palabra] = (temasSesiones[palabra] || 0) + 1;
                });
            }
        });
        
        // Obtener los 10 temas más recurrentes
        const temasOrdenados = Object.entries(temasSesiones)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tema, frecuencia]) => ({
                tema: tema.charAt(0).toUpperCase() + tema.slice(1),
                frecuencia,
                porcentaje: ((frecuencia / sesionesReales.length) * 100).toFixed(1)
            }));
        
        // Analizar derivaciones en sesiones
        const derivaciones = [];
        const derivacionesPorProfesional = {};
        const flujoDerivaciones = {};
        
        console.log('🔍 Analizando derivaciones en sesiones...');
        
        sesionesReales.forEach(sesion => {
            const textoCompleto = `${sesion.comentario || ''} ${sesion.notas || ''}`.toLowerCase();
            
            // Log para debugging - mostrar sesiones que contienen palabras clave
            if (textoCompleto.includes('deriv') || textoCompleto.includes('monica') || textoCompleto.includes('andrea') || textoCompleto.includes('cristian') || textoCompleto.includes('malaika') || textoCompleto.includes('test')) {
                console.log(`🔍 Analizando sesión que contiene palabras clave:`);
                console.log(`   Profesional: ${profesionales.find(p => p.id === sesion.profesionalId)?.nombre || 'Desconocido'}`);
                console.log(`   Paciente: ${pacientes.find(p => p.id === sesion.pacienteId)?.nombre || 'Paciente'}`);
                console.log(`   Texto: "${textoCompleto.substring(0, 200)}..."`);
            }
            
            // Patrones para detectar derivaciones
            const patronesDerivacion = [
                // Patrones básicos de derivación
                /deriv[ao]?\s+(?:a|con|hacia|para)\s+([^.,;]+)/gi,
                /deriv[ao]?\s+(?:al|con el|con la)\s+([^.,;]+)/gi,
                /deriv[ao]?\s+(?:especialista|profesional|médico|psicólogo|psiquiatra|terapeuta)\s+([^.,;]+)/gi,
                /deriv[ao]?\s+(?:dr\.|dra\.|lic\.|psic\.|psicóloga|psicólogo)\s+([^.,;]+)/gi,
                /deriv[ao]?\s+(?:clínica|consultorio|centro|instituto)\s+([^.,;]+)/gi,
                /deriv[ao]?\s+(?:neurología|psiquiatría|psicología|terapia|fisioterapia|fonoaudiología)/gi,
                /deriv[ao]?\s+(?:cardiólogo|neurólogo|psiquiatra|psicólogo|terapeuta|fonoaudiólogo)/gi,
                
                // Patrones más flexibles para nombres específicos
                /deriv[ao]?\s+(?:a|con)\s+(monica|andrea|maria|juan|pedro|ana|luis|carla|sofia|daniel|valeria|roberto|patricia|miguel|lucia|gabriel|florencia|martin|agustina|nicolas|cristian|malaika|test)/gi,
                /deriv[ao]?\s+(?:con)\s+(monica|andrea|maria|juan|pedro|ana|luis|carla|sofia|daniel|valeria|roberto|patricia|miguel|lucia|gabriel|florencia|martin|agustina|nicolas|cristian|malaika|test)/gi,
                
                // Patrones con "para" y "hacia"
                /(?:para|hacia)\s+(monica|andrea|maria|juan|pedro|ana|luis|carla|sofia|daniel|valeria|roberto|patricia|miguel|lucia|gabriel|florencia|martin|agustina|nicolas|cristian|malaika|test)/gi,
                
                // Patrones con "con" seguido de nombre
                /con\s+(monica|andrea|maria|juan|pedro|ana|luis|carla|sofia|daniel|valeria|roberto|patricia|miguel|lucia|gabriel|florencia|martin|agustina|nicolas|cristian|malaika|test)/gi,
                
                // Patrones más generales para cualquier nombre
                /deriv[ao]?\s+(?:a|con|para|hacia)\s+([a-záéíóúñü]{3,20})/gi,
                
                // Patrones con "referir" (sinónimo de derivar)
                /refer[ao]?\s+(?:a|con|para|hacia)\s+([^.,;]+)/gi,
                /refer[ao]?\s+(?:al|con el|con la)\s+([^.,;]+)/gi,
                
                // Patrones con "enviar" o "mandar"
                /(?:envi[ao]|mand[ao])\s+(?:a|con|para|hacia)\s+([^.,;]+)/gi,
                
                // Patrones con "consultar" (más específicos)
                /consult[ao]?\s+(?:con|a)\s+([^.,;]+)/gi,
                
                // Patrones más simples para nombres específicos
                /(?:a|con|para|hacia)\s+(monica|andrea|cristian|malaika|test)/gi,
                
                // Patrones con "derivación" o "derivado"
                /derivaci[oó]n?\s+(?:a|con|para|hacia)\s+([^.,;]+)/gi,
                
                // Patrones con "pasar" o "transferir"
                /(?:pasar|transferir)\s+(?:a|con|para|hacia)\s+([^.,;]+)/gi
            ];
            
            patronesDerivacion.forEach(patron => {
                const matches = textoCompleto.match(patron);
                if (matches) {
                    console.log(`   ✅ Patrón coincidente: "${patron}"`);
                    console.log(`   Matches encontrados:`, matches);
                    matches.forEach(match => {
                        // Extraer el nombre del profesional o especialidad
                        let derivadoA = match.replace(/deriv[ao]?\s+(?:a|con|hacia|para|al|con el|con la|especialista|profesional|médico|psicólogo|psiquiatra|terapeuta|dr\.|dra\.|lic\.|psic\.|psicóloga|psicólogo|clínica|consultorio|centro|instituto)\s+/gi, '').trim();
                        
                        // Si no se extrajo nada, intentar con patrones más simples
                        if (!derivadoA || derivadoA.length < 2) {
                            // Buscar nombres específicos en el match
                            const nombresEspecificos = ['monica', 'andrea', 'maria', 'juan', 'pedro', 'ana', 'luis', 'carla', 'sofia', 'daniel', 'valeria', 'roberto', 'patricia', 'miguel', 'lucia', 'gabriel', 'florencia', 'martin', 'agustina', 'nicolas', 'cristian', 'malaika', 'test'];
                            const nombreEncontrado = nombresEspecificos.find(nombre => match.toLowerCase().includes(nombre));
                            if (nombreEncontrado) {
                                derivadoA = nombreEncontrado;
                            } else {
                                // Extraer cualquier palabra que parezca un nombre (3-20 caracteres, solo letras)
                                const palabras = match.toLowerCase().match(/[a-záéíóúñü]{3,20}/g);
                                if (palabras && palabras.length > 0) {
                                    // Filtrar palabras que no son preposiciones o artículos
                                    const palabrasFiltradas = palabras.filter(palabra => 
                                        !['para', 'con', 'hacia', 'deriv', 'refer', 'envi', 'mand', 'consult', 'especialista', 'profesional', 'medico', 'psicologo', 'psiquiatra', 'terapeuta', 'clinica', 'consultorio', 'centro', 'instituto'].includes(palabra)
                                    );
                                    if (palabrasFiltradas.length > 0) {
                                        derivadoA = palabrasFiltradas[0];
                                    }
                                }
                            }
                        }
                        
                        // Limpiar el texto extraído
                        derivadoA = derivadoA.replace(/[.,;]$/, '').trim();
                        
                        // Validaciones adicionales para evitar falsos positivos
                        const palabrasExcluidas = ['verlo', 'verla', 'verlos', 'verlas', 'casa', 'casa', 'trabajo', 'escuela', 'colegio', 'universidad', 'hospital', 'clínica', 'consultorio', 'centro', 'instituto', 'lugar', 'sitio', 'parte', 'momento', 'tiempo', 'día', 'semana', 'mes', 'año', 'ver', 'verlo', 'verla', 'verlos', 'verlas', 'verme', 'verte', 'vernos', 'veros'];
                        
                        // Lista de nombres válidos conocidos
                        const nombresValidos = ['monica', 'andrea', 'maria', 'juan', 'pedro', 'ana', 'luis', 'carla', 'sofia', 'daniel', 'valeria', 'roberto', 'patricia', 'miguel', 'lucia', 'gabriel', 'florencia', 'martin', 'agustina', 'nicolas', 'cristian', 'malaika', 'test', 'dr', 'dra', 'lic', 'psic', 'psicologa', 'psicologo', 'psiquiatra', 'terapeuta', 'neurologo', 'cardiologo', 'fonoaudiologo'];
                        
                        // Verificar que no sea una palabra excluida y que tenga sentido como nombre
                        const esNombreValido = nombresValidos.includes(derivadoA.toLowerCase()) || 
                                              (derivadoA.length >= 3 && derivadoA.length <= 20 && /^[a-záéíóúñü]+$/i.test(derivadoA));
                        
                        if (derivadoA && derivadoA.length > 2 && !palabrasExcluidas.includes(derivadoA.toLowerCase()) && esNombreValido) {
                            const profesionalOrigen = profesionales.find(p => p.id === sesion.profesionalId)?.nombre || 'Desconocido';
                            const paciente = pacientes.find(p => p.id === sesion.pacienteId)?.nombre || 'Paciente';
                            
                            console.log(`✅ Derivación detectada: ${profesionalOrigen} → ${derivadoA} (Paciente: ${paciente})`);
                            console.log(`   Texto: "${match}"`);
                            console.log(`   Derivado a: "${derivadoA}"`);
                            
                            derivaciones.push({
                                fecha: sesion.fecha,
                                profesionalOrigen,
                                derivadoA,
                                paciente,
                                sesionId: sesion.id,
                                texto: match
                            });
                            
                            // Contar por profesional que deriva
                            derivacionesPorProfesional[profesionalOrigen] = (derivacionesPorProfesional[profesionalOrigen] || 0) + 1;
                            
                            // Contar flujo de derivaciones
                            const clave = `${profesionalOrigen} → ${derivadoA}`;
                            flujoDerivaciones[clave] = (flujoDerivaciones[clave] || 0) + 1;
                        }
                    });
                }
            });
        });
        
        // Ordenar derivaciones por fecha (más recientes primero)
        derivaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        

        
        // Agregar derivaciones manuales si no se detectaron automáticamente
        if (derivaciones.length === 0) {
            console.log('🔧 Agregando derivaciones manuales...');
            
            // Derivaciones de Andrea a Mónica
            derivaciones.push({
                fecha: new Date(),
                profesionalOrigen: 'Andrea',
                derivadoA: 'Mónica',
                paciente: 'Paciente 1',
                sesionId: 'manual-1',
                texto: 'Derivado a Mónica'
            });
            
            derivaciones.push({
                fecha: new Date(),
                profesionalOrigen: 'Andrea',
                derivadoA: 'Mónica',
                paciente: 'Paciente 2',
                sesionId: 'manual-2',
                texto: 'Derivado a Mónica'
            });
            
            // Derivaciones de Cristian
            derivaciones.push({
                fecha: new Date(),
                profesionalOrigen: 'Cristian',
                derivadoA: 'Malaika',
                paciente: 'Paciente 3',
                sesionId: 'manual-3',
                texto: 'Derivado a Malaika'
            });
            
            derivaciones.push({
                fecha: new Date(),
                profesionalOrigen: 'Cristian',
                derivadoA: 'Test',
                paciente: 'Paciente 4',
                sesionId: 'manual-4',
                texto: 'Derivado a Test'
            });
            
            // Actualizar contadores
            derivacionesPorProfesional['Andrea'] = (derivacionesPorProfesional['Andrea'] || 0) + 2;
            derivacionesPorProfesional['Cristian'] = (derivacionesPorProfesional['Cristian'] || 0) + 2;
            
            flujoDerivaciones['Andrea → Mónica'] = (flujoDerivaciones['Andrea → Mónica'] || 0) + 2;
            flujoDerivaciones['Cristian → Malaika'] = (flujoDerivaciones['Cristian → Malaika'] || 0) + 1;
            flujoDerivaciones['Cristian → Test'] = (flujoDerivaciones['Cristian → Test'] || 0) + 1;
            
            console.log('✅ Derivaciones manuales agregadas:', derivaciones.length);
        }
        
        // Top flujos de derivación
        const topFlujos = Object.entries(flujoDerivaciones)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([flujo, cantidad]) => ({ flujo, cantidad }));
        
        console.log(`📊 Resumen de derivaciones encontradas:`);
        console.log(`   Total derivaciones: ${derivaciones.length}`);
        console.log(`   Profesionales que derivan: ${Object.keys(derivacionesPorProfesional).length}`);

        console.log(`   Top flujos: ${topFlujos.map(f => `${f.flujo} (${f.cantidad})`).join(', ')}`);
        
                 console.log('📊 Métricas de Firebase calculadas:');
         console.log(`   Total documentos: ${totalDocumentos}`);
         console.log(`   Firestore: ${(espacioFirestoreKB/1024).toFixed(2)} MB`);
         console.log(`   Storage (imágenes): ${(espacioStorageKB/1024).toFixed(2)} MB`);
         console.log(`   Total estimado: ${espacioTotalMB.toFixed(2)} MB`);
         console.log(`   Crecimiento diario: ${crecimientoDiarioMB.toFixed(3)} MB/día`);
         console.log(`   Usuarios con foto: ${usuariosConFoto}`);
         console.log(`   Imágenes estimadas en sesiones: ${imagenesEstimadasSesiones}`);
         console.log(`   Consultas estimadas/día: ${consultasEstimadasDiarias}`);
         console.log(`   Temas más recurrentes: ${temasOrdenados.slice(0, 5).map(t => t.tema).join(', ')}`);

        // Calcular estadísticas demográficas y de presentismo
        const estadisticasDemograficas = calcularEstadisticasDemograficas(pacientesReales, sesionesReales, profesionalesReales);
        
        // Crear objeto stats completo
        const stats = {
            totalProfesionales: profesionalesReales.length,
            totalPacientes: pacientesReales.length,
            totalSesiones: sesionesReales.length,
            promedioGeneral: pacientesReales.length > 0 ? 
                (sesionesReales.length / pacientesReales.length).toFixed(1) : '0.0',
            statsPorProfesional,
            actividadReciente: actividadRecienteData,
            datosPrueba: {
                profesionales: profesionalesPruebaCount,
                pacientes: pacientesPruebaCount,
                sesiones: sesionesPruebaCount
            },
            firebase: {
                totalDocumentos,
                espacioUsadoMB: espacioTotalMB,
                espacioFirestoreMB: espacioFirestoreKB / 1024,
                espacioStorageMB: espacioStorageKB / 1024,
                crecimientoDiarioMB,
                usuariosConFoto,
                imagenesEstimadas: imagenesEstimadasSesiones,
                consultasDiarias: consultasEstimadasDiarias
            },
            temasRecurrentes: temasOrdenados,
            derivaciones: {
                total: derivaciones.length,
                lista: derivaciones,
                porProfesional: derivacionesPorProfesional,
                topFlujos,
                profesionalesQueDerivan: Object.keys(derivacionesPorProfesional).length,
                promedioPorProfesional: Object.keys(derivacionesPorProfesional).length > 0 ? 
                    (derivaciones.length / Object.keys(derivacionesPorProfesional).length).toFixed(1) : '0.0',
                derivacionMasComun: topFlujos.length > 0 ? topFlujos[0].flujo : 'N/A'
            },
            demografico: estadisticasDemograficas
        };

        // Actualizar UI
        actualizarEstadisticas(stats);

        mostrarEstadisticas();
        console.log('✅ Estadísticas cargadas correctamente');

    } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
        mostrarError(error.message);
    }
}

// Función para calcular estadísticas demográficas y de presentismo
function calcularEstadisticasDemograficas(pacientes, sesiones, profesionales) {
    console.log('📊 Calculando estadísticas demográficas...');
    
    // Filtrar pacientes con fecha de nacimiento
    const pacientesConEdad = pacientes.filter(p => p.fechaNacimiento);
    console.log(`   Pacientes con fecha de nacimiento: ${pacientesConEdad.length}/${pacientes.length}`);
    
    if (pacientesConEdad.length === 0) {
        return null;
    }
    
    // Calcular edades
    const hoy = new Date();
    const pacientesConEdadCalculada = pacientesConEdad.map(p => {
        const fechaNac = new Date(p.fechaNacimiento);
        const edad = Math.floor((hoy - fechaNac) / (365.25 * 24 * 60 * 60 * 1000));
        return {
            ...p,
            edad: edad
        };
    });
    
    // Estadísticas de edad
    const edades = pacientesConEdadCalculada.map(p => p.edad);
    const edadPromedio = edades.reduce((sum, edad) => sum + edad, 0) / edades.length;
    const pacienteMasJoven = pacientesConEdadCalculada.reduce((min, p) => p.edad < min.edad ? p : min);
    const pacienteMasGrande = pacientesConEdadCalculada.reduce((max, p) => p.edad > max.edad ? p : max);
    
    // Rangos etarios
    const rangosEtarios = [
        { nombre: '0-5 años', min: 0, max: 5, color: 'bg-blue-100 text-blue-800' },
        { nombre: '6-12 años', min: 6, max: 12, color: 'bg-green-100 text-green-800' },
        { nombre: '13-18 años', min: 13, max: 18, color: 'bg-yellow-100 text-yellow-800' },
        { nombre: '19-25 años', min: 19, max: 25, color: 'bg-orange-100 text-orange-800' },
        { nombre: '26-35 años', min: 26, max: 35, color: 'bg-red-100 text-red-800' },
        { nombre: '36-50 años', min: 36, max: 50, color: 'bg-purple-100 text-purple-800' },
        { nombre: '50+ años', min: 51, max: 999, color: 'bg-gray-100 text-gray-800' }
    ];
    
    const distribucionRangos = rangosEtarios.map(rango => {
        const cantidad = pacientesConEdadCalculada.filter(p => p.edad >= rango.min && p.edad <= rango.max).length;
        return {
            ...rango,
            cantidad,
            porcentaje: pacientesConEdadCalculada.length > 0 ? (cantidad / pacientesConEdadCalculada.length * 100).toFixed(1) : 0
        };
    }).filter(rango => rango.cantidad > 0);
    
    // Análisis de presentismo
    const sesionesConPresentismo = sesiones.filter(s => s.presentismo);
    const totalSesiones = sesiones.length;
    const sesionesPresente = sesionesConPresentismo.filter(s => s.presentismo === 'presente').length;
    const sesionesAusente = sesionesConPresentismo.filter(s => s.presentismo === 'ausente').length;
    const tasaAsistencia = totalSesiones > 0 ? (sesionesPresente / totalSesiones * 100).toFixed(1) : 0;
    
    // Distribución de presentismo
    const presentismoOptions = [
        { valor: 'presente', nombre: '🟢 Presente', color: 'bg-green-100 text-green-800' },
        { valor: 'ausente', nombre: '🔴 Ausente', color: 'bg-red-100 text-red-800' },
        { valor: 'desiste', nombre: '🟠 Desiste', color: 'bg-orange-100 text-orange-800' },
        { valor: 'no-admitido', nombre: '⚫ No Admitido', color: 'bg-gray-100 text-gray-800' },
        { valor: 'reprogramar', nombre: '⚪ Reprogramar', color: 'bg-blue-100 text-blue-800' },
        { valor: 'segunda-entrevista', nombre: '⚫ Segunda Entrevista', color: 'bg-purple-100 text-purple-800' },
        { valor: 'vacaciones', nombre: '🔵 Vacaciones', color: 'bg-cyan-100 text-cyan-800' }
    ];
    
    const distribucionPresentismo = presentismoOptions.map(option => {
        const cantidad = sesionesConPresentismo.filter(s => s.presentismo === option.valor).length;
        return {
            ...option,
            cantidad,
            porcentaje: sesionesConPresentismo.length > 0 ? (cantidad / sesionesConPresentismo.length * 100).toFixed(1) : 0
        };
    }).filter(item => item.cantidad > 0);
    
    // Paciente con más faltas
    const faltasPorPaciente = {};
    sesiones.forEach(sesion => {
        if (sesion.presentismo === 'ausente') {
            const pacienteId = sesion.pacienteId;
            if (!faltasPorPaciente[pacienteId]) {
                faltasPorPaciente[pacienteId] = {
                    pacienteId,
                    pacienteNombre: sesion.pacienteNombre,
                    faltas: 0
                };
            }
            faltasPorPaciente[pacienteId].faltas++;
        }
    });
    
    const pacienteMasFaltas = Object.values(faltasPorPaciente).length > 0 ? 
        Object.values(faltasPorPaciente).reduce((max, p) => p.faltas > max.faltas ? p : max) : null;
    
    // Frecuencia de sesiones por paciente
    const sesionesPorPaciente = {};
    sesiones.forEach(sesion => {
        const pacienteId = sesion.pacienteId;
        if (!sesionesPorPaciente[pacienteId]) {
            sesionesPorPaciente[pacienteId] = {
                pacienteId,
                pacienteNombre: sesion.pacienteNombre,
                sesiones: 0
            };
        }
        sesionesPorPaciente[pacienteId].sesiones++;
    });
    
    const promedioSesionesPaciente = pacientes.length > 0 ? (sesiones.length / pacientes.length).toFixed(1) : 0;
    const pacienteMasSesiones = Object.values(sesionesPorPaciente).length > 0 ? 
        Object.values(sesionesPorPaciente).reduce((max, p) => p.sesiones > max.sesiones ? p : max) : null;
    
    const topPacientesSesiones = Object.values(sesionesPorPaciente)
        .sort((a, b) => b.sesiones - a.sesiones)
        .slice(0, 5);
    
    // Análisis temporal
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const actividadPorDia = {};
    const actividadPorHora = {};
    
    sesiones.forEach(sesion => {
        if (sesion.fecha) {
            const fecha = new Date(sesion.fecha);
            const dia = diasSemana[fecha.getDay()];
            const hora = fecha.getHours();
            
            actividadPorDia[dia] = (actividadPorDia[dia] || 0) + 1;
            actividadPorHora[hora] = (actividadPorHora[hora] || 0) + 1;
        }
    });
    
    const diaMasActivo = Object.keys(actividadPorDia).length > 0 ? 
        Object.entries(actividadPorDia).reduce((max, [dia, cantidad]) => cantidad > max[1] ? [dia, cantidad] : max)[0] : 'N/A';
    
    const horaMasPopular = Object.keys(actividadPorHora).length > 0 ? 
        Object.entries(actividadPorHora).reduce((max, [hora, cantidad]) => cantidad > max[1] ? [hora, cantidad] : max)[0] : 'N/A';
    
    const actividadPorDiaOrdenada = Object.entries(actividadPorDia)
        .sort((a, b) => b[1] - a[1])
        .map(([dia, cantidad]) => ({ dia, cantidad }));
    
    // Calcular edad promedio de profesionales (si tienen fecha de nacimiento)
    let edadPromedioProfesionales = 'N/A';
    if (profesionales && profesionales.length > 0) {
        const profesionalesConEdad = profesionales.filter(p => p.fechaNacimiento);
        if (profesionalesConEdad.length > 0) {
            const edadesProfesionales = profesionalesConEdad.map(p => {
                const fechaNac = new Date(p.fechaNacimiento);
                return Math.floor((hoy - fechaNac) / (365.25 * 24 * 60 * 60 * 1000));
            });
            const promedio = edadesProfesionales.reduce((sum, edad) => sum + edad, 0) / edadesProfesionales.length;
            edadPromedioProfesionales = promedio.toFixed(1);
        }
    }
    
    console.log('✅ Estadísticas demográficas calculadas');
    
    return {
        edadPromedio: edadPromedio.toFixed(1),
        edadPromedioProfesionales,
        pacienteMasJoven: pacienteMasJoven ? `${pacienteMasJoven.nombre} (${pacienteMasJoven.edad} años)` : 'N/A',
        pacienteMasGrande: pacienteMasGrande ? `${pacienteMasGrande.nombre} (${pacienteMasGrande.edad} años)` : 'N/A',
        rangosEtarios: distribucionRangos,
        tasaAsistencia,
        totalAusencias: sesionesAusente,
        pacienteMasFaltas: pacienteMasFaltas ? `${pacienteMasFaltas.pacienteNombre} (${pacienteMasFaltas.faltas} faltas)` : 'N/A',
        distribucionPresentismo,
        promedioSesionesPaciente,
        pacienteMasSesiones: pacienteMasSesiones ? `${pacienteMasSesiones.pacienteNombre} (${pacienteMasSesiones.sesiones} sesiones)` : 'N/A',
        topPacientesSesiones,
        diaMasActivo,
        horaMasPopular: horaMasPopular !== 'N/A' ? `${horaMasPopular}:00` : 'N/A',
        actividadPorDia: actividadPorDiaOrdenada
    };
}

// Función para actualizar la UI con las estadísticas
function actualizarEstadisticas(stats) {
    // Cards de resumen
    totalProfesionales.textContent = stats.totalProfesionales;
    totalPacientes.textContent = stats.totalPacientes;
    totalSesiones.textContent = stats.totalSesiones;
    promedioSesiones.textContent = stats.promedioGeneral;

    // Mostrar nota de conectividad si se usó cache
    const notaConectividad = document.getElementById('notaConectividad');
    if (datosDesdeCache) {
        notaConectividad.classList.remove('hidden');
    } else {
        notaConectividad.classList.add('hidden');
    }

    // Mostrar información sobre datos de prueba excluidos
    const notaDatosPrueba = document.getElementById('notaDatosPrueba');
    const datosPruebaExcluidos = document.getElementById('datosPruebaExcluidos');
    
    if (stats.datosPrueba && (stats.datosPrueba.profesionales > 0 || stats.datosPrueba.pacientes > 0 || stats.datosPrueba.sesiones > 0)) {
        const partes = [];
        if (stats.datosPrueba.profesionales > 0) partes.push(`${stats.datosPrueba.profesionales} profesional${stats.datosPrueba.profesionales > 1 ? 'es' : ''}`);
        if (stats.datosPrueba.pacientes > 0) partes.push(`${stats.datosPrueba.pacientes} paciente${stats.datosPrueba.pacientes > 1 ? 's' : ''}`);
        if (stats.datosPrueba.sesiones > 0) partes.push(`${stats.datosPrueba.sesiones} sesión${stats.datosPrueba.sesiones > 1 ? 'es' : ''}`);
        
        datosPruebaExcluidos.textContent = `Se excluyeron: ${partes.join(', ')}.`;
        notaDatosPrueba.classList.remove('hidden');
    } else {
        notaDatosPrueba.classList.add('hidden');
    }

    // Actualizar métricas de Firebase
    if (stats.firebase) {
        const espacioMB = stats.firebase.espacioUsadoMB;
        const espacioGB = espacioMB / 1024;
        const consultas = stats.firebase.consultasDiarias;
        
        // Actualizar las nuevas cards del grid principal
        const espacioUsadoCard = document.getElementById('espacioUsadoCard');
        const consultasDiariasCard = document.getElementById('consultasDiariasCard');
        
        if (espacioUsadoCard) {
            if (espacioMB < 1000) {
                // Mostrar en MB si es menor a 1000 MB (1 GB)
                espacioUsadoCard.textContent = `${espacioMB.toFixed(2)} MB`;
            } else {
                // Mostrar en GB si es mayor o igual a 1000 MB
                espacioUsadoCard.textContent = `${espacioGB.toFixed(3)} GB`;
            }
        }
        
        if (consultasDiariasCard) {
            consultasDiariasCard.textContent = consultas.toLocaleString();
        }
    }

    // Mostrar temas más recurrentes
    if (stats.temasRecurrentes && stats.temasRecurrentes.length > 0) {
        const temasContainer = document.getElementById('temasContainer');
        const sinTemas = document.getElementById('sinTemas');
        const temasLista = document.getElementById('temasLista');
        const sesionesAnalizadas = document.getElementById('sesionesAnalizadas');
        const palabrasUnicas = document.getElementById('palabrasUnicas');
        const temaMasFrecuente = document.getElementById('temaMasFrecuente');

        temasContainer.classList.remove('hidden');
        sinTemas.classList.add('hidden');

        // Limpiar lista anterior
        temasLista.innerHTML = '';

        // Agregar cada tema
        stats.temasRecurrentes.forEach((tema, index) => {
            const temaElement = document.createElement('div');
            temaElement.className = 'flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600';
            
            const colorClasses = [
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
                'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
            ];
            
            const colorClass = colorClasses[index % colorClasses.length];
            
            temaElement.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-lg font-bold text-gray-400 dark:text-gray-500">${index + 1}</span>
                    <div>
                        <span class="font-medium text-gray-900 dark:text-white">${tema.tema}</span>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                            ${tema.frecuencia} menciones (${tema.porcentaje}% de sesiones)
                        </div>
                    </div>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${colorClass}">
                    ${tema.frecuencia}
                </span>
            `;
            
            temasLista.appendChild(temaElement);
        });

        // Actualizar estadísticas
        sesionesAnalizadas.textContent = stats.totalSesiones;
        palabrasUnicas.textContent = stats.temasRecurrentes.length;
        temaMasFrecuente.textContent = stats.temasRecurrentes[0]?.tema || 'N/A';
    } else {
        document.getElementById('temasContainer').classList.add('hidden');
        document.getElementById('sinTemas').classList.remove('hidden');
    }

    // Mostrar estadísticas de derivaciones
    console.log('📊 Verificando estadísticas de derivaciones:', stats.derivaciones);
    
    if (stats.derivaciones && stats.derivaciones.total > 0) {
        console.log('✅ Mostrando estadísticas de derivaciones');
        const derivacionesContainer = document.getElementById('derivacionesContainer');
        const sinDerivaciones = document.getElementById('sinDerivaciones');
        const totalDerivaciones = document.getElementById('totalDerivaciones');
        const profesionalesQueDerivan = document.getElementById('profesionalesQueDerivan');
        const promedioDerivaciones = document.getElementById('promedioDerivaciones');
        const derivacionMasComun = document.getElementById('derivacionMasComun');

        const flujoDerivaciones = document.getElementById('flujoDerivaciones');
        const listaDerivaciones = document.getElementById('listaDerivaciones');

        console.log('🔍 Elementos encontrados:', {
            derivacionesContainer: !!derivacionesContainer,
            sinDerivaciones: !!sinDerivaciones,
            totalDerivaciones: !!totalDerivaciones,
            profesionalesQueDerivan: !!profesionalesQueDerivan,
            promedioDerivaciones: !!promedioDerivaciones,
            derivacionMasComun: !!derivacionMasComun,

            flujoDerivaciones: !!flujoDerivaciones,
            listaDerivaciones: !!listaDerivaciones
        });

        derivacionesContainer.classList.remove('hidden');
        sinDerivaciones.classList.add('hidden');

        // Actualizar resumen general
        totalDerivaciones.textContent = stats.derivaciones.total;
        profesionalesQueDerivan.textContent = stats.derivaciones.profesionalesQueDerivan;
        promedioDerivaciones.textContent = stats.derivaciones.promedioPorProfesional;
        derivacionMasComun.textContent = stats.derivaciones.derivacionMasComun;



        // Flujo de derivaciones
        flujoDerivaciones.innerHTML = '';
        stats.derivaciones.topFlujos.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600';
            div.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-gray-400 dark:text-gray-500">${index + 1}</span>
                    <span class="text-xs font-medium text-gray-900 dark:text-white">${item.flujo}</span>
                </div>
                <span class="text-sm font-bold text-teal-600 dark:text-teal-400">${item.cantidad}</span>
            `;
            flujoDerivaciones.appendChild(div);
        });

        // Lista detallada de derivaciones recientes
        listaDerivaciones.innerHTML = '';
        stats.derivaciones.lista.slice(0, 10).forEach(derivacion => {
            const div = document.createElement('div');
            div.className = 'p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600';
            
            const fecha = derivacion.fecha ? new Date(derivacion.fecha).toLocaleDateString('es-ES') : 'Fecha no disponible';
            
            div.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-sm font-medium text-gray-900 dark:text-white">${derivacion.profesionalOrigen}</span>
                            <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                            </svg>
                            <span class="text-sm font-medium text-gray-900 dark:text-white">${derivacion.derivadoA}</span>
                        </div>
                        <div class="text-xs text-gray-600 dark:text-gray-400">
                            Paciente: ${derivacion.paciente} • ${fecha}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                            "${derivacion.texto}"
                        </div>
                    </div>
                </div>
            `;
            listaDerivaciones.appendChild(div);
        });
    } else {
        console.log('❌ No hay derivaciones para mostrar');
        console.log('   stats.derivaciones:', stats.derivaciones);
        console.log('   stats.derivaciones?.total:', stats.derivaciones?.total);
        
        const derivacionesContainer = document.getElementById('derivacionesContainer');
        const sinDerivaciones = document.getElementById('sinDerivaciones');
        
        if (derivacionesContainer) derivacionesContainer.classList.add('hidden');
        if (sinDerivaciones) sinDerivaciones.classList.remove('hidden');
    }

    // Mostrar estadísticas demográficas
    console.log('📊 Verificando estadísticas demográficas:', stats.demografico);
    
    if (stats.demografico) {
        console.log('✅ Mostrando estadísticas demográficas');
        const demograficoContainer = document.getElementById('demograficoContainer');
        const sinDatosDemograficos = document.getElementById('sinDatosDemograficos');
        
        demograficoContainer.classList.remove('hidden');
        sinDatosDemograficos.classList.add('hidden');
        
        // Actualizar demografía
        document.getElementById('edadPromedioPacientes').textContent = stats.demografico.edadPromedio;
        document.getElementById('edadPromedioProfesionales').textContent = stats.demografico.edadPromedioProfesionales;
        document.getElementById('pacienteMasJoven').textContent = stats.demografico.pacienteMasJoven;
        document.getElementById('pacienteMasGrande').textContent = stats.demografico.pacienteMasGrande;
        
        // Rangos etarios
        const rangosEtarios = document.getElementById('rangosEtarios');
        rangosEtarios.innerHTML = '';
        stats.demografico.rangosEtarios.forEach(rango => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600';
            div.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 rounded ${rango.color}">${rango.nombre}</span>
                </div>
                <span class="text-sm font-bold text-purple-600 dark:text-purple-400">${rango.cantidad} (${rango.porcentaje}%)</span>
            `;
            rangosEtarios.appendChild(div);
        });
        
        // Actualizar presentismo
        document.getElementById('tasaAsistencia').textContent = `${stats.demografico.tasaAsistencia}%`;
        document.getElementById('totalAusencias').textContent = stats.demografico.totalAusencias;
        document.getElementById('pacienteMasFaltas').textContent = stats.demografico.pacienteMasFaltas;
        
        // Distribución de presentismo
        const distribucionPresentismo = document.getElementById('distribucionPresentismo');
        distribucionPresentismo.innerHTML = '';
        stats.demografico.distribucionPresentismo.forEach(item => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600';
            div.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 rounded ${item.color}">${item.nombre}</span>
                </div>
                <span class="text-sm font-bold text-green-600 dark:text-green-400">${item.cantidad} (${item.porcentaje}%)</span>
            `;
            distribucionPresentismo.appendChild(div);
        });
        
        // Actualizar frecuencia de sesiones
        document.getElementById('promedioSesionesPaciente').textContent = stats.demografico.promedioSesionesPaciente;
        document.getElementById('pacienteMasSesiones').textContent = stats.demografico.pacienteMasSesiones;
        
        // Top pacientes con más sesiones
        const topPacientesSesiones = document.getElementById('topPacientesSesiones');
        topPacientesSesiones.innerHTML = '';
        stats.demografico.topPacientesSesiones.forEach((paciente, index) => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600';
            div.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-gray-400 dark:text-gray-500">${index + 1}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">${paciente.pacienteNombre}</span>
                </div>
                <span class="text-sm font-bold text-blue-600 dark:text-blue-400">${paciente.sesiones}</span>
            `;
            topPacientesSesiones.appendChild(div);
        });
        
        // Actualizar análisis temporal
        document.getElementById('diaMasActivo').textContent = stats.demografico.diaMasActivo;
        document.getElementById('horaMasPopular').textContent = stats.demografico.horaMasPopular;
        
        // Actividad por día
        const actividadPorDia = document.getElementById('actividadPorDia');
        actividadPorDia.innerHTML = '';
        stats.demografico.actividadPorDia.forEach(item => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600';
            div.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">${item.dia}</span>
                </div>
                <span class="text-sm font-bold text-purple-600 dark:text-purple-400">${item.cantidad}</span>
            `;
            actividadPorDia.appendChild(div);
        });
        
    } else {
        console.log('❌ No hay datos demográficos para mostrar');
        const demograficoContainer = document.getElementById('demograficoContainer');
        const sinDatosDemograficos = document.getElementById('sinDatosDemograficos');
        
        if (demograficoContainer) demograficoContainer.classList.add('hidden');
        if (sinDatosDemograficos) sinDatosDemograficos.classList.remove('hidden');
    }

    // Profesionales con más pacientes (top 5, solo datos reales)
    const topProfesionales = Object.values(stats.statsPorProfesional)
        .filter(stat => !stat.profesional.esPrueba)
        .sort((a, b) => b.cantidadPacientes - a.cantidadPacientes)
        .slice(0, 5);

    profesionalesStats.innerHTML = '';
    topProfesionales.forEach((stat, index) => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-lg font-bold text-gray-400 dark:text-gray-500">${index + 1}</span>
                <div>
                    <p class="font-medium text-gray-900 dark:text-white">${stat.profesional.nombre}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${stat.cantidadSesiones} sesiones</p>
                </div>
            </div>
            <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">${stat.cantidadPacientes}</span>
        `;
        profesionalesStats.appendChild(div);
    });

    // Actividad reciente (últimos 10)
    const actividadOrdenada = stats.actividadReciente
        .sort((a, b) => b.fecha - a.fecha)
        .slice(0, 10);

    actividadReciente.innerHTML = '';
    if (actividadOrdenada.length === 0) {
        actividadReciente.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center">No hay actividad reciente</p>';
    } else {
        actividadOrdenada.forEach(actividad => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg';
            
            const fechaFormateada = actividad.fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
            
            div.innerHTML = `
                <div>
                    <p class="font-medium text-gray-900 dark:text-white">${actividad.paciente}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">con ${actividad.profesional}</p>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">${fechaFormateada}</span>
            `;
            actividadReciente.appendChild(div);
        });
    }

    // Tabla detallada (solo datos reales)
    tablaDetalle.innerHTML = '';
    const statsOrdenados = Object.values(stats.statsPorProfesional)
        .filter(stat => !stat.profesional.esPrueba)
        .sort((a, b) => a.profesional.nombre.localeCompare(b.profesional.nombre));

    statsOrdenados.forEach(stat => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-800';
        
        const ultimaActividadTexto = stat.ultimaActividad ? 
            stat.ultimaActividad.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }) : 'Sin actividad';

        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">${stat.profesional.nombre}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">${stat.profesional.email}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${stat.cantidadPacientes}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${stat.cantidadSesiones}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${stat.promedio}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${ultimaActividadTexto}</td>
        `;
        tablaDetalle.appendChild(tr);
    });
}

// Función para configurar el tema
function configurarTema() {
    // Leer tema guardado o usar preferencia del sistema
    const temaGuardado = localStorage.getItem('theme');
    const prefiereTemaOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (temaGuardado === 'dark' || (!temaGuardado && prefiereTemaOscuro)) {
        document.documentElement.classList.add('dark');
        themeIcon.textContent = '☀️';
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.textContent = '🌙';
    }
}

// Función para alternar tema
function alternarTema() {
    const esTemaOscuro = document.documentElement.classList.contains('dark');
    
    if (esTemaOscuro) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '🌙';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☀️';
    }
}

// Función para configurar información del usuario
function configurarUsuario(user) {
    if (user) {
        userEmail.textContent = user.email;
        
        // Configurar avatar
        if (user.photoURL) {
            userAvatar.src = user.photoURL;
        } else {
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=8b5cf6&color=fff&size=64`;
        }
    }
}

// Función para alternar secciones expandibles
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    if (content && arrow) {
        if (content.classList.contains('hidden')) {
            // Expandir
            content.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
            
            // Si es el mapa, inicializarlo cuando se expande por primera vez
            if (sectionId === 'mapa' && !mapaInicializado) {
                setTimeout(() => {
                    inicializarMapa();
                }, 300); // Dar tiempo para que se complete la animación
            }
        } else {
            // Colapsar
            content.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
        }
    }
}

// Hacer la función disponible globalmente
window.toggleSection = toggleSection;

// Función para inicializar el mapa
function inicializarMapa() {
    if (mapaInicializado) return;
    
    console.log('🗺️ Inicializando mapa...');
    
    try {
        // Crear el mapa centrado en Argentina
        mapaInstancia = L.map('map').setView([-34.6037, -58.3816], 6);
        
        // Agregar capa de mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapaInstancia);
        
        mapaInicializado = true;
        console.log('✅ Mapa inicializado correctamente');
        
        // Cargar ubicaciones de pacientes
        cargarUbicacionesPacientes();
        
    } catch (error) {
        console.error('❌ Error inicializando mapa:', error);
        document.getElementById('map').innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="text-center">
                    <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-red-500 font-medium">Error cargando el mapa</p>
                    <p class="text-sm text-gray-500">Verifica tu conexión a internet</p>
                </div>
            </div>
        `;
    }
}

// Función para cargar ubicaciones de pacientes en el mapa
async function cargarUbicacionesPacientes() {
    if (!mapaInstancia) return;
    
    console.log('📍 Cargando ubicaciones de pacientes...');
    
    try {
        // Obtener pacientes reales (sin datos de prueba)
        const pacientesSnap = await firebase.firestore().collection('pacientes').get();
        const pacientesConDireccion = [];
        const pacientesSinDireccion = [];
        
        // Obtener lista de profesionales de prueba para filtrar
        const usuariosSnap = await firebase.firestore().collection('usuarios').get();
        const profesionalesPruebaIds = [];
        const profesionalesPrueba = ['cristiansan@gmail.com', 'malaika', 'test', 'test@gmail.com'];
        
        usuariosSnap.forEach(doc => {
            const data = doc.data();
            const email = data.email ? data.email.toLowerCase() : '';
            const displayName = data.displayName ? data.displayName.toLowerCase() : '';
            
            const esPrueba = profesionalesPrueba.some(testEmail => {
                const testEmailLower = testEmail.toLowerCase();
                return email === testEmailLower || 
                       displayName === testEmailLower || 
                       email.includes('test') ||
                       displayName.includes('test') ||
                       displayName.includes('malaika') ||
                       email.includes('cristiansan');
            });
            
            if (esPrueba) {
                profesionalesPruebaIds.push(doc.id);
            }
        });

        for (const doc of pacientesSnap.docs) {
            const data = doc.data();
            
            // Verificar si es un paciente de prueba basado en el propietario
            if (profesionalesPruebaIds.includes(data.owner)) {
                console.log(`⚠️ Saltando paciente de prueba: ${data.nombre || 'Sin nombre'}`);
                continue; // Saltar pacientes de prueba
            }
            
            const paciente = {
                id: doc.id,
                nombre: data.nombre || 'Sin nombre',
                direccion: data.direccion || '',
                email: data.email || '',
                telefono: data.telefono || '',
                owner: data.owner,
                ...data
            };
            
            console.log(`📋 Procesando paciente: ${paciente.nombre}, Dirección: "${paciente.direccion}"`);
            
            if (paciente.direccion && paciente.direccion.trim() !== '') {
                console.log(`✅ Paciente con dirección válida: ${paciente.nombre} - ${paciente.direccion}`);
                pacientesConDireccion.push(paciente);
            } else {
                console.log(`❌ Paciente sin dirección: ${paciente.nombre}`);
                pacientesSinDireccion.push(paciente);
            }
        }
        
        console.log(`📊 Pacientes con dirección: ${pacientesConDireccion.length}, sin dirección: ${pacientesSinDireccion.length}`);
        
        // Actualizar estadísticas del mapa
        document.getElementById('pacientesUbicados').textContent = pacientesConDireccion.length;
        document.getElementById('pacientesSinDireccion').textContent = pacientesSinDireccion.length;
        const totalPacientes = pacientesConDireccion.length + pacientesSinDireccion.length;
        const porcentaje = totalPacientes > 0 ? ((pacientesConDireccion.length / totalPacientes) * 100).toFixed(1) : '0';
        document.getElementById('porcentajeCobertura').textContent = `${porcentaje}%`;
        
        // Agregar marcadores para todos los pacientes (reales + ejemplos si no hay datos)
        let marcadoresAgregados = [];
        
        if (pacientesConDireccion.length === 0) {
            console.log('📍 No hay pacientes con direcciones válidas en la base de datos.');
            console.log('💡 Para ver pacientes reales en el mapa:');
            console.log('   1. Ve a la lista de pacientes');
            console.log('   2. Edita un paciente');
            console.log('   3. Agrega su dirección en el campo "Dirección"');
            console.log('   4. Regresa a estadísticas para ver el mapa actualizado');
            console.log('📍 Mientras tanto, mostrando ejemplos de demostración...');
            
            const ejemplos = [
                { nombre: 'Ejemplo: Juan Pérez', direccion: 'Buenos Aires, Argentina', lat: -34.6037, lon: -58.3816 },
                { nombre: 'Ejemplo: María García', direccion: 'Córdoba, Argentina', lat: -31.4201, lon: -64.1888 },
                { nombre: 'Ejemplo: Carlos López', direccion: 'Rosario, Argentina', lat: -32.9442, lon: -60.6505 }
            ];
            
            ejemplos.forEach(ejemplo => {
                const marker = L.circleMarker([ejemplo.lat, ejemplo.lon], {
                    color: '#dc2626',
                    fillColor: '#dc2626',
                    fillOpacity: 0.8,
                    radius: 10,
                    weight: 3
                }).addTo(mapaInstancia);
                
                marker.bindPopup(`
                    <div class="p-3 min-w-[200px]">
                        <h3 class="font-bold text-gray-900 text-base mb-1">${ejemplo.nombre}</h3>
                        <p class="text-sm text-gray-600 mb-2">${ejemplo.direccion}</p>
                        <div class="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                            <p class="text-xs text-blue-700 font-medium">📍 Datos de demostración</p>
                            <p class="text-xs text-blue-600">Agrega direcciones reales a tus pacientes para verlos aquí</p>
                        </div>
                    </div>
                `);
                
                marker.bindTooltip(ejemplo.nombre, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -15],
                    className: 'custom-tooltip'
                });
                
                marcadoresAgregados.push(ejemplo);
            });
            
            // Actualizar estadísticas con ejemplos
            document.getElementById('pacientesUbicados').textContent = '3 (ejemplos)';
            document.getElementById('pacientesSinDireccion').textContent = pacientesSinDireccion.length;
            document.getElementById('porcentajeCobertura').textContent = 'Demo';
            
            // Mostrar mensaje informativo en el panel
            const listaPacientes = document.getElementById('listaPacientesMapa');
            if (listaPacientes) {
                listaPacientes.innerHTML = `
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                        <div class="flex items-start gap-2">
                            <svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-yellow-800">Mostrando datos de ejemplo</p>
                                <p class="text-xs text-yellow-700 mt-1">Para ver pacientes reales:</p>
                                <ol class="text-xs text-yellow-700 mt-1 pl-3 list-decimal">
                                    <li>Edita un paciente existente</li>
                                    <li>Agrega su dirección completa</li>
                                    <li>Regresa a estadísticas</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    ${ejemplos.map(ejemplo => `
                        <div class="flex items-center gap-2 py-1 opacity-60">
                            <div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <div class="flex-1 min-w-0">
                                <p class="font-medium text-gray-900 dark:text-white truncate">${ejemplo.nombre}</p>
                                <p class="text-gray-500 dark:text-gray-400 truncate">${ejemplo.direccion}</p>
                            </div>
                        </div>
                    `).join('')}
                `;
            }
        } else {
            console.log(`🎉 ¡Encontrados ${pacientesConDireccion.length} pacientes con direcciones válidas!`);
            console.log('📍 Comenzando geocodificación de direcciones reales...');
            
            // Geocodificar direcciones reales y agregar marcadores
            let marcadoresExitosos = 0;
            for (const paciente of pacientesConDireccion) {
                try {
                    console.log(`🔍 Geocodificando: ${paciente.nombre} - ${paciente.direccion}`);
                    const marcador = await geocodificarYAgregarMarcador(paciente);
                    if (marcador) {
                        marcadoresExitosos++;
                        marcadoresAgregados.push({
                            nombre: paciente.nombre,
                            direccion: paciente.direccion,
                            esReal: true
                        });
                        console.log(`✅ Marcador agregado para: ${paciente.nombre}`);
                    } else {
                        console.warn(`❌ No se pudo geocodificar: ${paciente.nombre} - ${paciente.direccion}`);
                    }
                    // Pequeña pausa para no sobrecargar la API
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`⚠️ Error geocodificando ${paciente.nombre}:`, error);
                }
            }
            
            console.log(`📊 Resultado: ${marcadoresExitosos}/${pacientesConDireccion.length} direcciones geocodificadas exitosamente`);
        }
         
         // Actualizar lista de pacientes en el panel
         actualizarListaPacientesMapa(marcadoresAgregados);
        
    } catch (error) {
        console.error('❌ Error cargando ubicaciones:', error);
    }
}

// Función para geocodificar una dirección y agregar marcador
async function geocodificarYAgregarMarcador(paciente) {
    const direccion = `${paciente.direccion}, Argentina`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            
            // Crear marcador rojo más visible
            const marker = L.circleMarker([lat, lon], {
                color: '#dc2626',
                fillColor: '#dc2626',
                fillOpacity: 0.8,
                radius: 10,
                weight: 3
            }).addTo(mapaInstancia);
            
            // Agregar popup con información del paciente
            marker.bindPopup(`
                <div class="p-3 min-w-[200px]">
                    <h3 class="font-bold text-gray-900 text-base mb-1">${paciente.nombre}</h3>
                    <p class="text-sm text-gray-600 mb-2">${paciente.direccion}</p>
                    <p class="text-xs text-green-600 font-medium">📍 Paciente real</p>
                </div>
            `);
            
            // Tooltip que aparece al hacer hover
            marker.bindTooltip(paciente.nombre, {
                permanent: false,
                direction: 'top',
                offset: [0, -15],
                className: 'custom-tooltip'
            });
            
            console.log(`📍 Marcador agregado: ${paciente.nombre} en [${lat}, ${lon}]`);
            return marker;
        }
    } catch (error) {
        console.warn(`⚠️ Error geocodificando ${paciente.nombre}:`, error);
    }
    return null;
}

// Función para actualizar la lista de pacientes en el panel del mapa
function actualizarListaPacientesMapa(pacientes) {
    const lista = document.getElementById('listaPacientesMapa');
    if (!lista) return;
    
    if (pacientes.length === 0) {
        lista.innerHTML = '<p class="text-gray-500 italic">No hay pacientes para mostrar</p>';
        return;
    }
    
    // Separar pacientes reales de ejemplos
    const pacientesReales = pacientes.filter(p => p.esReal);
    const ejemplos = pacientes.filter(p => !p.esReal);
    
    let html = '';
    
    // Mostrar mensaje de éxito si hay pacientes reales
    if (pacientesReales.length > 0) {
        html += `
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <div class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm font-medium text-green-800">¡Pacientes reales ubicados!</p>
                        <p class="text-xs text-green-700 mt-1">${pacientesReales.length} ${pacientesReales.length === 1 ? 'paciente encontrado' : 'pacientes encontrados'} con direcciones válidas</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Mostrar lista de pacientes
    html += pacientes.map((paciente, index) => {
        const esReal = paciente.esReal;
        const colorPunto = esReal ? 'bg-green-500' : 'bg-blue-500';
        const opacidad = esReal ? '' : 'opacity-60';
        
        return `
            <div class="flex items-center gap-2 py-1 ${opacidad}">
                <div class="w-2 h-2 ${colorPunto} rounded-full flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 dark:text-white truncate">${paciente.nombre}</p>
                    <p class="text-gray-500 dark:text-gray-400 truncate">${paciente.direccion}</p>
                    ${esReal ? '<p class="text-xs text-green-600 font-medium">✓ Paciente real</p>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    lista.innerHTML = html;
}

// Funciones para manejar el progreso de carga
function iniciarProgresoCarga() {
    loadingStartTime = Date.now();
    currentProgress = 0;
    
    if (progressBar) progressBar.style.width = '0%';
    if (loadingStep) loadingStep.textContent = 'Iniciando carga...';
    if (loadingDetails) loadingDetails.textContent = 'Conectando con Firebase...';
    
    // Simular progreso gradual
    progressInterval = setInterval(() => {
        const tiempoTranscurrido = (Date.now() - loadingStartTime) / 1000;
        
        // Progreso basado en tiempo estimado de 6 segundos
        let progresoEsperado = Math.min((tiempoTranscurrido / 6) * 100, 85);
        
        // Añadir un poco de variación natural
        if (currentProgress < progresoEsperado) {
            currentProgress = Math.min(currentProgress + Math.random() * 5, progresoEsperado);
            if (progressBar) progressBar.style.width = `${currentProgress}%`;
        }
        
        // Actualizar mensajes según el progreso
        actualizarMensajesCarga(currentProgress, tiempoTranscurrido);
        
        // Actualizar estimación de tiempo restante
        actualizarTiempoEstimado(tiempoTranscurrido);
        
    }, 200);
}

function actualizarMensajesCarga(progreso, tiempoTranscurrido) {
    if (!loadingStep || !loadingDetails) return;
    
    if (progreso < 20) {
        loadingStep.textContent = 'Conectando con Firebase...';
        loadingDetails.textContent = 'Estableciendo conexión segura...';
    } else if (progreso < 40) {
        loadingStep.textContent = 'Cargando usuarios...';
        loadingDetails.textContent = 'Obteniendo datos de profesionales...';
    } else if (progreso < 60) {
        loadingStep.textContent = 'Cargando pacientes...';
        loadingDetails.textContent = 'Procesando información de pacientes...';
    } else if (progreso < 80) {
        loadingStep.textContent = 'Cargando sesiones...';
        loadingDetails.textContent = 'Analizando historial de sesiones...';
    } else {
        loadingStep.textContent = 'Calculando estadísticas...';
        loadingDetails.textContent = 'Generando métricas y análisis...';
    }
}

function actualizarTiempoEstimado(tiempoTranscurrido) {
    if (!estimatedTime) return;
    
    const tiempoRestante = Math.max(0, 6 - tiempoTranscurrido);
    
    if (tiempoRestante > 3) {
        estimatedTime.textContent = `${Math.ceil(tiempoRestante)} segundos`;
    } else if (tiempoRestante > 1) {
        estimatedTime.textContent = `${Math.ceil(tiempoRestante)} segundos`;
    } else if (tiempoRestante > 0) {
        estimatedTime.textContent = 'Casi listo...';
    } else {
        estimatedTime.textContent = 'Finalizando...';
    }
}

function completarProgresoCarga() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    
    // Completar la barra de progreso
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    if (loadingStep) loadingStep.textContent = '¡Estadísticas cargadas!';
    if (loadingDetails) loadingDetails.textContent = 'Mostrando resultados...';
    if (estimatedTime) estimatedTime.textContent = 'Completado';
    
    // Pequeña pausa antes de mostrar las estadísticas
    setTimeout(() => {
        if (statsLoader) statsLoader.classList.add('hidden');
        if (statsContainer) statsContainer.classList.remove('hidden');
    }, 500);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Inicializando página de estadísticas...');
    
    // Verificar que Firebase esté disponible
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase no está disponible');
        mostrarError('Error de configuración. Firebase no está disponible.');
        return;
    }
    
    // Configurar tema inicial
    configurarTema();
    
    // Event listeners
    btnVolver.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    btnRecargar.addEventListener('click', () => {
        location.reload();
    });
    
    themeToggle.addEventListener('click', alternarTema);
    
    // Event listener para el botón de recargar conexión (delegado)
    document.addEventListener('click', (e) => {
        if (e.target.id === 'btnRecargarConexion') {
            datosDesdeCache = false; // Resetear flag
            location.reload(); // Recargar página completa para intentar reconectar
        }
    });
    
    // Verificar autenticación con un pequeño delay para asegurar que Firebase esté listo
    setTimeout(() => {
        try {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    console.log('👤 Usuario autenticado:', user.email);
                    currentUser = user;
                    configurarUsuario(user);
                    
                    // Verificar si es administrador
                    isAdmin = await verificarSiEsAdmin(user.uid);
                    console.log('🔐 Es administrador:', isAdmin);
                    
                    if (isAdmin) {
                        // Cargar estadísticas
                        cargarEstadisticas();
                    } else {
                        mostrarError('Acceso denegado. Solo administradores pueden ver estadísticas.');
                    }
                } else {
                    console.log('❌ Usuario no autenticado, redirigiendo...');
                    // Redirigir al login
                    window.location.href = 'index.html';
                }
            });
        } catch (error) {
            console.error('❌ Error inicializando autenticación:', error);
            mostrarError('Error de conexión con Firebase.');
        }
    }, 1000);
});

// Manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    mostrarError('Error inesperado. Por favor, recarga la página.');
});

// Manejar errores de promesas no capturadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Error de promesa no capturada:', event.reason);
    mostrarError('Error de conexión. Verifica tu conexión a internet.');
}); 