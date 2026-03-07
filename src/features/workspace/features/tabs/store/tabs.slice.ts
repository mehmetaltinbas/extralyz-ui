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
        subtractByIndex: (state, action: PayloadAction<number>) => {
            const indexToDelete = action.payload;

            state.elements.splice(indexToDelete, 1);

            state.elements.forEach((el, i) => {
                el.index = i;
            });

            if (state.elements.length === 0) {
                state.activeTabIndex = -1;
            } else if (state.activeTabIndex === indexToDelete) {
                state.activeTabIndex = Math.max(0, indexToDelete - 1);
            } else if (state.activeTabIndex > indexToDelete) {
                state.activeTabIndex--;
            }
        },
        subtractById: (state, action: PayloadAction<string>) => {
            const idToDelete = action.payload;
            const indexToDelete = state.elements.findIndex(el => el.id === idToDelete);

            if (indexToDelete !== -1) {
                tabsSlice.caseReducers.subtractByIndex(state, { 
                    payload: indexToDelete, 
                    type: action.type 
                });
            }
        },
        setActiveTabIndex: (state, action: PayloadAction<number>) => {
            const payload = action.payload;

            state.activeTabIndex = payload;
        },
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
