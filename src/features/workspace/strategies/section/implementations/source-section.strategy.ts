import { SourceService } from 'src/features/source/services/source.service';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export class SourceSectionStrategy implements SectionStrategy {
    async buildProps(tab: TabsStateElement) {
        const { source } = await SourceService.readById(tab.id!);

        if (!source) {
            return {
                title: Section.SOURCE
            };
        }

        return {
            title: source.title,
            source: source,
        };
    }
}
