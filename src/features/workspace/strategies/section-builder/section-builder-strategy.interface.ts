import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { BuildPropsResponse } from 'src/features/workspace/strategies/section-builder/build-props.response';

export interface SectionBuilderStrategy {
    buildProps(tab: TabsStateElement): Promise<BuildPropsResponse>;
}
