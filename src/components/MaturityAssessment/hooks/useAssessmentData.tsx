
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { levelQuestions } from '../questions';
import { supabase } from '@/integrations/supabase/client';
import { AssessmentData } from '../AssessmentForm';

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
    const calculateProgress = () => {
      let answered = 0;
      let total = 0;
      
      // Count respondent section (4 questions)
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
      // Create a details object to store the extra information
      const details: any = {};
      
      // Add the response type and key to the details
      details.response_type = type;
      details.response_key = key;
      details.response_value = JSON.stringify(value);
      
      await supabase.from('assessment_responses').insert({
        session_id: assessmentData.sessionId,
        level_number: type === 'question' ? parseInt(key.split('_')[0]) : null,
        question_id: type === 'question' ? parseInt(key.split('_')[1]) : null,
        details: details
      });
    } catch (error) {
      console.error("Erro ao salvar resposta individual:", error);
    }
  };

  // Save the complete assessment to Supabase
  const saveAssessment = async () => {
    try {
      // 1. Save the main assessment
      const assessmentResponse = await supabase.from('maturity_assessments').insert({
        session_id: assessmentData.sessionId, // Add session_id to the maturity_assessments table
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

      // 2. Save the responses for each level in a consolidated way
      for (let level = 2; level <= 5; level++) {
        for (const question of assessmentData.levels[level].questions) {
          if (question.selectedOption) {
            const detailsObj = {
              ...question.details,
              selectedOption: question.selectedOption,
              score: question.score
            };
            
            const responseInsert = await supabase.from('assessment_responses').insert({
              assessment_id: assessmentId,
              session_id: assessmentData.sessionId, // Ensure session_id is included
              level_number: level,
              question_id: question.id,
              meets_requirement: question.meetsRequirement,
              details: detailsObj
            });

            if (responseInsert.error) {
              throw responseInsert.error;
            }
          }
        }
      }

      // 3. Update the assessment ID in the state
      setAssessmentData(prev => ({
        ...prev,
        assessmentId
      }));

      // 4. Mark assessment as saved to allow viewing results
      setIsAssessmentSaved(true);
      
      return true;
    } catch (error: any) {
      console.error("Erro ao salvar avaliação:", error);
      throw error;
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

  return {
    assessmentData,
    progress,
    isAssessmentSaved,
    setIsAssessmentSaved,
    updateRespondentData,
    updateQuestionAnswer,
    updateQuestionDetails,
    saveAssessment,
    isFormComplete
  };
};
