# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [0.3.7] - 2024-12-19

### 🗺️ Añadido
- Sistema de geocodificación mejorado con múltiples variaciones de direcciones
- Reconocimiento de todos los barrios de CABA (Balvanera, Palermo, Recoleta, etc.)
- Expansión automática de abreviaciones comunes (Tte. Gral. → Teniente General)
- Validación de coordenadas por provincia para evitar ubicaciones incorrectas
- Sistema de fallback con marcadores grises para direcciones no geocodificables
- Logging detallado del proceso de geocodificación

### 🔄 Cambiado
- Proceso de geocodificación más robusto con múltiples intentos
- Marcadores diferenciados: rojos para ubicaciones exactas, grises para aproximadas
- Mejor manejo de errores en geocodificación de direcciones

### ✅ Mejorado
- Precisión de ubicaciones en el mapa de pacientes
- Validación geográfica para evitar marcadores en provincias incorrectas
- Sugerencias para mejorar direcciones problemáticas

### 🔧 Técnico
- Nuevas funciones `limpiarDireccion()` y `generarVariacionesDireccion()`
- Validación de coordenadas por región geográfica
- Sistema de fallback para direcciones no reconocidas
- Logging mejorado para debugging de geocodificación

## [0.3.6] - 2024-12-19

### ✨ Añadido
- Sistema de checkboxes para selección múltiple de motivos de consulta
- Grid responsivo de 2 columnas para mejor organización visual
- Scroll automático cuando hay muchas opciones
- Etiquetas clickeables para facilitar la selección

### 🔄 Cambiado
- Reemplazado dropdown único por checkboxes múltiples
- Interfaz más intuitiva para selección de motivos
- Guardado de motivos como array en lugar de string único
- Visualización como lista ordenada en ficha clínica

### 🎨 Mejorado
- Diseño más moderno y accesible
- Mejor experiencia de usuario para selección múltiple
- Checkboxes pequeños que no ocupan mucho espacio
- Colores temáticos que se adaptan al tema claro/oscuro

### 🔧 Técnico
- Actualizada función `cargarOpcionesMotivoConsulta()` para generar checkboxes
- Nuevas funciones `obtenerMotivosSeleccionados()` y `establecerMotivosSeleccionados()`
- Actualizado manejo de datos en formularios de agregar y editar pacientes
- Modificada visualización en todas las fichas clínicas
- Actualizado test case para funcionar con checkboxes

## [0.3.5] - 2024-12-19

### ✨ Añadido
- Campo "Motivo de consulta" con dropdown de selección única
- Lista de 35 opciones predefinidas de motivos de consulta
- Integración completa en formularios de agregar y editar pacientes

### 📍 Posicionamiento
- Campo ubicado entre "Información Personal" y "Información de Contacto"
- Consistente en ambos formularios (agregar y editar)

### 🔧 Técnico
- Constante `MOTIVOS_CONSULTA` con todas las opciones
- Funciones para cargar, obtener y establecer motivos seleccionados
- Integración con Firebase para guardado y carga de datos
- Visualización en ficha clínica del paciente

## [0.3.4] - 2024-12-19

### ✨ Añadido
- Sistema de autenticación con Firebase
- Gestión de pacientes con CRUD completo
- Documentación de sesiones
- Subida de archivos clínicos
- Tema claro/oscuro
- Interfaz responsive

### 🔧 Técnico
- Integración con Firebase Auth, Firestore y Storage
- Sistema de modales para formularios
- Validación de datos
- Manejo de archivos
- Diseño con Tailwind CSS 