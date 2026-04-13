import React from 'react';
import { ExerciseSetGroupService } from 'src/features/exercise-set-group/services/exercise-set-group.service';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import type { CreateExerciseSetGroupDto } from 'src/features/exercise-set-group/types/dto/create-exercise-set-group.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function CreateExerciseSetGroupForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    onClose,
    setIsLoadingPageHidden,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();

    const initialDto: CreateExerciseSetGroupDto = { title: '' };
    const [dto, setDto] = React.useState<CreateExerciseSetGroupDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden]);

    async function createGroup() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const response = await ExerciseSetGroupService.create(dto);

        setIsLoadingPageHidden(true);

        if (!response.isSuccess) {
            alert(response.message);
            setIsHidden(false);
            isSubmittingRef.current = false;
            return;
        }

        isSubmittingRef.current = false;
        setDto(initialDto);
        dispatch(refreshExerciseSetsData());
        setIsPopUpActive(false);
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="flex justify-start items-center gap-2">
                <p>title: </p>

                <div className='w-48 sm:w-72'>
                    <Input
                        name="title"
                        value={dto.title}
                        onChange={(e) => setDto({ ...dto, title: e.currentTarget.value })}
                    />
                </div>
            </div>

            <Button variant={ButtonVariant.PRIMARY} onClick={createGroup}>
                Create
            </Button>
        </Modal>
    );
}
