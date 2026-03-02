import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { exerciseService } from 'src/features/exercise/services/exercise.service';
import type { SectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/section-builder-strategy.interface';

export const ExerciseSetPropsBuilderStrategy: SectionBuilderStrategy = {
    buildProps: async (tab) => {
        const exerciseSetResponse = await exerciseSetService.readById(tab.id!);
        const exercisesResponse = await exerciseService.readAllByExerciseSetId(tab.id!);
        return {
            exerciseSet: exerciseSetResponse.exerciseSet,
            exercises: exercisesResponse.exercises!,
        };
    },
};
