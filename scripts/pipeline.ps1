# 🚀 SENAI Lab - Script de Pipeline Automatizada
# Arquivo: scripts/pipeline.ps1
# Descricao: Automatiza o processo de commit seguindo PIPELINE-COMMIT.md

param(
    [Parameter(Mandatory=$true)]
    [string]$NovaVersao,
    
    [Parameter(Mandatory=$false)]
    [string]$TipoCommit = "feat",
    
    [Parameter(Mandatory=$false)]
    [string]$Escopo = "admin",
    
    [Parameter(Mandatory=$false)]
    [string]$Descricao = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$Producao,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipTests
)

Write-Host "SENAI Lab - Pipeline de Commit v1.0.0" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Verificar se estamos no diretorio correto
if (!(Test-Path "public/admin.html")) {
    Write-Host "Erro: Execute o script na raiz do projeto SENAI Lab" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "ETAPA 1: Atualizando versao em todos os arquivos..." -ForegroundColor Yellow

# Funcao para atualizar versao em arquivo
function Update-Version {
    param($FilePath, $Pattern, $Replacement)
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        $newContent = $content -replace $Pattern, $Replacement
        Set-Content $FilePath $newContent -NoNewline
        Write-Host "Atualizado: $FilePath" -ForegroundColor Green
    } else {
        Write-Host "Arquivo nao encontrado: $FilePath" -ForegroundColor Yellow
    }
}

# Atualizar versoes nos arquivos
$VersaoPattern = "v2\.\d+\.\d+"
$NovaVersaoFormatada = "v$NovaVersao"

Update-Version "public/admin.html" $VersaoPattern $NovaVersaoFormatada
Update-Version "public/index.html" $VersaoPattern $NovaVersaoFormatada
Update-Version "README.md" $VersaoPattern $NovaVersaoFormatada

# Buscar e atualizar em utils.js
$utilsPath = "public/assets/js/admin/utils.js"
if (Test-Path $utilsPath) {
    $content = Get-Content $utilsPath -Raw
    $newContent = $content -replace "Versao: v\d+\.\d+\.\d+", "Versao: $NovaVersaoFormatada"
    Set-Content $utilsPath $newContent -NoNewline
    Write-Host "Atualizado: $utilsPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "ETAPA 2: Verificando alteracoes..." -ForegroundColor Yellow

# Mostrar arquivos alterados
git status --porcelain

Write-Host ""
Write-Host "ETAPA 3: Verificacao manual necessaria" -ForegroundColor Yellow
Write-Host "Verifique se precisa atualizar CHANGELOG.md"
Write-Host "Verifique se precisa criar release"

if (!$SkipTests) {
    Write-Host ""
    Write-Host "ETAPA 4: Iniciando testes..." -ForegroundColor Yellow
    
    # Verificar se Python esta disponivel
    try {
        python --version | Out-Null
        Write-Host "Python encontrado" -ForegroundColor Green
        
        Write-Host "Iniciando servidor local na porta 8080..."
        Start-Process python -ArgumentList "-m", "http.server", "8080" -WorkingDirectory "public" -WindowStyle Hidden
        
        Start-Sleep 3
        Write-Host "Servidor iniciado em http://localhost:8080" -ForegroundColor Green
        Write-Host "Acesse: http://localhost:8080/admin.html para testar"
        
        $continuar = Read-Host "Pressione ENTER apos testar ou 'q' para cancelar"
        if ($continuar -eq 'q') {
            Write-Host "Pipeline cancelada pelo usuario" -ForegroundColor Red
            exit 1
        }
        
        # Matar processo do servidor
        Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*http.server*"} | Stop-Process -Force -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "Python nao encontrado, pulando teste local" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "ETAPA 5: Preparando commit..." -ForegroundColor Yellow

if ($Descricao -eq "") {
    $Descricao = Read-Host "Digite a descricao do commit"
}

$commitMessage = @"
$TipoCommit($Escopo): $Descricao

Versao: $NovaVersaoFormatada
Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm')

Arquivos atualizados:
"@

# Adicionar arquivos modificados a mensagem
$arquivosModificados = git diff --name-only HEAD
if ($arquivosModificados) {
    $commitMessage += "`n- " + ($arquivosModificados -join "`n- ")
}

Write-Host ""
Write-Host "Mensagem do commit:" -ForegroundColor Cyan
Write-Host $commitMessage -ForegroundColor White

$confirmar = Read-Host "`nConfirmar commit? (s/N)"
if ($confirmar -ne 's' -and $confirmar -ne 'S') {
    Write-Host "Commit cancelado" -ForegroundColor Red
    exit 1
}

# Fazer o commit
git add .
git commit -m $commitMessage

Write-Host "Commit realizado com sucesso!" -ForegroundColor Green

# Se for para producao
if ($Producao) {
    Write-Host ""
    Write-Host "ETAPA 6: Deploy para producao..." -ForegroundColor Yellow
    
    Write-Host "Mudando para branch main..."
    git checkout main
    
    Write-Host "Fazendo merge..."
    git merge test-environment-v2
    
    Write-Host "Fazendo push..."
    git push origin main
    
    Write-Host ""
    Write-Host "Deploy Firebase:" -ForegroundColor Cyan
    Write-Host "Execute manualmente: firebase deploy" -ForegroundColor White
    Write-Host "Ou faca upload da pasta public/ para Firebase Hosting" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Pipeline de producao concluida!" -ForegroundColor Green
    Write-Host "Verifique: https://senai-lab-6fe79.web.app" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Pipeline de desenvolvimento concluida!" -ForegroundColor Green
    Write-Host "Use -Producao para fazer deploy" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pipeline finalizada com sucesso!" -ForegroundColor Green
