
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
  details: {
    [key: string]: string;
  };
}

interface LevelSectionProps {
  level: number;
  title: string;
  questions: Question[];
  answers: Answer[];
  updateQuestionAnswer: (questionId: number, meetsRequirement: boolean) => void;
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
      details: {}
    };
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
          
          return (
            <div key={question.id} className="border-b pb-6 last:border-b-0">
              <div className="space-y-4">
                <h3 className="text-base font-medium">
                  {question.text}
                </h3>
                <RadioGroup 
                  value={answer.meetsRequirement === null 
                    ? undefined 
                    : answer.meetsRequirement ? "yes" : "no"}
                  onValueChange={(value) => updateQuestionAnswer(question.id, value === "yes")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`q${question.id}-yes`} />
                    <Label htmlFor={`q${question.id}-yes`}>Atende ao requisito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`q${question.id}-no`} />
                    <Label htmlFor={`q${question.id}-no`}>Não atende ao requisito</Label>
                  </div>
                </RadioGroup>
                
                {answer.meetsRequirement === true && (
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
