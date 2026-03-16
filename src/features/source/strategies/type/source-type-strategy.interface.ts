import type React from 'react';
import type { SourceType } from 'src/features/source/enums/source-type.enum';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';

export interface SourceTypeStrategy {
    readonly sourceType: SourceType;

    buildInitialCreateSourceDto(): CreateSourceDto;
    buildCreateSourceFormData(dto: CreateSourceDto, file?: File): FormData;
    renderCreateSourceFormFields(
        dto: CreateSourceDto,
        setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>,
        extra: { file?: File; setFile: (f?: File) => void; fileInputKey: number },
    ): React.ReactNode;
}
