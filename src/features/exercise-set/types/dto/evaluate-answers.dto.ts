export interface EvaluateAnswersDto {
    exercises: {
        id: string;
        answer?: string;
    }[];
}
