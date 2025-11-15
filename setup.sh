#!/bin/bash
echo "========================================"
echo "   CalculadoraH2D - Setup Completo"
echo "========================================"
echo ""

echo "[1/4] Limpando instalações antigas..."
rm -rf node_modules
rm -rf .next
rm -f package-lock.json

echo ""
echo "[2/4] Instalando dependências..."
npm install

echo ""
echo "[3/4] Verificando instalação..."
npm list tailwindcss

echo ""
echo "[4/4] Setup completo!"
echo ""
echo "========================================"
echo "   Pronto! Agora execute: npm run dev"
echo "========================================"
