'use client';

import { useEffect } from 'react';

/**
 * Hook de proteção anti-pirataria
 * Desabilita funcionalidades que permitem uso offline
 */
export function useAntiPiracy() {
  useEffect(() => {
    // Desabilitar Ctrl+S / Cmd+S (salvar página)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S ou Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert('⚠️ Salvar página está desabilitado. Use nossa plataforma online!');
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I (DevTools) - apenas warning
      if ((e.ctrlKey && e.shiftKey && e.key === 'I') || (e.metaKey && e.altKey && e.key === 'i')) {
        console.warn('⚠️ DevTools detectado. Este conteúdo é protegido.');
      }

      // F12 (DevTools) - apenas warning
      if (e.key === 'F12') {
        console.warn('⚠️ DevTools detectado. Este conteúdo é protegido.');
      }
    };

    // Desabilitar menu de contexto (botão direito)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Detectar se está rodando offline
    const checkOnline = () => {
      if (!navigator.onLine) {
        alert('⚠️ Você está offline. Esta plataforma requer conexão com a internet.');
        window.location.href = '/auth/login';
      }
    };

    // Verificar periodicamente se está online
    const onlineCheck = setInterval(checkOnline, 30000); // a cada 30s

    // Adicionar event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('offline', checkOnline);

    // Adicionar marca d'água no console
    console.log(
      '%c⚠️ AVISO DE SEGURANÇA',
      'color: red; font-size: 24px; font-weight: bold;'
    );
    console.log(
      '%cEsta plataforma é protegida por direitos autorais.',
      'color: orange; font-size: 16px;'
    );
    console.log(
      '%cUso não autorizado ou tentativa de pirataria é ilegal.',
      'color: orange; font-size: 16px;'
    );
    console.log(
      '%c© 2025 Precifica3D - BKreativeLab',
      'color: gray; font-size: 12px;'
    );

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('offline', checkOnline);
      clearInterval(onlineCheck);
    };
  }, []);

  // Verificar se está em iframe (tentando embutir)
  useEffect(() => {
    if (window.self !== window.top) {
      alert('⚠️ Esta plataforma não pode ser exibida em frames/iframes.');
      window.top!.location = window.self.location;
    }
  }, []);

  // Adicionar meta tags para prevenir indexação de conteúdo salvo
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noarchive, nocache';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}
