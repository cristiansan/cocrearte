# Changelog

## [0.4.8] - 2025-08-10

### Added
- Resumen de impagos en `pagos.html`
  - Sección “Resumen de Pacientes con Deuda” debajo del selector de paciente
  - Tabla con columnas: Paciente, Total Adeudado, Sesiones Impagas y Sesiones Totales
  - Cálculo automático de totales por paciente (recorre todas las sesiones y suma deudas)
  - Ordenado por mayor deuda
  - Botón “Descargar CSV” que exporta el resumen a `resumen_impagos_YYYY-MM-DD.csv`

### Changed
- Marcado en rojo de pacientes que abandonan tratamiento
  - Se pinta en rojo la tarjeta y el nombre cuando la última sesión tiene presentismo `desiste`
  - Prioridad del rojo por `desiste` sobre el estado “derivado”
  - Indicador mostrado como texto plano “(desiste)” (se eliminó el `span` para evitar render de `</span>` literal)

### Fixed
- Detección de última sesión más robusta: fallback por campo `creado` si la consulta por `fecha` no aplica
- Eliminado comportamiento especial que forzaba en rojo nombres que contienen “Sabado/Sábado”
- Corrección de referencia a variable no definida en render de pacientes (`pacientesHtml`)
- Eliminación del logo roto en header de `pagos.html`

## [0.4.7] - 2024-12-19

### Added
- Gestión de pagos completa
  - Campos en ficha clínica: Pago, Monto Pagado, Costo Sesión
  - Persistencia de `pago`, `monto` y `costo` en Firestore por sesión
  - Nueva página `pagos.html` con selector de paciente, tabla de sesiones y totales
  - Cálculo por sesión: Costo, Pagado, Impagas; y totales: Total Pagado y Total Adeudado
  - Edición rápida de cada sesión desde `pagos.html` (pago, costo, monto pagado)
  - Autorrelleno del último “Costo Sesión” al crear nuevas sesiones
  - Formato con puntos de miles en inputs y vistas

### Changed
- Botón y función de “Establecer Datos de Prueba” removidos de `pagos.html`
- Corrección del logo roto en header de `pagos.html` (uso de `public/favicon.ico`)

### Fixed
- Carga de sesiones desde subcolecciones `pacientes/{id}/sesiones` en `pagos.html`
- Migración que completa campos faltantes `pago`, `monto`, `costo` en sesiones antiguas

## [0.4.6] - 2024-12-19

### Added
- **Sistema de motivos de consulta dinámicos por profesional**
  - Nueva ficha "Motivos de Consulta" separada en formularios de agregar y editar pacientes
  - Botones de selección de profesional: Nutrición, Psicología adultos, Psicología infantil, Psicopedagogía, Fonoaudiología
  - Listas dinámicas de motivos de consulta según el profesional seleccionado
  - Lista específica para Fonoaudiología con 13 motivos especializados (TDL severo/moderado/leve, Mutismo, TSH, Tartamudez, etc.)
  - Persistencia del profesional seleccionado en Firestore
  - Carga correcta del profesional al editar pacientes existentes

### Changed
- **Restructuración de formularios de pacientes**
  - "Motivos de Consulta" movido a ficha independiente como primera pestaña
  - Ficha "Información" desplazada a segunda posición
  - Eliminación de campos "Estado de Salud" (padre y madre) de la sección Familiar
  - Eliminación de sección "Información de Hermanos" en formulario de editar paciente
  - Mejora en la organización y flujo de trabajo de los formularios

### Fixed
- **Corrección de errores de datos en Firestore**
  - Eliminación de referencias a campos removidos en JavaScript
  - Corrección de inconsistencia entre HTML y JavaScript en formulario de agregar paciente
  - Resolución de error 400 Bad Request al guardar datos de pacientes
  - Sincronización completa entre estructura de datos y formularios

### Technical
- **Optimizaciones en main.js**
  - Nuevo objeto `MOTIVOS_CONSULTA_POR_PROFESIONAL` con listas específicas por especialidad
  - Función `obtenerMotivosPorProfesional()` para carga dinámica de opciones
  - Función `cambiarProfesional()` para actualización en tiempo real
  - Función `crearBotonesProfesionales()` para generación dinámica de interfaz
  - Integración completa con sistema de carga y guardado de datos

## [0.4.5] - 2024-12-19

### Fixed
- **Corrección de límite de pacientes para plan Pro**
  - Corregido error en la lógica de verificación de límites durante la creación de pacientes
  - El plan Pro ahora permite correctamente hasta 10 pacientes (antes limitaba incorrectamente a 3)
  - La verificación se realizaba en `main.js` línea 1387 dentro de `addPatientForm.addEventListener('submit')`
  - Cambio: `cantidadPacientes >= 3` → `cantidadPacientes >= 10` para usuarios con plan Pro

## [0.4.4] - 2024-12-19

### Added
- **Sistemas de planes pagos actualizados**
  - Plan Gratis: Hasta 3 pacientes, calendario individual, funcionalidades básicas mejoradas
  - Plan Pro: Hasta 10 pacientes, múltiples calendarios, backup mensual, funcionalidades completas
  - Plan Ultra: Pacientes ilimitados, múltiples calendarios, backup diario, exportar backup, recordatorios por WhatsApp
  - Nuevas funcionalidades para todos los planes: dictado de audios (speech to text), ficha clínica personalizada, carga de fotos/imágenes
  - Textos optimizados y más claros para todas las características

### Changed
- **Modal de precios mejorado**
  - Estructura más detallada y profesional
  - Características específicas por plan claramente definidas
  - Mejor presentación visual de las funcionalidades

## [0.4.3] - 2024-12-19

### Added
- **Mejoras en el sistema de gestión de pacientes**
  - Optimizaciones en la interfaz de usuario
  - Mejoras en la experiencia de usuario

### Changed
- **Actualizaciones menores en la interfaz**
  - Correcciones de estilo y presentación

## [0.4.2] - 2024-12-19

### Added
- **Nueva página de perfil de usuario** (`perfil.html`)
  - Formulario completo de perfil profesional con campos: Nombre y Apellido, Email, Teléfono, Dirección, Especialidad, LinkedIn
  - Vista de solo lectura y modo de edición
  - Tema oscuro consistente con el resto de la aplicación
  - Botón de cámara para cambiar foto de perfil con modal de selección (Tomar Foto / Subir Imagen)
  - Integración completa con Firebase Storage para fotos de perfil
  - Sincronización de fotos entre dashboard y página de perfil
  - Botón de navegación de regreso al dashboard
  - Validación de archivos de imagen (máximo 2MB)
  - Persistencia de datos en Firestore
  - Manejo de errores robusto para elementos del DOM

### Changed
- **Dashboard mejorado**
  - Agregado botón "Mi Perfil" a la izquierda del botón "Pacientes"
  - El botón redirige a la nueva página `perfil.html`
  - Sincronización de fotos de perfil entre dashboard y página de perfil
  - Sistema unificado de almacenamiento de fotos usando Firebase Storage

### Fixed
- **Correcciones en sistema de fotos**
  - Sincronización completa entre dashboard y página de perfil
  - Manejo correcto de errores al subir fotos
  - Validación de tamaño de archivos
  - Restauración de iniciales si falla la subida

### Technical
- **Firebase Storage**
  - Agregado SDK de Firebase Storage a `firebase-config.js`
  - Configuración completa para almacenamiento de fotos de perfil
  - Sistema unificado de URLs en Firestore

## [0.4.1] - 2024-12-18

### Added
- **Sistema de precios implementado**
  - Modal de precios con 3 planes: Gratis, Pro ($15 USD), Ultra ($25 USD)
  - Planes anuales: Pro ($100 USD), Ultra ($150 USD) con descuentos
  - Integración con WhatsApp para solicitudes de pago
  - Enlace "Precios" en navegación principal
  - Redirección a página de precios desde botones "Agregar Paciente" para usuarios sin permisos

- **Control de acceso basado en planes**
  - Usuarios "Gratis": Solo calendario personal, límite de pacientes
  - Usuarios "Pro": Hasta 10 pacientes (excepción para Evelyn y Triana), calendario común
  - Usuarios "Ultra": Pacientes ilimitados, calendario compartido, backups con descarga
  - Usuarios "Admin": Acceso completo a todas las funciones
  - Tags visuales: "Pro", "Ultra", "Admin", "Gratis", "Derivar"

- **Nuevas opciones de motivo de consulta**
  - "Mutismo Selectivo"
  - "No controla esfínteres"

### Changed
- **Mejoras en experiencia de usuario**
  - Mensaje de bienvenida personalizado usando primer nombre del `displayName`
  - Tags en camel case: "Pro", "Ultra", "Admin", "Gratis", "Derivar", "Test"
  - Redirección a página de precios en lugar de mensajes de error
  - Vista por defecto "Pacientes" al iniciar sesión

### Fixed
- **Correcciones de visibilidad**
  - Calendario y lista de usuarios no se superponen
  - Manejo de errores de permisos de Firebase
  - Corrección de lógica de verificación de planes de usuario

## [0.4.0] - 2024-12-17

### Added
- **Sistema de roles y permisos**
  - Campo `isDerivar` para usuarios derivadores
  - Tags "D" para usuarios derivadores
  - Restricciones de acceso para usuarios derivadores
  - Campos `isPro` e `isUltra` para planes de pago
  - Control de acceso basado en planes de usuario

- **Funcionalidades de agenda**
  - Agenda individual y múltiple
  - Filtros por profesionales
  - Manejo de permisos para diferentes tipos de usuario

### Changed
- **Mejoras en la interfaz**
  - Tags visuales para diferentes tipos de usuario
  - Mensajes de permisos personalizados
  - Navegación mejorada entre vistas

### Fixed
- **Correcciones de bugs**
  - Problemas de visibilidad en agenda múltiple
  - Errores de permisos de Firebase
  - Manejo de estados de usuario

## [0.3.7] - 2024-12-16

### Added
- **Sistema de recordatorios por WhatsApp**
  - Configuración de mensajes personalizados
  - Envío automático de recordatorios
  - Integración con API de WhatsApp

### Changed
- **Mejoras en la gestión de sesiones**
  - Interfaz mejorada para crear sesiones
  - Validaciones adicionales
  - Mejor manejo de errores

## [0.3.6] - 2024-12-15

### Added
- **Sistema de backup y restauración**
  - Exportación de datos de pacientes
  - Importación de datos
  - Respaldo de sesiones

### Changed
- **Optimizaciones de rendimiento**
  - Carga más rápida de datos
  - Mejor manejo de memoria

## [0.3.5] - 2024-12-14

### Added
- **Nomenclador CIE-10**
  - Búsqueda de códigos de diagnóstico
  - Integración en formularios de pacientes
  - Autocompletado inteligente

### Changed
- **Mejoras en formularios**
  - Validaciones mejoradas
  - Interfaz más intuitiva

## [0.3.4] - 2024-12-13

### Added
- **Sistema de historial médico familiar**
  - Datos de padres
  - Información de hermanos
  - Historial de salud familiar

### Changed
- **Expansión de fichas de pacientes**
  - Más campos de información
  - Mejor organización de datos

## [0.3.3] - 2024-12-12

### Added
- **Sistema de motivos de consulta múltiples**
  - Checkboxes para seleccionar múltiples motivos
  - Categorización de motivos
  - Filtros por motivos

### Changed
- **Mejoras en la gestión de pacientes**
  - Interfaz más intuitiva
  - Mejor organización de información

## [0.3.2] - 2024-12-11

### Added
- **Sistema de presentismo**
  - Registro de asistencia
  - Estadísticas de presentismo
  - Reportes de asistencia

### Changed
- **Mejoras en el calendario**
  - Vista mejorada de sesiones
  - Mejor manejo de eventos

## [0.3.1] - 2024-12-10

### Added
- **Sistema de sesiones mejorado**
  - Notas de sesión con editor rico
  - Historial de sesiones
  - Búsqueda y filtros

### Changed
- **Interfaz de usuario mejorada**
  - Diseño más moderno
  - Mejor experiencia de usuario

## [0.3.0] - 2024-12-09

### Added
- **Sistema de autenticación completo**
  - Registro de usuarios
  - Inicio de sesión
  - Recuperación de contraseña
  - Roles de administrador

### Changed
- **Arquitectura de la aplicación**
  - Separación de responsabilidades
  - Mejor organización del código

## [0.2.0] - 2024-12-08

### Added
- **Sistema de pacientes**
  - CRUD completo de pacientes
  - Fichas médicas
  - Historial de consultas

### Changed
- **Base de datos**
  - Migración a Firebase Firestore
  - Estructura de datos optimizada

## [0.1.0] - 2024-12-07

### Added
- **Versión inicial**
  - Interfaz básica
  - Sistema de calendario
  - Gestión de citas 