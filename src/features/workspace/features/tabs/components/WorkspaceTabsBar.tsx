import React from 'react';
import { Tab } from 'src/features/workspace/features/tabs/components/Tab';
import {
    tabsActions,
    type TabsStateElement,
} from 'src/features/workspace/features/tabs/store/tabs.slice';
import { computeDropIndex } from 'src/features/workspace/features/tabs/store/utils/compute-drop-index.util';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function WorkspaceTabsBar() {
    const dispatch = useAppDispatch();
    const tabs = useAppSelector((state) => state.tabs);
    const widths = useAppSelector((state) => state.layoutDimensions);

    function onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    function onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();

        const dropTargetDataset = event.currentTarget.dataset.tabElement;
        let dropTargetIndex: number | undefined;
        if (dropTargetDataset) {
            const dropTarget = JSON.parse(dropTargetDataset) as { arrayIndex: number };
            dropTargetIndex = dropTarget.arrayIndex;
        }

        const dataTransfer = event.dataTransfer.getData('text/plain');
        const droppedData = JSON.parse(dataTransfer) as TabsStateElement & { dragSourceIndex?: number };
        const { dragSourceIndex, ...tab } = droppedData;

        if (dropTargetIndex === undefined) {
            // Dropping onto empty area
            if (dragSourceIndex !== undefined) {
                dispatch(tabsActions.setActiveTabIndex(dragSourceIndex));
            } else {
                dispatch(tabsActions.openTab(tab));
            }
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const middleX = rect.left + rect.width / 2;
        const dropSide: 'left' | 'right' = event.clientX < middleX ? 'left' : 'right';

        const targetIndex = computeDropIndex({
            dropTargetIndex,
            sourceIndex: dragSourceIndex,
            dropSide,
        });

        if (targetIndex === undefined) return;

        if (dragSourceIndex !== undefined) {
            dispatch(tabsActions.moveTab({ fromIndex: dragSourceIndex, toIndex: targetIndex }));
        } else {
            dispatch(tabsActions.insertTab({ tab, atIndex: targetIndex }));
        }
    }

    return (
        <div
            onDragOver={(event) => onDragOver(event)}
            onDrop={(event) => onDrop(event)}
            className={`w-[${widths.mainColumn.width}px] h-[40px] bg-[#F5F5F5] z-10
            flex flex-shrink-0 justify-start items-center
            border-1 border-white overflow-x-auto`}
        >
            {tabs.elements.map((tab, index) => (
                <Tab key={computeTabKey(tab)} tab={tab} index={index} onDragOver={onDragOver} onDrop={onDrop} />
            ))}
        </div>
    );
}
