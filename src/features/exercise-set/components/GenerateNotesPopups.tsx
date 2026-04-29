import React from 'react';
import { GenerateNotesDecisionForm } from 'src/features/exercise-set/components/GenerateNotesDecisionForm';
import { SaveGeneratedNotesForm } from 'src/features/exercise-set/components/SaveGeneratedNotesForm';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { GenerateNotesDto } from 'src/features/exercise-set/types/dto/generate-notes.dto';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { userActions } from 'src/features/user/store/user.slice';
import { useAppDispatch } from 'src/store/hooks';

export function GenerateNotesPopups({
    isHidden,
    setIsHidden: _setIsHidden,
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
    const dispatch = useAppDispatch();

    const [step, setStep] = React.useState<'decision' | 'edit'>('decision');
    const [generated, setGenerated] = React.useState<{ title: string; rawText: string } | null>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isFormLocallyHidden, setIsFormLocallyHidden] = React.useState(false);

    React.useEffect(() => {
        if (isHidden && !isGenerating) {
            setStep('decision');
            setGenerated(null);
            setIsFormLocallyHidden(false);
        }
    }, [isHidden, isGenerating]);

    async function handleConfirmDecision(dto: GenerateNotesDto) {
        setIsGenerating(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.generateNotes(exerciseSet._id, dto);

            if (!response.isSuccess || !response.title || !response.rawText) {
                alert(response.message);
                onClose();
            } else {
                setGenerated({ title: response.title, rawText: response.rawText });
                setStep('edit');
            }
        } catch (error) {
            alert('internal error');
            onClose();
        } finally {
            setIsLoadingPageHidden(true);
            setIsGenerating(false);
            dispatch(userActions.fetchData());
        }
    }

    return (
        <>
            <GenerateNotesDecisionForm
                isHidden={isHidden || step !== 'decision' || isGenerating}
                onClose={onClose}
                onConfirm={handleConfirmDecision}
                onBeforeNavigateToBilling={() => setIsPopUpActive(false)}
                exerciseSet={exerciseSet}
                isGenerating={isGenerating}
            />
            <SaveGeneratedNotesForm
                isHidden={isHidden || step !== 'edit' || isFormLocallyHidden}
                setIsHidden={setIsFormLocallyHidden}
                setIsPopUpActive={setIsPopUpActive}
                onClose={onClose}
                setIsLoadingPageHidden={setIsLoadingPageHidden}
                refreshData={refreshData}
                exerciseSet={exerciseSet}
                initialTitle={generated?.title ?? ''}
                initialRawText={generated?.rawText ?? ''}
            />
        </>
    );
}
