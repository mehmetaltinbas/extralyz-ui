import React from 'react';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';
import { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import type { CreateExerciseSetDto } from 'src/features/exercise-set/types/dto/create-exercise-set.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputType } from 'src/shared/enums/input-type.enum';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';
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
        type: ExerciseSetType.MIX,
        difficulty: ExerciseSetDifficulty.MIX,
        visibility: ExerciseSetVisibility.PRIVATE,
    };

    const [createExerciseSetDto, setCreateExerciseSetDto] =
        React.useState<CreateExerciseSetDto>(initialDto);
    const [selectedSourceId, setSelectedSourceId] = React.useState<string>(
        sourceId ?? ExerciseSetSourceType.INDEPENDENT
    );
    const sources = useAppSelector((state) => state.sources);
    const groups = useAppSelector((state) => state.exerciseSetGroups);

    const isSubmittingRef = React.useRef(false);

    function resetForm() {
        setCreateExerciseSetDto(initialDto);
    }

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            resetForm();
        }
    }, [isHidden]);

    React.useEffect(() => {
        setSelectedSourceId(sourceId ?? ExerciseSetSourceType.INDEPENDENT);
    }, [sourceId]);

    async function createExerciseSet() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        let resolvedSourceId: string | undefined;
        if (sourceId) {
            resolvedSourceId = sourceId;
        } else if (selectedSourceId === ExerciseSetSourceType.INDEPENDENT) {
            resolvedSourceId = undefined;
        } else if (selectedSourceId.startsWith('group:')) {
            resolvedSourceId = selectedSourceId.slice('group:'.length);
        } else {
            resolvedSourceId = selectedSourceId;
        }

        const response = await ExerciseSetService.create(
            resolvedSourceId,
            createExerciseSetDto
        );

        setIsLoadingPageHidden(true);

        if (!response.isSuccess) {
            alert(response.message);

            setIsHidden(false);

            isSubmittingRef.current = false;

            return;
        }

        isSubmittingRef.current = false;

        resetForm();

        dispatch(refreshExerciseSetsData());

        setIsPopUpActive(false);
    }

    function onChangeForEnum(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectElement = event.currentTarget;

        if (!Object.keys(createExerciseSetDto).includes(selectElement.name)) {
            return;
        }

        if (
            !(Object.values(ExerciseSetType) as string[]).includes(selectElement.value) &&
            !(Object.values(ExerciseSetDifficulty) as string[]).includes(selectElement.value) &&
            !(Object.values(ExerciseSetVisibility) as string[]).includes(selectElement.value)
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
                <Input
                    name="title"
                    value={createExerciseSetDto.title}
                    onChange={(e) => setCreateExerciseSetDto({ ...createExerciseSetDto, title: e.currentTarget.value })}
                />
            </div>

            {selectedSourceId !== ExerciseSetSourceType.INDEPENDENT && !selectedSourceId.startsWith('group:') && (
                <div className="flex justify-start items-center gap-2">
                    <p>count: </p>
                    <Input
                        name="count"
                        type={InputType.NUMBER}
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
                    {Object.values(ExerciseSetType).map((exerciseSetTypeValue, index) => (
                        <option key={`exercise-set-type-value-${index}`} value={exerciseSetTypeValue}>{camelToTitleCase(exerciseSetTypeValue)}</option>
                    ))}
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
                    {Object.values(ExerciseSetDifficulty).map((exerciseSetDifficultyValue, index) => (
                        <option key={`exercise-set-difficulty-value-${index}`} value={exerciseSetDifficultyValue}>{camelToTitleCase(exerciseSetDifficultyValue)}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>visibility: </p>
                <select
                    name="visibility"
                    value={createExerciseSetDto.visibility}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value={ExerciseSetVisibility.PRIVATE}>Private</option>
                    <option value={ExerciseSetVisibility.PUBLIC}>Public</option>
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
                        {groups.length > 0 && (
                            <optgroup label="Groups">
                                {groups.map((group) => (
                                    <option key={group._id} value={`group:${group._id}`}>
                                        {group.title}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                        {sources.length > 0 && (
                            <optgroup label="Sources">
                                {sources.map((source) => (
                                    <option key={source._id} value={source._id}>
                                        {source.title}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                    </select>
                </div>
            )}

            <Button variant={ButtonVariant.PRIMARY} onClick={createExerciseSet}>
                Create
            </Button>
        </Modal>
    );
}
