
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RespondentSection from './RespondentSection';
import LevelSection from './LevelSection';
import ResultsSection from './ResultsSection';
import ProgressBar from './ProgressBar';
import { levelQuestions } from './questions';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Save, History } from 'lucide-react';
import ResponseHistoryModal from './ResponseHistoryModal';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthProvider';

// Define assessment data structure
export interface AssessmentData {
  respondent: {
    hasProjectExperience: boolean | null;
    isPharmaceutical: boolean | null;
    pharmaceuticalType: string;
    companySize: string;
    state: string;
  };
  levels: {
    [key: number]: {
      questions: {
        id: number;
        meetsRequirement: boolean | null;
        selectedOption?: string;
        score?: number;
        details: {
          [key: string]: string;
        };
      }[];
    };
  };
  scores: {
    [key: number]: number;
  };
  totalPoints: number;
  overallMaturity: number;
  assessmentId?: string;
  sessionId?: string;
}

const AssessmentForm = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("respondent");
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    respondent: {
      hasProjectExperience: null,
      isPharmaceutical: null,
      pharmaceuticalType: "",
      companySize: "",
      state: "",
    },
    levels: {
      2: { questions: [] },
      3: { questions: [] },
      4: { questions: [] },
      5: { questions: [] }
    },
    scores: {
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    totalPoints: 0,
    overallMaturity: 0,
    sessionId: localStorage.getItem('assessment_session_id') || uuidv4()
  });
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isAssessmentSaved, setIsAssessmentSaved] = useState(false);

  // Save session ID to localStorage when it's generated
  useEffect(() => {
    if (assessmentData.sessionId && !localStorage.getItem('assessment_session_id')) {
      localStorage.setItem('assessment_session_id', assessmentData.sessionId);
    }
  }, [assessmentData.sessionId]);

  // Initialize questions from the predefined data
  useEffect(() => {
    const initializedLevels = { ...assessmentData.levels };
    
    // For each level (2-5), initialize questions
    for (let level = 2; level <= 5; level++) {
      initializedLevels[level] = {
        questions: levelQuestions[level].map(q => ({
          id: q.id,
          meetsRequirement: null,
          selectedOption: undefined,
          score: undefined,
          details: {}
        }))
      };
    }
    
    setAssessmentData(prev => ({
      ...prev,
      levels: initializedLevels
    }));
  }, []);

  // Calculate progress whenever assessment data changes
  useEffect(() => {
    const calculateProgress = () => {
      let answered = 0;
      let total = 0;
      
      // Count respondent section (4 questions now with state)
      if (assessmentData.respondent.hasProjectExperience !== null) answered++;
      if (assessmentData.respondent.isPharmaceutical !== null) answered++;
      if (assessmentData.respondent.companySize) answered++;
      if (assessmentData.respondent.state) answered++;
      total += 4;
      
      // Count questions from each level
      for (let level = 2; level <= 5; level++) {
        assessmentData.levels[level].questions.forEach(q => {
          if (q.selectedOption) answered++;
        });
        total += 10; // Each level has 10 questions
      }
      
      return Math.floor((answered / total) * 100);
    };
    
    setProgress(calculateProgress());
  }, [assessmentData]);

  // Calculate scores whenever answers change
  useEffect(() => {
    const calculateScores = () => {
      const scores = { 2: 0, 3: 0, 4: 0, 5: 0 };
      
      // Calculate score for each level
      for (let level = 2; level <= 5; level++) {
        const levelQuestions = assessmentData.levels[level].questions;
        let levelTotal = 0;
        
        levelQuestions.forEach(q => {
          if (q.score !== undefined) {
            levelTotal += q.score;
          }
        });
        
        scores[level] = levelTotal;
      }
      
      // Calculate total points
      const totalPoints = scores[2] + scores[3] + scores[4] + scores[5];
      
      // Calculate overall maturity using the formula: (100 + total_points) / 100
      const overallMaturity = (100 + totalPoints) / 100;
      
      return {
        levelScores: scores,
        totalPoints,
        overall: overallMaturity
      };
    };
    
    const { levelScores, totalPoints, overall } = calculateScores();
    
    setAssessmentData(prev => ({
      ...prev,
      scores: levelScores,
      totalPoints,
      overallMaturity: overall
    }));
  }, [assessmentData.levels]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    // Only allow changing to results tab if assessment is saved
    if (value === "results" && !isAssessmentSaved) {
      toast({
        variant: "destructive",
        title: "Ação não permitida",
        description: "Você precisa salvar a avaliação antes de ver os resultados."
      });
      return;
    }
    
    // Check if current section is complete before advancing
    if (activeTab === "respondent" && value !== "respondent") {
      const { hasProjectExperience, isPharmaceutical, companySize, state } = assessmentData.respondent;
      if (hasProjectExperience === null || isPharmaceutical === null || !companySize || !state) {
        toast({
          variant: "destructive", 
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos da seção de classificação."
        });
        return;
      }
    }
    
    // Check if level questions are all answered before advancing to next level
    const levels = {
      "level2": 2,
      "level3": 3,
      "level4": 4,
      "level5": 5
    };
    
    const currentLevel = levels[activeTab as keyof typeof levels];
    const nextLevel = levels[value as keyof typeof levels];
    
    if (currentLevel && nextLevel && nextLevel > currentLevel) {
      const questions = assessmentData.levels[currentLevel].questions;
      const allAnswered = questions.every(q => q.selectedOption !== undefined);
      
      if (!allAnswered) {
        toast({
          variant: "destructive", 
          title: "Respostas incompletas",
          description: `Por favor, responda todas as questões do Nível ${currentLevel} antes de avançar.`
        });
        return;
      }
    }
    
    setActiveTab(value);
  };

  // Handle respondent data updates
  const updateRespondentData = (field: keyof AssessmentData['respondent'], value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      respondent: {
        ...prev.respondent,
        [field]: value
      }
    }));
    
    // Save individual response to database
    saveIndividualResponse('respondent', field as string, value);
  };

  // Handle question answer updates with options (a, b, c, d, e) and scores (now hidden from user)
  const updateQuestionAnswer = (level: number, questionId: number, option: string) => {
    // Map options to scores (hidden from user)
    const scoreMap: {[key: string]: number} = {
      'a': 10,
      'b': 7,
      'c': 4,
      'd': 2,
      'e': 0
    };
    
    const score = scoreMap[option] || 0;
    
    setAssessmentData(prev => {
      const updatedLevels = { ...prev.levels };
      
      const questionIndex = updatedLevels[level].questions.findIndex(q => q.id === questionId);
      
      if (questionIndex !== -1) {
        updatedLevels[level].questions[questionIndex] = {
          ...updatedLevels[level].questions[questionIndex],
          selectedOption: option,
          score: score,
          meetsRequirement: score > 0 // Se a pontuação for maior que 0, considera como atendido
        };
      }
      
      return {
        ...prev,
        levels: updatedLevels
      };
    });
    
    // Save individual response to database
    saveIndividualResponse('question', `${level}_${questionId}`, { option, score });
  };

  // Handle question details updates - not used anymore but kept for compatibility
  const updateQuestionDetails = (level: number, questionId: number, field: string, value: string) => {
    setAssessmentData(prev => {
      const updatedLevels = { ...prev.levels };
      
      const questionIndex = updatedLevels[level].questions.findIndex(q => q.id === questionId);
      
      if (questionIndex !== -1) {
        updatedLevels[level].questions[questionIndex] = {
          ...updatedLevels[level].questions[questionIndex],
          details: {
            ...updatedLevels[level].questions[questionIndex].details,
            [field]: value
          }
        };
      }
      
      return {
        ...prev,
        levels: updatedLevels
      };
    });
    
    // Save individual response to database
    saveIndividualResponse('detail', `${level}_${questionId}_${field}`, value);
  };

  // Save individual responses to database as they're made
  const saveIndividualResponse = async (type: string, key: string, value: any) => {
    try {
      await supabase.from('assessment_responses').insert({
        response_type: type,
        response_key: key,
        response_value: JSON.stringify(value),
        session_id: assessmentData.sessionId,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao salvar resposta individual:", error);
    }
  };

  // Função para salvar a avaliação completa no Supabase
  const saveAssessment = async () => {
    try {
      setSaving(true);

      // 1. Salvar a avaliação principal
      const assessmentResponse = await supabase.from('maturity_assessments').insert({
        session_id: assessmentData.sessionId,
        has_project_experience: assessmentData.respondent.hasProjectExperience,
        is_pharmaceutical: assessmentData.respondent.isPharmaceutical,
        pharmaceutical_type: assessmentData.respondent.pharmaceuticalType,
        company_size: assessmentData.respondent.companySize,
        state: assessmentData.respondent.state,
        level_2_score: Math.round(assessmentData.scores[2]),
        level_3_score: Math.round(assessmentData.scores[3]),
        level_4_score: Math.round(assessmentData.scores[4]),
        level_5_score: Math.round(assessmentData.scores[5]),
        overall_maturity: assessmentData.overallMaturity
      }).select().single();

      if (assessmentResponse.error) {
        throw assessmentResponse.error;
      }

      const assessmentId = assessmentResponse.data.id;

      // 2. Salvar as respostas para cada nível de forma consolidada
      for (let level = 2; level <= 5; level++) {
        for (const question of assessmentData.levels[level].questions) {
          if (question.selectedOption) {
            // Fixed the error by not including 'session_id' directly in the assessment_responses insert
            const responseInsert = await supabase.from('assessment_responses').insert({
              assessment_id: assessmentId,
              level_number: level,
              question_id: question.id,
              meets_requirement: question.meetsRequirement,
              details: {
                ...question.details,
                selectedOption: question.selectedOption,
                score: question.score
              }
            });

            if (responseInsert.error) {
              throw responseInsert.error;
            }
          }
        }
      }

      // 3. Atualizar o ID da avaliação no state
      setAssessmentData(prev => ({
        ...prev,
        assessmentId
      }));

      // 4. Mark assessment as saved to allow viewing results
      setIsAssessmentSaved(true);

      toast({
        title: "Avaliação salva com sucesso!",
        description: "Suas respostas foram salvas no banco de dados."
      });
      
      // 5. Move to results tab now that assessment is saved
      setActiveTab("results");
      
    } catch (error: any) {
      console.error("Erro ao salvar avaliação:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar a avaliação."
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle the exit button click
  const handleExit = () => {
    if (window.confirm("Tem certeza que deseja sair? Suas respostas não salvas serão perdidas.")) {
      navigate('/');
    }
  };

  // Check if form is complete to enable save button
  const isFormComplete = () => {
    // Check respondent data
    const respondentComplete = 
      assessmentData.respondent.hasProjectExperience !== null && 
      assessmentData.respondent.isPharmaceutical !== null && 
      !!assessmentData.respondent.companySize &&
      !!assessmentData.respondent.state;
      
    if (!respondentComplete) return false;
    
    // Check all levels have all questions answered
    for (let level = 2; level <= 5; level++) {
      const allQuestionsAnswered = assessmentData.levels[level].questions.every(
        q => q.selectedOption !== undefined
      );
      if (!allQuestionsAnswered) return false;
    }
    
    return true;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {session && (
        <ResponseHistoryModal 
          open={showHistory} 
          onClose={() => setShowHistory(false)}
          sessionId={assessmentData.sessionId || ''}
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Autoavaliação de Maturidade em Gerenciamento de Projetos (MMGP)
        </h1>
        <div className="flex gap-2">
          {session && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowHistory(true)}
              title="Ver histórico de respostas"
            >
              <History className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={handleExit}
            title="Sair da avaliação"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        Este formulário avalia o nível de maturidade em gerenciamento de projetos da sua organização com base no modelo Prado-MMGP.
      </p>
      
      <ProgressBar progress={progress} />
      
      <div className="bg-white rounded-lg shadow-lg mt-6 overflow-hidden">
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
                onClick={() => setActiveTab("level2")} 
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
                onClick={() => setActiveTab("respondent")} 
                variant="outline"
              >
                Anterior
              </Button>
              <Button 
                onClick={() => setActiveTab("level3")}
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
                onClick={() => setActiveTab("level2")} 
                variant="outline"
              >
                Anterior
              </Button>
              <Button 
                onClick={() => setActiveTab("level4")}
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
                onClick={() => setActiveTab("level3")}
                variant="outline" 
              >
                Anterior
              </Button>
              <Button 
                onClick={() => setActiveTab("level5")}
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
                onClick={() => setActiveTab("level4")}
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
                onClick={() => setActiveTab("level5")}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={handleExit}
                variant="default"
              >
                Finalizar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssessmentForm;
