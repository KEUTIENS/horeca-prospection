# Script d'installation automatique de Docker Desktop
# Exécuter en tant qu'administrateur

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "  INSTALLATION DOCKER DESKTOP   " -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est déjà installé
Write-Host "1. Vérification de Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "✅ Docker est déjà installé : $dockerVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "Passez à l'étape suivante : Lancer HORECA Prospection" -ForegroundColor Green
    Write-Host "Exécutez : .\LANCER_HORECA.ps1" -ForegroundColor Cyan
    pause
    exit 0
} catch {
    Write-Host "❌ Docker n'est pas installé" -ForegroundColor Red
}

# Télécharger Docker Desktop
Write-Host ""
Write-Host "2. Téléchargement de Docker Desktop..." -ForegroundColor Yellow
$dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
$installerPath = "$env:TEMP\DockerDesktopInstaller.exe"

try {
    Write-Host "   Téléchargement en cours (environ 500 MB)..." -ForegroundColor Gray
    Write-Host "   Cela peut prendre 5-10 minutes selon votre connexion..." -ForegroundColor Gray
    
    # Télécharger avec barre de progression
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $dockerUrl -OutFile $installerPath -UseBasicParsing
    $ProgressPreference = 'Continue'
    
    Write-Host "✅ Téléchargement terminé" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur de téléchargement : $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solution alternative :" -ForegroundColor Yellow
    Write-Host "1. Allez sur : https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host "2. Cliquez sur 'Download for Windows'" -ForegroundColor Cyan
    Write-Host "3. Exécutez le fichier téléchargé" -ForegroundColor Cyan
    pause
    exit 1
}

# Lancer l'installation
Write-Host ""
Write-Host "3. Installation de Docker Desktop..." -ForegroundColor Yellow
Write-Host "   L'installeur va s'ouvrir..." -ForegroundColor Gray
Write-Host "   Suivez les instructions à l'écran" -ForegroundColor Gray
Write-Host ""

Start-Process -FilePath $installerPath -Wait

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "  INSTALLATION TERMINÉE !" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT : Vous devez REDÉMARRER votre PC maintenant !" -ForegroundColor Yellow
Write-Host ""
Write-Host "Après le redémarrage :" -ForegroundColor Cyan
Write-Host "1. Lancez Docker Desktop depuis le menu Démarrer" -ForegroundColor White
Write-Host "2. Attendez que Docker soit prêt (icône baleine)" -ForegroundColor White
Write-Host "3. Exécutez : .\LANCER_HORECA.ps1" -ForegroundColor White
Write-Host ""

$reboot = Read-Host "Voulez-vous redémarrer maintenant ? (O/N)"
if ($reboot -eq "O" -or $reboot -eq "o") {
    Write-Host "Redémarrage dans 10 secondes..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    Restart-Computer -Force
} else {
    Write-Host "N'oubliez pas de redémarrer avant de continuer !" -ForegroundColor Yellow
    pause
}

