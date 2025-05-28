
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ResultsSectionProps {
  scores: {
    [key: number]: number;
  };
  totalPoints: number;
  overallMaturity: number;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ scores, totalPoints, overallMaturity }) => {
  
  const getMaturityLevel = (index: number): string => {
    if (index < 2) return "Inicial";
    if (index < 3) return "Conhecido";
    if (index < 4) return "Padronizado";
    if (index < 5) return "Gerenciado";
    return "Otimizado";
  };

  const getLevelDescription = (level: number, score: number): string => {
    const descriptions: Record<number, string[]> = {
      2: [
        "Nível muito fraco. Quase nenhuma iniciativa da organização.",
        "Iniciativas isoladas. Conhecimento introdutório de gerenciamento de projetos.",
        "Algum avanço. Treinamentos básicos de gerenciamento para os principais envolvidos.",
      ],
      3: [
        "Nível muito fraco. Não existe metodologia.",
        "Metodologia desenvolvida, mas pouco utilizada.",
        "Metodologia estabelecida e em uso, com informatização parcial.",
      ],
      4: [
        "Nível muito fraco. Não existe acompanhamento formal.",
        "Acompanhamento e controle parcial, em algumas áreas.",
        "Acompanhamento e controle em todas as áreas, com métricas e melhorias.",
      ],
      5: [
        "Nível muito fraco. Não existem iniciativas de otimização.",
        "Algumas iniciativas isoladas de melhoria contínua.",
        "Otimização plena, com uso de benchmarking e melhoria contínua.",
      ],
    };

    if (score < 33) return descriptions[level][0];
    if (score < 66) return descriptions[level][1];
    return descriptions[level][2];
  };

  const chartData = [
    { name: 'Nível 2', score: scores[2] },
    { name: 'Nível 3', score: scores[3] },
    { name: 'Nível 4', score: scores[4] },
    { name: 'Nível 5', score: scores[5] },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Resultados da Avaliação de Maturidade</CardTitle>
          <CardDescription>
            Abaixo estão os resultados da sua autoavaliação de maturidade em gerenciamento de projetos, baseado no
            modelo Prado-MMGP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Índice de Maturidade Global</h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">{overallMaturity.toFixed(2)}</div>
                <div className="text-lg">{getMaturityLevel(overallMaturity)}</div>
              </div>
              <div className="mt-2 bg-gray-50 p-2 rounded-lg text-sm">
                <p className="text-gray-600">Cálculo: (100 + {totalPoints}) / 100 = {overallMaturity.toFixed(2)}</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nível</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Nível 2 - Conhecido</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={scores[2]} className="w-20" />
                      <span>{scores[2].toFixed(0)} pts</span>
                    </div>
                  </TableCell>
                  <TableCell>{scores[2] < 33 ? "Fraco" : scores[2] < 66 ? "Regular" : "Bom"}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLevelDescription(2, scores[2])}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nível 3 - Padronizado</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={scores[3]} className="w-20" />
                      <span>{scores[3].toFixed(0)} pts</span>
                    </div>
                  </TableCell>
                  <TableCell>{scores[3] < 33 ? "Fraco" : scores[3] < 66 ? "Regular" : "Bom"}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLevelDescription(3, scores[3])}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nível 4 - Gerenciado</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={scores[4]} className="w-20" />
                      <span>{scores[4].toFixed(0)} pts</span>
                    </div>
                  </TableCell>
                  <TableCell>{scores[4] < 33 ? "Fraco" : scores[4] < 66 ? "Regular" : "Bom"}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLevelDescription(4, scores[4])}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nível 5 - Otimizado</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={scores[5]} className="w-20" />
                      <span>{scores[5].toFixed(0)} pts</span>
                    </div>
                  </TableCell>
                  <TableCell>{scores[5] < 33 ? "Fraco" : scores[5] < 66 ? "Regular" : "Bom"}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLevelDescription(5, scores[5])}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="p-4 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-2">Interpretação do Resultado</h3>
              <p className="text-sm">
                {overallMaturity < 2
                  ? "Nível Inicial (1-1.9): A organização está nos estágios iniciais de gerenciamento de projetos, com iniciativas isoladas e sem padronização. Recomenda-se investir em treinamentos básicos e conscientização sobre a importância do gerenciamento de projetos."
                  : overallMaturity < 3
                    ? "Nível Conhecido (2-2.9): A organização reconhece a importância do gerenciamento de projetos, mas ainda não possui uma metodologia consolidada. Recomenda-se formalizar processos e investir em capacitação mais avançada."
                    : overallMaturity < 4
                      ? "Nível Padronizado (3-3.9): A organização possui metodologia estabelecida, mas ainda há oportunidades de melhoria na implementação e no controle. Recomenda-se fortalecer o PMO e implementar métricas de desempenho."
                      : overallMaturity < 5
                        ? "Nível Gerenciado (4-4.9): A organização possui processos consolidados e alinhados à estratégia. Recomenda-se focar em otimização e melhoria contínua dos processos existentes."
                        : "Nível Otimizado (5): A organização atingiu excelência em gerenciamento de projetos, com processos otimizados e cultura estabelecida. Recomenda-se manter o benchmark e a inovação contínua."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Pontuação por Nível</CardTitle>
          <CardDescription>
            Visualização das pontuações obtidas em cada nível de maturidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Pontuação (pontos)" fill="#3f83f8" />
                <ReferenceLine y={50} stroke="red" strokeDasharray="3 3" label="Mínimo" />
                <ReferenceLine y={70} stroke="green" strokeDasharray="3 3" label="Desejável" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsSection;
