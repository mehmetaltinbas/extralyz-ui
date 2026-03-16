import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import { AudioCreateSourceForm } from 'src/features/source/strategies/type/components/create-source-form/AudioCreateSourceForm';
import type { SourceTypeStrategy } from 'src/features/source/strategies/type/source-type-strategy.interface';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';

export class AudioSourceTypeStrategy implements SourceTypeStrategy {
    readonly sourceType = SourceType.AUDIO;

    buildInitialCreateSourceDto(): CreateSourceDto {
        return { type: SourceType.AUDIO, title: '' };
    }

    buildCreateSourceFormData(dto: CreateSourceDto, file?: File): FormData {
        const formData = new FormData();
        if (file) formData.append('file', file);
        if (dto.type) formData.append('type', dto.type);
        if (dto.title) formData.append('title', dto.title);
        return formData;
    }

    renderCreateSourceFormFields(
        dto: CreateSourceDto,
        setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>,
        extra: { file?: File; setFile: (f?: File) => void; fileInputKey: number },
    ): React.ReactNode {
        return (
            <AudioCreateSourceForm
                dto={dto}
                setDto={setDto}
                extra={extra}
            />
        );
    }
}
