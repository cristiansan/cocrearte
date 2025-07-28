# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [0.4.1] - 2024-12-19

### 🏷️ Añadido
- Nuevas opciones de motivo de consulta: "Mutismo Selectivo" y "No controla esfínteres"
- Tags en camel case para mejor legibilidad (Admin, Pro, Ultra, Gratis, Derivar, Test)
- Mensaje de bienvenida personalizado que muestra solo el primer nombre del usuario
- Redirección automática a página de precios para usuarios Gratis al intentar agregar pacientes

### 🔄 Cambiado
- Tags de usuario actualizados a camel case: "Admin", "Pro", "Ultra", "Gratis", "Derivar", "Test"
- Mensaje de bienvenida ahora muestra "Bienvenido, Cristian" en lugar del email completo
- Comportamiento del botón "Agregar Paciente" para usuarios Gratis: abre página de precios en lugar de mostrar error

### 🎯 Funcionalidades
- Sistema de extracción inteligente del primer nombre desde displayName o email
- Redirección contextual a página de precios según el plan del usuario
- Mensajes informativos mejorados para guiar a usuarios hacia planes premium

### 🔧 Técnico
- Nueva función `obtenerPrimerNombre()` para extraer primer nombre del displayName
- Actualizada función `agregarTagsUsuario()` para usar camel case
- Mejorada lógica de verificación de permisos en botones de agregar paciente
- Debug logs para troubleshooting de tags y nombres de usuario

### 🎨 UI/UX
- Tags más legibles y profesionales en camel case
- Experiencia más personalizada con nombres en lugar de emails
- Flujo de conversión mejorado hacia planes de pago

## [0.4.0] - 2024-12-19

### 🏷️ Añadido
- Sistema completo de planes y permisos (Gratis, Pro, Ultra)
- Tags visuales para identificar el plan de cada usuario (GRATIS, PRO, ULTRA, ADMIN)
- Página de precios con modal interactivo y toggle mensual/anual
- Restricciones de funcionalidades según el plan del usuario
- Límite de 3 pacientes para plan Pro
- Pacientes ilimitados para plan Ultra
- Acceso a agenda múltiple solo para Ultra y Admin
- Acceso a backup solo para Ultra y Admin

### 🔐 Permisos por Plan
- **Gratis**: Recibir pacientes derivados, calendario individual
- **Pro**: Hasta 3 pacientes nuevos, ficha clínica, backup básico
- **Ultra**: Pacientes ilimitados, agenda múltiple, backup completo, reminders WhatsApp
- **Admin**: Acceso completo a todas las funciones

### 💰 Página de Precios
- Modal moderno con diseño similar a plataformas premium
- Toggle entre facturación mensual y anual (+44% descuento)
- Precios en USD: Gratis $0, Pro $15/mes, Ultra $25/mes
- Precios anuales: Pro $100, Ultra $150
- Botones de acción que redirigen a registro o WhatsApp

### 🎯 Funcionalidades
- Verificación automática de límites al agregar pacientes
- Mensajes informativos cuando se alcanzan límites
- Redirección automática a página de precios
- Contador dinámico de pacientes por usuario
- Navegación actualizada con enlace "Precios"

### 🔧 Técnico
- Nuevas funciones: `verificarPlanUsuario()`, `contarPacientesUsuario()`, `agregarTagsUsuario()`
- Sistema de verificación de permisos en tiempo real
- Integración con Firebase para campos `isPro` e `isUltra`
- Debug logs para troubleshooting de permisos
- Priorización de tags (Ultra > Pro > Admin > Gratis)

### 🎨 UI/UX
- Tags con colores distintivos: Gris (Gratis), Púrpura (Pro), Amarillo (Ultra), Verde (Admin)
- Diseño responsive para página de precios
- Integración con sistema de temas claro/oscuro
- Botones de acción contextuales según el plan

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