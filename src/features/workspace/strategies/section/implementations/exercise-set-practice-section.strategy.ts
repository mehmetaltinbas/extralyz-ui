import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { ExerciseService } from 'src/features/exercise/services/exercise.service';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export class ExerciseSetPracticeSectionStrategy implements SectionStrategy {
    async buildProps(tab: TabsStateElement) {
        const { exerciseSet } = await ExerciseSetService.readById(tab.id!);
        const { exercises } = await ExerciseService.readAllByExerciseSetId(tab.id!);

        let processedExercises = exercises ?? [];

        if (tab.mode === ExerciseSetMode.SHUFFLE_PRACTICE) {
            processedExercises = [...processedExercises];

            for (let i = processedExercises.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [processedExercises[i], processedExercises[j]] = [processedExercises[j], processedExercises[i]];
            }
        }

        if (!exerciseSet) {
            return {
                title: Section.EXERCISE_SET
            };
        }

        return {
            title: exerciseSet.title,
            exerciseSet: exerciseSet,
            exercises:  processedExercises,
            shuffleChoices: tab.mode === ExerciseSetMode.SHUFFLE_PRACTICE,
        };
    }
}
