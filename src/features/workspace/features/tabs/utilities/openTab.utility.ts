import {
    tabsActions,
    type TabsStateElement,
} from 'src/features/workspace/features/tabs/store/tabsSlice';
import type { AppDispatch } from 'src/store/store';

export function openTab(dispatch: AppDispatch, element: TabsStateElement) {
    dispatch(tabsActions.add({ element }));
}
