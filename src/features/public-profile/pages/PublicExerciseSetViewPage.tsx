import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicExerciseSetPopupsProvider } from 'src/features/exercise-set/components/PublicExerciseSetPopupsProvider';
import { PublicExerciseSetService } from 'src/features/exercise-set/services/public-exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { PublicExerciseService } from 'src/features/exercise/services/public-exercise.service';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { PublicExerciseSetViewPageContent } from 'src/features/public-profile/pages/PublicExerciseSetViewPageContent';

export function PublicExerciseSetViewPage() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const { userName, title } = useParams<{ userName: string; title: string }>();

    const [exerciseSet, setExerciseSet] = React.useState<ExerciseSet | null>(null);
    const [exercises, setExercises] = React.useState<Exercise[]>([]);

    const decodedTitle = title ? decodeURIComponent(title) : '';

    React.useEffect(() => {
        if (!userName || !decodedTitle) return;

        async function fetchData() {
            const setsResponse = await PublicExerciseSetService.readAllPublicByUserName(userName!);

            if (!setsResponse.isSuccess || !setsResponse.exerciseSets) {
                return;
            }

            const found = setsResponse.exerciseSets.find((s) => s.title === decodedTitle);

            if (!found) {
                return;
            }

            setExerciseSet(found);

            const exercisesResponse = await PublicExerciseService.readAllPublicByExerciseSetId(found._id);

            if (exercisesResponse.isSuccess && exercisesResponse.exercises) {
                setExercises(exercisesResponse.exercises);
            }
        }

        fetchData();
    }, [userName, decodedTitle]);

    return (
        <div className={`w-full h-full`}>
            {exerciseSet && exercises && userName ? (
                <div
                    ref={containerRef}
                    className={`w-full h-full relative w-full h-full`}
                >
                    <PublicExerciseSetPopupsProvider
                        containerRef={containerRef}
                        exerciseSet={exerciseSet}
                        exercises={exercises}
                    >
                        <PublicExerciseSetViewPageContent
                            exerciseSet={exerciseSet}
                            exercises={exercises}
                            userName={userName}
                        />
                    </PublicExerciseSetPopupsProvider>
                </div>
            ) : (
                <div>undefined</div>
            )}
        </div>
    );
}
