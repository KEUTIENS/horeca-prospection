# Script de lancement complet de HORECA Prospection
# À exécuter APRÈS l'installation de Docker Desktop

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "  HORECA PROSPECTION - LANCEMENT" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Docker
Write-Host "1. Vérification de Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "   ✅ Docker : $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker n'est pas installé ou pas démarré" -ForegroundColor Red
    Write-Host ""
    Write-Host "Actions à faire :" -ForegroundColor Yellow
    Write-Host "1. Installez Docker Desktop : .\INSTALLER_DOCKER.ps1" -ForegroundColor Cyan
    Write-Host "2. OU lancez Docker Desktop depuis le menu Démarrer" -ForegroundColor Cyan
    pause
    exit 1
}

# Aller dans le dossier du projet
Write-Host ""
Write-Host "2. Navigation vers le projet..." -ForegroundColor Yellow
cd C:\Users\FABIEN0.CUISIMAT-FABIEN\cursor\PROSPECT
Write-Host "   ✅ Dossier : $PWD" -ForegroundColor Green

# Arrêter les anciens conteneurs
Write-Host ""
Write-Host "3. Nettoyage des anciens conteneurs..." -ForegroundColor Yellow
docker compose down 2>$null
Write-Host "   ✅ Nettoyé" -ForegroundColor Green

# Lancer tous les services
Write-Host ""
Write-Host "4. Démarrage de tous les services..." -ForegroundColor Yellow
Write-Host "   (PostgreSQL, Redis, Backend, Frontend, Worker)" -ForegroundColor Gray
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erreur lors du démarrage" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifiez que Docker Desktop est bien lancé !" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "   ✅ Services démarrés" -ForegroundColor Green

# Attendre que tout soit prêt
Write-Host ""
Write-Host "5. Attente du démarrage complet (90 secondes)..." -ForegroundColor Yellow
for ($i=90; $i -gt 0; $i--) {
    Write-Progress -Activity "Démarrage en cours" -Status "Encore $i secondes..." -PercentComplete ((90-$i)/90*100)
    Start-Sleep -Seconds 1
}
Write-Progress -Activity "Démarrage en cours" -Completed
Write-Host "   ✅ Démarrage terminé" -ForegroundColor Green

# Vérifier l'état
Write-Host ""
Write-Host "6. Vérification de l'état des services..." -ForegroundColor Yellow
docker compose ps
Write-Host ""

# Initialiser la base de données (si nécessaire)
Write-Host ""
Write-Host "7. Initialisation de la base de données..." -ForegroundColor Yellow
docker compose exec backend npm run migrate 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Migrations exécutées" -ForegroundColor Green
}

docker compose exec backend npm run seed 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Données de test créées" -ForegroundColor Green
}

# Test final
Write-Host ""
Write-Host "8. Test de connexion..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
    Write-Host "   ✅ Backend accessible" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ Backend pas encore prêt (normal au premier lancement)" -ForegroundColor Yellow
}

# Résultat final
Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "  APPLICATION LANCÉE !" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Ouvrez votre navigateur sur :" -ForegroundColor Cyan
Write-Host "   👉 http://localhost:3030" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Connectez-vous avec :" -ForegroundColor Cyan
Write-Host "   Email    : admin@horeca-prospection.com" -ForegroundColor White
Write-Host "   Password : Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "📊 Pour voir les logs :" -ForegroundColor Gray
Write-Host "   docker compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Pour arrêter l'application :" -ForegroundColor Gray
Write-Host "   docker compose down" -ForegroundColor White
Write-Host ""

# Ouvrir le navigateur automatiquement
$openBrowser = Read-Host "Ouvrir le navigateur automatiquement ? (O/N)"
if ($openBrowser -eq "O" -or $openBrowser -eq "o") {
    Start-Process "http://localhost:3030"
}

pause



