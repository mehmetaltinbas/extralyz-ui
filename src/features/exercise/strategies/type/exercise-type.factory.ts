import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/type/exercise-type-strategy.interface";
import { MultipleChoiceExerciseTypeStrategy } from "src/features/exercise/strategies/type/implementations/multiple-choice-exercise-type.strategy";
import { OpenEndedExerciseTypeStrategy } from "src/features/exercise/strategies/type/implementations/open-ended-exercise-type.strategy";
import { TrueFalseExerciseTypeStrategy } from "src/features/exercise/strategies/type/implementations/true-false-exercise-type.strategy";
import type { StrategyFactory } from "src/shared/types/strategy-factory.interface";

const map: Map<ExerciseType, ExerciseTypeStrategy> = new Map([
    [ExerciseType.MULTIPLE_CHOICE, new MultipleChoiceExerciseTypeStrategy()],
    [ExerciseType.TRUE_FALSE, new TrueFalseExerciseTypeStrategy()],
    [ExerciseType.OPEN_ENDED, new OpenEndedExerciseTypeStrategy()],
]);

export const exerciseTypeFactory: StrategyFactory<ExerciseType, ExerciseTypeStrategy> = {
    resolveStrategy: function (kind: ExerciseType): ExerciseTypeStrategy | undefined {
        return map.get(kind);
    }
};
