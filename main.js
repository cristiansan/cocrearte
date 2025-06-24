// main.js

// Referencias a elementos
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
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

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(!isDark);
});

// Mostrar mensajes
function showMessage(msg, type = 'error') {
    alert(msg); // Puedes mejorar esto con un sistema de mensajes visual
}

// Mostrar/Ocultar modal de paciente
window.hideAddPatientModal = function() {
    addPatientModal.classList.add('hidden');
    addPatientForm.reset();
};
showAddPatientBtn.addEventListener('click', () => {
    addPatientModal.classList.remove('hidden');
});

// Logout
logoutBtn.addEventListener('click', async () => {
    await window.firebaseAuth.signOut();
    dashboardSection.classList.add('hidden');
    authSection.classList.remove('hidden');
});

// Mostrar datos de usuario y pacientes tras login
function showDashboard(user) {
    welcomeUser.textContent = `Bienvenido${user.displayName ? ', ' + user.displayName : ''}`;
    userEmail.textContent = user.email;
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    loadPatients(user.uid);
}

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;
    try {
        const cred = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
        showDashboard(cred.user);
    } catch (error) {
        showMessage('Error al iniciar sesión: ' + error.message);
    }
});

// Registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = registerForm.registerName.value;
    const email = registerForm.registerEmail.value;
    const password = registerForm.registerPassword.value;
    try {
        const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        showDashboard(userCredential.user);
    } catch (error) {
        showMessage('Error al registrarse: ' + error.message);
    }
});

// Mantener sesión iniciada
window.firebaseAuth.onAuthStateChanged(user => {
    if (user) {
        showDashboard(user);
    } else {
        dashboardSection.classList.add('hidden');
        authSection.classList.remove('hidden');
    }
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
                <div class=\"font-bold text-[#2d3748] dark:text-gray-100\">${p.nombre || ''}</div>
                <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\">${p.email || ''}</div>
                <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\">${p.telefono || ''}</div>
                <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\">${p.motivo || ''}</div>
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
        <div class=\"font-bold text-[#2d3748] dark:text-gray-100 text-lg\">${p.nombre || ''}</div>
        <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\"><span class=\"font-semibold\">Email:</span> ${p.email || ''}</div>
        <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\"><span class=\"font-semibold\">Teléfono:</span> ${p.telefono || ''}</div>
        <div class=\"text-[#4b5563] dark:text-gray-200 text-sm\"><span class=\"font-semibold\">Motivo:</span> ${p.motivo || ''}</div>
    `;
    fichaPacienteModal.classList.remove('hidden');
    loadSesiones();
});

// Cargar sesiones de paciente
async function loadSesiones() {
    sesionesList.innerHTML = '';
    noSesionesMsg.classList.add('hidden');
    if (!fichaPacienteRef) return;
    const snapshot = await fichaPacienteRef.collection('sesiones').orderBy('fecha', 'desc').get();
    if (snapshot.empty) {
        noSesionesMsg.classList.remove('hidden');
        return;
    }
    snapshot.forEach(doc => {
        const s = doc.data();
        const div = document.createElement('div');
        div.className = 'border rounded p-3 bg-gray-50 dark:bg-darkbg';
        div.innerHTML = `
            <div class=\"text-sm font-bold text-[#2d3748] dark:text-gray-100\"><span class=\"font-semibold\">Fecha:</span> ${s.fecha || ''}</div>
            <div class=\"text-gray-900 dark:text-gray-200\">${s.comentario || ''}</div>
        `;
        sesionesList.appendChild(div);
    });
}

// Agregar nueva sesión
addSesionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!fichaPacienteRef) return;
    const fecha = addSesionForm.sesionFecha.value;
    const comentario = addSesionForm.sesionComentario.value;
    try {
        await fichaPacienteRef.collection('sesiones').add({
            fecha,
            comentario,
            creado: new Date()
        });
        addSesionForm.reset();
        loadSesiones();
    } catch (error) {
        showMessage('Error al agregar sesión: ' + error.message);
    }
});

// TODO: Mostrar dashboard tras login, ocultar sección de auth
// TODO: Lógica de logout, gestión de pacientes, etc. 