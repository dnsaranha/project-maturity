
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface ResponseHistoryModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
}

interface ResponseData {
  id: string;
  level_number?: number;
  question_id?: number;
  details: {
    response_type?: string;
    response_key?: string;
    response_value?: string;
    [key: string]: any;
  };
  created_at: string;
}

const ResponseHistoryModal: React.FC<ResponseHistoryModalProps> = ({ open, onClose, sessionId }) => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [activeTab, setActiveTab] = useState('respondent');

  useEffect(() => {
    if (open && sessionId) {
      fetchResponses();
    }
  }, [open, sessionId]);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      // Use the updated schema
      const { data, error } = await supabase
        .from('assessment_responses')
        .select('id, level_number, question_id, details, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setResponses(data as ResponseData[]);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResponseType = (response: ResponseData) => {
    // If we have the new schema with details.response_key
    if (response.details && response.details.response_key) {
      const key = response.details.response_key;
      if (key.includes('_')) {
        const parts = key.split('_');
        if (parts.length >= 2) {
          return `Nível ${parts[0]}, Questão ${parts[1]}`;
        }
      }
      return key;
    }
    
    // If we have the old schema with level_number and question_id directly
    if (response.level_number && response.question_id) {
      return `Nível ${response.level_number}, Questão ${response.question_id}`;
    }
    
    return 'Desconhecido';
  };

  const formatResponseValue = (response: ResponseData) => {
    try {
      // Try to get value from details.response_value (new schema)
      if (response.details && response.details.response_value) {
        const parsed = JSON.parse(response.details.response_value);
        if (typeof parsed === 'object' && parsed !== null) {
          if (parsed.option) {
            return `Opção: ${parsed.option.toUpperCase()}`;
          }
        }
        return response.details.response_value;
      }
      
      // If not found, try to get from details.selectedOption (old schema)
      if (response.details && response.details.selectedOption) {
        return `Opção: ${response.details.selectedOption.toUpperCase()}`;
      }
      
      // If none of the above, return a JSON string of details
      return JSON.stringify(response.details);
    } catch (e) {
      return JSON.stringify(response.details);
    }
  };
  
  const isRespondentData = (response: ResponseData) => {
    // Check if it's respondent data in the new schema
    if (response.details && response.details.response_type === 'respondent') {
      return true;
    }
    
    // Check if it's respondent data in the old schema (no level_number and no question_id)
    return !response.level_number && !response.question_id;
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Respostas</DialogTitle>
          <DialogDescription>
            Histórico das respostas enviadas nesta sessão
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center my-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="respondent">Classificação</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="respondent">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses
                    .filter(r => isRespondentData(r))
                    .map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>
                          {response.details?.response_key || "Campo"}
                        </TableCell>
                        <TableCell>{formatResponseValue(response)}</TableCell>
                        <TableCell>
                          {format(new Date(response.created_at), 'dd/MM/yyyy HH:mm:ss')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="questions">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Questão</TableHead>
                    <TableHead>Resposta</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses
                    .filter(r => !isRespondentData(r))
                    .map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>{getResponseType(response)}</TableCell>
                        <TableCell>{formatResponseValue(response)}</TableCell>
                        <TableCell>
                          {format(new Date(response.created_at), 'dd/MM/yyyy HH:mm:ss')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell>
                        {isRespondentData(response) 
                          ? (response.details?.response_key || "Campo")
                          : getResponseType(response)}
                      </TableCell>
                      <TableCell>{formatResponseValue(response)}</TableCell>
                      <TableCell>
                        {format(new Date(response.created_at), 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResponseHistoryModal;
