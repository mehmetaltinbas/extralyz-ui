import React from 'react';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { SaveGeneratedNotesDto } from 'src/features/exercise-set/types/dto/save-generated-notes.dto';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { Textarea } from 'src/shared/components/Textarea';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { InputType } from 'src/shared/enums/input-type.enum';
import { TextareaSize } from 'src/shared/enums/textarea-size.enum';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';

export function SaveGeneratedNotesForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    onClose,
    setIsLoadingPageHidden,
    refreshData,
    exerciseSet,
    initialTitle,
    initialRawText,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: () => void;
    exerciseSet: ExerciseSet;
    initialTitle: string;
    initialRawText: string;
}) {
    const initialDto: SaveGeneratedNotesDto = {
        title: initialTitle,
        rawText: initialRawText,
        link: false,
    };
    const [dto, setDto] = React.useState<SaveGeneratedNotesDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    const { isMobile } = useBreakpoint();

    React.useEffect(() => {
        setDto({
            title: initialTitle,
            rawText: initialRawText,
            link: false,
        });
    }, [initialTitle, initialRawText]);

    async function save() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.saveGeneratedNotes(
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
            <div className="flex justify-center items-center gap-2">
                <p>Title: </p>
                <Input
                    onChange={(e) => setDto({
                        ...dto,
                        title: e.currentTarget.value
                    })}
                    size={InputSize.LG}
                    value={dto.title}
                    placeholder="title..."
                />
            </div>

            <div className="w-72 sm:w-108 flex justify-center items-center gap-2">
                <p>Text: </p>
                <Textarea
                    onChange={(e) => setDto({
                        ...dto,
                        rawText: e.currentTarget.value
                    })}
                    value={dto.rawText}
                    placeholder="lecture notes..."
                    size={TextareaSize.LG}
                    rows={isMobile ? 6 : 10}
                />
            </div>

            <div className="w-72 sm:w-108 flex justify-center items-center gap-0">
                <div className='w-8'>
                    <Input
                        type={InputType.CHECKBOX}
                        onChange={(e) => setDto({ ...dto, link: e.target.checked })}
                    />
                </div>

                <p>Link exercise set to newly created source</p>
            </div>

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async () => await save()}
            >
                Create
            </Button>
        </Modal>
    );
}
