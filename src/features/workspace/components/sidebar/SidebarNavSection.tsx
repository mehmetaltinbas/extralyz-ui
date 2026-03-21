import type React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { Source } from 'src/features/source/types/source.interface';
import { Section } from 'src/features/workspace/enums/section.enum';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { sidebarActions } from 'src/features/workspace/store/sidebar.slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function SidebarNavSection({
    section,
    items,
}: {
    section: Section;
    items: Source[] | ExerciseSet[];
}) {
    const dispatch = useAppDispatch();
    const sidebarMode = useAppSelector((state) => state.sidebar.mode);

    function onDragStart(event: React.DragEvent<HTMLButtonElement>) {
        event.dataTransfer.setDragImage(event.currentTarget, 0, 0);
        const datasetElement = event.currentTarget.dataset.tabElement;
        const element = datasetElement
            ? (JSON.parse(datasetElement) as TabsStateElement)
            : undefined;
        if (element) {
            event.dataTransfer.setData('text/plain', JSON.stringify(element));
        }
    }

    function handleItemClick(tabData: Parameters<typeof tabsActions.openTab>[0]) {
        dispatch(tabsActions.openTab(tabData));
        if (sidebarMode === 'drawer') {
            dispatch(sidebarActions.close());
        }
    }

    return (
        <div
            className="w-full min-h-0
            flex-1 flex flex-col justify-start items-start gap-1"
        >
            <div
                className="w-full h-auto
                flex justify-start items-center gap-2"
            >
                <div className="w-full h-auto flex flex-col justify-center items-start gap-1">
                    <button
                        draggable="true"
                        onDragStart={(event) => onDragStart(event)}
                        data-tab-element={JSON.stringify({ section: section })}
                        onClick={() => handleItemClick({ section })}
                        className="w-full h-auto cursor-pointer px-[8px] py-[1px]
                            font-serif font-semibold flex justify-start
                            hover:bg-surface-hover"
                    >
                        <p>
                            {section}
                        </p>
                    </button>

                    <span className="w-full h-[1px] bg-border-strong"></span>
                </div>
            </div>

            <div
                className="w-full pl-8 flex-1 min-h-0 overflow-y-auto
                flex flex-col justify-start items-start gap-[2px]"
            >
                {items?.map((item) => (
                    <button
                        key={item._id}
                        draggable="true"
                        onDragStart={(event) => onDragStart(event)}
                        data-tab-element={JSON.stringify({
                            section: section.slice(0, -1),
                            id: item._id,
                            title: item.title,
                        })}
                        onClick={() =>
                            handleItemClick({
                                section: section.slice(0, -1) as Section,
                                id: item._id,
                                title: item.title,
                            })
                        }
                        className="w-full shrink-0 cursor-pointer truncate px-[8px] py-[1px]
                            flex justify-start
                            hover:bg-surface-hover"
                    >
                        <p>{item.title === '' || item.title === undefined ? item._id : item.title}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
