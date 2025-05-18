
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const ConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const [consent, setConsent] = useState(false);

  const handleAccept = () => {
    if (consent) {
      // Navegar para o formulário de avaliação
      navigate('/assessment');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Termo de Consentimento Livre e Esclarecido</CardTitle>
          <CardDescription className="text-center">Pesquisa de Maturidade em Gerenciamento de Projetos (Modelo Prado-MMGP)</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 text-justify">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sobre a Pesquisa</h3>
            <p>
              Você está sendo convidado(a) a participar de uma pesquisa sobre maturidade em gerenciamento de projetos
              baseada no modelo Prado-MMGP. Esta pesquisa tem como objetivo avaliar o nível de maturidade da sua organização
              em relação a práticas de gerenciamento de projetos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Objetivo da Pesquisa</h3>
            <p>
              Esta pesquisa visa coletar dados sobre as práticas de gerenciamento de projetos em sua organização para
              determinar o nível de maturidade de acordo com os cinco níveis do modelo Prado-MMGP: Inicial, Conhecido,
              Padronizado, Gerenciado e Otimizado.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Procedimentos</h3>
            <p>
              Se você concordar em participar desta pesquisa, será solicitado a responder um questionário detalhado sobre
              práticas de gerenciamento de projetos em sua organização. O questionário leva aproximadamente 15-20 minutos para
              ser concluído e está organizado em cinco seções, correspondendo aos cinco níveis de maturidade do modelo.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Benefícios e Riscos</h3>
            <p>
              Ao participar desta pesquisa, você contribuirá para o avanço do conhecimento sobre gerenciamento de projetos
              e poderá receber um relatório sobre o nível de maturidade da sua organização, com recomendações para melhorias.
              Não há riscos significativos associados à participação nesta pesquisa além daqueles encontrados na vida cotidiana.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Confidencialidade</h3>
            <p>
              Todas as informações coletadas por meio desta pesquisa permanecerão confidenciais. Os dados serão apresentados
              apenas de forma agregada, sem identificação de participantes ou organizações específicas.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Participação Voluntária</h3>
            <p>
              A participação nesta pesquisa é totalmente voluntária. Você pode optar por não participar ou interromper sua
              participação a qualquer momento sem qualquer penalidade.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Checkbox 
              id="consent" 
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
            />
            <Label htmlFor="consent" className="font-medium cursor-pointer">
              Eu li e aceito os termos de consentimento e desejo participar desta pesquisa.
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/')}>Recusar</Button>
          <Button 
            onClick={handleAccept} 
            disabled={!consent}
          >
            Aceito Participar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConsentPage;
