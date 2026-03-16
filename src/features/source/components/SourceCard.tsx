import { useSourcesPopups } from 'src/features/source/hooks/use-sources-popups.hook';
import type { Source } from 'src/features/source/types/source.interface';
import { Section } from 'src/features/workspace/enums/section.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import ActionMenuTriggerer from 'src/shared/components/ActionMenuTriggerer';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { useAppDispatch } from 'src/store/hooks';

export function SourceCard({
    source,
}: {
    source: Source;
}) {
    const dispatch = useAppDispatch();
    const { openSourceActionMenu } = useSourcesPopups();

    return (
        <div
            onClick={(event) =>
                dispatch(tabsActions.openTab({
                    section: Section.SOURCE,
                    id: source._id,
                    title: source.title,
                }))
            }
            className="relative w-[175px] h-[175px] border border-border cursor-pointer rounded-[10px]
            flex flex-col justify-center items-center
            hover:border-1 hover:border-border-strong"
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
                className={`absolute w-auto h-auto right-1.5 top-1.5
                flex justify-center items-center`}
            >
                <ActionMenuTriggerer
                    onClick={(event) => openSourceActionMenu(event, source._id)}
                    size={ButtonSize.SM}
                />
            </div>
        </div>
    );
}
