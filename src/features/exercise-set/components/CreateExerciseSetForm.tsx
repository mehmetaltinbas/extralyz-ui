import React from 'react';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetData } from 'src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk';
import type { CreateExerciseSetDto } from 'src/features/exercise-set/types/dto/create-exercise-set.dto';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function CreateExerciseSetForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    onClose,
    sourceId,
    setIsLoadingPageHidden,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    sourceId: string | undefined;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();

    const initialDto: CreateExerciseSetDto = {
        title: '',
        count: 5,
        type: ExerciseSetType.MCQ,
        difficulty: ExerciseSetDifficulty.MEDIUM,
    };

    const [createExerciseSetDto, setCreateExerciseSetDto] =
        React.useState<CreateExerciseSetDto>(initialDto);
    const [selectedSourceId, setSelectedSourceId] = React.useState<string | undefined>(
        sourceId
    );
    const sources = useAppSelector((state) => state.sources);

    React.useEffect(() => {
        setCreateExerciseSetDto(initialDto);
    }, [isHidden]);

    React.useEffect(() => {
        setSelectedSourceId(sourceId);
    }, [sourceId]);

    async function createExerciseSet() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const response = await ExerciseSetService.create(
            sourceId ??
                (selectedSourceId === ExerciseSetSourceType.INDEPENDENT
                    ? undefined
                    : selectedSourceId),
            createExerciseSetDto
        );

        setIsLoadingPageHidden(true);

        if (!response.isSuccess) {
            alert(response.message);
            setIsHidden(false);
        } else {
            dispatch(refreshExerciseSetData());
            setIsPopUpActive(false);
        }
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
        <Modal isHidden={isHidden} onClose={onClose}>
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
                        name="count"
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
                        {sources.map((source) => (
                            <option key={source._id} value={source._id}>
                                {source.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <Button variant={ButtonVariant.PRIMARY} onClick={createExerciseSet}>
                Generate
            </Button>
        </Modal>
    );
}
