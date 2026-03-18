import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import { SourceService } from 'src/features/source/services/source.service';
import { sourceTypeFactory } from 'src/features/source/strategies/type/source-type.factory';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

const defaultType = SourceType.DOCUMENT;

export function CreateSourceForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    updateSources,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    updateSources: () => void;
}) {
    const defaultStrategy = sourceTypeFactory.resolveStrategy(defaultType)!;
    const [dto, setDto] = React.useState<CreateSourceDto>(defaultStrategy.buildInitialCreateSourceDto());
    const [uploadedFile, setUploadedFile] = React.useState<File>();
    const [fileInputKey, setFileInputKey] = React.useState(0);
    const isSubmittingRef = React.useRef(false);

    const strategy = sourceTypeFactory.resolveStrategy(dto.type as SourceType);

    function resetForm() {
        setUploadedFile(undefined);
        setDto(defaultStrategy.buildInitialCreateSourceDto());
        setFileInputKey((prev) => prev + 1);
    }

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            resetForm();
        }
    }, [isHidden]);

    function handleTypeChange(newType: SourceType) {
        const newStrategy = sourceTypeFactory.resolveStrategy(newType);

        if (!newStrategy) return;

        setUploadedFile(undefined);
        setFileInputKey((prev) => prev + 1);
        setDto(newStrategy.buildInitialCreateSourceDto());
    }

    async function createSource() {
        if (!strategy) return;

        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const formData = strategy.buildCreateSourceFormData(dto, uploadedFile);
        const response = await SourceService.create(formData);

        if (!response.isSuccess) {
            alert(response.message);

            setIsLoadingPageHidden(true);

            isSubmittingRef.current = false;

            setIsHidden(false);
            return;
        }

        resetForm();

        isSubmittingRef.current = false;
        updateSources();

        setIsLoadingPageHidden(true);

        setIsPopUpActive(false);
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="flex justify-center items-center gap-2">
                <p>type: </p>
                <select
                    value={dto.type}
                    onChange={(e) => handleTypeChange(e.target.value as SourceType)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    {Object.values(SourceType).map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>

            {strategy?.renderCreateSourceFormFields(dto, setDto, {
                file: uploadedFile,
                setFile: setUploadedFile,
                fileInputKey,
            })}

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async () => {
                    await createSource();
                }}
            >
                Create
            </Button>
        </Modal>
    );
}
