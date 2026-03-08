import { configureStore } from '@reduxjs/toolkit';
import { exerciseSetsReducer } from 'src/features/exercise-set/store/exercise-sets.slice';
import { sourcesReducer } from 'src/features/source/store/sources.slice';
import { userReducer } from 'src/features/user/store/user.slice';
import { tabsReducer } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { layoutDimensionsReducer } from 'src/features/workspace/store/layout-dimensions.slice';
import { sidebarReducer } from 'src/features/workspace/store/sidebar.slice';

export const store = configureStore({
    reducer: {
        tabs: tabsReducer,
        sidebar: sidebarReducer,
        layoutDimensions: layoutDimensionsReducer,
        sources: sourcesReducer,
        exerciseSets: exerciseSetsReducer,
        user: userReducer,
    },
});

let previousTabs = store.getState().tabs;

store.subscribe(() => {
    const currentTabs = store.getState().tabs;

    if (currentTabs === previousTabs) return;
    
    previousTabs = currentTabs;

    localStorage.setItem('tabs', JSON.stringify({
        elements: currentTabs.elements,
        activeTabIndex: currentTabs.activeTabIndex,
    }));
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

export default store;
