import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TabsStateElement {
    index?: number;
    tabTitle?: string;
    section: string;
    id?: string;
    title?: string;
    mode?: string;
}

export interface TabsState {
    elements: TabsStateElement[];
    activeTabIndex: number;
}

const initialState: TabsState = {
    elements: [],
    activeTabIndex: -1,
};

const tabsSlice = createSlice({
    name: 'tabs',
    initialState,
    reducers: {
        add: (
            state,
            action: PayloadAction<{ element: TabsStateElement; newIndex?: number }>
        ) => {
            const payload = {
                element: { ...action.payload.element },
                newIndex: action.payload.newIndex,
            };

            if (!payload.element.tabTitle || payload.element.tabTitle.length === 0) {
                // giving a tabTitle if not existed in payload
                payload.element.tabTitle =
                    payload.element.mode && payload.element.mode.length > 0
                        ? `${payload.element.mode}: `
                        : '';
                payload.element.tabTitle +=
                    (payload.element.title && payload.element.title.length > 0) ||
                    (payload.element.id && payload.element.id.length > 0)
                        ? payload.element.title && payload.element.title.length > 0
                            ? payload.element.title
                            : payload.element.id
                        : payload.element.section;
            }

            if (
                !state.elements.some(
                    (element) => element.tabTitle === payload.element.tabTitle
                )
            ) {
                // if tabTitle doesn't match in one of state.elements array's elements'
                if (payload.newIndex || payload.newIndex === 0) {
                    // if newIndex is given
                    payload.element.index = payload.newIndex;
                    state.elements.splice(payload.newIndex, 0, payload.element);

                    for (let i = payload.newIndex + 1; i < state.elements.length; i++) {
                        state.elements[i].index!++;
                    }

                    state.activeTabIndex = payload.newIndex;
                } else {
                    // if newIndex isn't given
                    payload.element.index = state.elements.length;
                    state.elements.push(payload.element);
                    state.activeTabIndex = state.elements.length - 1;
                }
            } else if (
                state.elements.some((element) => element.tabTitle === payload.element.tabTitle)
            ) {
                // if tabTitle match in one of state.elements array's elements'
                if (payload.newIndex || payload.newIndex === 0) {
                    // if newIndex is given
                    const prevIndex = payload.element.index!;

                    if (prevIndex !== payload.newIndex) {
                        state.elements.splice(prevIndex, 1);

                        for (let i = prevIndex; i < state.elements.length; i++) {
                            state.elements[i].index!--;
                        }

                        payload.element.index = payload.newIndex;
                        state.elements.splice(payload.newIndex, 0, payload.element);

                        for (let i = payload.newIndex + 1; i < state.elements.length; i++) {
                            state.elements[i].index!++;
                        }
                    }

                    state.activeTabIndex = payload.newIndex;
                } else {
                    // if newIndex isn't given
                    const currentElement = state.elements.find(
                        (element) => element.tabTitle === payload.element.tabTitle
                    )!;

                    state.activeTabIndex = currentElement.index!;
                }
            }
        },
        subtract: (state, action: PayloadAction<number>) => {
            const indexToDelete = action.payload;

            state.elements = state.elements.filter(
                (element, index) => index !== indexToDelete
            );

            for (let i = indexToDelete; i < state.elements.length; i++) {
                state.elements[i].index!--;
            }

            const activeTab = state.elements.find(
                (element) => element.index! + 1 === state.activeTabIndex
            );

            if (activeTab && activeTab.index !== undefined) {
                if (indexToDelete < activeTab.index) {
                    state.activeTabIndex--;
                }
            }
        },
        changePosition: (state, action: PayloadAction<number>) => {},
        setActiveTabIndex: (state, action: PayloadAction<number>) => {
            const payload = action.payload;

            state.activeTabIndex = payload;
        },
    },
});

export const tabsActions = tabsSlice.actions;

export const tabsReducer = tabsSlice.reducer;
