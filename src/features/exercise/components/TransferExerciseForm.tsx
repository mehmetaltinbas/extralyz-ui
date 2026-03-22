import React from "react";
import { refreshExerciseSetData } from "src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk";
import { ExerciseService } from "src/features/exercise/services/exercise.service";
import type { TransferExerciseDto } from "src/features/exercise/types/dto/transfer-exercise.dto";
import { tabsActions } from "src/features/workspace/features/tabs/store/tabs.slice";
import { Button } from "src/shared/components/Button";
import { Modal } from "src/shared/components/Modal";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export default function TransferExerciseForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    exerciseId,
    currentExerciseSetId,
    onClose,
    refreshData,
    setIsLoadingPageHidden
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>,
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    exerciseId: string;
    currentExerciseSetId: string;
    onClose: () => void;
    refreshData: () => void;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();
    
    const exerciseSets = useAppSelector(state => state.exerciseSets);
    const otherExerciseSets = exerciseSets.filter(exerciseSet => exerciseSet._id !== currentExerciseSetId);
    
    const initialDto: TransferExerciseDto = {
        exerciseSetId: otherExerciseSets[0] ? otherExerciseSets[0]._id : ''
    };
    const [dto, setDto] = React.useState<TransferExerciseDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden]);

    async function transfer() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseService.transfer(exerciseId, dto);

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                dispatch(refreshExerciseSetData());
                dispatch(tabsActions.invalidateTabPropsById(dto.exerciseSetId));
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
            <div className="flex justify-start items-center gap-2">
                <p>transfer to: </p>
                <select
                    name="exerciseSetId"
                    value={dto.exerciseSetId}
                    onChange={(event) => setDto({ ...dto, exerciseSetId: event.currentTarget.value })}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    {otherExerciseSets.map(exerciseSet => (
                        <option
                            key={`option-to-transfer-${exerciseSet._id}`}
                            value={exerciseSet._id}
                        >
                            {exerciseSet.title}
                        </option>
                    ))}
                </select>
            </div>

            <Button
                onClick={transfer}
            >
                Transfer
            </Button>
        </Modal>
    );
}
