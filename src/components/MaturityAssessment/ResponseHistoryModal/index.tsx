
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import ResponseTabs from './ResponseTabs';
import { ResponseHistoryModalProps } from './types';

interface SimpleResponseData {
  id: string;
  level_number: number | null;
  question_id: number | null;
  details: any;
  created_at: string;
}

const ResponseHistoryModal: React.FC<ResponseHistoryModalProps> = ({ open, onClose, sessionId }) => {
  const [responses, setResponses] = useState<SimpleResponseData[]>([]);
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
        
        setResponses(data || []);
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
