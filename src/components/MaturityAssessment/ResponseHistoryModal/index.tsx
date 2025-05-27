
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import ResponseTabs from './ResponseTabs';
import { ResponseHistoryModalProps, ResponseData } from './types';

const ResponseHistoryModal: React.FC<ResponseHistoryModalProps> = ({ open, onClose, sessionId }) => {
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
        
        // Transform the data safely
        const transformedData: ResponseData[] = [];
        
        if (data) {
          for (const item of data) {
            const details = item.details as Record<string, any> || {};
            
            transformedData.push({
              id: item.id,
              level_number: item.level_number,
              question_id: item.question_id,
              details: {
                response_type: String(details.response_type || ''),
                response_key: String(details.response_key || ''),
                response_value: String(details.response_value || '')
              },
              created_at: item.created_at
            });
          }
        }
        
        setResponses(transformedData);
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
          <ResponseTabs responses={responses} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResponseHistoryModal;
