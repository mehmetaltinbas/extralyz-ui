import { Section } from 'src/features/workspace/enums/section.enum';
import type { SectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/section-builder-strategy.interface';

export const ExerciseSetsPropsBuilderStrategy: SectionBuilderStrategy = {
    buildProps: async (tab) => {
        return {
            title: Section.EXERCISE_SETS
        };
    },
};
