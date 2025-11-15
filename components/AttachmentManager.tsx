'use client';

import { useState } from 'react';
import { FileAttachment } from '@/lib/types';

interface AttachmentManagerProps {
  attachments: FileAttachment[];
  onChange: (attachments: FileAttachment[]) => void;
  maxSizeMB?: number;
}

/**
 * Componente para gerenciar anexos de arquivos
 *
 * Permite upload de modelos 3D (STL, GCODE, 3MF), imagens e documentos
 */
export default function AttachmentManager({
  attachments,
  onChange,
  maxSizeMB = 10,
}: AttachmentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedFileTypes = {
    model: ['.stl', '.gcode', '.3mf', '.obj'],
    image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    document: ['.pdf', '.txt', '.doc', '.docx'],
  };

  const getAllAcceptedTypes = () => {
    return Object.values(acceptedFileTypes).flat().join(',');
  };

  const getFileType = (fileName: string, mimeType: string): FileAttachment['type'] => {
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    if (acceptedFileTypes.model.includes(ext)) return 'model';
    if (acceptedFileTypes.image.includes(ext)) return 'image';
    return 'document';
  };

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

        // Validar tamanho
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          setError(`Arquivo "${file.name}" excede o tamanho máximo de ${maxSizeMB}MB`);
          continue;
        }

        // Converter para base64
        const base64 = await fileToBase64(file);

        const attachment: FileAttachment = {
          id: `${Date.now()}_${i}`,
          name: file.name,
          type: getFileType(file.name, file.type),
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          data: base64,
          uploadedAt: new Date().toISOString(),
        };

        newAttachments.push(attachment);
      }

      onChange([...attachments, ...newAttachments]);
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      setError('Erro ao processar arquivo(s). Tente novamente.');
    } finally {
      setIsUploading(false);
      // Limpar input para permitir re-upload do mesmo arquivo
      event.target.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remover o prefixo "data:...;base64," se existir
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = (attachment: FileAttachment) => {
    try {
      // Reconstruir o data URL
      const dataUrl = `data:${attachment.mimeType};base64,${attachment.data}`;

      // Criar link temporário e clicar
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

  const getFileIcon = (type: FileAttachment['type']) => {
    switch (type) {
      case 'model':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getTypeLabel = (type: FileAttachment['type']) => {
    switch (type) {
      case 'model': return 'Modelo 3D';
      case 'image': return 'Imagem';
      case 'document': return 'Documento';
    }
  };

  const getTypeBadgeColor = (type: FileAttachment['type']) => {
    switch (type) {
      case 'model': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300';
      case 'image': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300';
      case 'document': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Anexar Arquivos
        </label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isUploading ? 'Enviando...' : 'Adicionar Arquivos'}
            <input
              type="file"
              multiple
              accept={getAllAcceptedTypes()}
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Máx. {maxSizeMB}MB • STL, GCODE, 3MF, Imagens, PDFs
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

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Arquivos Anexados ({attachments.length})
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${getTypeBadgeColor(attachment.type)}`}>
                  {getFileIcon(attachment.type)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {attachment.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeBadgeColor(attachment.type)}`}>
                      {getTypeLabel(attachment.type)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatFileSize(attachment.size)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(attachment)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Baixar arquivo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(attachment.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Remover arquivo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {attachments.length === 0 && (
        <div className="text-center py-8 px-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
          <svg className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nenhum arquivo anexado
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            Adicione modelos 3D, fotos ou documentos do projeto
          </p>
        </div>
      )}
    </div>
  );
}
