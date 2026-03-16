import React from 'react';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Textarea } from 'src/shared/components/Textarea';
import { TextareaSize } from 'src/shared/enums/textarea-size.enum';

export function OpenEndedExercisePracticeCard({
    exercise,
    index,
    recordAnswer,
    className,
}: {
    exercise: Exercise;
    index: number;
    recordAnswer: (exerciseId: string, answer: string | number) => void;
    className?: string;
}) {
    const [answer, setAnswer] = React.useState<string>('');

    function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setAnswer(event.currentTarget.value);
        recordAnswer(exercise._id, event.currentTarget.value);
    }

    return (
        <>
            <Textarea
                onChange={(event) => onChange(event)}
                value={answer}
                placeholder="answer..."
                size={TextareaSize.LG}
                rows={4}
            />
        </>
    );
}
