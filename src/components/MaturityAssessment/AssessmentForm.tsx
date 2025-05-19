
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthProvider';
import { useAssessmentData } from './hooks/useAssessmentData';
import ProgressBar from './ProgressBar';
import ResponseHistoryModal from './ResponseHistoryModal';
import AssessmentHeader from './AssessmentHeader';
import AssessmentTabs from './AssessmentTabs';

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
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Use the custom hook to manage assessment data
  const {
    assessmentData,
    progress,
    isAssessmentSaved,
    setIsAssessmentSaved,
    updateRespondentData,
    updateQuestionAnswer,
    updateQuestionDetails,
    saveAssessment,
    isFormComplete
  } = useAssessmentData();

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

  // Handle the save assessment action
  const handleSaveAssessment = async () => {
    try {
      setSaving(true);
      await saveAssessment();
      
      toast({
        title: "Avaliação salva com sucesso!",
        description: "Suas respostas foram salvas no banco de dados."
      });
      
      // Move to results tab now that assessment is saved
      setActiveTab("results");
      
    } catch (error: any) {
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {session && (
        <ResponseHistoryModal 
          open={showHistory} 
          onClose={() => setShowHistory(false)}
          sessionId={assessmentData.sessionId || ''}
        />
      )}
      
      <AssessmentHeader 
        session={session}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        handleExit={handleExit}
      />
      
      <ProgressBar progress={progress} />
      
      <div className="bg-white rounded-lg shadow-lg mt-6 overflow-hidden">
        <AssessmentTabs 
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          assessmentData={assessmentData}
          updateRespondentData={updateRespondentData}
          updateQuestionAnswer={updateQuestionAnswer}
          updateQuestionDetails={updateQuestionDetails}
          saving={saving}
          saveAssessment={handleSaveAssessment}
          isFormComplete={isFormComplete}
          isAssessmentSaved={isAssessmentSaved}
        />
      </div>
    </div>
  );
};

export default AssessmentForm;
