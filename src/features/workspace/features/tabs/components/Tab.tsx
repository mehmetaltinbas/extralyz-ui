import type React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    tabsActions,
    type TabsStateElement,
} from 'src/features/workspace/features/tabs/store/tabs.slice';
import { computeTabKey } from 'src/features/workspace/features/tabs/store/utils/compute-tab-key.util';
import { computeTabTitle } from 'src/features/workspace/features/tabs/store/utils/compute-tab-title.util';
import type { OnDragOverTab } from 'src/features/workspace/features/tabs/types/on-drag-over-tab.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
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
    const { isMobile } = useBreakpoint();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: computeTabKey(tab), disabled: !isMobile });

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

    const sortableStyle: React.CSSProperties = isMobile
        ? { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
        : {};

    return (
        <div
            ref={isMobile ? setNodeRef : undefined}
            style={sortableStyle}
            {...(isMobile ? { ...attributes, ...listeners } : {})}
            draggable={!isMobile}
            onDragStart={!isMobile ? (event) => onDragStart(event) : undefined}
            data-tab-element={JSON.stringify({ arrayIndex: index })}
            onClick={displayTab}
            className={`max-w-[120px] md:max-w-[200px] h-full ${index === activeTabIndex && 'bg-surface'} ${onDragOverTab?.index === index && index !== dragSourceIndex && (onDragOverTab.side === 'left' ? 'border-l border-l-border-strong' : 'border-r border-r-border-strong')} cursor-pointer p-2
            flex-shrink-0 flex justify-center items-center gap-[10px]
            hover:bg-surface`}
        >
            <div className='max-w-[80px] md:max-w-[150px] truncate flex flex-col justify start items-start gap-0'>
                <div className="flex justify-center items-center">
                    <p className="text-xs md:text-sm" title={displayTitle}>
                        {displayTitle}
                    </p>
                </div>
                {tab.meta &&
                    <div>
                        <p className="text-xs md:text-sm">{tab.meta}</p>
                    </div>
                }
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
