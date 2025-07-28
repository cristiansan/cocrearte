# Espacio Cocrearte

Plataforma integral de gestión para terapeutas. Gestiona pacientes, sesiones y documentación clínica de manera eficiente y segura.

## 🚀 ¿Qué es Espacio Cocrearte?
Espacio Cocrearte es una plataforma web pensada para profesionales de la salud mental y terapeutas independientes. Permite organizar la información de pacientes, documentar sesiones, adjuntar archivos clínicos y mantener un historial seguro y privado.

## ✨ Características principales
- **Gestión de Pacientes**: Registra y organiza datos de contacto, motivo de consulta y más.
- **Documentación de Sesiones**: Guarda comentarios, notas y adjunta archivos por sesión.
- **Historial Clínico**: Visualiza el progreso de cada paciente de forma cronológica.
- **Seguridad y Privacidad**: Acceso solo para usuarios autenticados. Cumple estándares de confidencialidad médica.
- **Responsive**: Accede desde cualquier dispositivo.
- **Tema claro/oscuro**: Interfaz moderna adaptable a tus preferencias.

## 🖥️ Demo
Puedes ver una demo en vivo (si está desplegada) o probar localmente siguiendo los pasos de abajo.

## ⚙️ Instalación y uso local
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/cocrearte.git
   cd cocrearte
   ```
2. **Configura Firebase:**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita **Authentication** (Email/Password), **Firestore** y **Storage**
   - Copia tu configuración en `firebase-config.js`
3. **Reglas recomendadas para Storage:**
   Ve a Storage > Rules y usa:
   ```js
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. **Corre localmente:**
   - Usa la extensión **Live Server** de VS Code o cualquier servidor local que sirva archivos estáticos.
   - Abre `index.html` en tu navegador.

## ☁️ Despliegue
- Puedes subir la carpeta a **GitHub Pages**, **Vercel**, **Netlify** o cualquier hosting de archivos estáticos.
- No necesitas backend propio, solo la configuración de Firebase.

## 🛠️ Tecnologías usadas
- **HTML5 + CSS3 + TailwindCSS**
- **JavaScript Vanilla**
- **Firebase (Auth, Firestore, Storage)**

## 📦 Estructura del proyecto
```
cocrearte/
├── index.html
├── main.js
├── firebase-config.js
├── tailwind.css
├── public/
│   └── favicon.ico
```

## 📋 Historial de versiones

### v0.4.0 (Actual)
- 🗺️ **Nuevo**: Sistema de geocodificación mejorado con múltiples variaciones
- 📍 **Mejora**: Reconocimiento de todos los barrios de CABA (Balvanera, Palermo, etc.)
- 🔧 **Funcionalidad**: Expansión automática de abreviaciones (Tte. Gral. → Teniente General)
- ✅ **Validación**: Verificación de coordenadas por provincia para evitar ubicaciones incorrectas
- 🎯 **Fallback**: Marcadores grises para direcciones no geocodificables
- 📊 **Logging**: Proceso detallado de geocodificación con sugerencias de mejora

### v0.3.6
- ✨ **Nuevo**: Sistema de checkboxes para motivo de consulta
- 🔄 **Mejora**: Interfaz más intuitiva para selección múltiple de motivos
- 🎨 **Diseño**: Grid responsivo de 2 columnas con scroll automático
- 📱 **UX**: Etiquetas clickeables y checkboxes pequeños
- 🔧 **Funcionalidad**: Guardado como array y visualización como lista ordenada

### v0.3.5
- ✨ **Nuevo**: Campo "Motivo de consulta" con dropdown de selección única
- 📍 **Posicionamiento**: Campo ubicado entre Información Personal y Contacto
- 🔧 **Integración**: Guardado y carga en formularios de agregar/editar pacientes
- 📋 **Visualización**: Mostrado en ficha clínica del paciente

## 👤 Autor
- [Cristian](https://github.com/cristiansan)

## 📄 Licencia
MIT 