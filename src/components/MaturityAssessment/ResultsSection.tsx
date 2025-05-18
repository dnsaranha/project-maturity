
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
  Cell,
  ReferenceLine,
} from "recharts";

interface ResultsSectionProps {
  scores: {
    [key: number]: number;
  };
  totalPoints: number;
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

const ResultsSection: React.FC<ResultsSectionProps> = ({ scores, overallMaturity, totalPoints }) => {
  const chartData = [
    { name: 'Nível 2', score: scores[2] },
    { name: 'Nível 3', score: scores[3] },
    { name: 'Nível 4', score: scores[4] },
    { name: 'Nível 5', score: scores[5] },
  ];

  // Dados para o gráfico de perfil de aderência
  const adherenceProfileData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(value => {
    return {
      value,
      nivel2: scores[2] >= value ? scores[2] : 0,
      nivel3: scores[3] >= value ? scores[3] : 0,
      nivel4: scores[4] >= value ? scores[4] : 0,
      nivel5: scores[5] >= value ? scores[5] : 0,
    };
  });

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
                  <div className="text-2xl font-bold text-blue-600">{score.toFixed(0)} pontos</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Total de Pontos Obtidos</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalPoints} pontos</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Índice de Maturidade Global</h3>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-blue-700">{overallMaturity.toFixed(1)}</div>
              <div className="text-lg font-medium mt-2">{getMaturityLevel(overallMaturity)}</div>
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cálculo: (100 + {totalPoints}) / 100 = {overallMaturity.toFixed(1)}</p>
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
          <CardTitle className="text-xl font-bold">Perfil de Aderência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={adherenceProfileData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 40,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="value" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="nivel2" name="Nível 2" stackId="a" fill="#3f83f8" />
                <Bar dataKey="nivel3" name="Nível 3" stackId="a" fill="#22c55e" />
                <Bar dataKey="nivel4" name="Nível 4" stackId="a" fill="#eab308" />
                <Bar dataKey="nivel5" name="Nível 5" stackId="a" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>

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
