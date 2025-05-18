
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
import { useAuth } from '@/context/AuthProvider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-mobile';

// Define assessment data structure
export interface AssessmentData {
  respondent: {
    hasProjectExperience: boolean | null;
    isPharmaceutical: boolean | null;
    pharmaceuticalType: string;
    companySize: string;
  };
  levels: {
    [key: number]: {
      questions: {
        id: number;
        meetsRequirement: boolean | null;
        details: {
          [key: string]: string;
        };
      }[];
    };
  };
  scores: {
    [key: number]: number;
  };
  overallMaturity: number;
  assessmentId?: string;
}

const AssessmentForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeTab, setActiveTab] = useState("respondent");
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    respondent: {
      hasProjectExperience: null,
      isPharmaceutical: null,
      pharmaceuticalType: "",
      companySize: "",
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
    overallMaturity: 0
  });
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  // Verifica se o usuário está autenticado e redireciona para login se não estiver
  useEffect(() => {
    if (!user && !openLoginDialog) {
      setOpenLoginDialog(true);
    }
  }, [user]);

  // Initialize questions from the predefined data
  useEffect(() => {
    const initializedLevels = { ...assessmentData.levels };
    
    // For each level (2-5), initialize questions
    for (let level = 2; level <= 5; level++) {
      initializedLevels[level] = {
        questions: levelQuestions[level].map(q => ({
          id: q.id,
          meetsRequirement: null,
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
      
      // Count respondent section (3 questions)
      if (assessmentData.respondent.hasProjectExperience !== null) answered++;
      if (assessmentData.respondent.isPharmaceutical !== null) answered++;
      if (assessmentData.respondent.companySize) answered++;
      total += 3;
      
      // Count questions from each level
      for (let level = 2; level <= 5; level++) {
        assessmentData.levels[level].questions.forEach(q => {
          if (q.meetsRequirement !== null) answered++;
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
        const answeredQuestions = levelQuestions.filter(q => q.meetsRequirement !== null);
        
        if (answeredQuestions.length > 0) {
          const metRequirements = levelQuestions.filter(q => q.meetsRequirement === true).length;
          scores[level] = (metRequirements / 10) * 100; // Scale to percentage (0-100)
        }
      }
      
      // Calculate overall maturity (weighted average)
      let overallMaturity = 0;
      if (Object.values(scores).some(score => score > 0)) {
        const weightedSum = scores[2] * 0.2 + scores[3] * 0.3 + scores[4] * 0.3 + scores[5] * 0.2;
        overallMaturity = weightedSum / 100 * 5; // Scale to 0-5
      }
      
      return {
        levelScores: scores,
        overall: parseFloat(overallMaturity.toFixed(2))
      };
    };
    
    const { levelScores, overall } = calculateScores();
    
    setAssessmentData(prev => ({
      ...prev,
      scores: levelScores,
      overallMaturity: overall
    }));
  }, [assessmentData.levels]);

  // Redirecionar para a página de consentimento ou de login se o usuário não estiver autenticado
  const handleAuthRequired = () => {
    navigate('/');
    setOpenLoginDialog(false);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
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
  };

  // Handle question answer updates
  const updateQuestionAnswer = (level: number, questionId: number, meetsRequirement: boolean) => {
    setAssessmentData(prev => {
      const updatedLevels = { ...prev.levels };
      
      const questionIndex = updatedLevels[level].questions.findIndex(q => q.id === questionId);
      
      if (questionIndex !== -1) {
        updatedLevels[level].questions[questionIndex] = {
          ...updatedLevels[level].questions[questionIndex],
          meetsRequirement
        };
      }
      
      return {
        ...prev,
        levels: updatedLevels
      };
    });
  };

  // Handle question details updates
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
  };

  // Função para salvar a avaliação no Supabase
  const saveAssessment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Você precisa estar logado para salvar a avaliação."
      });
      setOpenLoginDialog(true);
      return;
    }

    try {
      setSaving(true);

      // 1. Salvar a avaliação principal
      const assessmentResponse = await supabase.from('maturity_assessments').insert({
        respondent_id: user.id,
        has_project_experience: assessmentData.respondent.hasProjectExperience,
        is_pharmaceutical: assessmentData.respondent.isPharmaceutical,
        pharmaceutical_type: assessmentData.respondent.pharmaceuticalType,
        company_size: assessmentData.respondent.companySize,
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

      // 2. Salvar as respostas para cada nível
      for (let level = 2; level <= 5; level++) {
        for (const question of assessmentData.levels[level].questions) {
          if (question.meetsRequirement !== null) {
            const responseInsert = await supabase.from('assessment_responses').insert({
              assessment_id: assessmentId,
              level_number: level,
              question_id: question.id,
              meets_requirement: question.meetsRequirement,
              details: question.details
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

      toast({
        title: "Avaliação salva com sucesso!",
        description: "Suas respostas foram salvas no banco de dados."
      });
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

  // Renderiza o diálogo de login
  const LoginDialogComponent = () => {
    if (isDesktop) {
      return (
        <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Autenticação Necessária</DialogTitle>
              <DialogDescription>
                Para continuar com a avaliação de maturidade, é necessário estar autenticado.
                Por favor, faça login para continuar.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleAuthRequired}>Entendi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
    
    return (
      <Drawer open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Autenticação Necessária</DrawerTitle>
            <DrawerDescription>
              Para continuar com a avaliação de maturidade, é necessário estar autenticado.
              Por favor, faça login para continuar.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleAuthRequired}>Entendi</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <LoginDialogComponent />

      <h1 className="text-3xl font-bold text-center mb-6">
        Autoavaliação de Maturidade em Gerenciamento de Projetos (MMGP)
      </h1>
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
            <TabsTrigger value="results" className="font-medium">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="respondent" className="p-6">
            <RespondentSection 
              respondentData={assessmentData.respondent} 
              updateRespondentData={updateRespondentData}
            />
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setActiveTab("level2")} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Próximo
              </button>
            </div>
          </TabsContent>

          <TabsContent value="level2" className="p-6">
            <LevelSection 
              level={2}
              title="Nível 2 - Conhecido (Iniciativas Isoladas)"
              questions={levelQuestions[2]}
              answers={assessmentData.levels[2].questions}
              updateQuestionAnswer={(questionId, meets) => updateQuestionAnswer(2, questionId, meets)}
              updateQuestionDetails={(questionId, field, value) => updateQuestionDetails(2, questionId, field, value)}
            />
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setActiveTab("respondent")} 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Anterior
              </button>
              <button 
                onClick={() => setActiveTab("level3")} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Próximo
              </button>
            </div>
          </TabsContent>

          <TabsContent value="level3" className="p-6">
            <LevelSection 
              level={3}
              title="Nível 3 - Padronizado"
              questions={levelQuestions[3]}
              answers={assessmentData.levels[3].questions}
              updateQuestionAnswer={(questionId, meets) => updateQuestionAnswer(3, questionId, meets)}
              updateQuestionDetails={(questionId, field, value) => updateQuestionDetails(3, questionId, field, value)}
            />
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setActiveTab("level2")} 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Anterior
              </button>
              <button 
                onClick={() => setActiveTab("level4")} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Próximo
              </button>
            </div>
          </TabsContent>

          <TabsContent value="level4" className="p-6">
            <LevelSection 
              level={4}
              title="Nível 4 - Gerenciado"
              questions={levelQuestions[4]}
              answers={assessmentData.levels[4].questions}
              updateQuestionAnswer={(questionId, meets) => updateQuestionAnswer(4, questionId, meets)}
              updateQuestionDetails={(questionId, field, value) => updateQuestionDetails(4, questionId, field, value)}
            />
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setActiveTab("level3")} 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Anterior
              </button>
              <button 
                onClick={() => setActiveTab("level5")} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Próximo
              </button>
            </div>
          </TabsContent>

          <TabsContent value="level5" className="p-6">
            <LevelSection 
              level={5}
              title="Nível 5 - Otimizado"
              questions={levelQuestions[5]}
              answers={assessmentData.levels[5].questions}
              updateQuestionAnswer={(questionId, meets) => updateQuestionAnswer(5, questionId, meets)}
              updateQuestionDetails={(questionId, field, value) => updateQuestionDetails(5, questionId, field, value)}
            />
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setActiveTab("level4")} 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Anterior
              </button>
              <button 
                onClick={() => setActiveTab("results")} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ver Resultados
              </button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="p-6">
            <ResultsSection 
              scores={assessmentData.scores}
              overallMaturity={assessmentData.overallMaturity}
            />
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setActiveTab("level5")} 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Anterior
              </button>
              <Button
                onClick={saveAssessment}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? 'Salvando...' : 'Salvar Avaliação'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssessmentForm;
