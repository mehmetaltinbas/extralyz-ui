import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { BuildPropsResponse } from 'src/features/workspace/strategies/section/types/build-props.response';

export interface SectionStrategy {
    buildProps(tab: TabsStateElement): Promise<BuildPropsResponse>;
}
