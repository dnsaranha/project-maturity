
import React from 'react';
import AssessmentForm from '@/components/MaturityAssessment/AssessmentForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AssessmentPage = () => {
  // Create a simple consent component directly in the page
  const [hasConsent, setHasConsent] = React.useState(() => {
    return localStorage.getItem('assessment_consent') === 'true';
  });

  const handleAcceptConsent = () => {
    localStorage.setItem('assessment_consent', 'true');
    setHasConsent(true);
  };

  // Render the consent screen or the assessment form
  if (!hasConsent) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Termo de Consentimento
          </h1>
          <div className="space-y-4 mb-8">
            <p>
              Você está sendo convidado(a) a participar da pesquisa "Avaliação de Maturidade em Gerenciamento de Projetos", 
              conduzida como parte de um estudo sobre práticas de gestão de projetos em organizações.
            </p>
            <p>
              <strong>Objetivo:</strong> Este estudo visa avaliar o nível de maturidade em gerenciamento de projetos 
              das organizações utilizando o modelo Prado-MMGP.
            </p>
            <p>
              <strong>Procedimentos:</strong> Sua participação envolve responder a um questionário de autoavaliação 
              com perguntas sobre práticas de gerenciamento de projetos na sua organização.
            </p>
            <p>
              <strong>Confidencialidade:</strong> Todas as informações fornecidas serão tratadas de forma confidencial. 
              Os dados serão analisados em conjunto, sem identificação individual dos participantes ou das organizações.
            </p>
            <p>
              <strong>Riscos e Benefícios:</strong> Não há riscos previsíveis em participar deste estudo. 
              Como benefício, você contribuirá para o avanço do conhecimento sobre gerenciamento de projetos 
              e poderá receber um relatório com os resultados consolidados da pesquisa, se assim desejar.
            </p>
            <p>
              <strong>Participação Voluntária:</strong> Sua participação é totalmente voluntária. 
              Você pode recusar-se a participar ou interromper sua participação a qualquer momento.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              onClick={handleAcceptConsent}
              className="flex-1 sm:flex-initial sm:min-w-[150px]"
            >
              Aceito Participar
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-initial sm:min-w-[150px]"
              asChild
            >
              <Link to="/">Não Aceito</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <AssessmentForm />
    </div>
  );
};

export default AssessmentPage;
