import React from 'react';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { UpdateExerciseSetDto } from 'src/features/exercise-set/types/dto/update-exercise-set.dto';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function UpdateExerciseSetForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    refreshData,
    exerciseSet,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    refreshData: () => void;
    exerciseSet: ExerciseSet;
}) {
    const dispatch = useAppDispatch();

    const initialDto: UpdateExerciseSetDto = {
        title: exerciseSet.title,
    };
    const [dto, setDto] = React.useState<UpdateExerciseSetDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden, exerciseSet]);

    async function update() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.updateById(
                exerciseSet._id,
                dto
            );

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                refreshData();

                dispatch(tabsActions.invalidateTabPropsById(exerciseSet._id));

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
                <div className="flex justify-start items-center gap-2">
                    <p>title: </p>
                    <Input
                        value={dto.title}
                        onChange={(e) =>
                            setDto({
                                ...dto,
                                title: e.currentTarget.value,
                            })
                        }
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
