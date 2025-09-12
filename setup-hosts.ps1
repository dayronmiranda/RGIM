# Script para configurar store.localhost en el archivo hosts
# Ejecutar como Administrador

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$entry = "127.0.0.1 store.localhost"

# Verificar si ya existe la entrada
$hostsContent = Get-Content $hostsPath
if ($hostsContent -contains $entry) {
    Write-Host "La entrada store.localhost ya existe en el archivo hosts." -ForegroundColor Green
} else {
    # Agregar la entrada
    Add-Content -Path $hostsPath -Value $entry
    Write-Host "Entrada store.localhost agregada exitosamente al archivo hosts." -ForegroundColor Green
}

Write-Host "Configuracion completada. Ahora puedes acceder a:" -ForegroundColor Cyan
Write-Host "- http://localhost:3000 (pagina home)" -ForegroundColor White
Write-Host "- http://store.localhost:3000 (pagina tienda)" -ForegroundColor White