import React from "react";
import { AUDIO_MAX_DURATION_SECONDS } from "src/features/source/constants/audio-max-duration-seconds.constant";
import type { CreateSourceDto } from "src/features/source/types/dto/create-source.dto";
import { Input } from "src/shared/components/Input";
import { InputType } from "src/shared/enums/input-type.enum";

export function AudioCreateSourceForm({
    dto: _dto,
    setDto,
    extra
} : {
    dto: CreateSourceDto;
    setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>;
    extra: { file?: File; setFile: (f?: File) => void; fileInputKey: number };
}) {
    const [durationError, setDurationError] = React.useState<string | null>(null);

    function readDurationSeconds(file: File): Promise<number> {
        return new Promise((resolve, reject) => {
            const audio = document.createElement('audio');
            audio.preload = 'metadata';
            const url = URL.createObjectURL(file);
            audio.src = url;
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve(Math.round(audio.duration));
            };
            audio.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Could not read audio metadata'));
            };
        });
    }

    async function handleFileSelected(file: File | undefined, fileInput?: HTMLInputElement) {
        if (!file) {
            extra.setFile(undefined);
            setDto((prev) => ({ ...prev, durationSeconds: undefined }));
            setDurationError(null);
            return;
        }

        try {
            const durationSeconds = await readDurationSeconds(file);

            if (durationSeconds > AUDIO_MAX_DURATION_SECONDS) {
                const limitMinutes = Math.floor(AUDIO_MAX_DURATION_SECONDS / 60);
                setDurationError(`Audio is ${Math.floor(durationSeconds / 60)} min long; the maximum is ${limitMinutes} min.`);
                if (fileInput) fileInput.value = '';
                extra.setFile(undefined);
                setDto((prev) => ({ ...prev, durationSeconds: undefined }));
                return;
            }

            setDurationError(null);
            extra.setFile(file);
            setDto((prev) => ({ ...prev, durationSeconds }));
        } catch {
            setDurationError('Could not read audio metadata.');
            if (fileInput) fileInput.value = '';
            extra.setFile(undefined);
            setDto((prev) => ({ ...prev, durationSeconds: undefined }));
        }
    }

    return (
        <>
            <div className={'flex justify-center items-center gap-2'}>
                <p>file: </p>
                <Input
                    inputKey={extra.fileInputKey}
                    onChange={(e) => {
                        const files = e.target.files;

                        if (files && files.length > 1) {
                            alert("Only 1 file can be inputted");
                            e.target.value = "";
                            handleFileSelected(undefined);
                            return;
                        }

                        handleFileSelected(e.target.files?.[0], e.target);
                    }}
                    type={InputType.FILE}
                    accept="audio/*"
                />
            </div>

            {durationError && (
                <p className="text-sm text-red-500 text-center max-w-[300px]">
                    {durationError}
                </p>
            )}
        </>
    );
}
