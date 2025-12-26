import type React from 'react';
import { useEffect, useState } from 'react';
import { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import { extendedSourcesActions } from 'src/features/source/store/extended-sources.slice';
import { ClaretButton } from 'src/shared/components/buttons/ClaretButton';
import { useAppDispatch } from 'src/store/hooks';
import { BlackButton } from '../../../shared/components/buttons/BlackButton';
import { exerciseSetService } from '../services/exercise-set.service';
import type { CreateExerciseSetDto } from '../types/dto/create-exercise-set.dto';

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
    sourceId: string;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();
    const [createExerciseSetDto, setCreateExerciseSetDto] = useState<CreateExerciseSetDto>({
        count: 5,
        type: ExerciseSetType.OPEN_ENDED,
        difficulty: ExerciseSetDifficulty.MEDIUM,
    });

    useEffect(() => {
        setCreateExerciseSetDto({
            count: 5,
            type: ExerciseSetType.OPEN_ENDED,
            difficulty: ExerciseSetDifficulty.MEDIUM,
        });
    }, [isHidden]);

    async function createExerciseSet() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);
        const response = await exerciseSetService.create(sourceId, createExerciseSetDto);
        dispatch(extendedSourcesActions.fetchData());
        setIsLoadingPageHidden(true);
        alert(response.message);
        setIsPopUpActive(false);
    }

    function onChangeForEnum(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectElement = event.currentTarget;
        if (!Object.keys(createExerciseSetDto).includes(selectElement.name)) return;
        if (!(Object.values(ExerciseSetType) as string[]).includes(selectElement.value) && !(Object.values(ExerciseSetDifficulty) as string[]).includes(selectElement.value)) return;
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
                <ClaretButton onClick={(event) => toggle()}>X</ClaretButton>
            </div>
            <div className="flex justify-start items-center gap-2">
                <p>count: </p>
                <input
                    type="number"
                    value={createExerciseSetDto.count}
                    onChange={(e) =>
                        setCreateExerciseSetDto({
                            ...createExerciseSetDto,
                            count: Number(e.target.value),
                        })
                    }
                    className="w-[50px] py-[2px] px-2 border rounded-[10px]"
                />
            </div>
            <div className="flex justify-start items-center gap-2">
                <p>type: </p>
                <select
                name='type'
                    value={createExerciseSetDto.type}
                    onChange={(e) =>
                        onChangeForEnum(e)
                    }
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ExerciseSetType.MCQ}>Multiple Choice</option>
                    <option value={ExerciseSetType.TRUE_FALSE}>True False</option>
                    <option value={ExerciseSetType.OPEN_ENDED}>Open Ended</option>
                    <option value={ExerciseSetType.SHORT}>Short Answer</option>
                </select>
            </div>
            <div className="flex justify-start items-center gap-2">
                <p>difficulty: </p>
                <select
                    name='difficulty'
                    value={createExerciseSetDto.difficulty}
                    onChange={(e) =>
                        onChangeForEnum(e)
                    }
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value="">select</option>
                    <option value={ExerciseSetDifficulty.EASY}>Easy</option>
                    <option value={ExerciseSetDifficulty.MEDIUM}>Medium</option>
                    <option value={ExerciseSetDifficulty.HARD}>Hard</option>
                </select>
            </div>
            <BlackButton
                onClick={async (event) => {
                    await createExerciseSet();
                }}
            >
                Generate
            </BlackButton>
        </div>
    );
}
