import { PublicSourceService } from 'src/features/source/services/public-source.service';
import { UserService } from 'src/features/user/services/user.service';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

export class PublicSourceSectionStrategy implements SectionStrategy {
    async buildProps(tab: TabsStateElement) {
        const { source } = await PublicSourceService.readPublicById(tab.id!);

        if (!source) {
            return {
                title: Section.PUBLIC_SOURCE,
                exists: false,
            };
        }

        const { user } = await UserService.readPublicById(source.userId);

        return {
            title: source.title,
            exists: true,
            source: source,
            ownerUserName: user?.userName,
        };
    }
}
