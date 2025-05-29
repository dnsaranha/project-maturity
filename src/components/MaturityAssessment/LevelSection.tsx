
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
  updateQuestionAnswer: (questionId: number, option: string) => void;
  updateQuestionDetails: (questionId: number, field: string, value: string) => void;
  hideScores?: boolean;
}

const LevelSection: React.FC<LevelSectionProps> = ({
  level,
  title,
  questions,
  answers,
  updateQuestionAnswer,
  hideScores = false
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

  // Check if this is level 5 (only A and E options)
  const isLevel5 = level === 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question, index) => {
          const answer = getAnswerByQuestionId(question.id);
          
          return (
            <div key={question.id} className="border-b pb-6 last:border-b-0">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-medium flex-1">
                    <span className="font-bold mr-2">{index + 1}.</span>
                    {question.text}
                  </h3>
                  {!answer.selectedOption && (
                    <Badge variant="destructive" className="ml-2">Não respondida</Badge>
                  )}
                </div>
                <RadioGroup 
                  value={answer.selectedOption}
                  onValueChange={(value) => updateQuestionAnswer(question.id, value)}
                  className="flex flex-col space-y-2"
                  required
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="a" id={`q${question.id}-a`} className="mt-1" />
                    <Label htmlFor={`q${question.id}-a`} className="flex-1">
                      <span className="font-medium">a)</span> Cenário de excelência em implementação há mais de um ano.
                      {!hideScores && <span className="text-xs ml-1 text-blue-600">(10 pontos)</span>}
                    </Label>
                  </div>
                  
                  {!isLevel5 && (
                    <>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="b" id={`q${question.id}-b`} className="mt-1" />
                        <Label htmlFor={`q${question.id}-b`} className="flex-1">
                          <span className="font-medium">b)</span> A situação existente é levemente inferior ao apresentado no item A.
                          {!hideScores && <span className="text-xs ml-1 text-blue-600">(7 pontos)</span>}
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="c" id={`q${question.id}-c`} className="mt-1" />
                        <Label htmlFor={`q${question.id}-c`} className="flex-1">
                          <span className="font-medium">c)</span> A situação existente é significativamente inferior ao apresentado no item A.
                          {!hideScores && <span className="text-xs ml-1 text-blue-600">(4 pontos)</span>}
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="d" id={`q${question.id}-d`} className="mt-1" />
                        <Label htmlFor={`q${question.id}-d`} className="flex-1">
                          <span className="font-medium">d)</span> Esforços foram iniciados neste sentido.
                          {!hideScores && <span className="text-xs ml-1 text-blue-600">(2 pontos)</span>}
                        </Label>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="e" id={`q${question.id}-e`} className="mt-1" />
                    <Label htmlFor={`q${question.id}-e`} className="flex-1">
                      <span className="font-medium">e)</span> Nenhum esforço foi iniciado neste sentido.
                      {!hideScores && <span className="text-xs ml-1 text-blue-600">(0 pontos)</span>}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LevelSection;
