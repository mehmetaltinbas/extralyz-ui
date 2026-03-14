import type React from 'react';
import {
    tabsActions,
    type TabsStateElement,
} from 'src/features/workspace/features/tabs/store/tabs.slice';
import { computeTabTitle } from 'src/features/workspace/features/tabs/store/utils/compute-tab-title.util';
import type { OnDragOverTab } from 'src/features/workspace/features/tabs/types/on-drag-over-tab.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function Tab({
    tab,
    index,
    onDragOverTab,
    dragSourceIndex,
    setDragSourceIndex,
}: {
    tab: TabsStateElement;
    index: number;
    onDragOverTab: OnDragOverTab | null;
    dragSourceIndex: number | null;
    setDragSourceIndex: (index: number | null) => void;
}) {
    const dispatch = useAppDispatch();
    const activeTabIndex = useAppSelector((state) => state.tabs.activeTabIndex);

    const displayTitle = computeTabTitle(tab);

    function onDragStart(event: React.DragEvent<HTMLDivElement>) {
        event.dataTransfer.setDragImage(event.currentTarget, 0, 0);
        setDragSourceIndex(index);
        event.dataTransfer.setData(
            'text/plain',
            JSON.stringify({ ...tab, dragSourceIndex: index })
        );
    }

    function displayTab() {
        dispatch(tabsActions.setActiveTabIndex(index));
    }

    function deleteTab(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        dispatch(tabsActions.closeTab(index));
    }

    return (
        <div
            draggable="true"
            onDragStart={(event) => onDragStart(event)}
            data-tab-element={JSON.stringify({ arrayIndex: index })}
            onClick={displayTab}
            className={`max-w-[200px] h-full ${index === activeTabIndex && 'bg-white'} ${onDragOverTab?.index === index && index !== dragSourceIndex && (onDragOverTab.side === 'left' ? 'border-l border-l-black' : 'border-r border-r-black')} cursor-pointer p-2
            flex-shrink-0 flex justify-center items-center gap-[10px]
            hover:bg-white`}
        >
            <div className="max-w-[150px] flex justify-center items-center">
                <p className="truncate" title={displayTitle}>
                    {displayTitle}
                </p>
            </div>

            <div className="w-[24px] flex justify-center items-center">
                <Button
                    variant={ButtonVariant.ICON}
                    size={ButtonSize.SM}
                    onClick={(event) => deleteTab(event)}
                >
                    ✕
                </Button>
            </div>
        </div>
    );
}
