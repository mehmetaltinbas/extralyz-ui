import type React from 'react';
import { type ProcessedSource } from 'src/features/processed-source/types/processed-source.interface';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { tabsActions, type TabsStateElement } from 'src/features/workspace/features/tabs/store/tabsSlice';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { useAppDispatch } from 'src/store/hooks';

export function ProcessedSourceCard({
    processedSource,
    fetchProcessedSources,
    toggleSourceActionMenu,
}: {
    processedSource: ProcessedSource;
    fetchProcessedSources: () => void;
    toggleSourceActionMenu: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        sourceId: string
    ) => void;
}) {
    const dispatch = useAppDispatch();

    function openTab(event: React.MouseEvent<HTMLDivElement>) {
        const section = Section.PROCESSED_SOURCE;
        const datasetElement = event.currentTarget.dataset.element;
        if (datasetElement) {
            const element = JSON.parse(datasetElement) as TabsStateElement;
            dispatch(
                tabsActions.add({
                    element: { section, id: element.id, title: element.title },
                })
            );
        } else if (!datasetElement) {
            dispatch(tabsActions.add({ element: { section } }));
        }
    }

    return (
        <div
            onClick={openTab}
            data-element={JSON.stringify({
                id: processedSource._id,
                title: processedSource.title,
            })}
            className="w-[300px] h-[250px] border cursor-pointer rounded-[10px]
            flex flex-col justify-center items-center
            hover:bg-gray-100"
        >
            <div
                className="w-full h-[60px]
                flex justify-center items-center
                border-b"
            >
                <div
                    className="w-[250px] h-full px-2
                    flex flex-col justify-center items-center"
                >
                    <p
                        className="max-w-[200px] font-serif font-semibold truncate"
                        title={
                            processedSource.title ? processedSource.title : processedSource._id
                        }
                    >
                        {processedSource.title ? processedSource.title : processedSource._id}
                    </p>
                </div>
                <div
                    className="w-[50px] h-full
                    flex justify-center items-center"
                >
                    <Button
                        variant={ButtonVariants.GHOST}
                        onClick={(event) => toggleSourceActionMenu(event, processedSource._id)}
                    >
                        ...
                    </Button>
                </div>
            </div>
            <div className="w-full h-full p-2 flex-1 overflow-y-auto">
                <div className="text-gray-500">{processedSource.processedText}</div>
            </div>
        </div>
    );
}
