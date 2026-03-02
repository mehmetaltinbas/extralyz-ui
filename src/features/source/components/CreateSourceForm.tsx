import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import { sourceService } from 'src/features/source/services/source.service';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';

export function CreateSourceForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    toggle,
    updateSources,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    updateSources: () => void;
}) {
    const [uploadedFile, setUploadedFile] = React.useState<File>();
    const initialDto: CreateSourceDto = {
        title: '',
        type: SourceType.DOCUMENT
    };
    const [dto, setDto] = React.useState<CreateSourceDto>(initialDto);
    const [fileInputKey, setFileInputKey] = React.useState(0); // will force file input to re-mount

    React.useEffect(() => {
        setUploadedFile(undefined);
        setDto(initialDto);
        setFileInputKey((prev) => prev + 1);
    }, [isHidden]);

    async function createSource() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const formData = new FormData();

        if (uploadedFile) {
            formData.append('file', uploadedFile);

            Object.keys(dto).forEach((key) => {
                const value = dto[key as keyof typeof dto];

                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            const response = await sourceService.create(formData);

            if (!response.isSuccess) alert(response.message);
        }

        updateSources();
        setIsLoadingPageHidden(true);
        setIsPopUpActive(false);
    }

    function handleFileOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    }

    return (
        <div
            className={`${isHidden && 'hidden'} w-[400px] h-auto relative border px-2 py-4 bg-white rounded-[10px]
            flex flex-col justify-center items-center gap-2`}
        >
            <Button
                variant={ButtonVariants.GHOST}
                className="absolute top-1 right-1"
                onClick={(event) => toggle()}
            >
                X
            </Button>

            <div className="flex justify-start items-center gap-2">
                <p>file: </p>
                <input
                    key={fileInputKey}
                    onChange={(event) => handleFileOnChange(event)}
                    type="file"
                    className="w-[200px] border rounded-full p-1 cursor-pointer
                    text-xs
                    hover:bg-gray-100"
                />
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>title: </p>
                <input
                    data-key="title"
                    onChange={(event) =>
                        setDto({
                            ...dto,
                            title: event.target.value,
                        })
                    }
                    type="text"
                    value={dto.title}
                    placeholder="title..."
                    className="px-2 py-[2px] border rounded-full"
                />
            </div>

            <Button
                variant={ButtonVariants.PRIMARY}
                onClick={async (event) => {
                    await createSource();
                }}
            >
                Create
            </Button>
        </div>
    );
}
