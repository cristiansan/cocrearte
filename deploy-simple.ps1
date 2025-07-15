Write-Host "Desplegando reglas de Firestore..." -ForegroundColor Green

# Verificar Firebase CLI
try {
    firebase --version
    Write-Host "Firebase CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI no encontrado. Instala con: npm install -g firebase-tools" -ForegroundColor Red
    exit 1
}

# Desplegar reglas
Write-Host "Desplegando reglas..." -ForegroundColor Yellow
firebase deploy --only firestore:rules

if ($LASTEXITCODE -eq 0) {
    Write-Host "Reglas desplegadas exitosamente!" -ForegroundColor Green
} else {
    Write-Host "Error al desplegar las reglas" -ForegroundColor Red
    Write-Host "Configura las reglas manualmente desde Firebase Console" -ForegroundColor Yellow
} 