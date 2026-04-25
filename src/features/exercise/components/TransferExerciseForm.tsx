import React from "react";
import { refreshExerciseSetsData } from "src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk";
import { ExerciseService } from "src/features/exercise/services/exercise.service";
import type { TransferExerciseDto } from "src/features/exercise/types/dto/transfer-exercise.dto";
import type { Exercise } from "src/features/exercise/types/exercise.interface";
import { tabsActions } from "src/features/workspace/features/tabs/store/tabs.slice";
import { Button } from "src/shared/components/Button";
import { Modal } from "src/shared/components/Modal";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export default function TransferExerciseForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    exercise,
    currentExerciseSetId,
    onClose,
    refreshData,
    setIsLoadingPageHidden
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>,
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    exercise: Exercise;
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
            const response = await ExerciseService.transfer(exercise._id, dto);

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                dispatch(refreshExerciseSetsData());
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
            <div className='absolute left-2 top-1'>
                <p className='font-bold'>{exercise.order + 1}</p>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p className="whitespace-nowrap">transfer to: </p>
                <select
                    name="exerciseSetId"
                    value={dto.exerciseSetId}
                    onChange={(event) => setDto({ ...dto, exerciseSetId: event.currentTarget.value })}
                    className="w-48 sm:w-72 py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
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
