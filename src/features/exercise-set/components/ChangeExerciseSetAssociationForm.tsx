import React from "react";
import { ExerciseSetContextType } from "src/features/exercise-set/enums/exercise-set-context-type.enum";
import { ExerciseSetService } from "src/features/exercise-set/services/exercise-set.service";
import { refreshExerciseSetsData } from "src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk";
import type { ChangeExerciseSetContextDto } from "src/features/exercise-set/types/dto/change-exercise-set-context.dto";
import type { ExerciseSet } from "src/features/exercise-set/types/exercise-set.interface";
import { tabsActions } from "src/features/workspace/features/tabs/store/tabs.slice";
import { Button } from "src/shared/components/Button";
import { Modal } from "src/shared/components/Modal";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export function ChangeExerciseSetAssociationForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    onClose,
    setIsLoadingPageHidden,
    refreshData,
    exerciseSet,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: () => void;
    exerciseSet: ExerciseSet;
}) {
    const dispatch = useAppDispatch();

    const sources = useAppSelector(state => state.sources);
    const groups = useAppSelector(state => state.exerciseSetGroups);
    const availableSources = sources.filter(source =>
        exerciseSet.contextType === ExerciseSetContextType.SOURCE
            ? source._id !== exerciseSet.contextId
            : true
    );
    const availableGroups = groups.filter(group =>
        exerciseSet.contextType === ExerciseSetContextType.GROUP
            ? group._id !== exerciseSet.contextId
            : true
    );

    const initialDto: ChangeExerciseSetContextDto = {
        contextType: exerciseSet.contextType,
        contextId: exerciseSet.contextType === ExerciseSetContextType.SOURCE && availableSources.length > 0 ? availableSources[0]._id :
            exerciseSet.contextType === ExerciseSetContextType.GROUP && availableGroups.length > 0 ? availableGroups[0]._id :
            '',
    };
    const [dto, setDto] = React.useState<ChangeExerciseSetContextDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden, exerciseSet._id, exerciseSet.contextId, exerciseSet.contextType]);

    function handleSourceTypeChange(contextType: ExerciseSetContextType) {
        if (contextType === ExerciseSetContextType.INDEPENDENT) {
            setDto({ contextType, contextId: '' });
        } else if (contextType === ExerciseSetContextType.GROUP) {
            setDto({ contextType, contextId: availableGroups[0]?._id ?? '' });
        } else {
            setDto({ contextType, contextId: availableSources[0]?._id ?? '' });
        }
    }

    async function submit() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.changeContext(exerciseSet._id, dto);

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                dispatch(refreshExerciseSetsData());
                dispatch(tabsActions.invalidateTabPropsById(exerciseSet._id));
                refreshData();
                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
            isSubmittingRef.current = false;
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="flex flex-col justify-start items-center gap-4">
                <div className="flex justify-start items-center gap-2">
                    <p>Association Type:</p>
                    <select
                        name="contextType"
                        value={dto.contextType}
                        onChange={(event) => handleSourceTypeChange(event.currentTarget.value as ExerciseSetContextType)}
                        className="py-[2px] px-2 border rounded-[10px]"
                    >
                        {Object.values(ExerciseSetContextType).map(type => (
                            <option key={`source-type-${type}`} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {dto.contextType === ExerciseSetContextType.SOURCE && (
                    <div className="flex justify-start items-center gap-2">
                        <p>Source:</p>
                        <select
                            name="contextId"
                            value={dto.contextId}
                            onChange={(event) => setDto({ ...dto, contextId: event.currentTarget.value })}
                            className="w-48 sm:w-72 py-[2px] px-2 border rounded-[10px]"
                        >
                            {availableSources.map(source => (
                                <option
                                    key={`option-source-${source._id}`}
                                    value={source._id}
                                >
                                    {source.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {dto.contextType === ExerciseSetContextType.GROUP && (
                    <div className="flex justify-start items-center gap-2">
                        <p>Group:</p>
                        <select
                            name="contextId"
                            value={dto.contextId}
                            onChange={(event) => setDto({ ...dto, contextId: event.currentTarget.value })}
                            className="py-[2px] px-2 border rounded-[10px]"
                        >
                            {availableGroups.map(group => (
                                <option
                                    key={`option-group-${group._id}`}
                                    value={group._id}
                                >
                                    {group.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <Button onClick={submit}>
                Change
            </Button>
        </Modal>
    );
}
