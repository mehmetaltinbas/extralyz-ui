import type React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { Source } from 'src/features/source/types/source.interface';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import type { TabsStateElement } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function SidebarNavSection({
    section,
    items,
}: {
    section: Section;
    items: Source[] | ExerciseSet[];
}) {
    const dispatch = useAppDispatch();
    const sidebar = useAppSelector((state) => state.sidebar);

    function onDragStart(event: React.DragEvent<HTMLButtonElement>) {
        const datasetElement = event.currentTarget.dataset.tabElement;
        const element = datasetElement
            ? (JSON.parse(datasetElement) as TabsStateElement)
            : undefined;
        if (element) {
            event.dataTransfer.setData('text/plain', JSON.stringify(element));
        }
    }

    return (
        <div
            className={`w-[${sidebar.width - 30}px] h-auto overflow-y-auto
            flex flex-col justify-start items-start gap-1`}
        >
            <div
                className="w-full h-auto
                flex justify-start items-center gap-2"
            >
                {/* <button>⌄</button> */}
                <div className="w-full h-auto flex flex-col justify-center items-start gap-1">
                    <button
                        draggable="true"
                        onDragStart={(event) => onDragStart(event)}
                        data-tab-element={JSON.stringify({ section: section })}
                        onClick={(event) => dispatch(tabsActions.openTab({ section }))}
                        className="w-auto h-auto cursor-pointer border border-1 border-transparent px-[8px] py-[1px] rounded-full
                            font-serif font-semibold
                            hover:border-black hover:bg-white"
                    >
                        {section}
                    </button>
                    <span className="w-full h-[1px] bg-black"></span>
                </div>
            </div>
            <div
                className={`w-full h-auto pl-8
                flex flex-col justify-start items-start gap-[2px]`}
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
                        onClick={(event) =>
                            dispatch(tabsActions.openTab({
                                section: section.slice(0, -1) as Section,
                                id: item._id,
                                title: item.title,
                            }))
                        }
                        className={`max-w-[${sidebar.width - 62}px] cursor-pointer truncate border border-1 border-transparent px-[8px] py-[1px] rounded-full
                            hover:border-black hover:bg-white`}
                    >
                        {item.title === '' || item.title === undefined ? item._id : item.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
