import type React from 'react';
import { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { ActionMenu } from 'src/shared/components/ActionMenu';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppSelector } from 'src/store/hooks';

export function ExerciseSetActionMenu({
    isHidden,
    setIsHidden,
    exerciseSet,
    ref,
    toggleStartPracticeDecision,
    toggleUpdateExerciseSetForm,
    toggleDeleteApproval,
    toggleGenerateNotesForm
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    exerciseSet?: ExerciseSet;
    ref: React.RefObject<HTMLDivElement | null>;
    toggleStartPracticeDecision: () => void;
    toggleUpdateExerciseSetForm: () => void;
    toggleDeleteApproval: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    toggleGenerateNotesForm: () => void;
}) {
    const user = useAppSelector((state) => state.user);

    function handleCopyPublicLink() {
        if (!exerciseSet || !user) return;

        const uiUrl = import.meta.env.VITE_UI_URL || window.location.origin;
        const url = `${uiUrl}/user/${user.userName}/exercise-set/${encodeURIComponent(exerciseSet.title)}`;

        navigator.clipboard.writeText(url);

        alert('Public link copied to clipboard!');
    }

    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            {exerciseSet && (
                <>
                    <Button
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleStartPracticeDecision();
                            setIsHidden(true);
                        }}
                        disabled={!exerciseSet || exerciseSet.count === 0}
                    >
                        Start Practice
                    </Button>

                    <Button
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleGenerateNotesForm();
                            setIsHidden(true);
                        }}
                    >
                        Generate Notes
                    </Button>

                    <Button
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleUpdateExerciseSetForm();
                            setIsHidden(true);
                        }}
                    >
                        Update
                    </Button>

                    <Button
                        variant={ButtonVariant.DANGER}
                        size={ButtonSize.SM}
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleDeleteApproval(event);
                            setIsHidden((prev) => !prev);
                        }}
                    >
                        Delete
                    </Button>

                    {exerciseSet.visibility === ExerciseSetVisibility.PUBLIC && (
                        <Button
                            size={ButtonSize.SM}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleCopyPublicLink();
                                setIsHidden(true);
                            }}
                        >
                            Copy Public Link
                        </Button>
                    )}
                </>
            )}
        </ActionMenu>
    );
}
