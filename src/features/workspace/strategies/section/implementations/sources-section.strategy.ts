import { Section } from 'src/features/workspace/enums/section.enum';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export class SourcesSectionStrategy implements SectionStrategy {
    async buildProps(tab) {
        return {
            title: Section.SOURCES
        };
    }
}
