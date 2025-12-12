# 🎨 Configuração de Logo e Favicon

## 📁 Arquivos Necessários:

### 1. **Logo Principal** (para páginas):
- **Nome**: `logo.svg` ou `logo.png`
- **Tamanho**: 512x512px ou maior
- **Formato**: SVG (recomendado) ou PNG
- **Fundo**: Transparente (se possível)
- **Uso**: Header de todas as páginas, PDFs

### 2. **Favicon** (ícone da aba do navegador):
- **Nome**: `favicon.ico` ou `favicon.png`
- **Tamanho**: 32x32px ou 64x64px
- **Formato**: ICO ou PNG
- **Fundo**: Transparente ou da cor da marca
- **Uso**: Aba do navegador, favoritos

## 🔧 Como Criar Favicon da sua Logo:

### Opção 1: Online (Fácil)
1. Vá para: https://favicon.io/favicon-converter/
2. Faça upload da sua logo
3. Baixe o favicon.ico gerado
4. Salve em: `/public/favicon.ico`

### Opção 2: Photoshop/GIMP
1. Abra sua logo
2. Redimensione para 32x32px (mantendo proporção)
3. Exporte como PNG 32x32
4. Renomeie para `favicon.png`
5. Salve em: `/public/favicon.ico`

## 📂 Estrutura Final:

```
/public/
  ├── logos/
  │   └── logo.svg (ou logo.png)  ← Logo principal
  └── favicon.ico                  ← Favicon (ícone da aba)
```

## ✅ Depois que adicionar:
O sistema irá automaticamente usar sua logo em:
- ✅ Header de todas as páginas
- ✅ Landing page
- ✅ PDFs gerados
- ✅ Aba do navegador (favicon)
