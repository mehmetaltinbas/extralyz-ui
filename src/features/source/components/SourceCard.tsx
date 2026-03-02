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
            className="relative w-[175px] h-[175px] border border-gray-400 cursor-pointer rounded-[10px]
            flex flex-col justify-center items-center
            hover:border-1 hover:border-black"
        >
            <div
                className="w-[150px] h-full px-2
                flex flex-col justify-center items-center"
            >
                <p
                    className="max-w-[150px] font-serif font-semibold truncate"
                    title={source.title ? source.title : source._id}
                >
                    {source.title ? source.title : source._id}
                </p>

                <p className="text-sm italic">{source.type}</p>
            </div>

            <div
                className="absolute w-auto h-auto right-1 top-1
                flex justify-center items-center"
            >
                <Button
                    variant={ButtonVariants.GHOST}
                    onClick={(event) => toggleSourceActionMenu(event, source._id)}
                    className="font-bold"
                >
                    ...
                </Button>
            </div>
        </div>
    );
}
