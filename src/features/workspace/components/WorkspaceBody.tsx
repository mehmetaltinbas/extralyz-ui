import React from 'react';
import { TabPortalWrapper } from 'src/features/workspace/components/TabPortalWrapper';
import { SECTION_COMPONENTS } from 'src/features/workspace/constants/section-components.constant';
import { tabsActions, type TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import { layoutDimensionsActions } from 'src/features/workspace/store/layout-dimensions.slice';
import { Section } from 'src/features/workspace/enums/section.enum';
import { sectionStrategyFactory } from 'src/features/workspace/strategies/section/section-strategy.factory';
import type { BuildPropsResponse } from 'src/features/workspace/strategies/section/types/build-props.response';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function WorkspaceBody() {
    const dispatch = useAppDispatch();
    const tabs = useAppSelector((state) => state.tabs);

    const [builtPropsRecord, setBuiltPropsRecord] = React.useState<
        Record<string, object | undefined>
    >({});
    const containerDiv = React.useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
    const scrollPositions = React.useRef<Record<string, number>>({});
    const activeTabKeyRef = React.useRef<string | null>(null);
    const buildingKeys = React.useRef<Set<string>>(new Set());

    // Continuously track scroll position for the active tab via scroll events
    React.useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            if (activeTabKeyRef.current) {
                scrollPositions.current[activeTabKeyRef.current] = scrollContainer.scrollTop;
            }
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    // Restore scroll position when switching between tabs
    React.useEffect(() => {
        const activeTab = tabs.elements[tabs.activeTabIndex];
        const currentKey = activeTab ? computeTabKey(activeTab) : null;

        if (scrollContainerRef.current && currentKey && currentKey !== activeTabKeyRef.current) {
            scrollContainerRef.current.scrollTop = scrollPositions.current[currentKey] ?? 0;
        }

        activeTabKeyRef.current = currentKey;
    }, [tabs.activeTabIndex]);

    // Track workspace body height changes for responsive layout calculations
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

    async function buildProps(tab: TabsStateElement): Promise<BuildPropsResponse | undefined> {
        const strategy = sectionStrategyFactory.resolveStrategy(tab.section);

        if (strategy) {
            return await strategy.buildProps(tab);
        }

        return undefined;
    }

    // Clean up stale props/scroll positions for closed tabs and build props for new tabs
    React.useEffect(() => {
        const activeKeys = new Set(tabs.elements.map((tab) => computeTabKey(tab)));

        setBuiltPropsRecord((prev) => {
            const cleaned: Record<string, object | undefined> = {};

            for (const key of Object.keys(prev)) {
                if (activeKeys.has(key)) cleaned[key] = prev[key];
            }

            return cleaned;
        });

        for (const key of Object.keys(scrollPositions.current)) {
            if (!activeKeys.has(key)) delete scrollPositions.current[key];
        }

        for (const tab of tabs.elements) {
            const key = computeTabKey(tab);
            if (buildingKeys.current.has(key)) continue;

            setBuiltPropsRecord((prev) => {
                if (prev[key]) return prev;

                buildingKeys.current.add(key);
                buildProps(tab).then((builtProps) => {
                    buildingKeys.current.delete(key);

                    if (builtProps && !builtProps.exists) {
                        const currentIndex = tabs.elements.findIndex(
                            (el) => computeTabKey(el) === key
                        );
                        if (currentIndex !== -1) {
                            dispatch(tabsActions.closeTab(currentIndex));
                        }
                        return;
                    }

                    setBuiltPropsRecord((p) => ({ ...p, [key]: builtProps }));

                    if (builtProps?.title) {
                        dispatch(tabsActions.setTitle({ key, title: builtProps.title }));
                    }
                });

                return prev;
            });
        }
    }, [tabs.elements]);

    // Rebuild props for tabs invalidated by ID (e.g. after data updates), excluding practice tabs
    React.useEffect(() => {
        if (tabs.propsInvalidatedTabIds.length === 0) return;

        const invalidatedTabs: { tab: TabsStateElement; key: string }[] = [];

        const PRACTICE_SECTIONS: Set<Section> = new Set([
            Section.EXERCISE_SET_PRACTICE,
            Section.PUBLIC_EXERCISE_SET_PRACTICE,
        ]);

        for (const invalidatedId of tabs.propsInvalidatedTabIds) {
            const matchingTabs = tabs.elements.filter(
                (el) => el.id === invalidatedId && !PRACTICE_SECTIONS.has(el.section)
            );
            for (const tab of matchingTabs) {
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
                if (builtProps && !builtProps.exists) {
                    const currentIndex = tabs.elements.findIndex(
                        (el) => computeTabKey(el) === key
                    );
                    if (currentIndex !== -1) {
                        dispatch(tabsActions.closeTab(currentIndex));
                    }
                    return;
                }

                setBuiltPropsRecord((prev) => ({
                    ...prev,
                    [key]: builtProps,
                }));

                if (builtProps?.title) {
                    dispatch(tabsActions.setTitle({ key: computeTabKey(tab), title: builtProps.title }));
                }
            });
        }

        dispatch(tabsActions.clearPropsInvalidations());
    }, [tabs.propsInvalidatedTabIds]);

    // Rebuild props for tabs invalidated by key
    React.useEffect(() => {
        if (tabs.propsInvalidatedTabKeys.length === 0) return;

        const keysToInvalidate = new Set(tabs.propsInvalidatedTabKeys);
        const invalidatedTabs: { tab: TabsStateElement; key: string }[] = [];

        for (const tab of tabs.elements) {
            const key = computeTabKey(tab);
            if (keysToInvalidate.has(key)) {
                invalidatedTabs.push({ tab, key });
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
                if (builtProps && !builtProps.exists) {
                    const currentIndex = tabs.elements.findIndex(
                        (el) => computeTabKey(el) === key
                    );
                    if (currentIndex !== -1) {
                        dispatch(tabsActions.closeTab(currentIndex));
                    }
                    return;
                }

                setBuiltPropsRecord((prev) => ({
                    ...prev,
                    [key]: builtProps,
                }));

                if (builtProps?.title) {
                    dispatch(tabsActions.setTitle({ key, title: builtProps.title }));
                }
            });
        }

        dispatch(tabsActions.clearKeyInvalidations());
    }, [tabs.propsInvalidatedTabKeys]);

    return (
        <div
            id='workspace-body'
            ref={containerDiv}
            className={`relative z-0 w-full
            flex-1`}
            style={{ transform: 'translateZ(0)' }}
        >
            <div ref={scrollContainerRef} className="w-full h-full overflow-y-auto p-4 flex justify-center items-center">
                    {tabs.elements?.map((element, index) => {
                        const Component = SECTION_COMPONENTS[element.section];
                        const key = computeTabKey(element);

                        const isActiveComponent = index === tabs.activeTabIndex;
                        const builtProps = builtPropsRecord[key];

                        return (
                            <TabPortalWrapper key={key} isActive={isActiveComponent}>
                                {Component && builtProps ? (
                                    <Component
                                        {...builtProps}
                                        isActiveComponent={isActiveComponent}
                                    />
                                ) : (
                                    <div className={isActiveComponent ? 'block w-full h-full' : 'hidden'}>
                                        <LoadingPage />
                                    </div>
                                )}
                            </TabPortalWrapper>
                        );
                    })}
            </div>
        </div>
    );
}
