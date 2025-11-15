'use client';

import React from 'react';
import InputMask from 'react-input-mask';

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
 * Componente de input com máscara
 *
 * Máscaras prontas:
 * - CPF: "999.999.999-99"
 * - CNPJ: "99.999.999/9999-99"
 * - Telefone: "(99) 99999-9999"
 * - CEP: "99999-999"
 * - Data: "99/99/9999"
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
  return (
    <InputMask
      mask={mask}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      type={type}
      className={className}
      maskChar={null} // Remove o _ das posições não preenchidas
    />
  );
}

// Máscaras pré-definidas para facilitar uso
export const MASKS = {
  CPF: '999.999.999-99',
  CNPJ: '99.999.999/9999-99',
  PHONE: '(99) 99999-9999',
  CEP: '99999-999',
  DATE: '99/99/9999',
};
