import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import { SourceVisibility } from 'src/features/source/enums/source-visibility.enum';
import { SourceService } from 'src/features/source/services/source.service';
import { sourceTypeFactory } from 'src/features/source/strategies/type/source-type.factory';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';

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
    const defaultStrategy = sourceTypeFactory.resolveStrategy(SourceType.DOCUMENT)!;
    const [dto, setDto] = React.useState<CreateSourceDto>({
        ...defaultStrategy.buildInitialCreateSourceDto(),
        visibility: SourceVisibility.PRIVATE,
    });
    const [uploadedFile, setUploadedFile] = React.useState<File>();
    const [fileInputKey, setFileInputKey] = React.useState(0);
    const isSubmittingRef = React.useRef(false);

    const strategy = sourceTypeFactory.resolveStrategy(dto.type as SourceType);

    function resetForm() {
        setUploadedFile(undefined);
        setDto({ ...defaultStrategy.buildInitialCreateSourceDto(), visibility: SourceVisibility.PRIVATE });
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

        const currentVisibility = dto.visibility;
        setUploadedFile(undefined);
        setFileInputKey((prev) => prev + 1);
        setDto({ ...newStrategy.buildInitialCreateSourceDto(), visibility: currentVisibility });
    }

    async function createSource() {
        if (!strategy) return;

        const estimate = await SourceService.estimate(dto);

        if (estimate.isSuccess && estimate.credits && estimate.credits > 0) {
            const confirmed = confirm(`This will cost ${estimate.credits} credits. Proceed?`);
            if (!confirmed) return;
        }

        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const formData = strategy.buildCreateSourceFormData(dto, uploadedFile);
        if (dto.visibility) formData.append('visibility', dto.visibility);
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

    function onChangeForEnum(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectElement = event.currentTarget;

        if (!Object.keys(dto).includes(selectElement.name)) {
            return;
        }

        if (
            !(Object.values(SourceVisibility) as string[]).includes(selectElement.value)
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
            <div className="flex justify-center items-center gap-2">
                <p>type: </p>
                <select
                    value={dto.type}
                    onChange={(e) => handleTypeChange(e.target.value as SourceType)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    {Object.values(SourceType).map((value) => (
                        <option key={value} value={value}>
                            {camelToTitleCase(value)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-48 sm:w-72 flex justify-center items-center gap-2">
                <p>title: </p>
                <Input
                    onChange={(e) => setDto((prev) => ({ ...prev, title: e.target.value }))}
                    size={InputSize.LG}
                    value={dto.title ?? ''}
                    placeholder="title..."
                />
            </div>

            <div className="flex justify-center items-center gap-2">
                <p>visibility: </p>
                <select
                    name='visibility'
                    value={dto.visibility ?? SourceVisibility.PRIVATE}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value={SourceVisibility.PRIVATE}>Private</option>
                    <option value={SourceVisibility.PUBLIC}>Public</option>
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
