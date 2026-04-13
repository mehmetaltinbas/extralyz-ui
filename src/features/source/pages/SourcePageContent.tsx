import { SourceTextRenderer } from 'src/features/source/components/SourceTextRenderer';
import { useSourcePopups } from 'src/features/source/hooks/use-source-popups.hook';
import type { SourceTextNode } from 'src/features/source/types/source-text-node/source-text-node.interface';
import { type Source } from 'src/features/source/types/source.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function SourcePageContent({ source }: { source: Source }) {
    const { openCreateExerciseSetForm, openUpdateSourceForm, openDeleteApproval, viewSourcePdf } = useSourcePopups();

    return (
        <div
            className="absolute w-full h-full pb-4
            flex flex-col justify-start items-center gap-4"
        >
            <div className='w-auto h-auto flex flex-col justify-start items-center gap-2'>
                <p className='text-lg font-bold'>{source.title}</p>

                <div className='flex gap-2'>
                    <p><span className=''>Type: </span><span className='italic'>{source.type}</span></p>
                </div>

                <div className='flex gap-2'>
                    <Button
                        onClick={(event) => openCreateExerciseSetForm(event)}
                    >
                        Generate Exercise Set
                    </Button>

                    <Button
                        onClick={(event) => viewSourcePdf(event)}
                    >
                        View as PDF
                    </Button>

                    <Button
                        onClick={(event) => openUpdateSourceForm(event)}
                    >
                        Update
                    </Button>

                    <Button
                        variant={ButtonVariant.DANGER}
                        onClick={(event) => openDeleteApproval(event)}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <SourceTextRenderer sourceTextNode={JSON.parse(source.rawText) as SourceTextNode} />
        </div>
    );
}
