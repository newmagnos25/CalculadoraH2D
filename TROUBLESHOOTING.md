# Troubleshooting - CalculadoraH2D

## Erro: "tailwindcss directly as a PostCSS plugin"

### Causa
Versão incompatível do TailwindCSS (4.x) instalada no `node_modules`.

### Solução Rápida

#### Windows (PowerShell ou CMD)
```powershell
# Execute o script de setup
setup.bat

# OU manualmente:
Remove-Item -Recurse -Force node_modules, .next, package-lock.json
npm install
npm run dev
```

#### Linux/Mac
```bash
# Dê permissão e execute
chmod +x setup.sh
./setup.sh

# OU manualmente:
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Verificação

Após reinstalar, verifique se está usando TailwindCSS 3.x:

```bash
npm list tailwindcss
```

Deve mostrar: `tailwindcss@3.4.18` (ou similar 3.x)

---

## Erro: Port 3000 já em uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## Erro: Cannot find module

```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Build Error no Vercel

Certifique-se que o `package.json` tem:
```json
{
  "dependencies": {
    "tailwindcss": "^3.4.18"
  }
}
```

---

## Problemas de Performance

```bash
# Limpar cache do Next.js
rm -rf .next
npm run dev
```

---

## Precisa de Ajuda?

1. Verifique o arquivo `README.md`
2. Revise este guia de troubleshooting
3. Abra uma issue no GitHub
