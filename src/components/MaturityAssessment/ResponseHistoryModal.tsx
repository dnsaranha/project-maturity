
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResponseHistoryModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
}

interface ResponseData {
  id: string;
  level_number: number | null;
  question_id: number | null;
  details: {
    response_type: string;
    response_key: string;
    response_value: string;
  };
  created_at: string;
}

const ResponseHistoryModal = ({ open, onClose, sessionId }: ResponseHistoryModalProps) => {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !sessionId) return;
    
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('assessment_responses')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setResponses(data || []);
      } catch (error) {
        console.error('Error fetching responses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResponses();
  }, [open, sessionId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Respostas</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando histórico...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="text-center py-8">
            <p>Nenhuma resposta encontrada para esta sessão.</p>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="respondent">Classificação</TabsTrigger>
              <TabsTrigger value="level2">Nível 2</TabsTrigger>
              <TabsTrigger value="level3">Nível 3</TabsTrigger>
              <TabsTrigger value="level4">Nível 4</TabsTrigger>
              <TabsTrigger value="level5">Nível 5</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {responses.map((response) => (
                <ResponseItem key={response.id} response={response} />
              ))}
            </TabsContent>
            
            <TabsContent value="respondent" className="space-y-4">
              {responses
                .filter((r) => r.details?.response_type === 'respondent')
                .map((response) => (
                  <ResponseItem key={response.id} response={response} />
                ))}
            </TabsContent>
            
            {[2, 3, 4, 5].map((level) => (
              <TabsContent key={level} value={`level${level}`} className="space-y-4">
                {responses
                  .filter((r) => r.level_number === level)
                  .map((response) => (
                    <ResponseItem key={response.id} response={response} />
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ResponseItem = ({ response }: { response: ResponseData }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatResponseKey = (key: string) => {
    if (response.details.response_type === 'respondent') {
      return {
        'hasProjectExperience': 'Experiência em Projetos',
        'isPharmaceutical': 'Setor Farmacêutico',
        'pharmaceuticalType': 'Tipo de Empresa Farmacêutica',
        'companySize': 'Porte da Empresa',
        'state': 'Estado'
      }[key] || key;
    }
    
    if (response.details.response_type === 'question') {
      const [level, questionId] = key.split('_');
      return `Nível ${level} - Questão ${questionId}`;
    }
    
    return key;
  };

  const formatResponseValue = (value: string) => {
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

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">{formatResponseKey(response.details?.response_key || '')}</h4>
        <span className="text-sm text-gray-500">{formatDate(response.created_at)}</span>
      </div>
      <p>{formatResponseValue(response.details?.response_value || '')}</p>
    </div>
  );
};

export default ResponseHistoryModal;
