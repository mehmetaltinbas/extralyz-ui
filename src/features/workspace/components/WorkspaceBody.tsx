import React from 'react';
import { SECTION_COMPONENTS } from 'src/features/workspace/constants/section-components.constant';
import { tabsActions, type TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import { layoutDimensionsActions } from 'src/features/workspace/store/layout-dimensions.slice';
import { resolveSectionStrategy } from 'src/features/workspace/strategies/section/resolve-section-strategy';
import type { BuildPropsResponse } from 'src/features/workspace/strategies/section/types/build-props.response';
import { BodyModalPortalContext } from 'src/shared/contexts/body-modal-portal.context';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function WorkspaceBody() {
    const dispatch = useAppDispatch();
    const tabs = useAppSelector((state) => state.tabs);
    const layoutDimensions = useAppSelector((state) => state.layoutDimensions);

    const [builtPropsRecord, setBuiltPropsRecord] = React.useState<
        Record<string, object | undefined>
    >({});
    const containerDiv = React.useRef<HTMLDivElement | null>(null);
    const portalTargetRef = React.useRef<HTMLDivElement | null>(null);
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
        const strategy = resolveSectionStrategy(tab.section);

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
            ref={containerDiv}
            className={`relative z-0 w-[${layoutDimensions.mainColumn.width}px] h-[${layoutDimensions.mainColumn.height ? `${layoutDimensions.mainColumn.height * 0.9}px` : '90%'}]
            flex-1`}
            style={{ transform: 'translateZ(0)' }}
        >
            <div className="w-full h-full overflow-y-auto p-4 flex justify-center items-center">
                <BodyModalPortalContext.Provider value={portalTargetRef}>
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
                </BodyModalPortalContext.Provider>
            </div>
            <div ref={portalTargetRef} />
        </div>
    );
}
