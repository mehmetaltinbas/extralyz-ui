import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface ExerciseAnswerEvaluationResult {
    exerciseId: string;
    exerciseType: string;
    correctChoiceIndex?: number;
    solution?: string;
    score: number;
    feedback: string;
    userAnswer: string; // if type is mcq or trueFalse, can be safely converted to number because then it indicates user's chosen index
}

export interface EvaluateAnswersResponse extends ResponseBase {
    overallScore?: number;
    exerciseAnswerEvaluationResults?: ExerciseAnswerEvaluationResult[];
}
