# Instrucciones para Solucionar Error de Permisos de Firestore

## Problema
El error "Missing or insufficient permissions" indica que las reglas de seguridad de Firestore no están configuradas correctamente.

## Solución

### Opción 1: Usar Firebase CLI (Recomendado)

1. **Instalar Firebase CLI** (si no lo tienes):
   ```bash
   npm install -g firebase-tools
   ```

2. **Iniciar sesión en Firebase**:
   ```bash
   firebase login
   ```

3. **Inicializar el proyecto** (si no está inicializado):
   ```bash
   firebase init firestore
   ```

4. **Desplegar las reglas**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Opción 2: Configurar desde Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `monitor-entrenamiento-1fc15`
3. Ve a **Firestore Database** → **Rules**
4. Reemplaza las reglas existentes con el contenido del archivo `firestore.rules`
5. Haz clic en **Publish**

### Reglas de Seguridad Configuradas

Las reglas permiten:
- Usuarios autenticados pueden leer/escribir sus propios datos
- Acceso temporal a todas las colecciones para desarrollo
- Protección básica de datos por propietario

### Verificación

Después de desplegar las reglas:
1. Recarga la aplicación
2. Intenta iniciar sesión
3. El error de permisos debería desaparecer

### Notas Importantes

- Las reglas actuales son permisivas para desarrollo
- Para producción, considera reglas más restrictivas
- Asegúrate de que el usuario esté autenticado antes de acceder a Firestore 