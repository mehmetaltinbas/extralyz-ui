import { configureStore } from '@reduxjs/toolkit';
import { exerciseSetsReducer } from 'src/features/exercise-set/store/exercise-sets.slice';
import { exerciseSetGroupsReducer } from 'src/features/exercise-set-group/store/exercise-set-groups.slice';
import { fetchPaymentMethodsData } from 'src/features/payment-method/store/fetch-payment-methods-data.thunk';
import { paymentMethodReducer } from 'src/features/payment-method/store/payment-method.slice';
import { sourcesReducer } from 'src/features/source/store/sources.slice';
import { fetchSubscriptionData } from 'src/features/subscription/store/fetch-subscription-data.thunk';
import { subscriptionReducer } from 'src/features/subscription/store/subscription.slice';
import { fetchUserData } from 'src/features/user/store/fetch-user-data.thunk';
import { userReducer } from 'src/features/user/store/user.slice';
import { tabsReducer } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { layoutDimensionsReducer } from 'src/features/workspace/store/layout-dimensions.slice';
import { sidebarReducer } from 'src/features/workspace/store/sidebar.slice';
import { themeReducer } from 'src/store/theme.slice';

export const store = configureStore({
    reducer: {
        tabs: tabsReducer,
        sidebar: sidebarReducer,
        layoutDimensions: layoutDimensionsReducer,
        sources: sourcesReducer,
        exerciseSets: exerciseSetsReducer,
        exerciseSetGroups: exerciseSetGroupsReducer,
        user: userReducer,
        subscription: subscriptionReducer,
        paymentMethod: paymentMethodReducer,
        theme: themeReducer,
    },
});

let previousTabs = store.getState().tabs;

store.subscribe(() => {
    const currentTabs = store.getState().tabs;

    if (currentTabs === previousTabs) return;

    previousTabs = currentTabs;

    const userId = store.getState().user?._id;

    if (!userId) return;

    localStorage.setItem(`tabs:${userId}`, JSON.stringify({
        elements: currentTabs.elements,
        activeTabIndex: currentTabs.activeTabIndex,
    }));
});

let previousTheme = store.getState().theme.mode;

store.subscribe(() => {
    const currentTheme = store.getState().theme.mode;

    if (currentTheme === previousTheme) return;

    previousTheme = currentTheme;

    localStorage.setItem('theme', currentTheme);

    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

store.dispatch(fetchUserData());
store.dispatch(fetchSubscriptionData());
store.dispatch(fetchPaymentMethodsData());

export default store;
