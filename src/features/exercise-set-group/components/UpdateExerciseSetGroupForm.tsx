import React from 'react';
import { ExerciseSetGroupService } from 'src/features/exercise-set-group/services/exercise-set-group.service';
import type { UpdateExerciseSetGroupDto } from 'src/features/exercise-set-group/types/dto/update-exercise-set-group.dto';
import type { ExerciseSetGroup } from 'src/features/exercise-set-group/types/exercise-set-group.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function UpdateExerciseSetGroupForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    refreshData,
    exerciseSetGroup,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    refreshData: () => void;
    exerciseSetGroup: ExerciseSetGroup;
}) {
    const initialDto: UpdateExerciseSetGroupDto = {
        title: exerciseSetGroup.title,
    };
    const [dto, setDto] = React.useState<UpdateExerciseSetGroupDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden, exerciseSetGroup]);

    async function update() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetGroupService.updateById(
                exerciseSetGroup._id,
                dto
            );

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
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
                <div className="flex justify-start items-center gap-2">
                    <p>title: </p>

                    <div className='w-48 sm:w-72'>
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
