import type { AppDispatch } from 'src/store/store';
import {
    tabsActions,
    type TabsStateElement,
} from 'src/features/workspace/features/tabs/store/tabsSlice';

export function openTab(dispatch: AppDispatch, element: TabsStateElement) {
    dispatch(tabsActions.add({ element }));
}
