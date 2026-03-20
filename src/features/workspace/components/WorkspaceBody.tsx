import React from 'react';
import { TabPortalWrapper } from 'src/features/workspace/components/TabPortalWrapper';
import { SECTION_COMPONENTS } from 'src/features/workspace/constants/section-components.constant';
import { tabsActions, type TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import { layoutDimensionsActions } from 'src/features/workspace/store/layout-dimensions.slice';
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

    async function buildProps(tab: TabsStateElement): Promise<BuildPropsResponse | undefined> {
        const strategy = sectionStrategyFactory.resolveStrategy(tab.section);

        if (strategy) {
            return await strategy.buildProps(tab);
        }

        return undefined;
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

                    if (builtProps?.title) {
                        dispatch(tabsActions.setTitle({ key, title: builtProps.title }));
                    }
                });

                return prev;
            });
        }
    }, [tabs.elements]);

    React.useEffect(() => {
        if (tabs.propsInvalidatedTabIds.length === 0) return;

        const invalidatedTabs: { tab: TabsStateElement; key: string }[] = [];

        for (const invalidatedId of tabs.propsInvalidatedTabIds) {
            const matchingTabs = tabs.elements.filter((el) => el.id === invalidatedId);
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

    return (
        <div
            id='workspace-body'
            ref={containerDiv}
            className={`relative z-0 w-full
            flex-1`}
            style={{ transform: 'translateZ(0)' }}
        >
            <div className="w-full h-full overflow-y-auto p-4 pb-12 flex justify-center items-center">
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
