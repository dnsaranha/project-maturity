
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { levelQuestions } from '../questions';
import { AssessmentData } from '../types';
import { 
  calculateProgress, 
  calculateScores, 
  isFormComplete as checkFormComplete 
} from '../utils/assessmentCalculations';
import { 
  saveIndividualResponse, 
  saveAssessment as saveAssessmentToDb 
} from '../services/assessmentService';

export const useAssessmentData = () => {
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
    setProgress(calculateProgress(assessmentData));
  }, [assessmentData]);

  // Calculate scores whenever answers change
  useEffect(() => {
    const { levelScores, totalPoints, overall } = calculateScores(assessmentData);
    
    setAssessmentData(prev => ({
      ...prev,
      scores: levelScores,
      totalPoints,
      overallMaturity: overall
    }));
  }, [assessmentData.levels]);

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
    if (assessmentData.sessionId) {
      saveIndividualResponse(assessmentData.sessionId, 'respondent', field as string, value);
    }
  };

  // Handle question answer updates with options (a, b, c, d, e) and scores
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
    if (assessmentData.sessionId) {
      saveIndividualResponse(assessmentData.sessionId, 'question', `${level}_${questionId}`, { option, score });
    }
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
    if (assessmentData.sessionId) {
      saveIndividualResponse(assessmentData.sessionId, 'detail', `${level}_${questionId}_${field}`, value);
    }
  };

  // Save the complete assessment to Supabase
  const saveAssessment = async () => {
    try {
      // Call the service function to save assessment data
      const assessmentId = await saveAssessmentToDb(assessmentData);

      // Update the assessment ID in the state
      setAssessmentData(prev => ({
        ...prev,
        assessmentId
      }));

      // Mark assessment as saved to allow viewing results
      setIsAssessmentSaved(true);
      
      return true;
    } catch (error: any) {
      console.error("Erro ao salvar avaliação:", error);
      throw error;
    }
  };

  return {
    assessmentData,
    progress,
    isAssessmentSaved,
    setIsAssessmentSaved,
    updateRespondentData,
    updateQuestionAnswer,
    updateQuestionDetails,
    saveAssessment,
    isFormComplete: () => checkFormComplete(assessmentData)
  };
};
