import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import { RawTextCreateSourceForm } from 'src/features/source/strategies/type/components/create-source-form/RawTextCreateSourceForm';
import type { SourceTypeStrategy } from 'src/features/source/strategies/type/source-type-strategy.interface';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';

export class RawTextSourceTypeStrategy implements SourceTypeStrategy {
    readonly sourceType = SourceType.RAW_TEXT;

    buildInitialCreateSourceDto(): CreateSourceDto {
        return { type: SourceType.RAW_TEXT, title: '', rawText: '' };
    }

    buildCreateSourceFormData(dto: CreateSourceDto): FormData {
        const formData = new FormData();
        if (dto.type) formData.append('type', dto.type);
        if (dto.title) formData.append('title', dto.title);
        if (dto.rawText) formData.append('rawText', dto.rawText);
        return formData;
    }

    renderCreateSourceFormFields(
        dto: CreateSourceDto,
        setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>,
    ): React.ReactNode {
        return (
            <RawTextCreateSourceForm
                dto={dto}
                setDto={setDto}
            />
        );
    }
}
