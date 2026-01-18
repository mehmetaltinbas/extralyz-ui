import type React from 'react';
import type { Source } from 'src/features/source/types/source.interface';
import { Section } from 'src/features/workspace/enums/sections.enum';
import { openTab } from 'src/features/workspace/features/tabs/utilities/openTab.utility';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { useAppDispatch } from 'src/store/hooks';

export function SourceCard({
    source,
    toggleSourceActionMenu,
}: {
    source: Source;
    toggleSourceActionMenu: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        sourceId: string
    ) => void;
}) {
    const dispatch = useAppDispatch();

    return (
        <div
            onClick={(event) =>
                openTab(dispatch, {
                    section: Section.SOURCE,
                    id: source._id,
                    title: source.title,
                })
            }
            className="w-[300px] h-[250px] border cursor-pointer rounded-[10px]
            flex flex-col justify-center items-center
            hover:border-2"
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
                        title={source.title ? source.title : source._id}
                    >
                        {source.title ? source.title : source._id}
                    </p>
                    <p className="text-xs">{source.type}</p>
                </div>
                <div
                    id='this is the button div'
                    className="w-[50px] h-full
                    flex justify-center items-center"
                >
                    <Button
                        variant={ButtonVariants.GHOST}
                        onClick={(event) => toggleSourceActionMenu(event, source._id)}
                        className='font-bold'
                    >
                        ...
                    </Button>
                </div>
            </div>
            <div className="w-full h-full p-2 flex-1 overflow-y-auto">
                <div className="text-gray-500">{source.rawText}</div>
            </div>
        </div>
    );
}
