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
const inputNotasSesion = document.getElementById('inputNotasSesion');
const cancelNuevaSesion = document.getElementById('cancelNuevaSesion');

// Referencias al modal de solo lectura para agenda múltiple
const modalDetalleSesionMultiple = document.getElementById('modalDetalleSesionMultiple');
const cerrarDetalleSesionMultiple = document.getElementById('cerrarDetalleSesionMultiple');
const detalleSesionMultipleContent = document.getElementById('detalleSesionMultipleContent');

// Configuración del tema
function setTheme(dark) {
    if (dark) {
        document.documentElement.classList.add('dark');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.textContent = '🌙';
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
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(!isDark);
});

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
    alert('Contacto: soporte@cocrearte.com');
});

// Mostrar mensajes
function showMessage(msg, type = 'error') {
    alert(msg);
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
    inputNotasSesion.value = '';
    cargarPacientesParaSelect();
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
    document.getElementById('landingPage').classList.add('hidden');
    hideAuthModal();
    // Detectar admin
    const userDoc = await window.firebaseDB.collection('usuarios').doc(user.uid).get();
    isAdmin = userDoc.exists && userDoc.data().isAdmin === true;
    const dashboardSection = document.getElementById('dashboardPacientesSection');
    if (isAdmin) {
        // Ocultar la grilla de pacientes propia para evitar duplicación, pero mostrar el botón '+ Agregar Paciente'
        if (dashboardSection) {
            dashboardSection.style.display = 'none';
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
            dashboardSection.style.display = '';
        }
        // Restaurar la lista de pacientes si se vuelve a modo profesional
        const patientsList = document.getElementById('patientsList');
        const noPatientsMsg = document.getElementById('noPatientsMsg');
        if (patientsList) patientsList.style.display = '';
        if (noPatientsMsg) noPatientsMsg.style.display = '';
    }
    if (!isAdmin) loadPatients(user.uid);
    // Ocultar calendario al iniciar sesión
    const calendarTabs = document.getElementById('calendarTabs');
    if (calendarTabs) calendarTabs.classList.add('hidden');
    // Mostrar agenda individual
    mostrarAgendaIndividual();
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
        welcomeBlock.classList.add('hidden');
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    await window.firebaseAuth.signOut();
    welcomeBlock.classList.add('hidden');
    document.getElementById('landingPage').classList.remove('hidden');
    location.hash = '';
});

// Mostrar/Ocultar modal de paciente
window.hideAddPatientModal = function() {
    addPatientModal.classList.add('hidden');
    addPatientForm.reset();
};

showAddPatientBtn.addEventListener('click', () => {
    addPatientModal.classList.remove('hidden');
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
    snapshot.forEach(doc => {
        const p = doc.data();
        const div = document.createElement('div');
        div.className = 'border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-darkborder transition';
        div.setAttribute('data-paciente-id', doc.id);
        div.innerHTML = `
            <div>
                <div class="font-bold text-[#2d3748] dark:text-gray-100">${p.nombre || ''}</div>
                <div class="text-[#4b5563] dark:text-gray-200 text-sm">${p.email || ''}</div>
                <div class="text-[#4b5563] dark:text-gray-200 text-sm">${p.telefono || ''}</div>
                <div class="text-[#4b5563] dark:text-gray-200 text-sm">${p.motivo || ''}</div>
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
    const nombre = addPatientForm.patientName.value;
    const email = addPatientForm.patientEmail.value;
    const telefono = addPatientForm.patientTelefono.value;
    const motivo = addPatientForm.patientMotivo.value;

    // Si eres admin y tienes seleccionado un profesional, asigna el paciente a ese profesional
    let ownerUid = user.uid;
    if (isAdmin && adminPanelState.selectedUser) {
        ownerUid = adminPanelState.selectedUser;
    }

    try {
        await window.firebaseDB.collection('pacientes').add({
            owner: ownerUid,
            nombre,
            email,
            telefono,
            motivo,
            creado: new Date()
        });
        hideAddPatientModal();
        loadPatients(ownerUid); // Recarga la lista del profesional correcto
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
    // Cargar datos paciente
    const doc = await fichaPacienteRef.get();
    if (!doc.exists) {
        fichaLoader.classList.add('hidden');
        return;
    }
    const p = doc.data();
    fichaPacienteDatos.innerHTML = `
        <div class="font-bold text-[#2d3748] dark:text-gray-100 text-lg">${p.nombre || ''}</div>
        <div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Email:</span> ${p.email || ''}</div>
        <div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Teléfono:</span> ${p.telefono || ''}</div>
        <div class="text-[#4b5563] dark:text-gray-200 text-sm">${p.motivo || ''}</div>
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
    snapshot.forEach(doc => {
        const s = doc.data();
        const div = document.createElement('div');
        div.className = 'border rounded p-3 bg-gray-50 dark:bg-darkbg';
        div.innerHTML = `
            <div class="text-sm font-bold text-[#2d3748] dark:text-gray-100"><span class="font-semibold">Fecha:</span> ${s.fecha || ''}</div>
            <div class="text-gray-900 dark:text-gray-200">${s.comentario || ''}</div>
            ${s.notas ? `<div class="text-xs mt-2 text-[#4b5563] dark:text-gray-400"><span class="font-semibold">Notas:</span> ${s.notas}</div>` : ''}
            ${s.archivosUrls && s.archivosUrls.length ? `<div class="mt-2 flex flex-col gap-1">${s.archivosUrls.map(url => `<a href="${url}" target="_blank" class="text-primary-700 underline dark:text-primary-600">Ver archivo adjunto</a>`).join('')}</div>` : ''}
        `;
        sesionesList.appendChild(div);
        
        if (s.archivosUrls && s.archivosUrls.length > 0) {
            console.log(`📎 Sesión del ${s.fecha} tiene ${s.archivosUrls.length} archivo(s) adjunto(s)`);
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
    const comentario = addSesionForm.sesionComentario.value;
    const notas = addSesionForm.sesionNotas.value;
    const archivoInput = document.getElementById('sesionArchivo');
    let archivosUrls = [];
    if (archivoInput && archivoInput.files && archivoInput.files.length > 0) {
        if (archivoInput.files.length > 5) {
            showMessage('Solo puedes adjuntar hasta 5 archivos por sesión.');
            return;
        }
        console.log(`🔄 Iniciando subida de ${archivoInput.files.length} archivo(s)...`);
        
        for (let i = 0; i < archivoInput.files.length; i++) {
            const archivo = archivoInput.files[i];
            if (archivo.size > 5 * 1024 * 1024) { // 5MB
                showMessage('El archivo "' + archivo.name + '" supera el tamaño máximo de 5MB.');
                return;
            }
        }
        const storageRef = window.firebaseStorage.ref();
        const sesionId = window.firebaseDB.collection('tmp').doc().id; // id único
        for (let i = 0; i < archivoInput.files.length; i++) {
            const archivo = archivoInput.files[i];
            try {
                console.log(`📤 Subiendo archivo ${i + 1}/${archivoInput.files.length}: ${archivo.name} (${(archivo.size / 1024 / 1024).toFixed(2)} MB)`);
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
        await fichaPacienteRef.collection('sesiones').add({
            fecha,
            comentario,
            notas,
            archivosUrls,
            creado: new Date()
        });
        console.log(`✅ Sesión guardada exitosamente con ${archivosUrls.length} archivo(s) adjunto(s)`);
        addSesionForm.reset();
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
    addSesionForm.addEventListener('reset', enableFileInput);
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
      html += `<li>
        <button class="w-full text-left flex items-center gap-2 px-3 py-2 rounded transition font-medium
          ${adminPanelState.selectedUser === u.uid ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'hover:bg-primary-50 dark:hover:bg-darkborder text-gray-700 dark:text-gray-200'}"
          data-uid="${u.uid}">
          <span class="text-lg">👤</span> <span>${u.displayName || u.email}</span>
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
      const pacientesSnap = await window.firebaseDB.collection('pacientes').where('owner', '==', adminPanelState.selectedUser).orderBy('creado', 'desc').get();
      if (pacientesSnap.empty) {
        pacientesHtml = '<div class="text-gray-500">No hay pacientes registrados para este profesional.</div>';
      } else {
        pacientesHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        for (const doc of pacientesSnap.docs) {
          const p = doc.data();
          pacientesHtml += `<div class=\"border rounded p-3 bg-gray-50 dark:bg-darkbg cursor-pointer hover:bg-primary-50 dark:hover:bg-darkborder transition\" data-paciente-id=\"${doc.id}\">\n` +
            `<div class=\"font-bold text-[#2d3748] dark:text-gray-100\">${p.nombre || '(sin nombre)'}</div>\n` +
            `<div class=\"text-[#4b5563] dark:text-gray-200 text-sm\">${p.email || ''}</div>\n` +
            `<div class=\"text-[#4b5563] dark:text-gray-200 text-sm\">${p.telefono || ''}</div>\n` +
            `<div class=\"text-[#4b5563] dark:text-gray-200 text-sm\">${p.motivo || ''}</div>`;
          const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(doc.id).collection('sesiones').orderBy('fecha', 'desc').get();
          if (sesionesSnap.empty) {
            pacientesHtml += '<div class=\"text-xs text-gray-400 mt-2\">Sin sesiones</div>';
          } else {
            pacientesHtml += '<ul class=\"ml-2 mt-2 text-xs\">';
            sesionesSnap.forEach(sdoc => {
              const s = sdoc.data();
              pacientesHtml += `<li>📅 ${s.fecha} - ${s.comentario || ''}</li>`;
            });
            pacientesHtml += '</ul>';
          }
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
          fichaPacienteDatos.innerHTML = `
              <div class=\"font-bold text-[#2d3748] dark:text-gray-100 text-lg\">${p.nombre || ''}</div>
              <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\"><span class=\"font-semibold\">Email:</span> ${p.email || ''}</div>
              <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\"><span class=\"font-semibold\">Teléfono:</span> ${p.telefono || ''}</div>
              <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\">${p.motivo || ''}</div>
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

// === BOTONES DE CAMBIO DE VISTA (DÍA/SEMANA) ===
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
    }
}

function agregarListenersVistaCalendario() {
    console.log('=== AGREGANDO LISTENERS VISTA CALENDARIO ===');
    const btnDia = document.getElementById('btnVistaDia');
    const btnSemana = document.getElementById('btnVistaSemana');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    console.log('Botones encontrados:', { btnDia, btnSemana, btnPrev, btnNext });
    if (!btnDia || !btnSemana || !btnPrev || !btnNext) {
        console.error('FALTAN BOTONES! No se pueden agregar listeners');
        return;
    }

    // REMOVER LISTENERS EXISTENTES ANTES DE AGREGAR NUEVOS
    const newBtnDia = btnDia.cloneNode(true);
    const newBtnSemana = btnSemana.cloneNode(true);
    const newBtnPrev = btnPrev.cloneNode(true);
    const newBtnNext = btnNext.cloneNode(true);
    
    btnDia.parentNode.replaceChild(newBtnDia, btnDia);
    btnSemana.parentNode.replaceChild(newBtnSemana, btnSemana);
    btnPrev.parentNode.replaceChild(newBtnPrev, btnPrev);
    btnNext.parentNode.replaceChild(newBtnNext, btnNext);

    // Variable para controlar debounce
    let navegacionEnProceso = false;

    newBtnDia.addEventListener('click', () => {
        let calendar = calendarInstance || calendarMultipleInstance;
        if (calendar) {
            const currentDate = calendar.getDate();
            calendar.changeView('timeGridDay');
            calendar.gotoDate(currentDate);
        }
        activarBotonVista('day');
        actualizarLabelCalendario();
    });
    newBtnSemana.addEventListener('click', () => {
        let calendar = calendarInstance || calendarMultipleInstance;
        if (calendar) {
            const currentDate = calendar.getDate();
            calendar.changeView('timeGridWeek');
            calendar.gotoDate(currentDate);
        }
        activarBotonVista('week');
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
    if (!btnDia || !btnSemana) return;
    if (tipo === 'day') {
        btnDia.classList.add('bg-primary-700', 'text-white');
        btnDia.classList.remove('bg-gray-200');
        btnSemana.classList.remove('bg-primary-700', 'text-white');
        btnSemana.classList.add('bg-gray-200');
    } else {
        btnSemana.classList.add('bg-primary-700', 'text-white');
        btnSemana.classList.remove('bg-gray-200');
        btnDia.classList.remove('bg-primary-700', 'text-white');
        btnDia.classList.add('bg-gray-200');
    }
    actualizarLabelCalendario();
}

// Función para inicializar la agenda múltiple
async function mostrarAgendaMultiple() {
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
            timeGridWeek: { type: 'timeGridWeek', buttonText: 'Semana', dateIncrement: { weeks: 1 } },
            timeGridDay: { type: 'timeGridDay', buttonText: 'Día', dateIncrement: { days: 1 }, dateAlignment: 'day' }
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
        console.log('=== CALENDARIO MÚLTIPLE RENDERIZADO ===');
        agregarListenersVistaCalendario();
        activarBotonVista('week');
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
                        sesionesSnap.forEach(sDoc => {
                            const s = sDoc.data();
                            eventos.push({
                                title: pacDoc.data().nombre || pacDoc.data().email,
                                start: s.fecha,
                                extendedProps: {
                                    pacienteId: pacDoc.id,
                                    notas: s.comentario,
                                    sesionId: sDoc.id
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

// Estado de visibilidad del calendario
let calendarVisible = false;
let activeTab = null; // 'individual', 'multiple' o null

// Event listeners para tabs del calendario (toggle)
const tabAgendaIndividual = document.getElementById('tabAgendaIndividual');
const tabAgendaMultiple = document.getElementById('tabAgendaMultiple');
const calendarTabs = document.getElementById('calendarTabs');
if (tabAgendaIndividual && tabAgendaMultiple && calendarTabs) {
    tabAgendaIndividual.addEventListener('click', () => {
        if (calendarVisible && activeTab === 'individual') {
            calendarTabs.classList.add('hidden');
            calendarVisible = false;
        } else {
            tabAgendaIndividual.classList.add('bg-primary-700', 'text-white');
            tabAgendaIndividual.classList.remove('bg-gray-200', 'text-gray-800');
            tabAgendaMultiple.classList.remove('bg-primary-700', 'text-white');
            tabAgendaMultiple.classList.add('bg-gray-200', 'text-gray-800');
            calendarTabs.classList.remove('hidden');
            calendarVisible = true;
            activeTab = 'individual';
            mostrarAgendaIndividual();
        }
    });
    tabAgendaMultiple.addEventListener('click', () => {
        if (calendarVisible && activeTab === 'multiple') {
            calendarTabs.classList.add('hidden');
            calendarVisible = false;
        } else {
            tabAgendaMultiple.classList.add('bg-primary-700', 'text-white');
            tabAgendaMultiple.classList.remove('bg-gray-200', 'text-gray-800');
            tabAgendaIndividual.classList.remove('bg-primary-700', 'text-white');
            tabAgendaIndividual.classList.add('bg-gray-200', 'text-gray-800');
            calendarTabs.classList.remove('hidden');
            calendarVisible = true;
            activeTab = 'multiple';
            mostrarAgendaMultiple();
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
        const notas = inputNotasSesion.value;
        if (!pacienteId || !fecha) return;
        try {
            if (sesionEditando && sesionEditando.sesionId) {
                // Editar sesión existente
                await window.firebaseDB.collection('pacientes').doc(pacienteId).collection('sesiones').doc(sesionEditando.sesionId).update({
                    fecha,
                    comentario: notas
                });
                if (sesionEditando.eventObj) {
                    sesionEditando.eventObj.setStart(fecha);
                    sesionEditando.eventObj.setProp('title', selectPaciente.options[selectPaciente.selectedIndex].text);
                    sesionEditando.eventObj.setExtendedProp('notas', notas);
                    sesionEditando.eventObj.setExtendedProp('pacienteId', pacienteId);
                }
            } else {
                // Crear nueva sesión
                const docRef = await window.firebaseDB.collection('pacientes').doc(pacienteId).collection('sesiones').add({
                    fecha,
                    comentario: notas,
                    creado: new Date()
                });
                // Agregar evento a la instancia activa
                const activeCalendar = calendarMultipleInstance || calendarInstance;
                if (activeCalendar) {
                    activeCalendar.addEvent({
                        title: selectPaciente.options[selectPaciente.selectedIndex].text,
                        start: fecha,
                        end: null,
                        extendedProps: { pacienteId, notas, sesionId: docRef.id }
                    });
                }
            }
            modalNuevaSesion.classList.add('hidden');
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