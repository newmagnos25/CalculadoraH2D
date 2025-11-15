'use client';

import React from 'react';

interface MaskedInputProps {
  mask: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  type?: string;
}

/**
 * Componente de input com máscara SIMPLES (sem biblioteca externa)
 * Funciona com React 18+
 */
export default function MaskedInput({
  mask,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  type = 'text',
}: MaskedInputProps) {
  const applyMask = (inputValue: string) => {
    // Remove tudo que não é número
    const numbers = inputValue.replace(/\D/g, '');

    // Aplica a máscara baseado no padrão
    let masked = '';
    let numIndex = 0;

    for (let i = 0; i < mask.length && numIndex < numbers.length; i++) {
      if (mask[i] === '9') {
        masked += numbers[numIndex];
        numIndex++;
      } else {
        masked += mask[i];
      }
    }

    return masked;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyMask(e.target.value);

    // Cria um novo evento com o valor mascarado
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: maskedValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(newEvent);
  };

  return (
    <input
      type={type}
      value={value || ''}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
}

// Máscaras pré-definidas
export const MASKS = {
  CPF: '999.999.999-99',
  CNPJ: '99.999.999/9999-99',
  PHONE: '(99) 99999-9999',
  CEP: '99999-999',
  DATE: '99/99/9999',
};
