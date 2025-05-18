
import React from 'react';
import AssessmentForm from '@/components/MaturityAssessment/AssessmentForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AssessmentPage = () => {
  const [consentGiven, setConsentGiven] = useState(false);

  const handleConsent = () => {
    setConsentGiven(true);
  };

  // Tela de consentimento inicial, sem necessidade de login
  const ConsentScreen = () => (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Termo de Consentimento</CardTitle>
          <CardDescription>
            Autoavaliação de Maturidade em Gerenciamento de Projetos (MMGP)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Você está sendo convidado(a) a participar de uma pesquisa sobre maturidade em gerenciamento de projetos utilizando o modelo Prado-MMGP.
          </p>
          <p>
            <strong>Objetivo da Pesquisa:</strong> Esta pesquisa tem como objetivo avaliar o nível de maturidade em gerenciamento de projetos na sua organização.
          </p>
          <p>
            <strong>Procedimentos:</strong> Sua participação envolve responder a um questionário dividido em seções que avaliam diferentes aspectos da maturidade em gerenciamento de projetos. O tempo estimado para completar o questionário é de aproximadamente 20-30 minutos.
          </p>
          <p>
            <strong>Confidencialidade:</strong> As informações fornecidas serão utilizadas apenas para fins de pesquisa acadêmica. Seus dados pessoais não serão divulgados em nenhuma publicação que possa resultar deste estudo.
          </p>
          <p>
            <strong>Riscos e Benefícios:</strong> Não há riscos previsíveis em participar desta pesquisa. Os benefícios incluem a possibilidade de obter um diagnóstico sobre o nível de maturidade em gerenciamento de projetos na sua organização.
          </p>
          <p>
            <strong>Participação Voluntária:</strong> Sua participação é voluntária e você pode se retirar da pesquisa a qualquer momento sem penalidades.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Recusar
          </Button>
          <Button onClick={handleConsent}>
            Aceitar e Continuar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      {consentGiven ? <AssessmentForm /> : <ConsentScreen />}
    </div>
  );
};

export default AssessmentPage;
