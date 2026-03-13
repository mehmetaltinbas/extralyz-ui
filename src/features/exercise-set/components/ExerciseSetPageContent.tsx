import React from 'react';
import { useExerciseSetPopups } from 'src/features/exercise-set/hooks/use-exercise-set-popups.hook';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { ExerciseCard } from 'src/features/exercise/components/ExerciseCard';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function ExerciseSetPageContent({
    exerciseSet,
    exercises,
}: {
    exerciseSet: ExerciseSet;
    exercises: Exercise[];
}) {
    const dispatch = useAppDispatch();
    const [isAnswersHidden, setIsAnswersHidden] = React.useState<boolean>(true);
    const { openCreateExerciseForm, openStartPracticeDecision, openUpdateExerciseSetForm, openExerciseSetDeleteApproval } = useExerciseSetPopups();

    async function viewPdf() {
        const response = await ExerciseSetService.getPdf(exerciseSet._id);

        if (!response.isSuccess || !response.pdfBase64) {
            alert(response.message);
            return;
        }

        // 1. Decode the Base64 string into raw binary characters
        const byteCharacters = atob(response.pdfBase64);
        
        // 2. Convert the characters into an array of byte numbers
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // 3. Create a Blob formatted as a PDF
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // 4. Create a temporary local URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // 5. Open the PDF in a new browser tab
        window.open(url, '_blank');
    }

    function toggleAnswerVisibility() {
        setIsAnswersHidden((prev) => !prev);
    }

    return (
        <div // main
            className="absolute w-full h-full
            flex flex-col justify-start items-start gap-4
            p-4"
        >
            <div
                className="w-full h-auto
                flex flex-col justif-center items-start gap-2"
            >
                <p><span className='font-bold'>Type:</span> <span className='italic'>{exerciseSet.type}</span></p>

                <p><span className='font-bold'>Count:</span> <span className='italic'>{exerciseSet.count}</span></p>

                <p><span className='font-bold'>Difficulty:</span><span className='italic'> {exerciseSet.difficulty}</span></p>

                <Button
                    onClick={openCreateExerciseForm}
                >
                    Generate Exercise
                </Button>

                <Button variant={ButtonVariant.OUTLINE} onClick={toggleAnswerVisibility}>
                    {isAnswersHidden ? 'Show Answers' : 'Hide Answers'}
                </Button>

                <Button
                    onClick={openStartPracticeDecision}
                >
                    Start Practice
                </Button>

                <Button
                    onClick={viewPdf}
                >
                    View as PDF
                </Button>

                <Button
                    onClick={openUpdateExerciseSetForm}
                >
                    Update
                </Button>

                <Button
                    variant={ButtonVariant.DANGER}
                    onClick={openExerciseSetDeleteApproval}
                >
                    Delete
                </Button>
            </div>

            <div
                className="w-full h-full
                grid grid-cols-3 gap-4 pb-12"
            >
                {exercises.map((exercise) => (
                    <ExerciseCard
                        key={`exercise-card-${exercise._id}`}
                        exercise={exercise}
                        isAnswersHidden={isAnswersHidden}
                    />
                ))}
            </div>
        </div>
    );
}