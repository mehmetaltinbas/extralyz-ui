import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Section } from 'src/features/workspace/enums/section.enum';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import { findTabIndex } from 'src/features/workspace/features/tabs/store/utils/find-tab-index.util';

export interface TabsStateElement {
    section: Section;
    id?: string;
    title?: string;
    mode?: string;
    meta?: string;
}

export interface TabsState {
    elements: TabsStateElement[];
    activeTabIndex: number;
    propsInvalidatedTabIds: string[];
}

const STORAGE_KEY = 'tabs';

function loadPersistedTabs(): TabsState {
    const fallback: TabsState = { elements: [], activeTabIndex: -1, propsInvalidatedTabIds: [] };

    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) return fallback;

        const parsed = JSON.parse(raw);
        
        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            elements: parsed.elements ?? [],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            activeTabIndex: parsed.activeTabIndex ?? -1,
            propsInvalidatedTabIds: [],
        };
    } catch {
        return fallback;
    }
}

const initialState: TabsState = loadPersistedTabs();

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
                // 1. If it exists, remove it from its current position first
                const [existingTab] = state.elements.splice(existingIndex, 1);

                // 2. Adjust target index: if we removed an item from BEFORE the target, 
                // the target index shifted down by 1.
                const adjustedTargetIndex = existingIndex < atIndex ? atIndex - 1 : atIndex;

                // 3. Insert at the corrected position
                state.elements.splice(adjustedTargetIndex, 0, existingTab);
                state.activeTabIndex = adjustedTargetIndex;
            } else {
                // New tab logic: just insert it
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
