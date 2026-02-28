import React, { useEffect, useRef, useState, type JSX, type ReactNode } from 'react';
import { selectSectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/select-section-builder-strategy';
import { ExerciseSetPracticePage } from 'src/features/exercise-set/pages/ExerciseSetPracticePage';
import { SourcePage } from 'src/features/source/pages/SourcePage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { SourcesPage } from 'src/features/source/pages/SourcesPage';
import { ExerciseSetsPage } from 'src/features/exercise-set/pages/ExerciseSetsPage';
import { ExerciseSetPage } from 'src/features/exercise-set/pages/ExerciseSetPage';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { layoutDimensionsActions } from 'src/features/workspace/store/layout-dimensions.slice';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabsSlice';

export function WorkspaceBody() {
    const dispatch = useAppDispatch();
    const tabs = useAppSelector((state) => state.tabs);
    const layoutDimensions = useAppSelector((state) => state.layoutDimensions);
    const [builtPropsRecord, setBuiltPropsRecord] = useState<
        Record<string, object | undefined>
    >({});
    // const [isPopUpActive, setIsPopUpActive] = useState<boolean>(false);
    const containerDiv = useRef<HTMLDivElement | null>(null);
    const componentsMap: Map<string, React.ComponentType<any>> = new Map([
        [Section.SOURCES, SourcesPage],
        [Section.SOURCE, SourcePage],
        [Section.EXERCISE_SETS, ExerciseSetsPage],
        [Section.EXERCISE_SET, ExerciseSetPage],
        [Section.EXERCISE_SET_PRACTICE, ExerciseSetPracticePage],
    ] as [string, React.ComponentType<any>][]);

    useEffect(() => {
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

    useEffect(() => {
        async function buildProps(tab: TabsStateElement) {
            const strategy = selectSectionBuilderStrategy(tab.section);
            let builtProps = {};
            if (strategy) {
                builtProps = await strategy.buildProps(tab);
            }
            return builtProps;
        }

        tabs.elements.forEach(async (tab, index) => {
            const builtProps = await buildProps(tab);
            setBuiltPropsRecord((prev) => ({
                ...prev,
                [String(tab.tabTitle)]: builtProps,
            }));
        });
    }, [tabs.elements]);

    return (
        <div
            ref={containerDiv}
            className={`relative z-0 w-[${layoutDimensions.mainColumn.width}px] h-[${layoutDimensions.mainColumn.height ? `${layoutDimensions.mainColumn.height * 0.9}px` : '90%'}] overflow-y-auto p-4
            flex-1 flex justify-center items-center`}
        >
            {tabs.elements?.map((element) => {
                const Component = componentsMap.get(element.section);
                let builtProps;
                let isActiveComponent: boolean = false;
                if (element.index === tabs.activeTabIndex) isActiveComponent = true;
                if (element.tabTitle) builtProps = builtPropsRecord[element.tabTitle];
                builtProps = {
                    ...builtProps,
                    className: `${isActiveComponent ? 'block' : 'hidden'}`,
                };
                return Component ? <Component key={element.tabTitle} {...builtProps} /> : null;
            })}
        </div>
    );
}
