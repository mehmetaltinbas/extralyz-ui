import type { TabsStateElement } from "src/features/workspace/features/tabs/store/tabs.slice";

export function computeTabKey(tab: TabsStateElement): string {
    return tab.id ? `${tab.section}:${tab.id}` : tab.section;
}
