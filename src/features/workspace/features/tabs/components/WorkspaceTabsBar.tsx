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
        const dropSide: 'left' | 'right' = event.clientX < middleX ? 'left' : 'right';

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

    return (
        <div
            onDragOver={(event) => onDragOver(event)}
            onDrop={(event) => onDrop(event)}
            className={`w-[${widths.mainColumn.width}px] h-[40px] bg-[#F5F5F5] z-10
            flex flex-shrink-0 justify-start items-center
            border-1 border-white overflow-x-auto`}
        >
            {tabs.elements.map((tab, index) => (
                <Tab key={computeTabKey(tab)} tab={tab} index={index} />
            ))}
        </div>
    );
}
