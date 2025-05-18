
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ResultsSectionProps {
  scores: {
    [key: number]: number;
  };
  overallMaturity: number;
}

const getMaturityLevel = (score: number): string => {
  if (score < 1.5) return "Inicial (ad hoc)";
  if (score < 2.5) return "Conhecido";
  if (score < 3.5) return "Padronizado";
  if (score < 4.5) return "Gerenciado";
  return "Otimizado";
};

const getMaturityDescription = (score: number): string => {
  if (score < 1.5) {
    return "Conhecimento escasso, sem processos padronizados e dependência de esforços individuais.";
  }
  if (score < 2.5) {
    return "Iniciativas isoladas, projetos executados intuitivamente e baixo nível de planejamento.";
  }
  if (score < 3.5) {
    return "Processos padronizados, metodologia estabelecida e estrutura organizacional implementada.";
  }
  if (score < 4.5) {
    return "Processos consolidados, alinhamento estratégico e indicadores de desempenho monitorados.";
  }
  return "Processos otimizados, melhoria contínua e foco no desenvolvimento das competências.";
};

const ResultsSection: React.FC<ResultsSectionProps> = ({ scores, overallMaturity }) => {
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
          <CardTitle className="text-xl font-bold">Resultados da Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Pontuação por Nível</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(scores).map(([level, score]) => (
                <div key={level} className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Nível {level}</div>
                  <div className="text-2xl font-bold text-blue-600">{score.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Índice de Maturidade Global</h3>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-blue-700">{overallMaturity.toFixed(1)}</div>
              <div className="text-lg font-medium mt-2">{getMaturityLevel(overallMaturity)}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Interpretação</h3>
            <p className="text-gray-700">
              {getMaturityDescription(overallMaturity)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Visualização Gráfica</CardTitle>
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
                <Bar dataKey="score" name="Pontuação (%)" fill="#3f83f8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsSection;
