import { Section } from 'src/features/workspace/enums/section.enum';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export class ExerciseSetsSectionStrategy implements SectionStrategy {
    async buildProps(tab: TabsStateElement) {
        return {
            title: Section.EXERCISE_SETS
        };
    }
}
