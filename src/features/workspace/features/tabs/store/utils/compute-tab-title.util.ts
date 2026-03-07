import type { TabsStateElement } from "src/features/workspace/features/tabs/store/tabs.slice";

export function computeTabTitle(tab: TabsStateElement): string {
    let title = tab.mode && tab.mode.length > 0 ? `${tab.mode}: ` : '';

    if (tab.title && tab.title.length > 0) {
        title += tab.title;
    } else if (tab.id && tab.id.length > 0) {
        title += tab.id;
    } else {
        title += tab.section;
    }

    return title;
}
