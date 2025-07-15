# Script para desplegar reglas de Firestore
# Ejecutar como: .\deploy-firestore-rules.ps1

Write-Host "🚀 Desplegando reglas de Firestore..." -ForegroundColor Green

# Verificar si Firebase CLI está instalado
try {
    $firebaseVersion = firebase --version
    Write-Host "✅ Firebase CLI encontrado: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI no encontrado. Instalando..." -ForegroundColor Red
    Write-Host "Ejecuta: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Verificar si el usuario está autenticado
try {
    $authStatus = firebase projects:list
    if ($LASTEXITCODE -ne 0) {
        Write-Host "🔐 Iniciando sesión en Firebase..." -ForegroundColor Yellow
        firebase login
    } else {
        Write-Host "✅ Usuario autenticado en Firebase" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error al verificar autenticación" -ForegroundColor Red
    exit 1
}

# Desplegar reglas de Firestore
Write-Host "📤 Desplegando reglas..." -ForegroundColor Yellow
firebase deploy --only firestore:rules

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Reglas desplegadas exitosamente!" -ForegroundColor Green
    Write-Host "🔄 Recarga la aplicación para ver los cambios" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error al desplegar las reglas" -ForegroundColor Red
    Write-Host "💡 Intenta configurar las reglas manualmente desde Firebase Console" -ForegroundColor Yellow
}

Write-Host "📋 Instrucciones completas en DEPLOY_INSTRUCTIONS.md" -ForegroundColor Cyan 