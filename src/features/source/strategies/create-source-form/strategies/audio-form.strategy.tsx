import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import type { CreateSourceFormStrategy } from 'src/features/source/strategies/create-source-form/create-source-form-strategy.interface';
import { FIELD_ROW_CLASS, INPUT_CLASS } from 'src/features/source/strategies/create-source-form/form-field-styles.constant';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';

export class AudioFormStrategy implements CreateSourceFormStrategy {
    readonly label = 'Audio';

    buildInitialDto(): CreateSourceDto {
        return { type: SourceType.AUDIO, title: '' };
    }

    buildFormData(dto: CreateSourceDto, file?: File): FormData {
        const formData = new FormData();
        if (file) formData.append('file', file);
        if (dto.type) formData.append('type', dto.type);
        if (dto.title) formData.append('title', dto.title);
        return formData;
    }

    renderFields(
        dto: CreateSourceDto,
        setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>,
        extra: { file?: File; setFile: (f?: File) => void; fileInputKey: number },
    ): React.ReactNode {
        return (
            <>
                <div className={FIELD_ROW_CLASS}>
                    <p>file: </p>
                    <input
                        key={extra.fileInputKey}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            extra.setFile(file);
                        }}
                        type="file"
                        accept="audio/*"
                        className="w-[200px] border rounded-full p-1 cursor-pointer text-xs hover:bg-gray-100"
                    />
                </div>

                <div className={FIELD_ROW_CLASS}>
                    <p>title: </p>
                    <input
                        onChange={(e) => setDto((prev) => ({ ...prev, title: e.target.value }))}
                        type="text"
                        value={dto.title ?? ''}
                        placeholder="title..."
                        className={INPUT_CLASS}
                    />
                </div>
            </>
        );
    }
}
