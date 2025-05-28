
import React from 'react';
import { ResponseData } from './types';

interface ResponseItemProps {
  response: ResponseData;
}

const ResponseItem: React.FC<ResponseItemProps> = ({ response }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateStr;
    }
  };

  const formatResponseKey = (key: string, responseType: string) => {
    if (responseType === 'respondent') {
      const keyMappings: Record<string, string> = {
        'hasProjectExperience': 'Experiência em Projetos',
        'isPharmaceutical': 'Setor Farmacêutico',
        'pharmaceuticalType': 'Tipo de Empresa Farmacêutica',
        'companySize': 'Porte da Empresa',
        'state': 'Estado'
      };
      return keyMappings[key] || key;
    }
    
    if (responseType === 'question') {
      const parts = key.split('_');
      if (parts.length >= 2) {
        return `Nível ${parts[0]} - Questão ${parts[1]}`;
      }
    }
    
    return key;
  };

  const formatResponseValue = (value: string) => {
    if (!value) return '';
    
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null) {
        if ('option' in parsed) {
          const optionLabels: Record<string, string> = {
            'a': 'A - Totalmente implementado',
            'b': 'B - Largamente implementado',
            'c': 'C - Parcialmente implementado',
            'd': 'D - Iniciando implementação',
            'e': 'E - Não implementado'
          };
          return optionLabels[parsed.option] || parsed.option;
        }
        return JSON.stringify(parsed);
      }
      return String(parsed);
    } catch (e) {
      return value;
    }
  };

  const responseKey = response.details?.response_key || '';
  const responseType = response.details?.response_type || '';
  const responseValue = response.details?.response_value || '';

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">{formatResponseKey(responseKey, responseType)}</h4>
        <span className="text-sm text-gray-500">{formatDate(response.created_at)}</span>
      </div>
      <p>{formatResponseValue(responseValue)}</p>
    </div>
  );
};

export default ResponseItem;
