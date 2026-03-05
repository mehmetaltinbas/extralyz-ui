import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';

export interface SectionBuilderStrategy {
    buildProps(tab: TabsStateElement): Promise<object>;

    // buildPopUpComponents(): Promise<React.ReactNode[]>;
}
