
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResponseHistoryModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
}

interface ResponseData {
  response_type: string;
  response_key: string;
  response_value: string;
  created_at: string;
}

const ResponseHistoryModal: React.FC<ResponseHistoryModalProps> = ({ open, onClose, sessionId }) => {
  const isDesktop = !useIsMobile();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  
  // Fetch responses when modal opens
  useEffect(() => {
    if (open && sessionId) {
      fetchResponses();
    }
  }, [open, sessionId]);
  
  const fetchResponses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_responses')
        .select('response_type, response_key, response_value, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setResponses(data || []);
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatResponseValue = (type: string, value: string) => {
    try {
      const parsed = JSON.parse(value);
      
      if (type === 'respondent') {
        if (typeof parsed === 'boolean') {
          return parsed ? 'Sim' : 'Não';
        }
        return parsed;
      }
      
      if (type === 'question' && parsed.option) {
        const optionMap: Record<string, string> = {
          'a': 'a) Cenário de excelência',
          'b': 'b) Levemente inferior ao item A',
          'c': 'c) Significativamente inferior ao item A',
          'd': 'd) Esforços iniciados neste sentido',
          'e': 'e) Nenhum esforço iniciado'
        };
        
        return optionMap[parsed.option] || parsed.option;
      }
      
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return value;
    }
  };
  
  const formatResponseKey = (type: string, key: string) => {
    if (type === 'respondent') {
      const keyMap: Record<string, string> = {
        'hasProjectExperience': 'Experiência em projetos',
        'isPharmaceutical': 'É indústria farmacêutica',
        'pharmaceuticalType': 'Tipo de indústria farmacêutica',
        'companySize': 'Porte da empresa',
        'state': 'Estado',
      };
      
      return keyMap[key] || key;
    }
    
    if (type === 'question') {
      const [level, questionId] = key.split('_');
      return `Nível ${level} - Questão ${questionId}`;
    }
    
    if (type === 'detail') {
      const [level, questionId, detailId] = key.split('_');
      return `Nível ${level} - Questão ${questionId} - Detalhe ${detailId}`;
    }
    
    return key;
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Group responses by type
  const groupedResponses = responses.reduce((acc, response) => {
    const key = response.response_type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(response);
    return acc;
  }, {} as Record<string, ResponseData[]>);
  
  const renderContent = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-4">
        Este é o histórico de todas as suas respostas nesta sessão de avaliação.
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <ScrollArea className="h-[60vh]">
          <Accordion type="single" collapsible className="w-full">
            {Object.keys(groupedResponses).map((type) => (
              <AccordionItem key={type} value={type}>
                <AccordionTrigger className="font-medium">
                  {type === 'respondent' ? 'Dados do Respondente' : 
                   type === 'question' ? 'Respostas às Questões' : 
                   type === 'detail' ? 'Detalhes Adicionais' : type}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {groupedResponses[type].map((response, idx) => (
                      <div key={idx} className="border p-3 rounded-md bg-gray-50">
                        <div className="font-medium">
                          {formatResponseKey(response.response_type, response.response_key)}
                        </div>
                        <div>
                          <span className="text-gray-600">Resposta: </span>
                          {formatResponseValue(response.response_type, response.response_value)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(response.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      )}
      
      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Histórico de Respostas</DialogTitle>
            <DialogDescription>
              Revisão das respostas fornecidas durante a avaliação
            </DialogDescription>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Histórico de Respostas</DrawerTitle>
          <DrawerDescription>
            Revisão das respostas fornecidas durante a avaliação
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          {renderContent()}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ResponseHistoryModal;
