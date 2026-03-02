import React from 'react';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';
import { independentExerciseSetsActions } from 'src/features/exercise-set/store/independent-exercise-sets.slice';
import type { CreateExerciseSetDto } from 'src/features/exercise-set/types/dto/create-exercise-set.dto';
import { extendedSourcesActions } from 'src/features/source/store/extended-sources.slice';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function CreateExerciseSetForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    toggle,
    sourceId,
    setIsLoadingPageHidden,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    sourceId: string | undefined;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();
    const [createExerciseSetDto, setCreateExerciseSetDto] =
        React.useState<CreateExerciseSetDto>({
            title: '',
            count: 5,
            type: ExerciseSetType.MCQ,
            difficulty: ExerciseSetDifficulty.MEDIUM,
        });
    const [selectedSourceId, setSelectedSourceId] = React.useState<string | undefined>(
        sourceId
    );
    const extendedSources = useAppSelector((state) => state.extendedSources);

    React.useEffect(() => {
        setCreateExerciseSetDto({
            title: '',
            count: 5,
            type: ExerciseSetType.OPEN_ENDED,
            difficulty: ExerciseSetDifficulty.MEDIUM,
        });
    }, [isHidden]);

    React.useEffect(() => {
        setSelectedSourceId(sourceId);
    }, [sourceId]);

    async function createExerciseSet() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const response = await exerciseSetService.create(
            sourceId ??
                (selectedSourceId === ExerciseSetSourceType.INDEPENDENT
                    ? undefined
                    : selectedSourceId),
            createExerciseSetDto
        );

        dispatch(extendedSourcesActions.fetchData());
        dispatch(independentExerciseSetsActions.fetchData());
        dispatch(exerciseSetsActions.fetchData());

        setIsLoadingPageHidden(true);
        if (!response.isSuccess) alert(response.message);
        setIsPopUpActive(false);
    }

    function onChangeForEnum(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectElement = event.currentTarget;

        if (!Object.keys(createExerciseSetDto).includes(selectElement.name)) {
            return;
        }

        if (
            !(Object.values(ExerciseSetType) as string[]).includes(selectElement.value) &&
            !(Object.values(ExerciseSetDifficulty) as string[]).includes(selectElement.value)
        ) {
            return;
        }

        setCreateExerciseSetDto({
            ...createExerciseSetDto,
            [selectElement.name]: selectElement.value,
        });
    }

    return (
        <div
            className={`${isHidden ? 'hidden' : ''} relative border px-2 py-4 bg-white rounded-[10px]
            flex flex-col justify-center items-center gap-2`}
        >
            <div className="absolute top-1 right-1 w-full flex justify-end items-center">
                <Button variant={ButtonVariants.DANGER} onClick={(event) => toggle()}>
                    X
                </Button>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>title: </p>
                <input
                    name="title"
                    value={createExerciseSetDto.title}
                    onChange={(e) => setCreateExerciseSetDto({ ...createExerciseSetDto, title: e.currentTarget.value })}
                    className="py-[2px] px-2 border rounded-[10px]"
                />
            </div>

            {selectedSourceId !== ExerciseSetSourceType.INDEPENDENT && (
                <div className="flex justify-start items-center gap-2">
                    <p>count: </p>
                    <input
                        type="number"
                        value={
                            !selectedSourceId ||
                            selectedSourceId === ExerciseSetSourceType.INDEPENDENT
                                ? 0
                                : createExerciseSetDto.count
                        }
                        onChange={(e) =>
                            setCreateExerciseSetDto({
                                ...createExerciseSetDto,
                                count: Number(e.target.value),
                            })
                        }
                        className="w-[50px] py-[2px] px-2 border rounded-[10px]"
                    />
                </div>
            )}

            <div className="flex justify-start items-center gap-2">
                <p>type: </p>
                <select
                    name="type"
                    value={createExerciseSetDto.type}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ExerciseSetType.MCQ}>Multiple Choice</option>
                    <option value={ExerciseSetType.TRUE_FALSE}>True False</option>
                    <option value={ExerciseSetType.OPEN_ENDED}>Open Ended</option>
                </select>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>difficulty: </p>
                <select
                    name="difficulty"
                    value={createExerciseSetDto.difficulty}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ExerciseSetDifficulty.EASY}>Easy</option>
                    <option value={ExerciseSetDifficulty.MEDIUM}>Medium</option>
                    <option value={ExerciseSetDifficulty.HARD}>Hard</option>
                </select>
            </div>

            {!sourceId && (
                <div className="flex justify-start items-center gap-2">
                    <p>source: </p>
                    <select
                        name="sourceId"
                        value={selectedSourceId}
                        onChange={(e) => setSelectedSourceId(e.currentTarget.value)}
                        className="py-[2px] px-2 border rounded-[10px]"
                    >
                        <option value={ExerciseSetSourceType.INDEPENDENT}>Independent</option>
                        {extendedSources.map((extendedSource) => (
                            <option key={extendedSource._id} value={extendedSource._id}>
                                {extendedSource.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <Button variant={ButtonVariants.PRIMARY} onClick={createExerciseSet}>
                Generate
            </Button>
        </div>
    );
}
