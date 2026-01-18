import type React from 'react';
import { useEffect, useState } from 'react';
import { sourceService } from 'src/features/source/services/source.service';
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
    const [uploadedFile, setUploadedFile] = useState<File>();
    const [createSourceDto, setCreateSourceDto] = useState({
        title: '',
    });
    const [fileInputKey, setFileInputKey] = useState(0); // will force file input to re-mount

    useEffect(() => {
        setUploadedFile(undefined);
        setCreateSourceDto({
            title: '',
        });
        setFileInputKey((prev) => prev + 1);
    }, [isHidden]);

    async function createSource() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);
        let message = 'internal error';
        const formData = new FormData();
        if (uploadedFile) {
            formData.append('file', uploadedFile);
            Object.keys(createSourceDto).forEach((key) => {
                const value = createSourceDto[key as keyof typeof createSourceDto];
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            message = (await sourceService.create(formData)).message;
        }
        updateSources();
        setIsLoadingPageHidden(true);
        alert(message);
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
                className="absolute top-1 right-1" onClick={(event) => toggle()}>
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
                        setCreateSourceDto({
                            ...createSourceDto,
                            title: event.target.value,
                        })
                    }
                    type="text"
                    value={createSourceDto.title}
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
