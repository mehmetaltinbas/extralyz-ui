import React from 'react';
import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { UpdateExerciseSetDto } from 'src/features/exercise-set/types/dto/update-exercise-set.dto';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function UpdateExerciseSetForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    toggle,
    refreshData,
    exerciseSet,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    refreshData: () => void;
    exerciseSet: ExerciseSet;
}) {
    const dispatch = useAppDispatch();

    const initialDto: UpdateExerciseSetDto = {
        title: exerciseSet.title,
    };
    const [dto, setDto] = React.useState<UpdateExerciseSetDto>(initialDto);

    React.useEffect(() => {
        setDto(initialDto);
    }, [isHidden, exerciseSet]);

    async function update() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await exerciseSetService.updateById(
                exerciseSet._id,
                dto
            );

            if (!response.isSuccess) {
                alert(response.message);
                setIsHidden(false);
            } else {
                refreshData();

                dispatch(tabsActions.invalidateTabPropsById(exerciseSet._id));

                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={toggle}>
            <div className="flex justify-start items-center gap-2">
                <div className="flex justify-start items-center gap-2">
                    <p>title: </p>
                    <input
                        value={dto.title}
                        onChange={(e) =>
                            setDto({
                                ...dto,
                                title: e.currentTarget.value,
                            })
                        }
                        className="w-64 py-[2px] px-2 border rounded-[10px]"
                    />
                </div>
            </div>

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async (event) => await update()}
            >
                Update
            </Button>
        </Modal>
    );
}
