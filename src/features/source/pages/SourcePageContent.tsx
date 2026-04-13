import React from 'react';
import { SourceTextEditor } from 'src/features/source/components/SourceTextEditor';
import { SourceTextRenderer } from 'src/features/source/components/SourceTextRenderer';
import { useSourcePopups } from 'src/features/source/hooks/use-source-popups.hook';
import { SourceService } from 'src/features/source/services/source.service';
import { type Source } from 'src/features/source/types/source.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function SourcePageContent({ source }: { source: Source }) {
    const { openCreateExerciseSetForm, openUpdateSourceForm, openDeleteApproval, viewSourcePdf, refreshData } = useSourcePopups();

    const [isEditing, setIsEditing] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    const content = JSON.parse(source.rawText) as object;

    async function handleSave(updatedContent: object) {
        setIsSaving(true);

        try {
            const response = await SourceService.updateById(source._id, {
                rawText: JSON.stringify(updatedContent),
            });

            if (!response.isSuccess) {
                alert(response.message);
                return;
            }

            refreshData();
            setIsEditing(false);
        } catch {
            alert('Internal error');
        } finally {
            setIsSaving(false);
        }
    }

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

                {!isEditing && (
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
                            onClick={() => setIsEditing(true)}
                            variant={ButtonVariant.SECONDARY}
                        >
                            Edit Content
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
                )}
            </div>

            {isEditing ? (
                <SourceTextEditor
                    initialContent={content}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                    isSaving={isSaving}
                />
            ) : (
                <SourceTextRenderer content={content} />
            )}
        </div>
    );
}
