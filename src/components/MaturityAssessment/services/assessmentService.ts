
import { supabase } from '@/integrations/supabase/client';
import { AssessmentData } from '../types';

// Save individual responses to database as they're made
export const saveIndividualResponse = async (
  sessionId: string,
  type: string,
  key: string,
  value: any
) => {
  try {
    // Create a details object to store the extra information
    const details: any = {};
    
    // Add the response type and key to the details
    details.response_type = type;
    details.response_key = key;
    details.response_value = JSON.stringify(value);
    
    await supabase.from('assessment_responses').insert({
      session_id: sessionId,
      level_number: type === 'question' ? parseInt(key.split('_')[0]) : null,
      question_id: type === 'question' ? parseInt(key.split('_')[1]) : null,
      details: details
    });
  } catch (error) {
    console.error("Erro ao salvar resposta individual:", error);
  }
};

// Save the complete assessment to Supabase
export const saveAssessment = async (assessmentData: AssessmentData) => {
  try {
    // 1. Create the insert object first
    const insertData = {
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
    };

    console.log("Trying to insert assessment:", insertData);

    // 2. Insert into maturity_assessments
    const assessmentResponse = await supabase
      .from('maturity_assessments')
      .insert(insertData)
      .select()
      .single();

    if (assessmentResponse.error) {
      console.error("Error details:", assessmentResponse.error);
      throw assessmentResponse.error;
    }

    console.log("Assessment saved successfully:", assessmentResponse.data);
    const assessmentId = assessmentResponse.data.id;

    // 3. Save the responses for each level
    for (let level = 2; level <= 5; level++) {
      for (const question of assessmentData.levels[level].questions) {
        if (question.selectedOption) {
          const detailsObj = {
            ...question.details,
            selectedOption: question.selectedOption,
            score: question.score
          };
          
          const responseInsert = await supabase
            .from('assessment_responses')
            .insert({
              assessment_id: assessmentId,
              session_id: assessmentData.sessionId,
              level_number: level,
              question_id: question.id,
              meets_requirement: question.meetsRequirement,
              details: detailsObj
            });

          if (responseInsert.error) {
            console.error(`Error saving response for level ${level}, question ${question.id}:`, responseInsert.error);
          }
        }
      }
    }

    return assessmentId;
  } catch (error: any) {
    console.error("Erro ao salvar avaliação:", error);
    throw error;
  }
};
