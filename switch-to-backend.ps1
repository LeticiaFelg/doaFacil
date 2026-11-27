# Script PowerShell para voltar para versão com backend

Write-Host "🔙 Voltando para versão com BACKEND..." -ForegroundColor Cyan
Write-Host ""

# Restaura API original
if (Test-Path "assets\js\api-backend.js.bak") {
    Copy-Item "assets\js\api-backend.js.bak" "assets\js\api.js" -Force
    Write-Host "✅ API restaurada para versão com backend" -ForegroundColor Green
} else {
    Write-Host "❌ Backup api-backend.js.bak não encontrado!" -ForegroundColor Red
    Write-Host "   Execute switch-to-demo.ps1 primeiro para criar o backup." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Pronto! Versão com backend restaurada." -ForegroundColor Green
Write-Host ""
Write-Host "Lembre-se de:" -ForegroundColor Yellow
Write-Host "1. Iniciar o backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Configurar o config.js com a URL correta do backend" -ForegroundColor White
Write-Host ""
