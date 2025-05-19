
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
  response_key: string;
  response_value: string;
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
      // Use a table specifically for individual responses
      const { data, error } = await supabase
        .from('assessment_responses')
        .select('id, response_key, response_value, created_at')
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

  const getResponseType = (key: string) => {
    if (key.includes('_')) {
      const parts = key.split('_');
      if (parts.length >= 2) {
        return `Nível ${parts[0]}, Questão ${parts[1]}`;
      }
    }
    return key;
  };

  const formatResponseValue = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.option) {
          return `Opção: ${parsed.option.toUpperCase()}`;
        }
      }
      return value;
    } catch (e) {
      return value;
    }
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
                    .filter(r => !r.response_key.includes('_'))
                    .map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>{response.response_key}</TableCell>
                        <TableCell>{formatResponseValue(response.response_value)}</TableCell>
                        <TableCell>{format(new Date(response.created_at), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
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
                    .filter(r => r.response_key.includes('_'))
                    .map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>{getResponseType(response.response_key)}</TableCell>
                        <TableCell>{formatResponseValue(response.response_value)}</TableCell>
                        <TableCell>{format(new Date(response.created_at), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
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
                        {response.response_key.includes('_') 
                          ? getResponseType(response.response_key) 
                          : response.response_key}
                      </TableCell>
                      <TableCell>{formatResponseValue(response.response_value)}</TableCell>
                      <TableCell>{format(new Date(response.created_at), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
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
