import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import { usePublicExerciseSetPopups } from 'src/features/exercise-set/hooks/use-public-exercise-set-popups.hook';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { exerciseTypeFactory } from 'src/features/exercise/strategies/type/exercise-type.factory';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Section } from 'src/features/workspace/enums/section.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { storeAuthRedirectUrl } from 'src/shared/utils/auth-redirect/store-auth-redirect-url.util';
import { useAppDispatch } from 'src/store/hooks';

export function PublicExerciseSetViewPageContent({
    exerciseSet,
    exercises,
    userName
}: {
    exerciseSet: ExerciseSet;
    exercises: Exercise[];
    userName: string;
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
    const [isAnswersHidden, setIsAnswersHidden] = React.useState<boolean>(true);

    const { openCloneExerciseSetForm, openViewPdfDecision } = usePublicExerciseSetPopups();

    React.useEffect(() => {
        async function checkAuth() {
            const response = await AuthService.authorize();
            setIsAuthenticated(response.isSuccess);
        }

        checkAuth();
    }, []);

    function openInWorkspaceOrRedirect(section: Section, mode?: string) {
        if (!exerciseSet || !userName) return;

        if (isAuthenticated) {
            dispatch(
                tabsActions.openTab({
                    section,
                    id: exerciseSet._id,
                    title: exerciseSet.title,
                    mode,
                    meta: { ownerUserName: userName },
                })
            );

            navigate('/workspace');
        } else {
            storeAuthRedirectUrl(window.location.pathname);

            navigate('/sign-in');
        }
    }

    function validateOrRedirect(): boolean {
        if (!exerciseSet) return false;

        if (!isAuthenticated) {
            storeAuthRedirectUrl(window.location.pathname);

            navigate('/sign-in');

            return false;
        }

        return true;
    }

    return (
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8">
            <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl font-bold">{exerciseSet.title}</p>

                    <p className="text-text-secondary">
                        by{' '}
                        <span onClick={() => navigate(`/user/${userName}`)} className='cursor-pointer'>@{userName}</span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <p><span>Type:</span> <span className="italic">{exerciseSet.type}</span></p>

                    <p>|</p>

                    <p><span>Difficulty:</span> <span className="italic">{exerciseSet.difficulty}</span></p>

                    <p>|</p>

                    <p><span>Count:</span> <span className="italic">{exerciseSet.count}</span></p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                        onClick={() =>
                            openInWorkspaceOrRedirect(
                                Section.PUBLIC_EXERCISE_SET,
                            )
                        }
                    >
                        Open in Workspace
                    </Button>

                    <Button
                        onClick={() => {
                            openViewPdfDecision();
                        }}
                    >
                        View as PDF
                    </Button>

                    <Button 
                        onClick={() => {
                            const isValidated = validateOrRedirect();
                            if (!isValidated) return;
                            openCloneExerciseSetForm();
                        }}
                    >
                        Clone to My Sets
                    </Button>

                    <Button 
                        variant={ButtonVariant.SECONDARY}
                        onClick={() => {
                            setIsAnswersHidden(prev => !prev);
                        }}
                    >
                        {isAnswersHidden ? 'Show Answers' : 'Hide Answers'}
                    </Button>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {exercises.map((exercise) => {
                        const strategy = exerciseTypeFactory.resolveStrategy(exercise.type);

                        return (
                            <div key={exercise._id} className="flex justify-center items-center">
                                <div className="relative w-full max-w-[250px] md:max-w-[300px] h-[250px] md:h-[300px] border rounded-[10px] px-8 py-8 text-sm md:text-base">
                                    <div className="w-full h-full overflow-y-auto">
                                        {strategy?.getRestOfExerciseCard(exercise, isAnswersHidden)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
