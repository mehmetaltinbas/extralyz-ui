import React from 'react';
import { ExerciseSetEstimateService } from 'src/features/exercise-set/services/exercise-set-estimate.service';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import { Button } from 'src/shared/components/Button';
import { InformationText } from 'src/shared/components/InformationText';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { Textarea } from 'src/shared/components/Textarea';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { TextareaSize } from 'src/shared/enums/textarea-size.enum';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';

export function GenerateNotesForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    onClose,
    setIsLoadingPageHidden,
    refreshData,
    exerciseSet,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: () => void;
    exerciseSet: ExerciseSet;
}) {
    const [isGenerated, setIsGenerated] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [rawText, setRawText] = React.useState('');

    const isSubmittingRef = React.useRef(false);
    const hasTriggeredGenerate = React.useRef(false);

    const { isMobile } = useBreakpoint();

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setIsGenerated(false);
            setTitle('');
            setRawText('');
            hasTriggeredGenerate.current = false;
        }
    }, [isHidden]);

    React.useEffect(() => {
        if (!isHidden && !isGenerated && !hasTriggeredGenerate.current) {
            hasTriggeredGenerate.current = true;
            generateWithEstimate();
        }
    }, [isHidden]);

    async function generateWithEstimate() {
        const estimate = await ExerciseSetEstimateService.estimateGenerateNotes(exerciseSet._id);

        if (estimate.isSuccess && estimate.credits && estimate.credits > 0) {
            const confirmed = confirm(`This will cost ${estimate.credits} credits. Proceed?`);
            if (!confirmed) {
                onClose();
                return;
            }
        }

        await generate();
    }

    async function generate() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.generateNotes(exerciseSet._id);

            if (!response.isSuccess || !response.title || !response.rawText) {
                alert(response.message);
                isSubmittingRef.current = false;
                onClose();
            } else {
                setTitle(response.title);
                setRawText(response.rawText);
                setIsGenerated(true);
                isSubmittingRef.current = false;
                setIsHidden(false);
            }
        } catch (error) {
            alert('internal error');
            isSubmittingRef.current = false;
            onClose();
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    async function save() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.saveGeneratedNotes(
                exerciseSet._id,
                { title, rawText }
            );

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                refreshData();
                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
            isSubmittingRef.current = false;
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            {isGenerated && (
                <>
                    <div className="flex justify-center items-center gap-2">
                        <p>type: </p>
                        <select
                            value={SourceType.RAW_TEXT}
                            disabled
                            className="py-[2px] px-2 border rounded-[10px] opacity-60 bg-surface text-text-primary"
                        >
                            <option value={SourceType.RAW_TEXT}>
                                {camelToTitleCase(SourceType.RAW_TEXT)}
                            </option>
                        </select>
                    </div>

                    <div className="flex justify-center items-center gap-2">
                        <p>title: </p>
                        <Input
                            onChange={(e) => setTitle(e.target.value)}
                            size={InputSize.LG}
                            value={title}
                            placeholder="title..."
                        />
                    </div>

                    <div className="w-72 sm:w-108 flex justify-center items-center gap-2">
                        <p>text: </p>
                        <Textarea
                            onChange={(e) => setRawText(e.target.value)}
                            value={rawText}
                            placeholder="lecture notes..."
                            size={TextareaSize.LG}
                            rows={isMobile ? 6 : 10}
                        />
                    </div>

                    <InformationText
                        text="This exercise set will be linked to the created source. If already linked to a source, the existing link will be replaced."
                    />

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={async () => await save()}
                    >
                        Create
                    </Button>
                </>
            )}
        </Modal>
    );
}
