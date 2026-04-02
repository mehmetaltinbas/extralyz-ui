import React from 'react';
import { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';
import { PublicExerciseSetService } from 'src/features/exercise-set/services/public-exercise-set.service';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import type { CloneExerciseSetDto } from 'src/features/exercise-set/types/dto/clone-exercise-set.dto';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function CloneExerciseSetForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    exerciseSet,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    exerciseSet: ExerciseSet;
}) {
    const dispatch = useAppDispatch();

    const initialDto: CloneExerciseSetDto = {
        title: `${exerciseSet.title} (clone)`,
        visibility: ExerciseSetVisibility.PRIVATE,
    };
    const [dto, setDto] = React.useState<CloneExerciseSetDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden, exerciseSet]);

    async function clone() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await PublicExerciseSetService.clone(
                exerciseSet._id,
                dto
            );

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;

                setDto(initialDto);

                dispatch(refreshExerciseSetsData());

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

    function onChangeForEnum(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectElement = event.currentTarget;

        if (!Object.keys(dto).includes(selectElement.name)) {
            return;
        }

        if (
            !(Object.values(ExerciseSetVisibility) as string[]).includes(selectElement.value)
        ) {
            return;
        }

        setDto({
            ...dto,
            [selectElement.name]: selectElement.value,
        });
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

            <div className="flex justify-start items-center gap-2">
                <p>visibility: </p>
                <select
                    name="visibility"
                    value={dto.visibility}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value={ExerciseSetVisibility.PRIVATE}>Private</option>
                    <option value={ExerciseSetVisibility.PUBLIC}>Public</option>
                </select>
            </div>

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async (event) => await clone()}
            >
                Clone
            </Button>
        </Modal>
    );
}
