# Script para crear las carpetas necesarias
$basePath = "frontend\src\modules"
$folders = @(
    "health",
    "sports",
    "spiritual",
    "common",
    "layout",
    "auth",
    "parent-dashboard",
    "rewards"
)

foreach ($folder in $folders) {
    $fullPath = Join-Path -Path $basePath -ChildPath $folder
    if (-not (Test-Path -Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Creada carpeta: $fullPath"
    } else {
        Write-Host "La carpeta ya existe: $fullPath"
    }
}

Write-Host "\nTodas las carpetas han sido creadas correctamente."
