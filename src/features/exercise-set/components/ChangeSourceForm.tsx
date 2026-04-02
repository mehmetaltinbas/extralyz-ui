import React from "react";
import { ExerciseSetSourceType } from "src/features/exercise-set/enums/exercise-set-source-type.enum";
import { ExerciseSetService } from "src/features/exercise-set/services/exercise-set.service";
import { refreshExerciseSetsData } from "src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk";
import type { ChangeSourceDto } from "src/features/exercise-set/types/dto/change-source.dto";
import type { ExerciseSet } from "src/features/exercise-set/types/exercise-set.interface";
import { tabsActions } from "src/features/workspace/features/tabs/store/tabs.slice";
import { Button } from "src/shared/components/Button";
import { Modal } from "src/shared/components/Modal";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export function ChangeSourceForm({
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
    const availableSources = sources.filter(source =>
        exerciseSet.sourceType === ExerciseSetSourceType.SOURCE
            ? source._id !== exerciseSet.sourceId
            : true
    );

    const initialDto: ChangeSourceDto = {
        sourceType: exerciseSet.sourceType,
        sourceId: exerciseSet.sourceId,
    };
    const [dto, setDto] = React.useState<ChangeSourceDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden]);

    function handleSourceTypeChange(sourceType: string) {
        if (sourceType === ExerciseSetSourceType.INDEPENDENT) {
            setDto({ sourceType, sourceId: '' });
        } else {
            setDto({ sourceType, sourceId: availableSources[0]?._id ?? '' });
        }
    }

    async function submit() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.changeSource(exerciseSet._id, dto);

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
            <div className="flex flex-col justify-start items-start gap-4">
                <div className="flex justify-start items-center gap-2">
                    <p>Source Type:</p>
                    <select
                        name="sourceType"
                        value={dto.sourceType}
                        onChange={(event) => handleSourceTypeChange(event.currentTarget.value)}
                        className="py-[2px] px-2 border rounded-[10px]"
                    >
                        {Object.values(ExerciseSetSourceType).map(type => (
                            <option key={`source-type-${type}`} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {dto.sourceType === ExerciseSetSourceType.SOURCE && (
                    <div className="flex justify-start items-center gap-2">
                        <p>Source:</p>
                        <select
                            name="sourceId"
                            value={dto.sourceId}
                            onChange={(event) => setDto({ ...dto, sourceId: event.currentTarget.value })}
                            className="py-[2px] px-2 border rounded-[10px]"
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
            </div>

            <Button onClick={submit}>
                Change Source
            </Button>
        </Modal>
    );
}
