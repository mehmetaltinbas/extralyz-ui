import type { TabDropSide } from "src/features/workspace/features/tabs/enums/tab-drop-side.enum";

export interface OnDragOverTab {
    index: number;
    side: TabDropSide;
}
