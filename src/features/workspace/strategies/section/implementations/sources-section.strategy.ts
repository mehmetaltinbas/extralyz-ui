import { Section } from 'src/features/workspace/enums/section.enum';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export const SourcesSectionStrategy: SectionStrategy = {
    buildProps: async (tab) => {
        return {
            title: Section.SOURCES
        };
    },
};
