import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicExerciseSetService } from 'src/features/exercise-set/services/public-exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { PublicSourceService } from 'src/features/source/services/public-source.service';
import type { Source } from 'src/features/source/types/source.interface';
import { PublicExerciseSetCard } from 'src/features/public-visit/components/PublicExerciseSetCard';
import { PublicSourceCard } from 'src/features/public-visit/components/PublicSourceCard';
import { PublicPageHeader } from 'src/features/public-visit/components/PublicPageHeader';
import { UserService } from 'src/features/user/services/user.service';

export function PublicProfilePage() {
    const { userName } = useParams<{ userName: string }>();
    const [exerciseSets, setExerciseSets] = React.useState<ExerciseSet[]>([]);
    const [sources, setSources] = React.useState<Source[]>([]);
    const [userExists, setUserExists] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        if (!userName) return;

        async function fetchData() {
            const userResponse = await UserService.readPublicByUserName(userName!);

            if (!userResponse.isSuccess || !userResponse.user) {
                setUserExists(false);
                return;
            }

            setUserExists(true);

            const [setsResponse, sourcesResponse] = await Promise.all([
                PublicExerciseSetService.readAllPublicByUserName(userName!),
                PublicSourceService.readAllPublicByUserName(userName!),
            ]);

            if (setsResponse.isSuccess && setsResponse.exerciseSets) {
                setExerciseSets(setsResponse.exerciseSets);
            }

            if (sourcesResponse.isSuccess && sourcesResponse.sources) {
                setSources(sourcesResponse.sources);
            }
        }

        fetchData();
    }, [userName]);

    return (
        <div className="w-full min-h-screen flex flex-col justify-start items-center">
            <PublicPageHeader />

            <main className="w-full h-full flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-8">
                {userExists === null ? null : !userExists ? (
                    <div className="text-center py-20">
                        <p className="text-lg">User not found</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center gap-2 pb-8">
                            <p className="text-2xl font-bold">@{userName}</p>
                            <p className="text-text-secondary">
                                {exerciseSets.length} public exercise {exerciseSets.length === 1 ? 'set' : 'sets'}
                                {' · '}
                                {sources.length} public {sources.length === 1 ? 'source' : 'sources'}
                            </p>
                        </div>

                        {exerciseSets.length > 0 && (
                            <>
                                <p className="text-lg font-semibold pb-2">Exercise Sets</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center pb-8">
                                    {exerciseSets.map((exerciseSet) => (
                                        <PublicExerciseSetCard
                                            key={exerciseSet._id}
                                            exerciseSet={exerciseSet}
                                            userName={userName!}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {sources.length > 0 && (
                            <>
                                <p className="text-lg font-semibold pb-2">Sources</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center pb-8">
                                    {sources.map((source) => (
                                        <PublicSourceCard
                                            key={source._id}
                                            source={source}
                                            userName={userName!}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {exerciseSets.length === 0 && sources.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-text-secondary">No public content yet.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
