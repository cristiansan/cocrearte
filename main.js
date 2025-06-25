// main.js - Espacio Cocrearte

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

// Mostrar dashboard y ocultar landing page
async function showDashboard(user) {
    welcomeUser.textContent = `Bienvenido${user.displayName ? ', ' + user.displayName : ''}`;
    userEmail.textContent = user.email;
    welcomeBlock.classList.remove('hidden');
    document.getElementById('landingPage').classList.add('hidden');
    hideAuthModal();
    // Detectar admin
    const userDoc = await window.firebaseDB.collection('usuarios').doc(user.uid).get();
    isAdmin = userDoc.exists && userDoc.data().isAdmin === true;
    if (isAdmin) {
        // Ocultar dashboard de pacientes propios
        document.getElementById('dashboardPacientesSection').style.display = 'none';
        // Seleccionar por defecto el propio usuario
        adminPanelState.selectedUser = user.uid;
        await showAdminPanel();
    } else if (adminPanel) {
        adminPanel.remove();
        adminPanel = null;
        document.getElementById('dashboardPacientesSection').style.display = '';
    }
    if (!isAdmin) loadPatients(user.uid);
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
    patientsList.innerHTML = '';
    noPatientsMsg.classList.add('hidden');
    const snapshot = await window.firebaseDB.collection('pacientes').where('owner', '==', uid).get();
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
    try {
        await window.firebaseDB.collection('pacientes').add({
            owner: user.uid,
            nombre,
            email,
            telefono,
            motivo,
            creado: new Date()
        });
        hideAddPatientModal();
        loadPatients(user.uid);
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
    // Cargar datos paciente
    const doc = await fichaPacienteRef.get();
    if (!doc.exists) return;
    const p = doc.data();
    fichaPacienteDatos.innerHTML = `
        <div class="font-bold text-[#2d3748] dark:text-gray-100 text-lg">${p.nombre || ''}</div>
        <div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Email:</span> ${p.email || ''}</div>
        <div class="text-[#4b5563] dark:text-gray-200 text-sm"><span class="font-semibold">Teléfono:</span> ${p.telefono || ''}</div>
        <div class="text-[#4b5563] dark:text-gray-200 text-sm">${p.motivo || ''}</div>
    `;
    fichaPacienteModal.classList.remove('hidden');
    loadSesiones();
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
    adminPanel.innerHTML = '<h3 class="text-xl font-bold mb-6 text-primary-700">Panel de Administración</h3>';
    // Layout responsive: grid-cols-1 en móvil, grid-cols-2 en md+
    let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div id="adminProList">
        <h4 class="font-semibold mb-2">Profesionales registrados</h4>
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
          <span class="text-lg">👤</span> ${u.displayName || u.email}
          <span class="text-xs text-gray-400">(${u.email})</span>
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
      html += `<div class="mb-4 font-bold text-lg flex items-center gap-2">👤 ${u.displayName || u.email} <span class="text-xs text-gray-400">(${u.email})</span> ${u.isAdmin ? '<span class=\"text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2\">admin</span>' : ''}</div>`;
      const pacientesSnap = await window.firebaseDB.collection('pacientes').where('owner', '==', adminPanelState.selectedUser).orderBy('creado', 'desc').get();
      if (pacientesSnap.empty) {
        html += '<div class="text-gray-500">No hay pacientes registrados para este profesional.</div>';
      } else {
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        for (const doc of pacientesSnap.docs) {
          const p = doc.data();
          html += `<div class="border rounded p-3 bg-gray-50 dark:bg-darkbg cursor-pointer hover:bg-primary-50 dark:hover:bg-darkborder transition" data-paciente-id="${doc.id}">
            <div class="font-bold text-[#2d3748] dark:text-gray-100">${p.nombre || '(sin nombre)'}</div>
            <div class="text-[#4b5563] dark:text-gray-200 text-sm">${p.email || ''}</div>
            <div class="text-[#4b5563] dark:text-gray-200 text-sm">${p.telefono || ''}</div>
            <div class="text-[#4b5563] dark:text-gray-200 text-sm">${p.motivo || ''}</div>`;
          const sesionesSnap = await window.firebaseDB.collection('pacientes').doc(doc.id).collection('sesiones').orderBy('fecha', 'desc').get();
          if (sesionesSnap.empty) {
            html += '<div class="text-xs text-gray-400 mt-2">Sin sesiones</div>';
          } else {
            html += '<ul class="ml-2 mt-2 text-xs">';
            sesionesSnap.forEach(sdoc => {
              const s = sdoc.data();
              html += `<li>📅 ${s.fecha} - ${s.comentario || ''}</li>`;
            });
            html += '</ul>';
          }
          html += '</div>';
        }
        html += '</div>';
      }
    }
    html += `</div></div>`;
    adminPanel.innerHTML += html;
    welcomeBlock.parentNode.insertBefore(adminPanel, welcomeBlock.nextSibling);
    // Listeners para seleccionar profesional
    adminPanel.querySelectorAll('button[data-uid]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        adminPanelState.selectedUser = btn.getAttribute('data-uid');
        await showAdminPanel();
      });
    });
    // Después de insertar el HTML, agrego listeners para abrir ficha clínica
    adminPanel.querySelectorAll('[data-paciente-id]').forEach(div => {
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
} 