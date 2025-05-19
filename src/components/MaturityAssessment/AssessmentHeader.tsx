
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, History } from 'lucide-react';

interface AssessmentHeaderProps {
  session: any;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  handleExit: () => void;
}

const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({ 
  session, 
  showHistory, 
  setShowHistory, 
  handleExit 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Autoavaliação de Maturidade em Gerenciamento de Projetos (MMGP)
        </h1>
        <div className="flex gap-2">
          {session && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowHistory(true)}
              title="Ver histórico de respostas"
            >
              <History className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={handleExit}
            title="Sair da avaliação"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        Este formulário avalia o nível de maturidade em gerenciamento de projetos da sua organização com base no modelo Prado-MMGP.
      </p>
    </>
  );
};

export default AssessmentHeader;
