import React from 'react';
import { ExerciseSetPage } from 'src/features/exercise-set/pages/ExerciseSetPage';
import { ExerciseSetPracticePage } from 'src/features/exercise-set/pages/ExerciseSetPracticePage';
import { ExerciseSetsPage } from 'src/features/exercise-set/pages/ExerciseSetsPage';
import { SourcePage } from 'src/features/source/pages/SourcePage';
import { SourcesPage } from 'src/features/source/pages/SourcesPage';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions, type TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { layoutDimensionsActions } from 'src/features/workspace/store/layout-dimensions.slice';
import { selectSectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/select-section-builder-strategy';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function WorkspaceBody() {
    const dispatch = useAppDispatch();
    const tabs = useAppSelector((state) => state.tabs);
    const layoutDimensions = useAppSelector((state) => state.layoutDimensions);

    const [builtPropsRecord, setBuiltPropsRecord] = React.useState<
        Record<string, object | undefined>
    >({});
    // const [isPopUpActive, setIsPopUpActive] = useState<boolean>(false);
    const containerDiv = React.useRef<HTMLDivElement | null>(null);
    const componentsMap: Map<string, React.ComponentType<any>> = new Map([
        [Section.SOURCES, SourcesPage],
        [Section.SOURCE, SourcePage],
        [Section.EXERCISE_SETS, ExerciseSetsPage],
        [Section.EXERCISE_SET, ExerciseSetPage],
        [Section.EXERCISE_SET_PRACTICE, ExerciseSetPracticePage],
    ] as [string, React.ComponentType<any>][]);

    React.useEffect(() => {
        if (!containerDiv.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newHeight = entry.contentRect.height;

                dispatch(
                    layoutDimensionsActions.updateDimension({
                        layout: 'mainColumn',
                        dimension: 'height',
                        value: newHeight,
                    })
                );
            }
        });

        observer.observe(containerDiv.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    async function buildProps(tab: TabsStateElement) {
        const strategy = selectSectionBuilderStrategy(tab.section);

        let builtProps = {};

        if (strategy) {
            builtProps = await strategy.buildProps(tab);
        }

        return builtProps;
    }

    /**
     * building props for new tab
     * clearing orphaned props
     */
    React.useEffect(() => { // building props for new tab
        const activeTabTitles = new Set(tabs.elements.map((tab) => String(tab.tabTitle)));

        setBuiltPropsRecord((prev) => {
            const cleaned: Record<string, object | undefined> = {};

            for (const key of Object.keys(prev)) {
                if (activeTabTitles.has(key)) cleaned[key] = prev[key];
            }

            return cleaned;
        });

        tabs.elements.forEach(async (tab) => {
            if (builtPropsRecord[String(tab.tabTitle)]) return;

            const builtProps = await buildProps(tab);

            setBuiltPropsRecord((prev) => ({
                ...prev,
                [String(tab.tabTitle)]: builtProps,
            }));
        });
    }, [tabs.elements]);

    React.useEffect(() => { // refreshing invalidated tabs (an operation happened that changes the content of tab that is determined as invalidated)
        if (tabs.propsInvalidatedTabIds.length === 0) return;

        // compute invalidated tabs outside the setState updater
        const invalidatedTabs: TabsStateElement[] = [];

        for (const invalidatedId of tabs.propsInvalidatedTabIds) {
            const tab = tabs.elements.find((el) => el.id === invalidatedId);

            if (tab?.tabTitle) {
                invalidatedTabs.push(tab);
            }
        }

        // delete old props
        setBuiltPropsRecord((prev) => {
            const updated = { ...prev };

            for (const tab of invalidatedTabs) {
                delete updated[tab.tabTitle!];
            }

            return updated;
        });

        // rebuild props for invalidated tabs
        invalidatedTabs.forEach(async (tab) => {
            const builtProps = await buildProps(tab);

            setBuiltPropsRecord((prev) => ({
                ...prev,
                [String(tab.tabTitle)]: builtProps,
            }));
        });

        dispatch(tabsActions.clearPropsInvalidations());
    }, [tabs.propsInvalidatedTabIds]);

    return (
        <div
            ref={containerDiv}
            className={`relative z-0 w-[${layoutDimensions.mainColumn.width}px] h-[${layoutDimensions.mainColumn.height ? `${layoutDimensions.mainColumn.height * 0.9}px` : '90%'}] overflow-y-auto p-4
            flex-1 flex justify-center items-center`}
        >
            {tabs.elements?.map((element) => {
                const Component = componentsMap.get(element.section);

                const isActiveComponent = element.index === tabs.activeTabIndex ? true : false;
                const builtProps = element.tabTitle ? builtPropsRecord[element.tabTitle] : undefined;

                return Component && builtProps ? (
                    <Component
                        key={element.tabTitle}
                        {...builtProps}
                        className={isActiveComponent ? 'block' : 'hidden'}
                    />
                ) : (
                    <div key={element.tabTitle} className={isActiveComponent ? 'block w-full h-full' : 'hidden'}>
                        <LoadingPage />
                    </div>
                );
            })}
        </div>
    );
}
