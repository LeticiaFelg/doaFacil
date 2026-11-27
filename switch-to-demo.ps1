# Script PowerShell para trocar para versão demo (GitHub Pages)

Write-Host "🎭 Configurando versão DEMO para GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

# Backup da API original
if (Test-Path "assets\js\api.js") {
    if (-not (Test-Path "assets\js\api-backend.js.bak")) {
        Copy-Item "assets\js\api.js" "assets\js\api-backend.js.bak"
        Write-Host "✅ Backup criado: api-backend.js.bak" -ForegroundColor Green
    }
}

# Troca para versão mock
if (Test-Path "assets\js\api-mock.js") {
    Copy-Item "assets\js\api-mock.js" "assets\js\api.js" -Force
    Write-Host "✅ API trocada para versão MOCK (client-side)" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo api-mock.js não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Pronto! Versão demo configurada." -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Teste localmente: abra index.html no navegador" -ForegroundColor White
Write-Host "2. Faça commit: git add . && git commit -m 'Versão demo'" -ForegroundColor White
Write-Host "3. Push: git push" -ForegroundColor White
Write-Host "4. Configure GitHub Pages nas configurações do repo" -ForegroundColor White
Write-Host ""
Write-Host "Para voltar ao backend: execute .\switch-to-backend.ps1" -ForegroundColor Cyan
