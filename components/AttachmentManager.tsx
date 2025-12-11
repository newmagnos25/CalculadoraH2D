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
 * Permite upload de modelos 3D (STL, GCODE, 3MF), imagens, vídeos e documentos
 * Com preview visual separado por tipo de arquivo
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
    video: ['.mp4', '.mov', '.avi', '.webm', '.mkv'],
    document: ['.pdf', '.txt', '.doc', '.docx'],
  };

  const getAllAcceptedTypes = () => {
    return Object.values(acceptedFileTypes).flat().join(',');
  };

  const getFileType = (fileName: string, mimeType: string): FileAttachment['type'] => {
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    if (acceptedFileTypes.model.includes(ext)) return 'model';
    if (acceptedFileTypes.image.includes(ext)) return 'image';
    if (acceptedFileTypes.video.includes(ext)) return 'video';
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
      case 'video':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
      case 'video': return 'Vídeo';
      case 'document': return 'Documento';
    }
  };

  const getTypeBadgeColor = (type: FileAttachment['type']) => {
    switch (type) {
      case 'model': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300';
      case 'image': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300';
      case 'video': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-300';
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
            Máx. {maxSizeMB}MB • Modelos 3D, Imagens, Vídeos, PDFs
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

      {/* Attachments List - Separado por tipo */}
      {attachments.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Arquivos Anexados ({attachments.length})
          </h4>

          {/* IMAGENS */}
          {attachments.filter(a => a.type === 'image').length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imagens ({attachments.filter(a => a.type === 'image').length})
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {attachments.filter(a => a.type === 'image').map((attachment) => {
                  const dataUrl = `data:${attachment.mimeType};base64,${attachment.data}`;
                  return (
                    <div key={attachment.id} className="group relative bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-900 rounded-lg overflow-hidden hover:border-green-400 dark:hover:border-green-600 transition-all shadow-sm hover:shadow-md">
                      <img
                        src={dataUrl}
                        alt={attachment.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-2 bg-gradient-to-t from-black/70 to-transparent absolute bottom-0 left-0 right-0">
                        <p className="text-xs font-semibold text-white truncate">{attachment.name}</p>
                        <p className="text-xs text-green-200">{formatFileSize(attachment.size)}</p>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => handleDownload(attachment)}
                          className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Baixar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(attachment.id)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Remover"
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

          {/* VÍDEOS */}
          {attachments.filter(a => a.type === 'video').length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-pink-700 dark:text-pink-400 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Vídeos ({attachments.filter(a => a.type === 'video').length})
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {attachments.filter(a => a.type === 'video').map((attachment) => {
                  const dataUrl = `data:${attachment.mimeType};base64,${attachment.data}`;
                  return (
                    <div key={attachment.id} className="group bg-white dark:bg-slate-800 border-2 border-pink-200 dark:border-pink-900 rounded-lg overflow-hidden hover:border-pink-400 dark:hover:border-pink-600 transition-all shadow-sm hover:shadow-md">
                      <video
                        src={dataUrl}
                        controls
                        className="w-full h-48 bg-black"
                      >
                        Seu navegador não suporta vídeos.
                      </video>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{attachment.name}</p>
                          <p className="text-xs text-pink-600 dark:text-pink-400">{formatFileSize(attachment.size)}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDownload(attachment)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Baixar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(attachment.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Remover"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODELOS 3D */}
          {attachments.filter(a => a.type === 'model').length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Modelos 3D ({attachments.filter(a => a.type === 'model').length})
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {attachments.filter(a => a.type === 'model').map((attachment) => {
                  const ext = attachment.name.split('.').pop()?.toUpperCase();
                  return (
                    <div key={attachment.id} className="group bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-900 rounded-lg overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
                      <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center relative overflow-hidden">
                        {/* 3D Grid Background */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute inset-0" style={{
                            backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                          }}></div>
                        </div>
                        {/* 3D Icon */}
                        <div className="relative">
                          <svg className="w-16 h-16 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                            {ext}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{attachment.name}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">{formatFileSize(attachment.size)}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDownload(attachment)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Baixar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(attachment.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Remover"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DOCUMENTOS */}
          {attachments.filter(a => a.type === 'document').length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentos ({attachments.filter(a => a.type === 'document').length})
              </h5>
              <div className="space-y-2">
                {attachments.filter(a => a.type === 'document').map((attachment) => {
                  const ext = attachment.name.split('.').pop()?.toUpperCase();
                  const isPDF = ext === 'PDF';
                  return (
                    <div key={attachment.id} className="group bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-900 rounded-lg p-3 hover:border-purple-400 dark:hover:border-purple-600 transition-all shadow-sm hover:shadow-md flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 rounded-lg flex items-center justify-center">
                        {isPDF ? (
                          <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{attachment.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold">
                            {ext}
                          </span>
                          <span className="text-xs text-purple-600 dark:text-purple-400">{formatFileSize(attachment.size)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDownload(attachment)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Baixar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(attachment.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Remover"
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
            Adicione modelos 3D, imagens, vídeos ou documentos do projeto
          </p>
        </div>
      )}
    </div>
  );
}
