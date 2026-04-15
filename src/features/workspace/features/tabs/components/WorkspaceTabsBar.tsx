import React from 'react';
import { DndContext, type DragEndEvent, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Tab } from 'src/features/workspace/features/tabs/components/Tab';
import { TOUCH_SENSOR_ACTIVATION } from 'src/features/workspace/features/tabs/constants/touch-sensor-activation.constant';
import { TabDropSide } from 'src/features/workspace/features/tabs/enums/tab-drop-side.enum';
import {
    tabsActions,
    type TabsStateElement,
} from 'src/features/workspace/features/tabs/store/tabs.slice';
import { computeDropIndex } from 'src/features/workspace/features/tabs/store/utils/compute-drop-index.util';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import type { OnDragOverTab } from 'src/features/workspace/features/tabs/types/on-drag-over-tab.interface';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function WorkspaceTabsBar() {
    const dispatch = useAppDispatch();
    const tabs = useAppSelector((state) => state.tabs);
    const { isMobile } = useBreakpoint();

    const containerRef = React.useRef<HTMLDivElement>(null);
    const [onDragOverTab, setOnDragOverTab] = React.useState<OnDragOverTab | null>(null);
    const [dragSourceIndex, setDragSourceIndex] = React.useState<number | null>(null);

    const sensors = useSensors(
        useSensor(TouchSensor, { activationConstraint: TOUCH_SENSOR_ACTIVATION })
    );

    const tabIds = tabs.elements.map((tab) => computeTabKey(tab));

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = tabIds.indexOf(String(active.id));
        const newIndex = tabIds.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;

        dispatch(tabsActions.moveTab({ fromIndex: oldIndex, toIndex: newIndex }));
    }

    React.useEffect(() => {
        if (!containerRef.current || tabs.activeTabIndex < 0) return;
        const activeTab = containerRef.current.querySelector(
            `[data-tab-element]:nth-child(${tabs.activeTabIndex + 1})`,
        );
        if (activeTab) {
            activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }, [tabs.activeTabIndex]);

    function onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const targetElement = (event.target as HTMLElement).closest('[data-tab-element]') as HTMLElement | null;

        if (!targetElement?.dataset.tabElement) {
            setOnDragOverTab(null);
            return;
        }

        const dropTarget = JSON.parse(targetElement.dataset.tabElement) as { arrayIndex: number };
        const rect = targetElement.getBoundingClientRect();
        const middleX = rect.left + rect.width / 2;
        const dropSide: TabDropSide = event.clientX < middleX ? TabDropSide.LEFT : TabDropSide.RIGHT;

        setOnDragOverTab({
            index: dropTarget.arrayIndex,
            side: dropSide,
        });
    }

    function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOnDragOverTab(null);
        }
    }

    function onDragEnd() {
        setOnDragOverTab(null);
        setDragSourceIndex(null);
    }

    function onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();

        setOnDragOverTab(null);

        // 1. Try to find the specific tab being dropped onto.
        // We use closest() in case the user drops onto a child (span/icon) inside the Tab.
        const targetElement = (event.target as HTMLElement).closest('[data-tab-element]') as HTMLElement | null;
        
        let dropTargetIndex: number | undefined;
        if (targetElement?.dataset.tabElement) {
            const dropTarget = JSON.parse(targetElement.dataset.tabElement) as { arrayIndex: number };
            dropTargetIndex = dropTarget.arrayIndex;
        }

        // 2. Parse the incoming dragged data
        const dataTransfer = event.dataTransfer.getData('text/plain');
        if (!dataTransfer) return;

        const droppedData = JSON.parse(dataTransfer) as TabsStateElement & { dragSourceIndex?: number };
        const { dragSourceIndex, ...tab } = droppedData;

        // 3. LOGIC FOR DROPPING INTO EMPTY SPACE (End of Bar)
        if (dropTargetIndex === undefined) {
            if (dragSourceIndex !== undefined) {
                // Move existing tab to the very last position
                const lastIndex = tabs.elements.length - 1;
                dispatch(tabsActions.moveTab({ 
                    fromIndex: dragSourceIndex, 
                    toIndex: lastIndex 
                }));
            } else {
                // If it's a new tab from the sidebar, just append it to the end
                dispatch(tabsActions.insertTab({ tab, atIndex: tabs.elements.length }));
            }
            return;
        }

        // 4. LOGIC FOR DROPPING ONTO A SPECIFIC TAB
        const rect = targetElement!.getBoundingClientRect();
        const middleX = rect.left + rect.width / 2;
        const dropSide: TabDropSide = event.clientX < middleX ? TabDropSide.LEFT : TabDropSide.RIGHT;

        const targetIndex = computeDropIndex({
            dropTargetIndex,
            sourceIndex: dragSourceIndex,
            dropSide,
        });

        if (targetIndex === undefined) return;

        if (dragSourceIndex !== undefined) {
            // Reordering within the bar
            dispatch(tabsActions.moveTab({ 
                fromIndex: dragSourceIndex, 
                toIndex: targetIndex 
            }));
        } else {
            // Inserting a new tab from sidebar into a specific position
            dispatch(tabsActions.insertTab({ 
                tab, 
                atIndex: targetIndex 
            }));
        }
    }

    const tabList = (
        <div
            ref={containerRef}
            onDragOver={!isMobile ? (event) => onDragOver(event) : undefined}
            onDragLeave={!isMobile ? (event) => onDragLeave(event) : undefined}
            onDragEnd={!isMobile ? onDragEnd : undefined}
            onDrop={!isMobile ? (event) => onDrop(event) : undefined}
            className={`w-full h-[40px] bg-surface-alt z-10
            flex justify-start items-center
            border-1 border-surface overflow-x-auto ${!isMobile ? 'touch-pan-x' : ''}`}
        >
            {tabs.elements.map((tab, index) => (
                <Tab key={computeTabKey(tab)} tab={tab} index={index} onDragOverTab={onDragOverTab} dragSourceIndex={dragSourceIndex} setDragSourceIndex={setDragSourceIndex} />
            ))}
        </div>
    );

    if (isMobile) {
        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
                    {tabList}
                </SortableContext>
            </DndContext>
        );
    }

    return tabList;
}
