import type { ExerciseSetVisibility } from "src/features/exercise-set/enums/exercise-set-visibility.enum";

export interface ExerciseSet {
    _id: string;
    userId: string;
    sourceType: string;
    sourceId: string;
    type: string;
    difficulty: string;
    count: number;
    title: string;
    visibility: ExerciseSetVisibility;
}
