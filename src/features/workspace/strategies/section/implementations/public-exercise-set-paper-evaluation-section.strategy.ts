import { PublicExerciseSetService } from 'src/features/exercise-set/services/public-exercise-set.service';
import { PublicExerciseService } from 'src/features/exercise/services/public-exercise.service';
import { UserService } from 'src/features/user/services/user.service';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export class PublicExerciseSetPaperEvaluationSectionStrategy implements SectionStrategy {
    async buildProps(tab: TabsStateElement) {
        const { exerciseSet } = await PublicExerciseSetService.readPublicById(tab.id!);

        if (!exerciseSet) {
            return {
                title: Section.PUBLIC_EXERCISE_SET_PAPER_EVALUATION,
                exists: false,
            };
        }

        const { exercises } = await PublicExerciseService.readAllPublicByExerciseSetId(tab.id!);
        const { user } = await UserService.readPublicById(exerciseSet.userId);

        return {
            title: exerciseSet.title,
            exists: true,
            exerciseSet: exerciseSet,
            exercises: exercises ?? [],
            ownerUserName: user?.userName,
        };
    }
}
