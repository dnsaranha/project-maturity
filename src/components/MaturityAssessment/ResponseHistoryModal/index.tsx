
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
          
        if (error) {
          console.error('Error fetching responses:', error);
          setResponses([]);
          return;
        }
        
        const transformedData: ResponseData[] = [];
        
        if (data && Array.isArray(data)) {
          data.forEach(item => {
            try {
              // Safe type checking for details object
              const details = item.details;
              let detailsObj = {
                response_type: '',
                response_key: '',
                response_value: ''
              };

              if (details && typeof details === 'object' && !Array.isArray(details)) {
                const obj = details as Record<string, unknown>;
                detailsObj = {
                  response_type: typeof obj.response_type === 'string' ? obj.response_type : '',
                  response_key: typeof obj.response_key === 'string' ? obj.response_key : '',
                  response_value: typeof obj.response_value === 'string' ? obj.response_value : ''
                };
              }
              
              transformedData.push({
                id: item.id || '',
                level_number: item.level_number || null,
                question_id: item.question_id || null,
                details: detailsObj,
                created_at: item.created_at || ''
              });
            } catch (itemError) {
              console.error('Error processing item:', itemError);
            }
          });
        }
        
        setResponses(transformedData);
      } catch (error) {
        console.error('Error fetching responses:', error);
        setResponses([]);
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
