import React from 'react';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

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
            <textarea
                onChange={(event) => onChange(event)}
                value={answer}
                placeholder="answer..."
                className="w-full p-2 border rounded-[10px] focus:outline-none"
                rows={4}
            />
        </>
    );
}
