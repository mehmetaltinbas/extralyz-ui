import React from 'react';
import { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import { SourceVisibility } from 'src/features/source/enums/source-visibility.enum';
import { PublicSourceService } from 'src/features/source/services/public-source.service';
import type { CloneSourceDto } from 'src/features/source/types/dto/clone-source.dto';
import type { Source } from 'src/features/source/types/source.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function CloneSourceForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    source,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    source: Source;
}) {
    const dispatch = useAppDispatch();

    const initialDto: CloneSourceDto = {
        title: `${source.title} (clone)`,
        visibility: SourceVisibility.PRIVATE,
    };
    const [dto, setDto] = React.useState<CloneSourceDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden, source]);

    async function clone() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await PublicSourceService.clone(
                source._id,
                dto
            );

            alert(response.message);

            if (!response.isSuccess) {
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
                    className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
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
