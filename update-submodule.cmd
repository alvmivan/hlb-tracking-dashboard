@echo off
REM Enlazar el repositorio
cd src\lib\hlb-api-library
git init
git remote add origin https://github.com/alvmivan/hlb-api-library

REM Limpiar archivos no rastreados (y directorios)
git clean -fd

REM Ejecutar git fetch y luego resetear con hard pull
git fetch origin
git reset --hard origin/main

REM Eliminar rastro de Git
rd /s /q .git

REM Volver al directorio original
cd /d %~dp0
