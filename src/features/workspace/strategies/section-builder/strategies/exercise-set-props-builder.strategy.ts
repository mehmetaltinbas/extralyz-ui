import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { exerciseService } from 'src/features/exercise/services/exercise.service';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { SectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/section-builder-strategy.interface';

export const ExerciseSetPropsBuilderStrategy: SectionBuilderStrategy = {
    buildProps: async (tab) => {
        const { exerciseSet } = await exerciseSetService.readById(tab.id!);
        const { exercises } = await exerciseService.readAllByExerciseSetId(tab.id!);

        if (!exerciseSet) {
            return {
                title: Section.EXERCISE_SET
            };
        }

        return {
            title: exerciseSet.title,
            exerciseSet: exerciseSet,
            exercises: exercises ?? [],
        };
    },
};
