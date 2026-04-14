import { Globe, Lock } from 'lucide-react';
import { SourceVisibility } from 'src/features/source/enums/source-visibility.enum';
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
            className="relative w-[175px] aspect-square border border-border cursor-pointer rounded-[10px]
            flex flex-col justify-center items-center
            hover:border-1 hover:border-border-strong"
        >
            <div
                className="w-[150px] h-full px-2
                flex flex-col justify-center items-center"
            >
                <div className='absolute left-4 top-4'>
                    {source.visibility === SourceVisibility.PUBLIC ? (
                        <Globe size={14} className="flex-shrink-0" />
                    ) : (
                        <Lock size={14} className="flex-shrink-0" />
                    )}
                </div>

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
