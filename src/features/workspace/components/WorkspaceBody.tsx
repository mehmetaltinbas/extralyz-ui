import React from 'react';
import { ExerciseSetPage } from 'src/features/exercise-set/pages/ExerciseSetPage';
import { ExerciseSetPracticePage } from 'src/features/exercise-set/pages/ExerciseSetPracticePage';
import { ExerciseSetsPage } from 'src/features/exercise-set/pages/ExerciseSetsPage';
import { SourcePage } from 'src/features/source/pages/SourcePage';
import { SourcesPage } from 'src/features/source/pages/SourcesPage';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions, type TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import { layoutDimensionsActions } from 'src/features/workspace/store/layout-dimensions.slice';
import { selectSectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/select-section-builder-strategy';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

const SECTION_COMPONENTS: Record<Section, React.ComponentType<any>> = {
    [Section.SOURCES]: SourcesPage,
    [Section.SOURCE]: SourcePage,
    [Section.EXERCISE_SETS]: ExerciseSetsPage,
    [Section.EXERCISE_SET]: ExerciseSetPage,
    [Section.EXERCISE_SET_PRACTICE]: ExerciseSetPracticePage,
};

export function WorkspaceBody() {
    const dispatch = useAppDispatch();
    const tabs = useAppSelector((state) => state.tabs);
    const layoutDimensions = useAppSelector((state) => state.layoutDimensions);

    const [builtPropsRecord, setBuiltPropsRecord] = React.useState<
        Record<string, object | undefined>
    >({});
    const containerDiv = React.useRef<HTMLDivElement | null>(null);
    const buildingKeys = React.useRef<Set<string>>(new Set());

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

    React.useEffect(() => {
        const activeKeys = new Set(tabs.elements.map((tab) => computeTabKey(tab)));

        setBuiltPropsRecord((prev) => {
            const cleaned: Record<string, object | undefined> = {};

            for (const key of Object.keys(prev)) {
                if (activeKeys.has(key)) cleaned[key] = prev[key];
            }

            return cleaned;
        });

        for (const tab of tabs.elements) {
            const key = computeTabKey(tab);
            if (buildingKeys.current.has(key)) continue;

            setBuiltPropsRecord((prev) => {
                if (prev[key]) return prev;

                buildingKeys.current.add(key);
                buildProps(tab).then((builtProps) => {
                    setBuiltPropsRecord((p) => ({ ...p, [key]: builtProps }));
                    buildingKeys.current.delete(key);
                });

                return prev;
            });
        }
    }, [tabs.elements]);

    React.useEffect(() => {
        if (tabs.propsInvalidatedTabIds.length === 0) return;

        const invalidatedTabs: { tab: TabsStateElement; key: string }[] = [];

        for (const invalidatedId of tabs.propsInvalidatedTabIds) {
            const tab = tabs.elements.find((el) => el.id === invalidatedId);

            if (tab) {
                invalidatedTabs.push({ tab, key: computeTabKey(tab) });
            }
        }

        setBuiltPropsRecord((prev) => {
            const updated = { ...prev };

            for (const { key } of invalidatedTabs) {
                delete updated[key];
            }

            return updated;
        });

        for (const { tab, key } of invalidatedTabs) {
            buildProps(tab).then((builtProps) => {
                setBuiltPropsRecord((prev) => ({
                    ...prev,
                    [key]: builtProps,
                }));
            });
        }

        dispatch(tabsActions.clearPropsInvalidations());
    }, [tabs.propsInvalidatedTabIds]);

    return (
        <div
            ref={containerDiv}
            className={`relative z-0 w-[${layoutDimensions.mainColumn.width}px] h-[${layoutDimensions.mainColumn.height ? `${layoutDimensions.mainColumn.height * 0.9}px` : '90%'}] overflow-y-auto p-4
            flex-1 flex justify-center items-center`}
        >
            {tabs.elements?.map((element, index) => {
                const Component = SECTION_COMPONENTS[element.section];
                const key = computeTabKey(element);

                const isActiveComponent = index === tabs.activeTabIndex;
                const builtProps = builtPropsRecord[key];

                return Component && builtProps ? (
                    <Component
                        key={key}
                        {...builtProps}
                        className={isActiveComponent ? 'block' : 'hidden'}
                    />
                ) : (
                    <div key={key} className={isActiveComponent ? 'block w-full h-full' : 'hidden'}>
                        <LoadingPage />
                    </div>
                );
            })}
        </div>
    );
}
