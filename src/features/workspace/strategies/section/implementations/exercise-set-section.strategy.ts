import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { ExerciseService } from 'src/features/exercise/services/exercise.service';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export class ExerciseSetSectionStrategy implements SectionStrategy {
    async buildProps(tab: TabsStateElement) {
        const { exerciseSet } = await ExerciseSetService.readById(tab.id!);
        const { exercises } = await ExerciseService.readAllByExerciseSetId(tab.id!);

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
    }
}
