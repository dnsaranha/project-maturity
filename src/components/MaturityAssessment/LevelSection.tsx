
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Question {
  id: number;
  text: string;
  details: {
    label: string;
    questions: string[];
  };
}

interface Answer {
  id: number;
  meetsRequirement: boolean | null;
  selectedOption?: string;
  score?: number;
  details: {
    [key: string]: string;
  };
}

interface LevelSectionProps {
  level: number;
  title: string;
  questions: Question[];
  answers: Answer[];
  updateQuestionAnswer: (questionId: number, option: string, score: number) => void;
  updateQuestionDetails: (questionId: number, field: string, value: string) => void;
}

const LevelSection: React.FC<LevelSectionProps> = ({
  level,
  title,
  questions,
  answers,
  updateQuestionAnswer,
  updateQuestionDetails
}) => {
  // Find answer by question ID
  const getAnswerByQuestionId = (questionId: number) => {
    return answers.find(a => a.id === questionId) || {
      id: questionId,
      meetsRequirement: null,
      selectedOption: undefined,
      score: undefined,
      details: {}
    };
  };

  // Função para converter pontuação em status de "atende ao requisito"
  const scoreToMeetsRequirement = (score: number | undefined): boolean | null => {
    if (score === undefined) return null;
    return score > 0;
  };

  // Função para processar a seleção de opção
  const handleOptionChange = (questionId: number, option: string) => {
    let score: number;
    switch (option) {
      case 'a': score = 10; break;
      case 'b': score = 7; break;
      case 'c': score = 4; break;
      case 'd': score = 2; break;
      case 'e': score = 0; break;
      default: score = 0;
    }
    updateQuestionAnswer(questionId, option, score);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question) => {
          const answer = getAnswerByQuestionId(question.id);
          const meetsRequirement = scoreToMeetsRequirement(answer.score);
          
          return (
            <div key={question.id} className="border-b pb-6 last:border-b-0">
              <div className="space-y-4">
                <h3 className="text-base font-medium">
                  {question.text}
                </h3>
                <RadioGroup 
                  value={answer.selectedOption}
                  onValueChange={(value) => handleOptionChange(question.id, value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="a" id={`q${question.id}-a`} className="mt-1" />
                    <Label htmlFor={`q${question.id}-a`} className="flex-1">
                      <span className="font-medium">a)</span> Cenário de excelência em implementação há mais de um ano.
                      <span className="text-xs ml-1 text-blue-600">(10 pontos)</span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="b" id={`q${question.id}-b`} className="mt-1" />
                    <Label htmlFor={`q${question.id}-b`} className="flex-1">
                      <span className="font-medium">b)</span> A situação existente é levemente inferior ao apresentado no item A.
                      <span className="text-xs ml-1 text-blue-600">(7 pontos)</span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="c" id={`q${question.id}-c`} className="mt-1" />
                    <Label htmlFor={`q${question.id}-c`} className="flex-1">
                      <span className="font-medium">c)</span> A situação existente é significativamente inferior ao apresentado no item A.
                      <span className="text-xs ml-1 text-blue-600">(4 pontos)</span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="d" id={`q${question.id}-d`} className="mt-1" />
                    <Label htmlFor={`q${question.id}-d`} className="flex-1">
                      <span className="font-medium">d)</span> Esforços foram iniciados neste sentido.
                      <span className="text-xs ml-1 text-blue-600">(2 pontos)</span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="e" id={`q${question.id}-e`} className="mt-1" />
                    <Label htmlFor={`q${question.id}-e`} className="flex-1">
                      <span className="font-medium">e)</span> Nenhum esforço foi iniciado neste sentido.
                      <span className="text-xs ml-1 text-blue-600">(0 pontos)</span>
                    </Label>
                  </div>
                </RadioGroup>
                
                {meetsRequirement === true && (
                  <div className="mt-4 pl-4 border-l-2 border-green-300 space-y-4">
                    <h4 className="text-sm font-medium">
                      {question.details.label}
                    </h4>
                    {question.details.questions.map((detailQuestion, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-sm text-gray-600">{detailQuestion}</p>
                        <Textarea 
                          placeholder="Digite sua resposta aqui..."
                          value={answer.details[`detail${idx}`] || ''}
                          onChange={(e) => updateQuestionDetails(question.id, `detail${idx}`, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LevelSection;
