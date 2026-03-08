import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Section } from 'src/features/workspace/enums/section.enum';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import { findTabIndex } from 'src/features/workspace/features/tabs/store/utils/find-tab-index.util';

export interface TabsStateElement {
    section: Section;
    id?: string;
    title?: string;
    mode?: string;
}

export interface TabsState {
    elements: TabsStateElement[];
    activeTabIndex: number;
    propsInvalidatedTabIds: string[];
}

const initialState: TabsState = {
    elements: [],
    activeTabIndex: -1,
    propsInvalidatedTabIds: [],
};

const tabsSlice = createSlice({
    name: 'tabs',
    initialState,
    reducers: {
        /**
         * Open or focus existing tab
         */
        openTab: (state, action: PayloadAction<TabsStateElement>) => {
            const tab = action.payload;
            const existingIndex = findTabIndex(state.elements, tab);

            if (existingIndex !== -1) {
                state.activeTabIndex = existingIndex;
            } else {
                state.elements.push(tab);
                state.activeTabIndex = state.elements.length - 1;
            }
        },
        /**
         * Insert at position (sidebar drag)
         */
        insertTab: (
            state,
            action: PayloadAction<{ tab: TabsStateElement; atIndex: number }>
        ) => {
            const { tab, atIndex } = action.payload;
            const existingIndex = findTabIndex(state.elements, tab);

            if (existingIndex !== -1) {
                state.activeTabIndex = existingIndex;
            } else {
                state.elements.splice(atIndex, 0, tab);
                state.activeTabIndex = atIndex;
            }
        },
        /**
         * Reorder existing tab
         */
        moveTab: (
            state,
            action: PayloadAction<{ fromIndex: number; toIndex: number }>
        ) => {
            const { fromIndex, toIndex } = action.payload;

            if (fromIndex === toIndex) {
                state.activeTabIndex = toIndex;
                return;
            }

            const [tab] = state.elements.splice(fromIndex, 1);
            state.elements.splice(toIndex, 0, tab);
            state.activeTabIndex = toIndex;
        },
        closeTab: (state, action: PayloadAction<number>) => {
            const indexToDelete = action.payload;

            state.elements.splice(indexToDelete, 1);

            if (state.elements.length === 0) {
                state.activeTabIndex = -1;
            } else if (state.activeTabIndex === indexToDelete) {
                state.activeTabIndex = Math.max(0, indexToDelete - 1);
            } else if (state.activeTabIndex > indexToDelete) {
                state.activeTabIndex--;
            }
        },
        closeTabById: (state, action: PayloadAction<string>) => {
            const idToDelete = action.payload;
            const indexToDelete = state.elements.findIndex(el => el.id === idToDelete);

            if (indexToDelete !== -1) {
                tabsSlice.caseReducers.closeTab(state, {
                    payload: indexToDelete,
                    type: action.type,
                });
            }
        },
        setActiveTabIndex: (state, action: PayloadAction<number>) => {
            state.activeTabIndex = action.payload;
        },
        setTitle: (state, action: PayloadAction<{ key: string; title: string; }>) => {
            const { key, title } = action.payload;

            const element = state.elements.find((element) => computeTabKey(element) === key);

            if (element) {
                element.title = title;
            }
        },
        /**
         * Mark a tab's cached props as stale so WorkspaceBody rebuilds them.
         * Used when an external operation (e.g. transferring an exercise between sets)
         * changes data that an already open tab depends on.
         */
        invalidateTabPropsById: (state, action: PayloadAction<string>) => {
            state.propsInvalidatedTabIds.push(action.payload);
        },
        clearPropsInvalidations: (state) => {
            state.propsInvalidatedTabIds = [];
        },
    },
});

export const tabsActions = tabsSlice.actions;

export const tabsReducer = tabsSlice.reducer;
