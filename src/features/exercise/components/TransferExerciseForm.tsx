import React from "react";
import { exerciseSetsActions } from "src/features/exercise-set/store/exercise-sets.slice";
import { independentExerciseSetsActions } from "src/features/exercise-set/store/independent-exercise-sets.slice";
import { exerciseService } from "src/features/exercise/services/exercise.service";
import type { TransferExerciseDto } from "src/features/exercise/types/dto/transfer-exercise.dto";
import { extendedSourcesActions } from "src/features/source/store/extended-sources.slice";
import { tabsActions } from "src/features/workspace/features/tabs/store/tabs.slice";
import { Button } from "src/shared/components/Button";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export default function TransferExerciseForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    exerciseId,
    refreshData,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>,
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    exerciseId: string;
    refreshData: () => Promise<void>;
}) {
    const dispatch = useAppDispatch();

    const exerciseSets = useAppSelector(state => state.exerciseSets);
    
    const [dto, setDto] = React.useState<TransferExerciseDto>({
        exerciseSetId: exerciseSets[0]._id
    });

    function toggleModal() {
        setIsHidden(prev => !prev);
        setIsPopUpActive(prev => !prev);
    }

    async function handleTransfer() {
        const response = await exerciseService.transfer(exerciseId, dto);

        if (!response.isSuccess) alert(response.message);

        else {
            dispatch(extendedSourcesActions.fetchData());
            dispatch(independentExerciseSetsActions.fetchData());
            dispatch(exerciseSetsActions.fetchData());
            dispatch(tabsActions.invalidateTabPropsById(dto.exerciseSetId));
            toggleModal();
            await refreshData();
        };
    }

    return (
        <div
            className={`${isHidden && 'hidden'} relative border px-4 py-4 bg-white rounded-[10px]
            flex flex-col justify-center items-center gap-2`}
        >
            <button 
                className="absolute top-0 right-1.5 text-gray-400 hover:text-black cursor-pointer"
                onClick={toggleModal}
            >
                x
            </button>

            <div className="flex justify-start items-center gap-2 pt-4">
                <p>transfer to: </p>
                <select
                    name="exerciseSetId"
                    value={dto.exerciseSetId}
                    onChange={(event) => setDto({ ...dto, exerciseSetId: event.currentTarget.value })}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    {exerciseSets.map(exerciseSet => (
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
                onClick={handleTransfer}
            >
                Transfer
            </Button>
        </div>
    );
}
