@echo off
echo ========================================
echo   CalculadoraH2D - Setup Completo
echo ========================================
echo.

echo [1/4] Limpando instalacoes antigas...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
if exist package-lock.json del /f package-lock.json

echo.
echo [2/4] Instalando dependencias...
call npm install

echo.
echo [3/4] Verificando instalacao...
call npm list tailwindcss

echo.
echo [4/4] Setup completo!
echo.
echo ========================================
echo   Pronto! Agora execute: npm run dev
echo ========================================
pause
