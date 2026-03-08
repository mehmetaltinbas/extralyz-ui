import { sourceService } from 'src/features/source/services/source.service';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { SectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/section-builder-strategy.interface';

export const SourcePropsBuilderStrategy: SectionBuilderStrategy = {
    buildProps: async (tab) => {
        const { source } = await sourceService.readById(tab.id!);

        if (!source) {
            return {
                title: Section.SOURCE
            };
        }
        
        return {
            title: source.title,
            source: source,
        };
    },
};
