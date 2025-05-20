import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import RespondentSection from './RespondentSection';
import LevelSection from './LevelSection';
import ResultsSection from './ResultsSection';
import { levelQuestions } from './questions';
import { AssessmentData } from './types';

interface AssessmentTabsProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  assessmentData: AssessmentData;
  updateRespondentData: (field: keyof AssessmentData['respondent'], value: any) => void;
  updateQuestionAnswer: (level: number, questionId: number, option: string) => void;
  updateQuestionDetails: (level: number, questionId: number, field: string, value: string) => void;
  saving: boolean;
  saveAssessment: () => void;
  isFormComplete: () => boolean;
  isAssessmentSaved: boolean;
}

const AssessmentTabs: React.FC<AssessmentTabsProps> = ({
  activeTab,
  handleTabChange,
  assessmentData,
  updateRespondentData,
  updateQuestionAnswer,
  updateQuestionDetails,
  saving,
  saveAssessment,
  isFormComplete,
  isAssessmentSaved
}) => {
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-6 bg-slate-100">
        <TabsTrigger value="respondent" className="font-medium">Classificação</TabsTrigger>
        <TabsTrigger value="level2" className="font-medium">Nível 2</TabsTrigger>
        <TabsTrigger value="level3" className="font-medium">Nível 3</TabsTrigger>
        <TabsTrigger value="level4" className="font-medium">Nível 4</TabsTrigger>
        <TabsTrigger value="level5" className="font-medium">Nível 5</TabsTrigger>
        <TabsTrigger value="results" className="font-medium" disabled={!isAssessmentSaved}>Resultados</TabsTrigger>
      </TabsList>

      <TabsContent value="respondent" className="p-6">
        <RespondentSection 
          respondentData={assessmentData.respondent} 
          updateRespondentData={updateRespondentData}
        />
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={() => handleTabChange("level2")} 
            variant="default"
            disabled={!assessmentData.respondent.hasProjectExperience || 
              assessmentData.respondent.isPharmaceutical === null || 
              !assessmentData.respondent.companySize ||
              !assessmentData.respondent.state}
          >
            Próximo
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="level2" className="p-6">
        <LevelSection 
          level={2}
          title="Nível 2 - Conhecido (Iniciativas Isoladas)"
          questions={levelQuestions[2]}
          answers={assessmentData.levels[2].questions}
          updateQuestionAnswer={(questionId, option) => updateQuestionAnswer(2, questionId, option)}
          updateQuestionDetails={(questionId, field, value) => updateQuestionDetails(2, questionId, field, value)}
          hideScores={true}
        />
        <div className="mt-8 flex justify-between">
          <Button 
            onClick={() => handleTabChange("respondent")} 
            variant="outline"
          >
            Anterior
          </Button>
          <Button 
            onClick={() => handleTabChange("level3")}
            variant="default"
            disabled={!assessmentData.levels[2].questions.every(q => q.selectedOption !== undefined)}
          >
            Próximo
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="level3" className="p-6">
        <LevelSection 
          level={3}
          title="Nível 3 - Padronizado"
          questions={levelQuestions[3]}
          answers={assessmentData.levels[3].questions}
          updateQuestionAnswer={(questionId, option) => updateQuestionAnswer(3, questionId, option)}
          updateQuestionDetails={(questionId, field, value) => updateQuestionDetails(3, questionId, field, value)}
          hideScores={true}
        />
        <div className="mt-8 flex justify-between">
          <Button 
            onClick={() => handleTabChange("level2")} 
            variant="outline"
          >
            Anterior
          </Button>
          <Button 
            onClick={() => handleTabChange("level4")}
            variant="default" 
            disabled={!assessmentData.levels[3].questions.every(q => q.selectedOption !== undefined)}
          >
            Próximo
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="level4" className="p-6">
        <LevelSection 
          level={4}
          title="Nível 4 - Gerenciado"
          questions={levelQuestions[4]}
          answers={assessmentData.levels[4].questions}
          updateQuestionAnswer={(questionId, option) => updateQuestionAnswer(4, questionId, option)}
          updateQuestionDetails={(questionId, field, value) => updateQuestionDetails(4, questionId, field, value)}
          hideScores={true}
        />
        <div className="mt-8 flex justify-between">
          <Button 
            onClick={() => handleTabChange("level3")}
            variant="outline" 
          >
            Anterior
          </Button>
          <Button 
            onClick={() => handleTabChange("level5")}
            variant="default" 
            disabled={!assessmentData.levels[4].questions.every(q => q.selectedOption !== undefined)}
          >
            Próximo
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="level5" className="p-6">
        <LevelSection 
          level={5}
          title="Nível 5 - Otimizado"
          questions={levelQuestions[5]}
          answers={assessmentData.levels[5].questions}
          updateQuestionAnswer={(questionId, option) => updateQuestionAnswer(5, questionId, option)}
          updateQuestionDetails={(questionId, field, value) => updateQuestionDetails(5, questionId, field, value)}
          hideScores={true}
        />
        <div className="mt-8 flex justify-between">
          <Button 
            onClick={() => handleTabChange("level4")}
            variant="outline"
          >
            Anterior
          </Button>
          <Button
            onClick={saveAssessment}
            disabled={saving || !isFormComplete()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {saving ? 'Salvando...' : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Salvar Avaliação</span>
              </div>
            )}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="results" className="p-6">
        <ResultsSection 
          scores={assessmentData.scores}
          totalPoints={assessmentData.totalPoints}
          overallMaturity={assessmentData.overallMaturity}
        />
        <div className="mt-8 flex justify-between">
          <Button 
            onClick={() => handleTabChange("level5")}
            variant="outline"
          >
            Anterior
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="default"
          >
            Finalizar
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AssessmentTabs;
