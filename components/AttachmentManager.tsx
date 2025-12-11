'use client';

import { useState } from 'react';
import { FileAttachment } from '@/lib/types';

interface AttachmentManagerProps {
  attachments: FileAttachment[];
  onChange: (attachments: FileAttachment[]) => void;
  maxSizeMB?: number;
}

/**
 * Componente para gerenciar anexos de FOTOS do projeto
 *
 * Permite upload apenas de imagens com preview visual completo
 */
export default function AttachmentManager({
  attachments,
  onChange,
  maxSizeMB = 10,
}: AttachmentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedImageTypes = '.jpg,.jpeg,.png,.webp,.gif';

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const newAttachments: FileAttachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validar que é imagem
        if (!file.type.startsWith('image/')) {
          setError(`"${file.name}" não é uma imagem válida. Apenas JPG, PNG, WEBP e GIF são aceitos.`);
          continue;
        }

        // Validar tamanho
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          setError(`"${file.name}" excede o tamanho máximo de ${maxSizeMB}MB`);
          continue;
        }

        // Converter para base64
        const base64 = await fileToBase64(file);

        const attachment: FileAttachment = {
          id: `${Date.now()}_${i}`,
          name: file.name,
          type: 'image',
          mimeType: file.type,
          size: file.size,
          data: base64,
          uploadedAt: new Date().toISOString(),
        };

        newAttachments.push(attachment);
      }

      onChange([...attachments, ...newAttachments]);
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      setError('Erro ao processar imagem(ns). Tente novamente.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = (attachment: FileAttachment) => {
    try {
      const dataUrl = `data:${attachment.mimeType};base64,${attachment.data}`;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao baixar arquivo:', err);
      setError('Erro ao baixar arquivo. Tente novamente.');
    }
  };

  const handleDelete = (id: string) => {
    onChange(attachments.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          📸 Fotos do Projeto
        </label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isUploading ? 'Enviando...' : 'Adicionar Fotos'}
            <input
              type="file"
              multiple
              accept={acceptedImageTypes}
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Máx. {maxSizeMB}MB por foto • JPG, PNG, WEBP, GIF
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Photos Grid */}
      {attachments.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Fotos Anexadas ({attachments.length})
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {attachments.map((attachment) => {
              const dataUrl = `data:${attachment.mimeType};base64,${attachment.data}`;
              return (
                <div
                  key={attachment.id}
                  className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all shadow-md hover:shadow-xl"
                >
                  {/* Imagem */}
                  <div className="aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={dataUrl}
                      alt={attachment.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
                    <p className="text-xs font-semibold text-white truncate">{attachment.name}</p>
                    <p className="text-xs text-orange-200 mt-1">{formatFileSize(attachment.size)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-all"
                      title="Baixar foto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(attachment.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all"
                      title="Remover foto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {attachments.length === 0 && (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <svg className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Nenhuma foto anexada
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Adicione fotos do projeto para incluir nos orçamentos e contratos
          </p>
        </div>
      )}
    </div>
  );
}
