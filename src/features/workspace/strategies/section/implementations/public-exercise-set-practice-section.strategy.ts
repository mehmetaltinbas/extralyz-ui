import { ExerciseSetMode } from 'src/features/exercise-set/enums/exercise-set-mode.enum';
import { PublicExerciseSetService } from 'src/features/exercise-set/services/public-exercise-set.service';
import { PublicExerciseService } from 'src/features/exercise/services/public-exercise.service';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export class PublicExerciseSetPracticeSectionStrategy implements SectionStrategy {
    async buildProps(tab: TabsStateElement) {
        const { exerciseSet } = await PublicExerciseSetService.readPublicById(tab.id!);

        if (!exerciseSet) {
            return {
                title: Section.PUBLIC_EXERCISE_SET_PRACTICE,
                exists: false,
            };
        }

        const { exercises } = await PublicExerciseService.readAllPublicByExerciseSetId(tab.id!);

        let processedExercises = exercises ?? [];

        if (tab.mode === ExerciseSetMode.SHUFFLE_PRACTICE) {
            processedExercises = [...processedExercises];

            for (let i = processedExercises.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [processedExercises[i], processedExercises[j]] = [processedExercises[j], processedExercises[i]];
            }
        }

        return {
            title: exerciseSet.title,
            exists: true,
            exerciseSet: exerciseSet,
            exercises: processedExercises,
            shuffleChoices: tab.mode === ExerciseSetMode.SHUFFLE_PRACTICE,
            mode: tab.mode,
        };
    }
}
