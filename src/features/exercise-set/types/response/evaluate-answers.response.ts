import type { ResponseBase } from 'src/shared/types/response-base';

export interface ExerciseAnswerEvaluationResult {
    exerciseId: string;
    exerciseType: string;
    userAnswer: string;
    solution: string;
    correctChoiceIndex: number;
    score: number;
    feedback: string;
}

export interface EvaluateAnswersResponse extends ResponseBase {
    overallScore?: number;
    exerciseAnswerEvaluationResults?: ExerciseAnswerEvaluationResult[];
}
