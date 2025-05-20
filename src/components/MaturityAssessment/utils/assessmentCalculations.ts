
import { AssessmentData } from '../types';

// Calculate progress whenever assessment data changes
export const calculateProgress = (assessmentData: AssessmentData): number => {
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

// Calculate scores whenever answers change
export const calculateScores = (assessmentData: AssessmentData) => {
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

// Check if form is complete to enable save button
export const isFormComplete = (assessmentData: AssessmentData): boolean => {
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
