import type { TabsStateElement } from "src/features/workspace/features/tabs/store/tabs.slice";
import { computeTabKey } from "src/features/workspace/features/tabs/store/utils/compute-tab-key.util";

export function findTabIndex(elements: TabsStateElement[], tab: TabsStateElement): number {
    const key = computeTabKey(tab);
    return elements.findIndex((el) => computeTabKey(el) === key);
}
