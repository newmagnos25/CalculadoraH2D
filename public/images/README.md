# 📁 Pasta de Imagens

## Como usar os logos

Coloque o arquivo `logo.png` (ou qualquer outro formato de imagem) nesta pasta.

### Acessar no código:

```tsx
// Usar o logo em componentes React
<img src="/images/logo.png" alt="Logo" />

// Ou com Next.js Image
import Image from 'next/image';
<Image src="/images/logo.png" alt="Logo" width={200} height={50} />
```

### Onde usar:

- Landing page (página inicial)
- Header/Footer
- PDFs (configurações da empresa)
- Emails
- Documentos gerados

## Estrutura:

```
public/
  └── images/
      ├── logo.png          # Logo principal da empresa
      ├── logo-white.png    # Logo versão branca (opcional)
      └── logo-dark.png     # Logo versão escura (opcional)
```
