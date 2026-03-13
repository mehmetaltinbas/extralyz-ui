import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/exercise-type-strategy.interface";
import { McqExerciseTypeStrategy } from "src/features/exercise/strategies/implementations/mcq-exercise-type.strategy";
import { OpenEndedExerciseTypeStrategy } from "src/features/exercise/strategies/implementations/open-ended-exercise-type.strategy";
import { TrueFalseExerciseTypeStrategy } from "src/features/exercise/strategies/implementations/true-false-exercise-type.strategy";

const map: Map<ExerciseType, ExerciseTypeStrategy> = new Map([
    [McqExerciseTypeStrategy.type, McqExerciseTypeStrategy],
    [TrueFalseExerciseTypeStrategy.type, TrueFalseExerciseTypeStrategy],
    [OpenEndedExerciseTypeStrategy.type, OpenEndedExerciseTypeStrategy
    ]
]);

export function resolveExerciseTypeStrategy(
    type: ExerciseType
): ExerciseTypeStrategy | undefined {
    return map.get(type);
}
