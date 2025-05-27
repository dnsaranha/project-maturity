
export interface ResponseHistoryModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
}

export interface ResponseData {
  id: string;
  level_number: number | null;
  question_id: number | null;
  details: {
    response_type?: string;
    response_key?: string;
    response_value?: string;
  };
  created_at: string;
}
